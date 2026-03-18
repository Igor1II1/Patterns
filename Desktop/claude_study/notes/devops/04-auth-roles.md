# Авторизация и роли: система разрешений

> [[devops/03-backend|<-- Предыдущая: Backend]] | [[devops/05-testing|Следующая: Тестирование -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]

---

## Зачем эта тема существует?

"Кто ты?" и "Что тебе можно?" — два ключевых вопроса безопасности. Авторизация (authentication) отвечает на первый, система ролей (authorization) — на второй. В реальных приложениях есть обычные пользователи, модераторы, админы. Каждый видит и может делать разное. Без системы ролей любой пользователь получит доступ ко всему.

---

## Модель ролей в базе данных

### Что это такое?

Роли определяют уровень доступа пользователя. Самый простой вариант — поле role в таблице User. Для сложных систем используются отдельные таблицы ролей и разрешений.

### Простая модель (enum)

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
  USER      // обычный пользователь
  EDITOR    // может редактировать контент
  MODERATOR // может модерировать комментарии
  ADMIN     // полный доступ
}
```

### Продвинутая модель (таблицы ролей и разрешений)

```prisma
model User {
  id    String     @id @default(cuid())
  email String     @unique
  name  String?
  roles UserRole[]
}

model Role {
  id          String           @id @default(cuid())
  name        String           @unique  // "admin", "editor"
  description String?
  users       UserRole[]
  permissions RolePermission[]
}

model Permission {
  id          String           @id @default(cuid())
  name        String           @unique  // "posts:create", "users:delete"
  description String?
  roles       RolePermission[]
}

model UserRole {
  user   User   @relation(fields: [userId], references: [id])
  userId String
  role   Role   @relation(fields: [roleId], references: [id])
  roleId String

  @@id([userId, roleId])
}

model RolePermission {
  role         Role       @relation(fields: [roleId], references: [id])
  roleId       String
  permission   Permission @relation(fields: [permissionId], references: [id])
  permissionId String

  @@id([roleId, permissionId])
}
```

### Частые заблуждения

- "Достаточно boolean-поля isAdmin" — для простых приложений да, но при росте потребуется больше ролей. Enum масштабируется лучше.
- "Роли нужно проверять только на фронтенде" — нет! Фронтенд можно обойти. Проверка всегда на сервере.

### Мини-проверка

1. Когда использовать enum Role, а когда отдельные таблицы?
2. Зачем нужна промежуточная таблица UserRole?
3. Как выглядит разрешение в формате "ресурс:действие"?

---

## Система разрешений (Permissions)

### Что это такое?

Разрешения определяют, какие действия может выполнять роль. Это более гибко, чем проверка роли напрямую.

### Как работает?

```typescript
// lib/permissions.ts

// Определяем все возможные разрешения
export const PERMISSIONS = {
  // Посты
  'posts:read': 'Чтение постов',
  'posts:create': 'Создание постов',
  'posts:edit': 'Редактирование постов',
  'posts:delete': 'Удаление постов',

  // Пользователи
  'users:read': 'Просмотр пользователей',
  'users:edit': 'Редактирование пользователей',
  'users:delete': 'Удаление пользователей',

  // Настройки
  'settings:read': 'Просмотр настроек',
  'settings:edit': 'Изменение настроек',
} as const

type Permission = keyof typeof PERMISSIONS

// Маппинг ролей на разрешения
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  USER: [
    'posts:read',
    'posts:create',  // может создавать свои посты
  ],
  EDITOR: [
    'posts:read',
    'posts:create',
    'posts:edit',     // может редактировать любые посты
  ],
  MODERATOR: [
    'posts:read',
    'posts:create',
    'posts:edit',
    'posts:delete',   // может удалять посты
    'users:read',     // может видеть пользователей
  ],
  ADMIN: Object.keys(PERMISSIONS) as Permission[],  // все разрешения
}

