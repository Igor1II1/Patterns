# Проект 5: Добавить БД и авторизацию

**Месяц:** Июль 2026
**Папка:** `projects/month-4-blog/` (расширяем проект месяца 4)
**Стек:** PostgreSQL · Prisma · NextAuth.js

---

## Описание

Расширяем блог-платформу из месяца 4: вместо статических JSON-файлов подключаем реальную базу данных. Добавляем авторизацию через GitHub/Google. Авторизованные пользователи могут создавать посты и оставлять комментарии.

---

## Что меняется в проекте

| Было (месяц 4) | Стало (месяц 5) |
|----------------|-----------------|
| JSON файлы | PostgreSQL + Prisma |
| Нет авторизации | NextAuth (GitHub OAuth) |
| Нет комментариев | Комментарии авторизованных |
| Деплой Vercel | Vercel + Railway (БД) |

---

## Функциональность

### База данных
- [ ] Посты в PostgreSQL (перенести из JSON)
- [ ] CRUD для постов через Prisma
- [ ] Категории и теги в отдельных таблицах

### Авторизация
- [ ] OAuth через GitHub (NextAuth)
- [ ] Страница входа /login
- [ ] Профиль пользователя /profile
- [ ] Защита маршрутов — только авторизованные могут создавать посты

### Комментарии
- [ ] Добавить комментарий к посту (только авторизованные)
- [ ] Список комментариев на странице поста
- [ ] Удалить свой комментарий

### Деплой
- [ ] БД на Railway
- [ ] Приложение на Vercel
- [ ] Переменные окружения настроены

---

## Схема базы данных (Prisma)

```prisma
// prisma/schema.prisma

model User {
  id        String    @id @default(cuid())
  name      String?
  email     String    @unique
  image     String?
  posts     Post[]
  comments  Comment[]
  createdAt DateTime  @default(now())
}

model Post {
  id         String    @id @default(cuid())
  slug       String    @unique
  title      String
  excerpt    String
  content    String
  published  Boolean   @default(false)
  author     User      @relation(fields: [authorId], references: [id])
  authorId   String
  category   Category  @relation(fields: [categoryId], references: [id])
  categoryId String
  comments   Comment[]
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

model Comment {
  id        String   @id @default(cuid())
  text      String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    String
  createdAt DateTime @default(now())
}

model Category {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique
  posts Post[]
}
```

---

## API Routes

```
GET    /api/posts              — список постов
GET    /api/posts/[slug]       — один пост
POST   /api/posts              — создать пост (auth required)
PUT    /api/posts/[id]         — обновить пост (author only)
DELETE /api/posts/[id]         — удалить пост (author only)

GET    /api/posts/[id]/comments   — комментарии к посту
POST   /api/posts/[id]/comments   — добавить комментарий (auth)
DELETE /api/comments/[id]         — удалить комментарий (author)
```

---

## Поэтапная разработка

### Этап 1: PostgreSQL + Prisma (дни 1-3)
1. Установить PostgreSQL локально или использовать Railway
2. `npm install prisma @prisma/client`
3. Написать схему в `prisma/schema.prisma`
4. `npx prisma db push` — применить схему
5. Написать seed-скрипт (перенести посты из JSON)
6. Заменить функции в `lib/posts.ts` на Prisma-запросы

### Этап 2: NextAuth (дни 4-5)
1. `npm install next-auth @prisma/client @auth/prisma-adapter`
2. Настроить GitHub OAuth App (Settings → Developer → OAuth Apps)
3. Создать `app/api/auth/[...nextauth]/route.ts`
4. Страницы: SignIn, Profile
5. Защита маршрутов через middleware

### Этап 3: CRUD постов (дни 6-7)
1. Форма создания поста (только авторизованные)
2. Редактирование своих постов
3. Удаление постов

### Этап 4: Комментарии (дни 8-9)
1. API для комментариев
2. UI комментариев на странице поста
3. Форма добавления (авторизованные)

### Этап 5: Деплой (день 10)
1. Railway: создать PostgreSQL, скопировать DATABASE_URL
2. Vercel: добавить переменные окружения
3. `npx prisma db push` в production

---

## Переменные окружения (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/blog"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="random-secret-string"
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"
```

---

## Что проверяется из пройденных тем

| Тема | Как используется |
|------|-----------------|
| SQL / PostgreSQL | База данных |
| Prisma | ORM, CRUD операции |
| NextAuth | Авторизация OAuth |
| API Routes | REST API |
| Middleware | Защита роутов |
| TypeScript | Типы для Prisma |
| Деплой | Vercel + Railway |
