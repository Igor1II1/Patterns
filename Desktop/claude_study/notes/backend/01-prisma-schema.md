# Prisma ORM: схема, модели и миграции

> [[backend/02-prisma-crud|Следующая глава: Prisma CRUD -->]]
> [[backend-fundamentals|<-- Назад к оглавлению Backend]]

---

## Зачем эта тема существует?

Писать SQL-запросы руками — это мощно, но медленно и чревато ошибками. ORM (Object-Relational Mapping) позволяет работать с базой данных через JavaScript-объекты вместо строковых SQL-запросов. Prisma — самый популярный ORM для Node.js и TypeScript. Он дает автодополнение в редакторе, проверку типов и автоматические миграции. В современной fullstack-разработке на Next.js Prisma — стандартный выбор.

---

## Установка Prisma

### Что это такое?

Prisma состоит из трех частей:
- **Prisma CLI** — инструмент командной строки для миграций и генерации
- **Prisma Client** — библиотека для выполнения запросов из кода
- **Prisma Schema** — файл описания структуры базы данных

### Как работает?

```bash
# Создай проект (если еще нет)
mkdir my-app && cd my-app
npm init -y

# Установи Prisma CLI как dev-зависимость
npm install prisma --save-dev

# Установи Prisma Client
npm install @prisma/client

# Инициализируй Prisma (создаст папку prisma/ и файл schema.prisma)
npx prisma init
```

После `prisma init` появятся:
```
prisma/
  schema.prisma    <-- описание моделей
.env               <-- строка подключения к БД
```

### Файл .env

```env
# Строка подключения к PostgreSQL
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/mydb?schema=public"
#              пользователь:пароль@хост:порт/имя_базы
```

### Частые заблуждения

- "ORM заменяет знание SQL" — нет. ORM упрощает типичные операции, но для сложных запросов нужно понимать SQL.
- "Prisma работает только с PostgreSQL" — нет, поддерживаются MySQL, SQLite, MongoDB, CockroachDB.

### Мини-проверка

1. Из каких трех частей состоит Prisma?
2. Где хранится строка подключения к базе данных?
3. Что создает команда `npx prisma init`?

---

## Schema-файл: основы

### Что это такое?

`schema.prisma` — главный файл Prisma. В нем ты описываешь структуру базы данных: таблицы (модели), столбцы (поля), связи и настройки.

### Как работает?

```prisma
// prisma/schema.prisma

// Настройки генератора (создает Prisma Client)
generator client {
  provider = "prisma-client-js"
}

// Настройки подключения к БД
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Модель = таблица в базе данных
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  age       Int?
  createdAt DateTime @default(now()) @map("created_at")

  @@map("users")  // Имя таблицы в БД
}
```

### Разбор построчно

```prisma
model User {
// model — ключевое слово, User — имя модели (PascalCase)

  id Int @id @default(autoincrement())
  // id — имя поля
  // Int — тип (целое число)
  // @id — первичный ключ
  // @default(autoincrement()) — автоинкремент (1, 2, 3...)

  email String @unique
  // String — текстовый тип
  // @unique — уникальное значение

  name String
  // Обязательное поле (без ?)

  age Int?
  // ? — поле необязательное (может быть null)

  createdAt DateTime @default(now()) @map("created_at")
  // DateTime — дата и время
  // @default(now()) — текущее время по умолчанию
  // @map("created_at") — в БД столбец называется created_at

  @@map("users")
  // @@map — имя таблицы в БД (в Prisma модель User, в БД таблица users)
}
```

---

## Типы полей в Prisma

### Что это такое?

Prisma имеет свои типы, которые маппятся на типы SQL:

```prisma
// Скалярные типы
String    // VARCHAR / TEXT
Int       // INTEGER
Float     // DOUBLE PRECISION
Decimal   // DECIMAL
BigInt    // BIGINT
Boolean   // BOOLEAN
DateTime  // TIMESTAMP
Json      // JSON / JSONB
Bytes     // BYTEA
```

### Примеры кода

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  title       String   // обязательное текстовое поле
  description String?  // необязательное (может быть null)
  price       Decimal  // точное десятичное число
  inStock     Boolean  @default(true)
  tags        String[] // массив строк (PostgreSQL)
  metadata    Json?    // произвольный JSON
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt  // обновляется автоматически
}
```

### Атрибуты полей

```prisma
// Атрибуты уровня поля (одинарный @)
@id                    // первичный ключ
@unique                // уникальное значение
@default(value)        // значение по умолчанию
@map("column_name")    // имя столбца в БД
@updatedAt             // автообновление при изменении записи
@relation(...)         // настройка связи

// Значения по умолчанию
@default(autoincrement())  // автоинкремент
@default(now())            // текущее время
@default(true)             // конкретное значение
@default(uuid())           // генерация UUID
@default(cuid())           // генерация CUID

// Атрибуты уровня модели (двойной @@)
@@map("table_name")    // имя таблицы в БД
@@unique([field1, field2])  // составной уникальный ключ
@@index([field1, field2])   // составной индекс
@@id([field1, field2])      // составной первичный ключ
```

### Частые заблуждения

- "Int? и Int — одно и то же" — нет, `Int?` допускает null, `Int` — нет.
- "@updatedAt обновляется при любом изменении БД" — нет, только при обновлении через Prisma Client.

### Мини-проверка

1. Как сделать поле необязательным в Prisma?
2. Чем @map отличается от @@map?
3. Что делает атрибут @updatedAt?

---

## Связи между моделями

### Что это такое?

В реальных приложениях данные связаны: у пользователя есть посты, у поста — комментарии. Prisma позволяет описать эти связи прямо в схеме.

### Один-ко-многим (1:N)

Самая частая связь. У одного пользователя — много постов.

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
  posts Post[] // У пользователя много постов
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String?
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int    // Внешний ключ (столбец в БД)
}
```

