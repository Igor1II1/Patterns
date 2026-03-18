# Backend-разработка: API, запросы, ошибки

> [[devops/02-frontend|<-- Предыдущая: Frontend]] | [[devops/04-auth-roles|Следующая: Auth и роли -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]

---

## Зачем эта тема существует?

Backend — это мозг приложения. Он принимает запросы, проверяет данные, работает с базой и возвращает результат. Плохо организованный бэкенд приводит к дублированию кода, непонятным ошибкам и проблемам с безопасностью. Эта глава о паттернах, которые делают бэкенд надежным и поддерживаемым.

---

## Структура API Routes

### Что это такое?

Правильная структура папок для API Routes помогает быстро находить нужный эндпоинт и поддерживать код.

### Как работает?

```
app/api/
├── auth/
│   └── [...nextauth]/route.ts     # Авторизация
├── boards/
│   ├── route.ts                    # GET (список), POST (создать)
│   └── [id]/
│       ├── route.ts                # GET, PUT, DELETE (одна доска)
│       └── columns/
│           └── route.ts            # POST (добавить колонку)
├── columns/
│   └── [id]/
│       ├── route.ts                # PUT, DELETE (одна колонка)
│       └── tasks/
│           └── route.ts            # POST (создать задачу)
├── tasks/
│   └── [id]/
│       ├── route.ts                # GET, PUT, DELETE
│       └── comments/
│           └── route.ts            # GET, POST
├── comments/
│   └── [id]/
│       └── route.ts                # DELETE
└── upload/
    └── route.ts                    # POST (загрузка файлов)
```

### Шаблон эндпоинта

```typescript
// Каждый API route следует одному паттерну:
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 1. Схема валидации
const createBoardSchema = z.object({
  title: z.string().min(1).max(100),
})

// 2. Обработчик
export async function POST(request: NextRequest) {
  try {
    // 3. Проверка авторизации
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    // 4. Получение и валидация данных
    const body = await request.json()
    const validation = createBoardSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Невалидные данные', details: validation.error.flatten() },
        { status: 422 }
      )
    }

    // 5. Бизнес-логика (работа с БД)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    const board = await prisma.board.create({
      data: {
        title: validation.data.title,
        ownerId: user!.id,
      },
    })

    // 6. Успешный ответ
    return NextResponse.json({ data: board }, { status: 201 })
  } catch (error) {
    // 7. Обработка ошибок
    console.error('POST /api/boards error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
```

### Частые заблуждения

- "Можно не оборачивать в try/catch" — можно, но необработанная ошибка вернет 500 с непонятным сообщением. Пользователь увидит "Internal Server Error".
- "Валидация на фронтенде достаточна" — нет, API можно вызвать в обход фронтенда. Валидация обязательна на бэкенде.

### Мини-проверка

1. В каком порядке выполняются проверки в API route?
2. Почему нужна валидация и на фронте, и на бэкенде?
3. Какой HTTP-код возвращать при создании ресурса?

---

## Паттерны запросов к базе данных

### Что это такое?

Правильные запросы к базе — это не просто "получить данные". Нужно думать о производительности, безопасности и удобстве.

### Как работает?

```typescript
// Паттерн: не загружай лишнее
// Плохо — загружаем ВСЕ поля всех связей:
const board = await prisma.board.findUnique({
  where: { id },
  include: {
    columns: {
      include: {
        tasks: {
          include: {
            comments: {
              include: { author: true }
            },
            assignee: true,
          }
        }
      }
    },
    owner: true,
  }
})

// Хорошо — загружаем только нужное:
const board = await prisma.board.findUnique({
  where: { id },
  select: {
    id: true,
    title: true,
    columns: {
      select: {
        id: true,
        title: true,
        order: true,
        tasks: {
          select: {
            id: true,
            title: true,
            priority: true,
            order: true,
            _count: { select: { comments: true } },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    },
  },
})
```

### Проверка владельца ресурса

```typescript
// Паттерн: ВСЕГДА проверяй, что пользователь имеет доступ к ресурсу

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const board = await prisma.board.findUnique({
    where: { id: params.id },
    select: { owner: { select: { email: true } } },
  })

  if (!board) {
    return NextResponse.json({ error: 'Не найдено' }, { status: 404 })
  }

  // Проверка владельца
  if (board.owner.email !== session.user.email) {
    return NextResponse.json({ error: 'Нет доступа' }, { status: 403 })
  }

  await prisma.board.delete({ where: { id: params.id } })
  return NextResponse.json({ message: 'Удалено' })
}
```

### Транзакции для связанных операций

```typescript
// Перемещение задачи в другую колонку — нужна транзакция
export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json()
  const { targetColumnId, newOrder } = body

  const result = await prisma.$transaction(async (tx) => {
    // 1. Проверяем что задача и колонка существуют
    const task = await tx.task.findUnique({ where: { id: params.id } })
    const column = await tx.column.findUnique({ where: { id: targetColumnId } })

    if (!task || !column) {
      throw new Error('Не найдено')
    }

    // 2. Обновляем порядок в старой колонке
    await tx.task.updateMany({
      where: {
        columnId: task.columnId,
        order: { gt: task.order },
      },
      data: { order: { decrement: 1 } },
    })

    // 3. Обновляем порядок в новой колонке
    await tx.task.updateMany({
      where: {
        columnId: targetColumnId,
        order: { gte: newOrder },
      },
      data: { order: { increment: 1 } },
    })

    // 4. Перемещаем задачу
    return tx.task.update({
      where: { id: params.id },
      data: { columnId: targetColumnId, order: newOrder },
    })
  })

  return NextResponse.json({ data: result })
}
```

### Частые заблуждения

- "Транзакции нужны редко" — нет, любая операция затрагивающая несколько записей должна быть в транзакции.
- "select: true загружает все поля" — нет, нужно перечислить каждое поле: `select: { id: true, name: true }`.

---

## Паттерны обработки ошибок

### Что это такое?

Централизованная обработка ошибок избавляет от дублирования try/catch в каждом эндпоинте.

### Как работает?

```typescript
// lib/api-errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} не найден`, 'NOT_FOUND')
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super(403, 'Нет доступа', 'FORBIDDEN')
  }
}

