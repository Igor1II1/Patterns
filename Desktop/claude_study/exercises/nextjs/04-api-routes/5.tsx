// ==================================================
// Задание 5: Комплексная задача — REST API для блога
// Уровень: 🔴 Сложный
// Тема: Все концепции API Routes вместе
// Ссылка: notes/nextjs/04-api-routes.md — вся глава
// ==================================================
//
// Создай полный REST API для блога:
//
// 1. app/api/posts/route.ts:
//    GET /api/posts — список постов
//      Query: ?page=1&limit=10&category=tech&search=react
//      Ответ: { data: Post[], total: number, page: number, totalPages: number }
//    POST /api/posts — создать пост
//      Body: { title, content, category, authorId }
//      Валидация: title обязателен (минимум 3 символа), content обязателен
//      Ответ: 201 + созданный пост
//
// 2. app/api/posts/[id]/route.ts:
//    GET — получить пост (или 404)
//    PUT — обновить пост
//    DELETE — удалить пост
//
// 3. Middleware (middleware.ts):
//    - POST/PUT/DELETE требуют заголовок Authorization
//    - Без него → 401
//    - Добавь X-Response-Time заголовок
//
// 4. Обработка ошибок:
//    - try/catch в каждом handler
//    - Валидация body (проверка обязательных полей)
//    - Правильные HTTP-коды: 200, 201, 400, 401, 404, 500
//
// 5. Пагинация:
//    - Правильный расчёт: skip = (page - 1) * limit
//    - totalPages = Math.ceil(total / limit)
//
// Пиши код ниже:
// ==================================================