Разбор связи:
- `posts Post[]` — виртуальное поле, в БД его нет. Означает "у User много Post".
- `author User @relation(...)` — поле связи на стороне Post.
- `fields: [authorId]` — какое поле в этой модели хранит ключ.
- `references: [id]` — на какое поле в связанной модели ссылается.
- `authorId Int` — реальный столбец в таблице posts (внешний ключ).

### Один-к-одному (1:1)

У пользователя один профиль, у профиля один пользователь.

```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  profile Profile? // может быть, а может не быть
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  avatar String?
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique // @unique делает связь 1:1, а не 1:N
}
```

### Многие-ко-многим (M:N)

Пост может иметь много тегов, тег может быть у многих постов.

```prisma
// Неявная связь M:N (Prisma создаст промежуточную таблицу сама)
model Post {
  id    Int    @id @default(autoincrement())
  title String
  tags  Tag[]
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}

// Явная связь M:N (с промежуточной моделью — когда нужны доп. поля)
model Post {
  id    Int        @id @default(autoincrement())
  title String
  tags  PostTag[]
}

model Tag {
  id    Int        @id @default(autoincrement())
  name  String     @unique
  posts PostTag[]
}

model PostTag {
  post   Post @relation(fields: [postId], references: [id])
  postId Int
  tag    Tag  @relation(fields: [tagId], references: [id])
  tagId  Int

  assignedAt DateTime @default(now()) // Доп. поле!

  @@id([postId, tagId]) // Составной первичный ключ
}
```

### Каскадное удаление

```prisma
model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId Int
  // При удалении User — все его посты удалятся
}
```

Варианты `onDelete`:
- `Cascade` — удалить связанные записи
- `SetNull` — поставить NULL (поле должно быть необязательным)
- `Restrict` — запретить удаление (по умолчанию)

### Частые заблуждения

- "Post[] создает столбец в базе" — нет, это виртуальное поле только для Prisma Client.
- "Для M:N всегда нужна промежуточная модель" — нет, Prisma может создать ее неявно. Явная нужна когда в промежуточной таблице есть дополнительные поля.

### Мини-проверка

1. Как отличить связь 1:1 от 1:N в Prisma?
2. Что такое внешний ключ (authorId)?
3. Когда нужна явная промежуточная модель для M:N?

---

## Миграции

### Что это такое?

Миграция — это набор SQL-команд, которые приводят базу данных в соответствие со схемой. Вместо ручного ALTER TABLE ты меняешь schema.prisma, а Prisma генерирует SQL автоматически.

### Как работает?

```bash
# Создать миграцию (сравнивает схему с БД и генерирует SQL)
npx prisma migrate dev --name init
# --name init — имя миграции (описательное)

# Что происходит:
# 1. Prisma сравнивает schema.prisma с текущим состоянием БД
# 2. Генерирует SQL-файл в prisma/migrations/
# 3. Применяет миграцию к БД
# 4. Перегенерирует Prisma Client
```

После выполнения:
```
prisma/
  migrations/
    20260307120000_init/
      migration.sql     <-- сгенерированный SQL
    migration_lock.toml
  schema.prisma
```

### Основные команды

```bash
# Создать и применить миграцию (разработка)
npx prisma migrate dev --name add_user_role

# Применить миграции на продакшне
npx prisma migrate deploy

# Сбросить БД и применить все миграции заново
npx prisma migrate reset

# Сгенерировать Prisma Client без миграции
npx prisma generate

# Отправить схему в БД без миграции (прототипирование)
npx prisma db push

# Открыть визуальный редактор данных
npx prisma studio
```

### Рабочий процесс

```
1. Изменил schema.prisma (добавил поле, модель, связь)
2. npx prisma migrate dev --name описание_изменения
3. Prisma создаст SQL-миграцию и применит к БД
4. Prisma Client обновится автоматически
5. Используй обновленный Client в коде
```

### Примеры кода

```prisma
// Было:
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}

// Стало (добавили поле role):
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
  role  String @default("user")  // Новое поле
}
```

```bash
npx prisma migrate dev --name add_user_role
```

Prisma сгенерирует:
```sql
-- migration.sql
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
```

### Частые заблуждения

- "db push и migrate dev — одно и то же" — нет. `db push` не создает файл миграции и не отслеживает историю. Используй для прототипов, `migrate dev` — для реальной разработки.
- "Можно редактировать файлы миграций" — технически можно, но не рекомендуется. Лучше создать новую миграцию.

### Мини-проверка

1. Чем `prisma migrate dev` отличается от `prisma db push`?
2. Что делает `prisma generate`?
3. Где хранятся файлы миграций?

---

## Итог

Prisma упрощает работу с базой данных:

| Концепция | Что делает |
|-----------|-----------|
| schema.prisma | Описание структуры БД |
| model | Модель = таблица |
| @relation | Связь между моделями |
| migrate dev | Создание и применение миграций |
| prisma generate | Генерация клиента |
| prisma studio | Визуальный редактор данных |

Ключевые правила:
- Одна модель = одна таблица в базе
- Связи описываются с обеих сторон
- Внешний ключ всегда на стороне "многих" (1:N) или на одной стороне (1:1)
- Используй `migrate dev` для разработки, `migrate deploy` для продакшна

---

> [[backend/02-prisma-crud|Следующая глава: Prisma CRUD -->]]
> [[backend-fundamentals|<-- Назад к оглавлению Backend]]