export class ValidationError extends AppError {
  constructor(public details: any) {
    super(422, 'Ошибка валидации', 'VALIDATION_ERROR')
  }
}
```

```typescript
// lib/api-handler.ts — обертка для обработки ошибок
import { NextRequest, NextResponse } from 'next/server'
import { AppError } from './api-errors'
import { Prisma } from '@prisma/client'

type Handler = (request: NextRequest, context?: any) => Promise<NextResponse>

export function withErrorHandler(handler: Handler): Handler {
  return async (request, context) => {
    try {
      return await handler(request, context)
    } catch (error) {
      // Наши кастомные ошибки
      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.statusCode }
        )
      }

      // Ошибки Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return NextResponse.json(
            { error: 'Запись уже существует', code: 'DUPLICATE' },
            { status: 409 }
          )
        }
        if (error.code === 'P2025') {
          return NextResponse.json(
            { error: 'Запись не найдена', code: 'NOT_FOUND' },
            { status: 404 }
          )
        }
      }

      // Неизвестная ошибка
      console.error('Unhandled error:', error)
      return NextResponse.json(
        { error: 'Внутренняя ошибка сервера' },
        { status: 500 }
      )
    }
  }
}
```

```typescript
// Использование — код стал чище
import { withErrorHandler } from '@/lib/api-handler'
import { NotFoundError, ForbiddenError } from '@/lib/api-errors'

export const GET = withErrorHandler(async (request, { params }) => {
  const board = await prisma.board.findUnique({ where: { id: params.id } })

  if (!board) throw new NotFoundError('Доска')

  if (board.ownerId !== session.user.id) throw new ForbiddenError()

  return NextResponse.json({ data: board })
})
```

### Частые заблуждения

- "console.error на продакшне бесполезен" — не совсем, на Vercel логи видны в панели управления. Но для серьезных проектов нужен Sentry или аналогичный сервис.

### Мини-проверка

1. Зачем создавать кастомные классы ошибок?
2. Какие ошибки Prisma нужно обрабатывать чаще всего?
3. Чем throw new NotFoundError лучше чем return NextResponse.json(..., 404)?

---

## Итог

| Паттерн | Зачем |
|---------|-------|
| Шаблон эндпоинта | Единообразная структура каждого route |
| select вместо include | Не загружать лишние данные |
| Проверка владельца | Безопасность: пользователь видит только свое |
| Транзакции | Целостность связанных операций |
| Кастомные ошибки | Чистый код без дублирования try/catch |

Порядок в каждом эндпоинте: авторизация -> валидация -> бизнес-логика -> ответ.

---

> [[devops/02-frontend|<-- Предыдущая: Frontend]] | [[devops/04-auth-roles|Следующая: Auth и роли -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]
