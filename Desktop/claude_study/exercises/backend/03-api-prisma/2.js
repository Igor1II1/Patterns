// ==================================================
// Задание 2: POST с валидацией Zod
// Уровень: 🟡 Средний
// Тема: POST + Prisma create + Zod валидация
// Ссылка: notes/backend/03-api-prisma.md — "POST", "Zod"
// ==================================================
//
// 1. Создай Zod-схему для создания пользователя:
//    import { z } from "zod"
//    const createUserSchema = z.object({
//      name: z.string().min(2, "Минимум 2 символа"),
//      email: z.string().email("Некорректный email"),
//      age: z.number().min(0).max(150).optional(),
//    })
//
// 2. Напиши POST /api/users:
//    - Парсит body через createUserSchema.parse(body)
//    - Если валидация не прошла — 400 с ошибками
//    - Создаёт пользователя через prisma.user.create
//    - Возвращает 201 + созданного пользователя
//
// 3. Обработка ошибки уникальности (P2002):
//    try { ... } catch (error) {
//      if (error.code === "P2002") {
//        return NextResponse.json({ error: "Email уже занят" }, { status: 409 })
//      }
//    }
//
// 4. Создай Zod-схему для создания поста:
//    title (min 3), content (min 10), categoryId (number), authorId (number)
//
// 5. Напиши POST /api/posts с валидацией и обработкой ошибок.
//
// Пиши код ниже:
// ==================================================
