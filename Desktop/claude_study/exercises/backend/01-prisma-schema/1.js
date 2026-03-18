// ==================================================
// Задание 1: Базовая модель Prisma
// Уровень: 🟢 Лёгкий
// Тема: model, типы полей, атрибуты @id, @default
// Ссылка: notes/backend/01-prisma-schema.md — "Модель"
// ==================================================
//
// Напиши schema.prisma с моделью User:
//
// model User {
//   id        Int      @id @default(autoincrement())
//   email     String   @unique
//   name      String
//   age       Int?                    // опциональное (?)
//   isActive  Boolean  @default(true)
//   createdAt DateTime @default(now())
// }
//
// 1. Опиши модель User (код выше — перепиши сам, не копируй)
//
// 2. Создай модель Product:
//    - id: автоинкремент
//    - name: строка, обязательное
//    - price: Float
//    - description: String? (опциональное)
//    - inStock: Boolean, по умолчанию true
//    - createdAt: DateTime, по умолчанию now()
//
// 3. Создай модель Category:
//    - id: автоинкремент
//    - name: String
//    - slug: String @unique
//
// 4. Напиши datasource и generator в начале schema.prisma.
//
// 5. Напиши в комментарии: что делает @unique? Что делает @default?
//    Чем Int? отличается от Int?
//
// Пиши schema.prisma ниже (в комментариях):
// ==================================================
