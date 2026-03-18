# Защита маршрутов: доступ по ролям

> [[backend/04-nextauth|<-- Предыдущая: NextAuth.js]] | [[backend/06-file-upload|Следующая: Загрузка файлов -->]]
> [[backend-fundamentals|<-- Назад к оглавлению Backend]]

---

## Зачем эта тема существует?

Авторизация — это "кто ты?". Защита маршрутов — это "что тебе можно?". Страница админки не должна быть доступна обычному пользователю. API удаления данных не должен работать без авторизации. В реальных приложениях разграничение доступа — критическая часть безопасности.

---

## Защита серверных компонентов (Server Components)

### Что это такое?

В Next.js App Router серверные компоненты могут проверять сессию на сервере через `getServerSession`. Если пользователь не авторизован — перенаправляем.

### Как работает?

```typescript
// app/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Не авторизован — перенаправить на вход
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div>
      <h1>Дашборд</h1>
      <p>Привет, {session.user?.name}!</p>
    </div>
  )
}
```

```typescript
// app/admin/page.tsx — страница только для админов
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  if (session.user.role !== 'admin') {
    redirect('/dashboard')  // Или показать страницу "Нет доступа"
  }

  return (
    <div>
      <h1>Админ-панель</h1>
    </div>
  )
}
```

### Частые заблуждения

- "Достаточно скрыть ссылку на админку" — нет, пользователь может ввести URL напрямую. Проверка должна быть на сервере.
- "getServerSession работает в клиентских компонентах" — нет, только в серверных. На клиенте используй useSession.

### Мини-проверка

1. Чем getServerSession отличается от useSession?
2. Почему скрытие ссылки — не защита?
3. Куда перенаправлять неавторизованного пользователя?

---

## Middleware — глобальная защита маршрутов

### Что это такое?

Middleware в Next.js — это функция, которая выполняется **до** рендеринга страницы. Идеальное место для проверки авторизации на группу маршрутов.

### Как работает?

```typescript
// middleware.ts (в КОРНЕ проекта, рядом с app/)
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(request) {
    const { pathname } = request.nextUrl
    const token = request.nextauth.token

    // Проверка роли для админских маршрутов
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // authorized возвращает true если пользователь авторизован
      authorized: ({ token }) => !!token,
    },
  }
)

// Указываем какие маршруты защищать
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/api/protected/:path*',
  ],
}
```

### Matcher — какие маршруты защищать

```typescript
export const config = {
  matcher: [
    // Конкретные пути
    '/dashboard',
    '/profile',

    // Все подпути
    '/admin/:path*',         // /admin, /admin/users, /admin/settings

    // API-маршруты
    '/api/protected/:path*',

    // НЕ включай сюда:
    // '/api/auth/:path*'    — иначе невозможно будет войти!
    // '/'                    — главная должна быть публичной
    // '/api/public/:path*'  — публичные API
  ],
}
```

### Частые заблуждения

- "Middleware заменяет проверку в компонентах" — нет, middleware дает первый уровень защиты. Проверку ролей лучше дублировать в компонентах и API.
- "Middleware работает на клиенте" — нет, middleware выполняется на edge-сервере, до отправки ответа клиенту.

### Мини-проверка

1. Где должен находиться файл middleware.ts?
2. Что делает matcher?
3. Почему нельзя добавлять `/api/auth` в matcher?

---

## Защита API Routes

### Что это такое?

API-эндпоинты тоже должны проверять авторизацию. Даже если фронтенд не показывает кнопку — API можно вызвать напрямую через curl или Postman.

### Как работает?

```typescript
// app/api/posts/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET — публичный (все могут читать посты)
export async function GET() {
  const posts = await prisma.post.findMany({
    include: { author: { select: { name: true } } },
  })
  return NextResponse.json(posts)
}

// POST — только для авторизованных
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Необходима авторизация' },
      { status: 401 }
    )
  }

  const body = await request.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json(
      { error: 'Пользователь не найден' },
      { status: 404 }
    )
  }

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: user.id,
    },
  })

  return NextResponse.json(post, { status: 201 })
}
```

### Хелпер для защиты API

```typescript
// lib/api-auth.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Не авторизован' }, { status: 401 }) }
  }

  return { session }
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { error: NextResponse.json({ error: 'Не авторизован' }, { status: 401 }) }
  }

  if (session.user.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Нет доступа' }, { status: 403 }) }
  }

  return { session }
}
```

