# Next.js API Routes + Prisma: полноценный REST-бэкенд

> [[backend/02-prisma-crud|<-- Предыдущая: Prisma CRUD]] | [[backend/04-nextauth|Следующая: NextAuth.js -->]]
> [[backend-fundamentals|<-- Назад к оглавлению Backend]]

---

## Зачем эта тема существует?

Frontend без backend — это статическая страница. Чтобы приложение могло сохранять данные, авторизовать пользователей, обрабатывать заказы — нужен API. Next.js позволяет создавать API прямо внутри проекта, без отдельного сервера. Добавляем Prisma — и получаем полноценный бэкенд с базой данных.

---

## API Routes в Next.js (App Router)

### Что это такое?

API Routes — это серверные эндпоинты, которые обрабатывают HTTP-запросы. В App Router они создаются через файлы `route.ts` внутри папки `app/api/`.

### Как работает?

```
app/
  api/
    users/
      route.ts          <-- GET /api/users, POST /api/users
      [id]/
        route.ts        <-- GET /api/users/1, PUT /api/users/1, DELETE /api/users/1
    posts/
      route.ts          <-- GET /api/posts, POST /api/posts
```

Каждый файл `route.ts` экспортирует функции по имени HTTP-метода:

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

// GET /api/users — получить список пользователей
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Список пользователей' })
}

// POST /api/users — создать пользователя
export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ message: 'Пользователь создан' }, { status: 201 })
}
```

### Параметры маршрута

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

type Params = { params: { id: string } }

// GET /api/users/5
export async function GET(request: NextRequest, { params }: Params) {
  const id = parseInt(params.id)
  return NextResponse.json({ id })
}

// PUT /api/users/5
export async function PUT(request: NextRequest, { params }: Params) {
  const id = parseInt(params.id)
  const body = await request.json()
  return NextResponse.json({ id, ...body })
}

// DELETE /api/users/5
export async function DELETE(request: NextRequest, { params }: Params) {
  const id = parseInt(params.id)
  return NextResponse.json({ message: `Пользователь ${id} удален` })
}
```

### Частые заблуждения

- "API Routes работают на клиенте" — нет, они выполняются на сервере. Клиент только отправляет HTTP-запросы.
- "Можно использовать любые имена функций" — нет, только стандартные HTTP-методы: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS.

### Мини-проверка

1. Где создаются API Routes в Next.js App Router?
2. Как получить параметр из URL (например, id)?
3. Какой HTTP-метод используется для создания ресурса?

---

## Полный CRUD API с Prisma

### Что это такое?

Соединяем API Routes с Prisma Client для создания полноценного REST API с базой данных.

### Примеры кода

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/users — список пользователей
export async function GET(request: NextRequest) {
  try {
    // Получить query-параметры (?page=2&limit=10&search=игорь)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: search
          ? { name: { contains: search, mode: 'insensitive' } }
          : undefined,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
      prisma.user.count({
        where: search
          ? { name: { contains: search, mode: 'insensitive' } }
          : undefined,
      }),
    ])

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка получения пользователей' },
      { status: 500 }
    )
  }
}

// POST /api/users — создать пользователя
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        age: body.age,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    // Обработка уникального ключа
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Ошибка создания пользователя' },
      { status: 500 }
    )
  }
}
```

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

// GET /api/users/:id — один пользователь
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Некорректный ID' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

// PUT /api/users/:id — обновить пользователя
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        age: body.age,
      },
    })

    return NextResponse.json(user)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }
    return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 })
  }
}

// DELETE /api/users/:id — удалить пользователя
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const id = parseInt(params.id)

    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ message: 'Пользователь удален' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 })
  }
}
```

---

## Обработка ошибок

### Что это такое?

Правильная обработка ошибок — разница между профессиональным и любительским API. Клиент должен получать понятные сообщения об ошибках с правильными HTTP-кодами.

### Коды ошибок Prisma

