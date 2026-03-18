# Тестирование: Jest и React Testing Library

> [[devops/04-auth-roles|<-- Предыдущая: Auth и роли]] | [[devops/06-docker|Следующая: Docker -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]

---

## Зачем эта тема существует?

Код без тестов — бомба замедленного действия. Ты меняешь одну функцию — и ломается что-то в другом месте. Тесты ловят ошибки до того, как их увидят пользователи. Для Junior-разработчика умение писать тесты — серьезное конкурентное преимущество на собеседовании.

---

## Установка и настройка Jest

### Что это такое?

Jest — самый популярный фреймворк для тестирования JavaScript/TypeScript. React Testing Library (RTL) — библиотека для тестирования React-компонентов.

### Как работает?

```bash
# Установка для Next.js проекта
npm install -D jest @jest/types ts-jest @testing-library/react \
  @testing-library/jest-dom @testing-library/user-event \
  jest-environment-jsdom
```

```typescript
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',  // Путь к Next.js приложению
})

const config: Config = {
  setupFilesAfterSetup: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',  // Поддержка alias @/
  },
}

export default createJestConfig(config)
```

```typescript
// jest.setup.ts
import '@testing-library/jest-dom'
```

```json
// package.json — добавь скрипты
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Структура тестов

```
src/
├── lib/
│   ├── utils.ts
│   └── __tests__/
│       └── utils.test.ts       # Тесты рядом с кодом
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx         # Или рядом с компонентом
tests/                          # Или отдельная папка
├── unit/
│   └── permissions.test.ts
├── integration/
│   └── api-boards.test.ts
```

### Частые заблуждения

- "Тесты замедляют разработку" — сначала да, но через месяц они экономят часы на отладке и рефакторинге.
- "Нужно покрыть 100% кода" — нет, 70-80% покрытия критичного кода лучше, чем 100% с бесполезными тестами.

---

## Unit-тесты: тестирование функций

### Что это такое?

Unit-тест проверяет одну маленькую единицу кода (функцию, класс) в изоляции от остального приложения.

### Как работает?

```typescript
// lib/utils.ts
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(price)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}
```

```typescript
// lib/__tests__/utils.test.ts
import { formatPrice, slugify, truncate } from '../utils'

// describe — группа связанных тестов
describe('formatPrice', () => {
  // it (или test) — один тест
  it('форматирует целое число', () => {
    expect(formatPrice(1500)).toContain('1')
    expect(formatPrice(1500)).toContain('500')
  })

  it('форматирует десятичное число', () => {
    const result = formatPrice(99.99)
    expect(result).toContain('99')
  })

  it('форматирует ноль', () => {
    const result = formatPrice(0)
    expect(result).toContain('0')
  })
})

describe('slugify', () => {
  it('преобразует пробелы в дефисы', () => {
    expect(slugify('hello world')).toBe('hello-world')
  })

  it('приводит к нижнему регистру', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('удаляет спецсимволы', () => {
    expect(slugify('hello! @world#')).toBe('hello-world')
  })

  it('обрабатывает пустую строку', () => {
    expect(slugify('')).toBe('')
  })

  it('убирает дефисы по краям', () => {
    expect(slugify('-hello-')).toBe('hello')
  })
})

describe('truncate', () => {
  it('не обрезает короткий текст', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('обрезает длинный текст и добавляет ...', () => {
    expect(truncate('hello world foo', 10)).toBe('hello...')
  })

  it('обрабатывает текст точно по длине', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })
})
```

### Основные матчеры (assertions)

```typescript
// Равенство
expect(value).toBe(42)              // строгое равенство (===)
expect(value).toEqual({ a: 1 })     // глубокое сравнение объектов
expect(value).not.toBe(0)           // отрицание

// Типы
expect(value).toBeDefined()
expect(value).toBeUndefined()
expect(value).toBeNull()
expect(value).toBeTruthy()           // любое truthy значение
expect(value).toBeFalsy()

// Числа
expect(value).toBeGreaterThan(3)
expect(value).toBeLessThanOrEqual(10)
expect(value).toBeCloseTo(0.3, 1)    // для float

// Строки
expect(value).toContain('hello')
expect(value).toMatch(/regex/)

// Массивы
expect(arr).toContain('item')
expect(arr).toHaveLength(3)

// Объекты
expect(obj).toHaveProperty('name')
expect(obj).toMatchObject({ name: 'Igor' })  // частичное совпадение

// Исключения
expect(() => fn()).toThrow()
expect(() => fn()).toThrow('error message')

// Асинхронные
await expect(asyncFn()).resolves.toBe(42)
await expect(asyncFn()).rejects.toThrow('error')
```

### Мини-проверка

1. Чем toBe отличается от toEqual?
2. Зачем группировать тесты в describe?
3. Что тестирует unit-тест?

---

## Тестирование React-компонентов

### Что это такое?

React Testing Library тестирует компоненты так, как их использует пользователь: находит элементы по тексту, кликает по кнопкам, проверяет что отображается.

### Как работает?

```typescript
// components/Counter.tsx
'use client'
import { useState } from 'react'

export function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial)

  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(0)}>Сбросить</button>
    </div>
  )
}
```

```typescript
// components/Counter.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './Counter'