```typescript
// Использование в API
import { requireAuth, requireAdmin } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  const auth = await requireAuth()
  if ('error' in auth) return auth.error

  // auth.session гарантированно существует
  const { session } = auth
  // ...
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  // Только админ дойдет до этой точки
  // ...
}
```

---

## Role-Based Access Control (RBAC)

### Что это такое?

RBAC — система, где каждому пользователю назначается роль, а каждая роль имеет набор разрешений.

### Как работает?

```prisma
// prisma/schema.prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
  role  Role   @default(USER)
  // ...
}

enum Role {
  USER
  EDITOR
  ADMIN
}
```

```typescript
// lib/permissions.ts
type Permission = 'read' | 'create' | 'edit' | 'delete' | 'manage_users'

const rolePermissions: Record<string, Permission[]> = {
  USER:   ['read', 'create'],
  EDITOR: ['read', 'create', 'edit'],
  ADMIN:  ['read', 'create', 'edit', 'delete', 'manage_users'],
}

export function hasPermission(role: string, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function requirePermission(role: string, permission: Permission) {
  if (!hasPermission(role, permission)) {
    throw new Error(`Роль ${role} не имеет разрешения ${permission}`)
  }
}
```

```typescript
// Использование в API
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await requireAuth()
  if ('error' in auth) return auth.error

  if (!hasPermission(auth.session.user.role, 'delete')) {
    return NextResponse.json({ error: 'Нет прав на удаление' }, { status: 403 })
  }

  await prisma.post.delete({ where: { id: parseInt(params.id) } })
  return NextResponse.json({ message: 'Удалено' })
}
```

### Проверка владельца ресурса

```typescript
// Пользователь может редактировать только СВОИ посты (или админ — любые)
export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireAuth()
  if ('error' in auth) return auth.error

  const post = await prisma.post.findUnique({
    where: { id: parseInt(params.id) },
    include: { author: true },
  })

  if (!post) {
    return NextResponse.json({ error: 'Пост не найден' }, { status: 404 })
  }

  const isOwner = post.author.email === auth.session.user.email
  const isAdmin = auth.session.user.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    return NextResponse.json(
      { error: 'Можно редактировать только свои посты' },
      { status: 403 }
    )
  }

  const body = await request.json()
  const updated = await prisma.post.update({
    where: { id: post.id },
    data: { title: body.title, content: body.content },
  })

  return NextResponse.json(updated)
}
```

### Частые заблуждения

- "401 и 403 — одно и то же" — нет. 401 Unauthorized = "Кто ты? Войди". 403 Forbidden = "Я знаю кто ты, но тебе нельзя".
- "Проверки на фронтенде достаточно" — нет, фронтенд можно обойти. Все проверки доступа должны быть на сервере.

### Мини-проверка

1. Чем 401 отличается от 403?
2. Почему проверка владельца ресурса важна?
3. Что такое RBAC?

---

## Паттерны перенаправления

### Что это такое?

Правильные перенаправления улучшают пользовательский опыт: после входа пользователь попадает туда, откуда пришел.

### Как работает?

```typescript
// Перенаправление с сохранением URL
// Пользователь хотел /dashboard/settings,
// но не авторизован -> /signin?callbackUrl=/dashboard/settings
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/dashboard/settings')
  }

  return <div>Настройки</div>
}
```

```typescript
// Клиентский компонент — перенаправление после входа
'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedClientPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') return <div>Загрузка...</div>
  if (!session) return null

  return <div>Защищенный контент</div>
}
```

---

## Итог

Защита маршрутов строится на нескольких уровнях:

| Уровень | Инструмент | Что защищает |
|---------|-----------|-------------|
| Middleware | withAuth + matcher | Группы маршрутов (первый барьер) |
| Server Component | getServerSession | Конкретные страницы |
| API Route | getServerSession | Эндпоинты |
| Client Component | useSession | UI-элементы (не безопасность!) |
| RBAC | hasPermission | Разрешения по ролям |

Главные правила:
- Проверка доступа всегда на сервере (middleware, getServerSession)
- 401 = не авторизован, 403 = нет доступа
- Проверяй не только роль, но и владельца ресурса
- Скрытие UI-элементов — не замена серверной проверке

---

> [[backend/04-nextauth|<-- Предыдущая: NextAuth.js]] | [[backend/06-file-upload|Следующая: Загрузка файлов -->]]
> [[backend-fundamentals|<-- Назад к оглавлению Backend]]