```typescript
// Основные коды ошибок Prisma
switch (error.code) {
  case 'P2002':  // Нарушение уникальности
    // "Запись с таким email уже существует"
    break
  case 'P2025':  // Запись не найдена
    // "Запись не найдена"
    break
  case 'P2003':  // Нарушение внешнего ключа
    // "Связанная запись не существует"
    break
  case 'P2014':  // Нарушение обязательной связи
    // "Нельзя удалить — есть связанные записи"
    break
}
```

### HTTP-коды ответов

```typescript
// 2xx — Успех
200  // OK — запрос выполнен
201  // Created — ресурс создан
204  // No Content — успех, но нечего возвращать

// 4xx — Ошибка клиента
400  // Bad Request — неверные данные
401  // Unauthorized — не авторизован
403  // Forbidden — нет доступа
404  // Not Found — ресурс не найден
409  // Conflict — конфликт (дубликат)
422  // Unprocessable Entity — данные не прошли валидацию

// 5xx — Ошибка сервера
500  // Internal Server Error — непредвиденная ошибка
```

### Частые заблуждения

- "Можно всегда возвращать 200" — нет, правильные HTTP-коды помогают клиенту понять что произошло.
- "try/catch не нужен если Prisma справится" — Prisma может выбросить ошибку (дубликат, отсутствие записи), и без try/catch сервер вернет 500 с непонятным сообщением.

---

## Валидация входных данных

### Что это такое?

Никогда не доверяй данным от клиента. Валидация проверяет, что данные корректны, прежде чем отправлять их в базу.

### Как работает?

```bash
npm install zod
```

```typescript
// lib/validations/user.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email('Некорректный email'),
  name: z.string().min(2, 'Имя должно быть не менее 2 символов'),
  age: z.number().int().min(0).max(150).optional(),
})

export const updateUserSchema = createUserSchema.partial()
// .partial() делает все поля необязательными
```

```typescript
// app/api/users/route.ts
import { createUserSchema } from '@/lib/validations/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Валидация
    const validation = createUserSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: validation.error.flatten() },
        { status: 422 }
      )
    }

    // Данные гарантированно корректны
    const user = await prisma.user.create({
      data: validation.data,
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
```

### Мини-проверка

1. Зачем нужна валидация если база данных сама проверяет типы?
2. Что делает метод safeParse?
3. Почему лучше вернуть 422 а не 400 при ошибке валидации?

---

## CORS

### Что это такое?

CORS (Cross-Origin Resource Sharing) — механизм, который контролирует, какие домены могут обращаться к твоему API. По умолчанию браузер блокирует запросы между разными доменами.

### Как работает?

```typescript
// middleware.ts (в корне проекта)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Разрешить запросы с любого домена (для разработки)
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )

  // Обработка preflight-запросов
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers })
  }

  return response
}

export const config = {
  matcher: '/api/:path*',
}
```

### Частые заблуждения

- "CORS — это защита от хакеров" — нет, CORS — защита пользователя браузера. API все равно доступен через curl или Postman.
- "Всегда ставь Allow-Origin: *" — только для разработки. На продакшне указывай конкретный домен.

---

## Итог

Полноценный REST API на Next.js + Prisma строится из:

| Компонент | Роль |
|-----------|------|
| route.ts | Обработка HTTP-запросов |
| Prisma Client | Работа с базой данных |
| Zod | Валидация входных данных |
| try/catch | Обработка ошибок |
| HTTP-коды | Правильные ответы клиенту |
| CORS | Контроль доступа к API |

Паттерн каждого эндпоинта:
1. Получить данные из запроса
2. Валидировать данные
3. Выполнить операцию в БД
4. Вернуть результат или ошибку

---

> [[backend/02-prisma-crud|<-- Предыдущая: Prisma CRUD]] | [[backend/04-nextauth|Следующая: NextAuth.js -->]]
> [[backend-fundamentals|<-- Назад к оглавлению Backend]]