describe('Counter', () => {
  it('отображает начальное значение', () => {
    render(<Counter initial={5} />)

    expect(screen.getByTestId('count')).toHaveTextContent('5')
  })

  it('увеличивает счетчик при клике на +', async () => {
    const user = userEvent.setup()
    render(<Counter />)

    await user.click(screen.getByRole('button', { name: '+' }))

    expect(screen.getByTestId('count')).toHaveTextContent('1')
  })

  it('уменьшает счетчик при клике на -', async () => {
    const user = userEvent.setup()
    render(<Counter initial={5} />)

    await user.click(screen.getByRole('button', { name: '-' }))

    expect(screen.getByTestId('count')).toHaveTextContent('4')
  })

  it('сбрасывает счетчик', async () => {
    const user = userEvent.setup()
    render(<Counter initial={10} />)

    await user.click(screen.getByRole('button', { name: 'Сбросить' }))

    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })
})
```

### Поиск элементов

```typescript
// По роли (рекомендуется — как пользователь видит)
screen.getByRole('button', { name: 'Отправить' })
screen.getByRole('textbox')          // input
screen.getByRole('heading', { level: 1 })  // h1

// По тексту
screen.getByText('Привет, мир!')
screen.getByText(/привет/i)          // регистронезависимый поиск

// По label (для форм)
screen.getByLabelText('Email')

// По placeholder
screen.getByPlaceholderText('Введите имя')

// По data-testid (крайний случай)
screen.getByTestId('submit-button')

// Варианты: get / query / find
screen.getByText('...')     // бросит ошибку если не найдет
screen.queryByText('...')   // вернет null если не найдет
screen.findByText('...')    // async — ждет появления элемента
```

### Тестирование формы

```typescript
// components/LoginForm.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('вызывает onSubmit с введенными данными', async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn()

    render(<LoginForm onSubmit={handleSubmit} />)

    await user.type(screen.getByLabelText('Email'), 'igor@mail.ru')
    await user.type(screen.getByLabelText('Пароль'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'igor@mail.ru',
      password: 'secret123',
    })
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('показывает ошибку при пустом email', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={jest.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(screen.getByText(/email обязателен/i)).toBeInTheDocument()
  })
})
```

### Частые заблуждения

- "Нужно тестировать внутреннее состояние компонента" — нет, тестируй поведение: что видит пользователь, что происходит при клике. Не лезь внутрь useState.
- "data-testid нужен для каждого элемента" — нет, используй роли и текст. data-testid — крайний случай.

### Мини-проверка

1. Чем getByRole лучше чем getByTestId?
2. Когда использовать queryBy вместо getBy?
3. Зачем нужен jest.fn()?

---

## Integration-тесты

### Что это такое?

Integration-тесты проверяют взаимодействие нескольких частей приложения вместе, например API route + база данных.

### Как работает?

```typescript
// tests/integration/permissions.test.ts
import { can, canAll, canAny } from '@/lib/permissions'

describe('Система разрешений', () => {
  describe('USER', () => {
    it('может читать посты', () => {
      expect(can('USER', 'posts:read')).toBe(true)
    })

    it('может создавать посты', () => {
      expect(can('USER', 'posts:create')).toBe(true)
    })

    it('не может удалять посты', () => {
      expect(can('USER', 'posts:delete')).toBe(false)
    })

    it('не может управлять пользователями', () => {
      expect(can('USER', 'users:delete')).toBe(false)
    })
  })

  describe('ADMIN', () => {
    it('имеет все разрешения', () => {
      expect(can('ADMIN', 'posts:delete')).toBe(true)
      expect(can('ADMIN', 'users:delete')).toBe(true)
      expect(can('ADMIN', 'settings:edit')).toBe(true)
    })
  })

  describe('canAll', () => {
    it('возвращает true если есть все разрешения', () => {
      expect(canAll('ADMIN', ['posts:read', 'posts:delete'])).toBe(true)
    })

    it('возвращает false если не хватает хотя бы одного', () => {
      expect(canAll('USER', ['posts:read', 'posts:delete'])).toBe(false)
    })
  })
})
```

### Моки (Mocks)

```typescript
// Мок — подмена реальной зависимости фейковой

// Мок модуля
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

// Мок fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  })
) as jest.Mock

// Мок next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() =>
    Promise.resolve({
      user: { email: 'test@mail.ru', role: 'USER' },
    })
  ),
}))
```

---

## Паттерны тестирования

### Что это такое?

Паттерны помогают писать читаемые и поддерживаемые тесты.

### AAA (Arrange, Act, Assert)

```typescript
it('удаляет элемент из списка', () => {
  // Arrange — подготовка
  const list = ['a', 'b', 'c']

  // Act — действие
  const result = removeItem(list, 'b')

  // Assert — проверка
  expect(result).toEqual(['a', 'c'])
})
```

### Запуск тестов

```bash
# Все тесты
npm test

# В режиме наблюдения (перезапуск при изменении файлов)
npm run test:watch

# С отчетом о покрытии
npm run test:coverage

# Только конкретный файл
npx jest utils.test.ts

# Только тесты с определенным именем
npx jest -t "форматирует"
```

---

## Итог

| Тип теста | Что тестирует | Скорость | Количество |
|-----------|-------------|----------|-----------|
| Unit | Одна функция | Быстро | Много |
| Component | React-компонент | Средне | Средне |
| Integration | Несколько модулей вместе | Медленнее | Меньше |
| E2E | Все приложение целиком | Медленно | Мало |

Ключевые правила:
- Тестируй поведение, а не реализацию
- Используй AAA-паттерн: Arrange, Act, Assert
- Находи элементы по ролям и тексту, не по data-testid
- 70-80% покрытия критичного кода > 100% бесполезного покрытия

---

> [[devops/04-auth-roles|<-- Предыдущая: Auth и роли]] | [[devops/06-docker|Следующая: Docker -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]