// Проверка разрешения
export function can(role: string, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

// Проверка нескольких разрешений (все должны быть)
export function canAll(role: string, permissions: Permission[]): boolean {
  return permissions.every((p) => can(role, p))
}

// Проверка хотя бы одного разрешения
export function canAny(role: string, permissions: Permission[]): boolean {
  return permissions.some((p) => can(role, p))
}
```

```typescript
// Использование в API
import { can } from '@/lib/permissions'

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  // Проверяем разрешение, а не роль напрямую
  if (!can(session.user.role, 'posts:delete')) {
    return NextResponse.json({ error: 'Нет разрешения' }, { status: 403 })
  }

  await prisma.post.delete({ where: { id: params.id } })
  return NextResponse.json({ message: 'Удалено' })
}
```

### Частые заблуждения

- "Проверять роль напрямую (role === 'ADMIN') — нормально" — для маленьких проектов допустимо, но при добавлении новых ролей придется менять каждую проверку. Система разрешений масштабируется лучше.

---

## Защита на уровне UI

### Что это такое?

Интерфейс должен показывать только то, что пользователь может делать. Кнопка "Удалить" не нужна пользователю без права удаления.

### Как работает?

```typescript
// hooks/usePermissions.ts
'use client'
import { useSession } from 'next-auth/react'
import { can, canAny } from '@/lib/permissions'

export function usePermissions() {
  const { data: session } = useSession()
  const role = session?.user?.role || 'USER'

  return {
    can: (permission: string) => can(role, permission as any),
    canAny: (permissions: string[]) => canAny(role, permissions as any),
    role,
    isAdmin: role === 'ADMIN',
  }
}
```

```typescript
// Использование в компоненте
'use client'
import { usePermissions } from '@/hooks/usePermissions'

export function PostActions({ postId }: { postId: string }) {
  const { can } = usePermissions()

  return (
    <div>
      {can('posts:edit') && (
        <button>Редактировать</button>
      )}
      {can('posts:delete') && (
        <button className="text-red-500">Удалить</button>
      )}
    </div>
  )
}
```

### Компонент-обертка для защиты

```typescript
// components/PermissionGate.tsx
'use client'
import { usePermissions } from '@/hooks/usePermissions'
import { ReactNode } from 'react'

interface Props {
  permission: string
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGate({ permission, fallback = null, children }: Props) {
  const { can } = usePermissions()

  if (!can(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Использование:
<PermissionGate permission="settings:edit" fallback={<p>Нет доступа</p>}>
  <SettingsForm />
</PermissionGate>
```

### Частые заблуждения

- "Скрытие UI-элементов = защита" — нет! Это удобство, не безопасность. API всегда должен проверять разрешения независимо от UI.

### Мини-проверка

1. Зачем проверять разрешения и на UI, и на API?
2. Что делает компонент PermissionGate?
3. Почему скрытие кнопки — не защита?

---

## Основы админ-панели

### Что это такое?

Админ-панель — интерфейс для управления данными приложения: пользователи, контент, настройки.

### Как работает?

```typescript
// app/(admin)/admin/layout.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
        <h2 className="text-xl font-bold mb-6">Админ-панель</h2>
        <nav className="space-y-2">
          <a href="/admin" className="block p-2 hover:bg-gray-800 rounded">
            Обзор
          </a>
          <a href="/admin/users" className="block p-2 hover:bg-gray-800 rounded">
            Пользователи
          </a>
          <a href="/admin/posts" className="block p-2 hover:bg-gray-800 rounded">
            Посты
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
```

```typescript
// app/(admin)/admin/users/page.tsx
import { prisma } from '@/lib/prisma'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { posts: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Пользователи ({users.length})</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Имя</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Роль</th>
            <th className="text-left p-2">Постов</th>
            <th className="text-left p-2">Дата регистрации</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                  user.role === 'EDITOR' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="p-2">{user._count.posts}</td>
              <td className="p-2">{new Date(user.createdAt).toLocaleDateString('ru')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

## Итог

| Уровень защиты | Что проверяем | Где |
|----------------|-------------|-----|
| Middleware | Авторизован ли пользователь | middleware.ts |
| Layout | Роль для группы страниц | layout.tsx |
| API Route | Разрешение на действие | route.ts |
| UI-компонент | Показывать/скрывать элементы | PermissionGate |

Ключевые правила:
- Роли определяют набор разрешений
- Проверяй разрешения, а не роли напрямую
- Безопасность всегда на сервере, UI — только для удобства
- 401 = не авторизован, 403 = нет разрешения

---

> [[devops/03-backend|<-- Предыдущая: Backend]] | [[devops/05-testing|Следующая: Тестирование -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]
