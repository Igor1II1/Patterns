// ==================================================
// Задание 5: Комплексная задача — полный REST API для блога
// Уровень: 🔴 Сложный
// Тема: Все концепции API + Prisma + Zod
// Ссылка: notes/backend/03-api-prisma.md — вся глава
// ==================================================
//
// Создай полный REST API для блог-платформы:
//
// 1. Zod-схемы:
//    - createPostSchema: title (min 3), content (min 10), categoryId, tagIds[]?
//    - updatePostSchema: createPostSchema.partial()
//    - querySchema: page?, limit?, search?, category?, sort?
//
// 2. app/api/posts/route.ts:
//    GET — список постов с фильтрацией, пагинацией, поиском
//    POST — создание поста с валидацией
//
// 3. app/api/posts/[id]/route.ts:
//    GET — пост с автором, категорией, тегами, комментариями
//    PUT — обновление с валидацией
//    DELETE — удаление
//
// 4. app/api/posts/[id]/comments/route.ts:
//    GET — комментарии к посту (с пагинацией)
//    POST — создание комментария
//
// 5. Обработка ошибок:
//    - Zod → 400 + подробные ошибки
//    - P2002 → 409
//    - P2025 → 404
//    - Неизвестные → 500
//
// 6. CORS headers на всех эндпоинтах.
//
// 7. Helper функции:
//    - apiResponse(data, status)
//    - apiError(message, status)
//    - handlePrismaError(error)
//    - parseQuery(searchParams)
//
// Пиши код ниже:
// ==================================================
