// ==================================================
// Задание 5: Комплексная задача — полная schema блог-платформы
// Уровень: 🔴 Сложный
// Тема: Все концепции Prisma Schema вместе
// Ссылка: notes/backend/01-prisma-schema.md — вся глава
// ==================================================
//
// Спроектируй полную Prisma schema для блог-платформы:
//
// 1. User:
//    - id, email (unique), name, passwordHash, role (enum: USER, ADMIN, MODERATOR)
//    - avatar? (опциональное)
//    - createdAt, updatedAt
//    - Связи: posts[], comments[], profile (1:1)
//
// 2. Profile (1:1 с User):
//    - id, bio, website?, location?
//    - userId (unique)
//
// 3. Post:
//    - id, title, slug (unique), content, excerpt?
//    - isPublished (default false), publishedAt?
//    - author (связь с User), authorId
//    - category (связь), categoryId
//    - tags (M:N с Tag)
//    - comments (1:N)
//    - createdAt, updatedAt
//
// 4. Category:
//    - id, name, slug (unique)
//    - posts (1:N)
//
// 5. Tag (M:N с Post):
//    - id, name (unique)
//    - posts
//
// 6. Comment:
//    - id, content
//    - post, postId (CASCADE при удалении поста)
//    - author, authorId (SET NULL при удалении пользователя)
//    - createdAt
//
// 7. Enum Role { USER ADMIN MODERATOR }
//
// 8. Напиши @@map для snake_case имён таблиц:
//    model User { ... @@map("users") }
//
// Пиши schema.prisma ниже (в комментариях):
// ==================================================
