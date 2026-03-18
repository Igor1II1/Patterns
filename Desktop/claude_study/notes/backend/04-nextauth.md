# NextAuth.js: авторизация в Next.js

> [[backend/03-api-prisma|<-- Предыдущая: API + Prisma]] | [[backend/05-protected-routes|Следующая: Защита маршрутов -->]]
> [[backend-fundamentals|<-- Назад к оглавлению Backend]]

---

## Зачем эта тема существует?

Почти каждое приложение требует авторизации: вход, выход, "Кто сейчас залогинен?". Писать авторизацию с нуля — сложно и опасно (легко допустить уязвимость). NextAuth.js (теперь Auth.js) — стандартная библиотека для авторизации в Next.js. Она поддерживает OAuth (вход через GitHub, Google), email-авторизацию и управление сессиями.

---

## Установка и настройка

### Что это такое?

NextAuth.js обрабатывает весь цикл авторизации: показывает страницу входа, общается с OAuth-провайдерами, создает и хранит сессии.

### Как работает?

```bash
npm install next-auth @auth/prisma-adapter
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

`[...nextauth]` — это catch-all route. Он перехватывает все запросы на `/api/auth/*`:
- `/api/auth/signin` — страница входа
- `/api/auth/signout` — выход
- `/api/auth/session` — текущая сессия
- `/api/auth/callback/github` — callback после OAuth

```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  session: {
    strategy: 'database',  // или 'jwt'
  },

  pages: {
    signIn: '/auth/signin',   // Кастомная страница входа (необязательно)
    error: '/auth/error',      // Страница ошибки
  },
}
```

### Переменные окружения

```env
# .env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=любая-длинная-случайная-строка-для-шифрования

# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# Google OAuth
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret
```

### Как получить ключи GitHub OAuth

1. Зайди на github.com -> Settings -> Developer settings -> OAuth Apps
2. New OAuth App
3. Application name: My App
4. Homepage URL: http://localhost:3000
5. Authorization callback URL: http://localhost:3000/api/auth/callback/github
6. Скопируй Client ID и Client Secret

### Частые заблуждения

- "NEXTAUTH_SECRET необязателен" — на продакшне обязателен! Без него сессии небезопасны.
- "OAuth хранит пароль пользователя" — нет, OAuth никогда не передает пароль. Только токен доступа.

### Мини-проверка

1. Что делает catch-all route `[...nextauth]`?
2. Зачем нужен NEXTAUTH_SECRET?
3. Что происходит при переходе на `/api/auth/signin`?

---

## Prisma-схема для авторизации

### Что это такое?

NextAuth с Prisma Adapter требует определенных таблиц в базе данных для хранения пользователей, аккаунтов и сессий.

### Как работает?

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          String    @default("user")

  accounts      Account[]
  sessions      Session[]
  posts         Post[]    // твои собственные связи

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

```bash
# Применить схему
npx prisma migrate dev --name add_auth_tables
```

---

## OAuth-провайдеры

### Что это такое?

OAuth — протокол, позволяющий пользователю войти через существующий аккаунт (GitHub, Google) без создания нового пароля.

### Как работает OAuth?

```
1. Пользователь нажимает "Войти через GitHub"
2. Браузер перенаправляется на github.com
3. Пользователь разрешает доступ приложению
4. GitHub перенаправляет обратно на /api/auth/callback/github
5. NextAuth получает данные пользователя от GitHub
6. Создается запись в User и Account (первый вход)
   или находится существующая (повторный вход)
7. Создается сессия
8. Пользователь авторизован
```

### Примеры кода

```typescript
// Компонент кнопки входа
'use client'
import { signIn, signOut, useSession } from 'next-auth/react'

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Загрузка...</div>
  }

  if (session) {
    return (
      <div>
        <p>Привет, {session.user?.name}!</p>
        <img src={session.user?.image || ''} alt="Avatar" width={32} />
        <button onClick={() => signOut()}>Выйти</button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => signIn('github')}>Войти через GitHub</button>
      <button onClick={() => signIn('google')}>Войти через Google</button>
    </div>
  )
}
```

```typescript
// app/layout.tsx — обернуть приложение в SessionProvider
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
```

### Частые заблуждения

- "SessionProvider нужен только на странице входа" — нет, он нужен на уровне всего приложения, иначе `useSession` не будет работать.
- "После signIn пользователь сразу авторизован" — нет, происходит перенаправление на провайдер и обратно. Это асинхронный процесс.

### Мини-проверка

1. Какие шаги проходит OAuth-авторизация?
2. Зачем нужен SessionProvider?
3. Чем signIn('github') отличается от signIn() без аргументов?

---

## JWT vs Database Sessions

### Что это такое?

NextAuth поддерживает две стратегии хранения сессий:

### JWT (JSON Web Token)

```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',  // Сессия хранится в зашифрованном cookie
  },
  // ...
}
```

- Сессия хранится в зашифрованном cookie на клиенте
- Не требует таблицы Session в базе
- Быстрее (не нужен запрос к БД для проверки сессии)
- Нельзя "убить" сессию с сервера (пока не истечет)
- Подходит для stateless-приложений

### Database Sessions

```typescript
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',  // Сессия хранится в таблице Session
  },
  // ...
}
```

- Сессия хранится в таблице Session
- Можно удалить сессию с сервера (принудительный выход)
- Медленнее (запрос к БД при каждой проверке)
- Подходит когда нужен контроль над сессиями

### Сравнение

| Свойство | JWT | Database |
|----------|-----|----------|
| Скорость | Быстрее | Медленнее |
| Требует БД | Нет | Да |
| Принудительный выход | Невозможен | Возможен |
| Размер cookie | Больше | Меньше |
| Рекомендуется для | Простых приложений | Приложений с ролями |

### Добавление данных в сессию

```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  // ...
  callbacks: {
    // Добавить role в JWT-токен
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },

    // Добавить role в объект сессии
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
}
```

```typescript
// types/next-auth.d.ts — расширяем типы
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      role: string
    } & DefaultSession['user']
  }

  interface User {
    role: string
  }
}
```

### Частые заблуждения

- "JWT безопаснее чем database sessions" — нет, оба варианта безопасны. Просто разные подходы с разными компромиссами.

### Мини-проверка

1. Где хранится JWT-сессия?
2. Когда лучше использовать database sessions?
3. Как добавить поле role в объект session?

---

## Итог

NextAuth.js решает авторизацию в Next.js:

| Компонент | Роль |
|-----------|------|
| providers | Настройка способов входа (GitHub, Google) |
| adapter | Связь с базой данных (Prisma) |
| session strategy | JWT или database |
| callbacks | Кастомизация сессии и токена |
| signIn / signOut | Вход и выход |
| useSession | Доступ к сессии на клиенте |
| getServerSession | Доступ к сессии на сервере |

Главные правила:
- Всегда оборачивай приложение в SessionProvider
- Храни секреты в .env, никогда не в коде
- Используй database sessions если нужен контроль (роли, принудительный выход)

---

> [[backend/03-api-prisma|<-- Предыдущая: API + Prisma]] | [[backend/05-protected-routes|Следующая: Защита маршрутов -->]]
> [[backend-fundamentals|<-- Назад к оглавлению Backend]]
