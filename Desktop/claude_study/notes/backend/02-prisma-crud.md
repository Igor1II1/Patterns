# Prisma Client: CRUD-операции

> [[backend/01-prisma-schema|<-- Предыдущая: Prisma Schema]] | [[backend/03-api-prisma|Следующая: API + Prisma -->]]
> [[backend-fundamentals|<-- Назад к оглавлению Backend]]

---

## Зачем эта тема существует?

Prisma Schema описывает структуру базы, а Prisma Client — это то, через что ты реально взаимодействуешь с данными из JavaScript/TypeScript кода. Вместо написания SQL-строк ты вызываешь методы с автодополнением и проверкой типов. Это основа для создания API в Next.js.

---

## Инициализация Prisma Client

### Что это такое?

Prisma Client — это автосгенерированная библиотека, которая предоставляет типизированные методы для каждой модели из schema.prisma.

### Как работает?

```typescript
// lib/prisma.ts — создаем единственный экземпляр клиента
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

Зачем так сложно? В режиме разработки Next.js перезагружает модули при каждом изменении. Без этого кода каждая перезагрузка создавала бы новое подключение к базе, и через 10 минут все подключения закончились бы.

```typescript
// Использование в любом файле
import { prisma } from '@/lib/prisma'

const users = await prisma.user.findMany()
```

### Частые заблуждения

- "Можно создавать new PrismaClient() в каждом файле" — нет, это приведет к исчерпанию подключений к базе данных.
- "Prisma Client нужно обновлять вручную" — `prisma migrate dev` обновляет его автоматически. Если нужно отдельно — `npx prisma generate`.

---

## Create — создание записей

### Что это такое?

Метод `create` добавляет одну запись в таблицу. Метод `createMany` — несколько записей за один запрос.

### Как работает?

```typescript
// Создать одного пользователя
const user = await prisma.user.create({
  data: {
    email: 'igor@mail.ru',
    name: 'Игорь',
    age: 25,
  },
})
// user = { id: 1, email: 'igor@mail.ru', name: 'Игорь', age: 25, createdAt: ... }

// Создать пользователя вместе с постами (вложенное создание)
const userWithPosts = await prisma.user.create({
  data: {
    email: 'anna@mail.ru',
    name: 'Анна',
    posts: {
      create: [
        { title: 'Первый пост', content: 'Привет мир!' },
        { title: 'Второй пост', content: 'Учу Prisma' },
      ],
    },
  },
  include: {
    posts: true,  // Вернуть посты в результате
  },
})

// Создать много записей за раз
const result = await prisma.user.createMany({
  data: [
    { email: 'user1@mail.ru', name: 'User 1' },
    { email: 'user2@mail.ru', name: 'User 2' },
    { email: 'user3@mail.ru', name: 'User 3' },
  ],
  skipDuplicates: true,  // Пропустить записи с дублирующимся unique-полем
})
// result = { count: 3 }
```

### Частые заблуждения

- "createMany возвращает созданные записи" — нет, возвращает только `{ count: N }`. Для получения записей используй create в цикле или транзакцию.

### Мини-проверка

1. Как создать запись со связанными данными одним запросом?
2. Что возвращает createMany?
3. Что делает параметр skipDuplicates?

---

## Read — чтение данных

### Что это такое?

Prisma предоставляет несколько методов для чтения: `findMany` (список), `findUnique` (одна запись по уникальному полю), `findFirst` (первая подходящая).

### findMany — получить список

```typescript
// Все пользователи
const allUsers = await prisma.user.findMany()

// С фильтрацией
const adults = await prisma.user.findMany({
  where: {
    age: { gte: 18 },  // age >= 18
  },
})

// Выбрать конкретные поля
const names = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    // email не будет в результате
  },
})

// Сортировка
const sorted = await prisma.user.findMany({
  orderBy: {
    createdAt: 'desc',  // от новых к старым
  },
})

