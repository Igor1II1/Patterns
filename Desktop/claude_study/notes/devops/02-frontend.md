# Frontend-разработка: компоненты, стейт, API

> [[devops/01-architecture|<-- Предыдущая: Архитектура]] | [[devops/03-backend|Следующая: Backend-разработка -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]

---

## Зачем эта тема существует?

Frontend — это то, что видит пользователь. Красивый дизайн без работающей логики бесполезен, а работающая логика без структуры превращается в спагетти-код. Эта глава о том, как правильно организовать фронтенд: создать библиотеку компонентов, управлять состоянием и интегрироваться с API.

---

## Библиотека UI-компонентов

### Что это такое?

UI-компоненты — базовые строительные блоки интерфейса: кнопки, инпуты, модалки. Создав их один раз, ты переиспользуешь везде.

### Как работает?

```typescript
// components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded font-medium transition-colors
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Загрузка...' : children}
    </button>
  )
}
```

```typescript
// components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <input
          ref={ref}
          className={`border rounded px-3 py-2 text-base
            ${error ? 'border-red-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${className}`}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

### Частые заблуждения

- "Можно писать стили инлайн везде" — можно, но это нечитаемо и не переиспользуемо. UI-компоненты инкапсулируют стили.
- "Каждый проект нужно начинать с нуля" — нет, библиотеки вроде shadcn/ui дают готовые компоненты, которые можно кастомизировать.

### Мини-проверка

1. Зачем создавать собственные UI-компоненты вместо обычных HTML-элементов?
2. Что делает forwardRef?
3. Зачем нужен паттерн `...props` (spread)?

---

## Управление состоянием

### Что это такое?

Состояние (state) — данные, которые меняются во время работы приложения: список задач, текущий пользователь, открыта ли модалка.

### Уровни состояния

```typescript
// 1. Локальный state — один компонент
function TaskCard() {
  const [isExpanded, setIsExpanded] = useState(false)
  // Нужен только этому компоненту
}

// 2. Поднятие state — между родственными компонентами
function Board() {
  const [tasks, setTasks] = useState<Task[]>([])

  return (
    <>
      <TaskList tasks={tasks} />
      <AddTaskForm onAdd={(task) => setTasks([...tasks, task])} />
    </>
  )
}

// 3. Context — глобальные данные (тема, авторизация)
const ThemeContext = createContext<'light' | 'dark'>('light')

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  return (
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  )
}

// 4. Серверный state — данные из API (используй SWR или React Query)
```

### React Query (TanStack Query) — работа с серверными данными

```bash
npm install @tanstack/react-query
```

```typescript
// providers/QueryProvider.tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )
}
```

```typescript
// hooks/useBoards.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Board {
  id: string
  title: string
  createdAt: string
}

// Получение списка
export function useBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: async (): Promise<Board[]> => {
      const res = await fetch('/api/boards')
      if (!res.ok) throw new Error('Ошибка загрузки')
      const data = await res.json()
      return data.data
    },
  })
}

// Создание
export function useCreateBoard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (!res.ok) throw new Error('Ошибка создания')
      return res.json()
    },
    onSuccess: () => {
      // Обновить кеш — перезагрузить список досок
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })
}
```

```typescript
// Использование в компоненте
'use client'
import { useBoards, useCreateBoard } from '@/hooks/useBoards'

export function BoardsPage() {
  const { data: boards, isLoading, error } = useBoards()
  const createBoard = useCreateBoard()

  if (isLoading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error.message}</div>

  return (
    <div>
      <button
        onClick={() => createBoard.mutate('Новая доска')}
        disabled={createBoard.isPending}
      >
        {createBoard.isPending ? 'Создание...' : 'Создать доску'}
      </button>

      {boards?.map((board) => (
        <div key={board.id}>{board.title}</div>
      ))}
    </div>
  )
}
```

### Частые заблуждения

- "Все данные нужно хранить в глобальном состоянии" — нет, серверные данные лучше хранить в React Query. Глобальный state — только для UI-состояния (тема, язык).
- "useEffect + fetch — лучший способ загрузки данных" — нет, React Query дает кеширование, автообновление, обработку ошибок и состояний загрузки из коробки.

### Мини-проверка

1. Когда использовать useState, а когда Context?
2. Зачем нужен invalidateQueries?
3. Чем React Query лучше чем useEffect + fetch?

---

## Паттерны интеграции с API

### Что это такое?

Правильная интеграция с API определяет, как фронтенд общается с бэкендом: загрузка данных, отправка форм, обработка ошибок.

### Как работает?

```typescript
// lib/api.ts — централизованный API-клиент
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Ошибка сервера' }))
    throw new ApiError(response.status, error.error || 'Ошибка')
  }

  return response.json()
}

// Типизированные методы
export const api = {
  boards: {
    list: () => apiRequest<{ data: Board[] }>('/api/boards'),
    get: (id: string) => apiRequest<Board>(`/api/boards/${id}`),
    create: (data: { title: string }) =>
      apiRequest<Board>('/api/boards', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Board>) =>
      apiRequest<Board>(`/api/boards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiRequest<void>(`/api/boards/${id}`, { method: 'DELETE' }),
  },
}
```

### Обработка состояний загрузки

```typescript
// Паттерн для всех страниц с данными
'use client'
import { useBoards } from '@/hooks/useBoards'

export function BoardsPage() {
  const { data, isLoading, error, refetch } = useBoards()

  // Состояние загрузки
  if (isLoading) {
    return <BoardsSkeleton />  // Скелетон вместо "Загрузка..."
  }

  // Состояние ошибки
  if (error) {
    return (
      <div>
        <p>Не удалось загрузить доски</p>
        <button onClick={() => refetch()}>Попробовать снова</button>
      </div>
    )
  }

  // Пустое состояние
  if (!data || data.length === 0) {
    return (
      <div>
        <p>У вас пока нет досок</p>
        <button>Создать первую доску</button>
      </div>
    )
  }

  // Данные есть
  return (
    <div>
      {data.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}
    </div>
  )
}
```

### Частые заблуждения

- "Достаточно показать 'Загрузка...'" — нет, скелетоны (серые плейсхолдеры) дают лучший UX, потому что пользователь видит структуру страницы.
- "Пустое состояние не важно" — важно! Пустая страница сбивает с толку. Покажи подсказку, что делать дальше.

---

## Итог

| Концепция | Инструмент | Когда использовать |
|-----------|-----------|-------------------|
| UI-компоненты | Button, Input, Modal | Базовые элементы интерфейса |
| Локальный state | useState | Данные одного компонента |
| Context | createContext | Глобальные UI-данные (тема) |
| Серверный state | React Query | Данные из API |
| API-клиент | fetch wrapper | Централизованная работа с API |

Ключевые правила:
- Создавай переиспользуемые UI-компоненты
- Серверные данные — в React Query, не в useState
- Обрабатывай все состояния: загрузка, ошибка, пусто, данные

---

> [[devops/01-architecture|<-- Предыдущая: Архитектура]] | [[devops/03-backend|Следующая: Backend-разработка -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]