// Пагинация
const page2 = await prisma.user.findMany({
  skip: 10,   // пропустить 10 записей (OFFSET)
  take: 10,   // взять 10 записей (LIMIT)
  orderBy: { id: 'asc' },
})
```

### findUnique — одна запись по уникальному полю

```typescript
// По id
const user = await prisma.user.findUnique({
  where: { id: 1 },
})
// user или null

// По email (поле с @unique)
const user = await prisma.user.findUnique({
  where: { email: 'igor@mail.ru' },
})

// findUnique работает ТОЛЬКО с полями @id или @unique
// Для поиска по обычному полю используй findFirst
```

### findFirst — первая подходящая запись

```typescript
const user = await prisma.user.findFirst({
  where: {
    name: 'Игорь',
  },
})
```

### Фильтрация (where)

```typescript
const filtered = await prisma.user.findMany({
  where: {
    // Точное совпадение
    name: 'Игорь',

    // Сравнение чисел
    age: { gt: 18 },     // >
    age: { gte: 18 },    // >=
    age: { lt: 30 },     // <
    age: { lte: 30 },    // <=
    age: { not: 25 },    // !=

    // Текстовый поиск
    name: { contains: 'гор' },      // LIKE '%гор%'
    name: { startsWith: 'И' },       // LIKE 'И%'
    name: { endsWith: 'ь' },         // LIKE '%ь'
    email: { contains: 'mail', mode: 'insensitive' },  // без учета регистра

    // Список значений
    age: { in: [22, 25, 30] },       // IN (22, 25, 30)
    age: { notIn: [22, 25] },        // NOT IN

    // NULL
    age: null,            // IS NULL (поле не заполнено)
    age: { not: null },   // IS NOT NULL

    // Логические операторы
    AND: [
      { age: { gte: 18 } },
      { age: { lte: 30 } },
    ],
    OR: [
      { name: 'Игорь' },
      { name: 'Анна' },
    ],
    NOT: {
      email: { contains: 'spam' },
    },
  },
})
```

### Включение связей (include)

```typescript
// Получить пользователя с его постами
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true,  // Все посты этого пользователя
  },
})
// { id: 1, name: 'Игорь', posts: [{ id: 1, title: '...' }, ...] }

// Вложенные связи
const userFull = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      include: {
        comments: true,  // Посты с комментариями
      },
      orderBy: { createdAt: 'desc' },
      take: 5,  // Только последние 5 постов
    },
  },
})
```

### select vs include

```typescript
// select — выбрать конкретные поля (остальных НЕ будет)
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    name: true,
    email: true,
    posts: { select: { title: true } },
  },
})
// { name: 'Игорь', email: 'igor@mail.ru', posts: [{ title: '...' }] }

// include — добавить связи (все поля модели + связи)
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true },
})
// { id: 1, name: 'Игорь', email: '...', age: 25, ..., posts: [...] }

// НЕЛЬЗЯ использовать select и include одновременно!
```

### Подсчет записей

```typescript
// Количество пользователей
const count = await prisma.user.count()

// С фильтром
const adultCount = await prisma.user.count({
  where: { age: { gte: 18 } },
})

// Агрегация
const stats = await prisma.order.aggregate({
  _sum: { total: true },
  _avg: { total: true },
  _min: { total: true },
  _max: { total: true },
  _count: true,
})
```

### Частые заблуждения

- "findUnique может искать по любому полю" — нет, только по полям с @id или @unique.
- "select и include можно комбинировать" — нет, используй что-то одно.
- "findMany без where вернет ошибку" — нет, вернет все записи. Но на больших таблицах это плохая идея.

### Мини-проверка

1. Чем findUnique отличается от findFirst?
2. Как реализовать пагинацию?
3. Чем select отличается от include?

---

## Update — обновление записей

### Что это такое?

Методы `update` и `updateMany` изменяют существующие записи.

### Как работает?

```typescript
// Обновить одну запись (по уникальному полю)
const updated = await prisma.user.update({
  where: { id: 1 },
  data: {
    name: 'Игорь Петров',
    age: 26,
  },
})

// Обновить много записей
const result = await prisma.user.updateMany({
  where: {
    age: { lt: 18 },
  },
  data: {
    role: 'minor',
  },
})
// result = { count: 5 }

// Числовые операции
const updated = await prisma.product.update({
  where: { id: 1 },
  data: {
    views: { increment: 1 },   // views + 1
    stock: { decrement: 1 },   // stock - 1
    price: { multiply: 1.1 },  // price * 1.1
    rating: { divide: 2 },     // rating / 2
  },
})

// Обновить связи
const updated = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      create: { title: 'Новый пост' },           // создать новый пост
      connect: { id: 5 },                         // привязать существующий пост
      disconnect: { id: 3 },                      // отвязать пост
      delete: { id: 2 },                          // удалить пост
    },
  },
})

// upsert — обновить или создать
const user = await prisma.user.upsert({
  where: { email: 'igor@mail.ru' },
  update: { name: 'Игорь Петров' },  // Если нашли
  create: {                            // Если не нашли
    email: 'igor@mail.ru',
    name: 'Игорь Петров',
  },
})
```

### Частые заблуждения

- "update может обновить по любому полю" — нет, `where` в `update` работает только с уникальными полями. Для остальных — `updateMany`.
- "updateMany возвращает обновленные записи" — нет, только `{ count: N }`.

### Мини-проверка

1. Чем update отличается от updateMany?
2. Что делает upsert?
3. Как увеличить числовое поле на 1?

---

## Delete — удаление записей

### Что это такое?

Методы `delete` и `deleteMany` удаляют записи из базы.

### Как работает?

```typescript
// Удалить одну запись
const deleted = await prisma.user.delete({
  where: { id: 1 },
})
// Вернет удаленную запись

// Удалить много записей
const result = await prisma.user.deleteMany({
  where: {
    createdAt: { lt: new Date('2025-01-01') },
  },
})
// result = { count: 10 }

// Удалить ВСЕ записи
const result = await prisma.user.deleteMany()
// Опасно! Удалит все строки в таблице
```

### Частые заблуждения

- "delete без where удалит все" — нет, Prisma не позволит. `where` обязателен в `delete`. Для удаления всего — `deleteMany()` без аргументов.

---

## Транзакции

### Что это такое?

Транзакция — группа операций, которые выполняются целиком или не выполняются вовсе. Если одна операция упадет — все отменятся.

### Как работает?

```typescript
// Последовательные операции в транзакции
const [user, order] = await prisma.$transaction([
  prisma.user.update({
    where: { id: 1 },
    data: { balance: { decrement: 100 } },
  }),
  prisma.order.create({
    data: { userId: 1, total: 100 },
  }),
])

// Интерактивная транзакция (с логикой внутри)
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.findUnique({ where: { id: 1 } })

  if (!user || user.balance < 100) {
    throw new Error('Недостаточно средств')
  }

  await tx.user.update({
    where: { id: 1 },
    data: { balance: { decrement: 100 } },
  })

  const order = await tx.order.create({
    data: { userId: 1, total: 100 },
  })

  return order
})
```

### Мини-проверка

1. Зачем нужны транзакции?
2. Что произойдет, если одна операция в транзакции упадет?
3. Чем интерактивная транзакция отличается от обычной?

---

## Итог

| Метод | SQL-аналог | Возвращает |
|-------|-----------|-----------|
| create | INSERT | Созданную запись |
| createMany | INSERT (множ.) | { count: N } |
| findMany | SELECT | Массив записей |
| findUnique | SELECT WHERE id = | Запись или null |
| findFirst | SELECT LIMIT 1 | Запись или null |
| update | UPDATE WHERE id = | Обновленную запись |
| updateMany | UPDATE WHERE | { count: N } |
| delete | DELETE WHERE id = | Удаленную запись |
| deleteMany | DELETE WHERE | { count: N } |
| upsert | INSERT ON CONFLICT UPDATE | Запись |
| count | SELECT COUNT | Число |

---

> [[backend/01-prisma-schema|<-- Предыдущая: Prisma Schema]] | [[backend/03-api-prisma|Следующая: API + Prisma -->]]
> [[backend-fundamentals|<-- Назад к оглавлению Backend]]
