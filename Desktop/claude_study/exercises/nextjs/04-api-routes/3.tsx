// ==================================================
// Задание 3: Query параметры и заголовки
// Уровень: 🟡 Средний
// Тема: NextRequest, searchParams, headers
// Ссылка: notes/nextjs/04-api-routes.md — "NextRequest"
// ==================================================
//
// 1. Напиши GET /api/search?q=...&page=...&limit=...:
//    - Извлеки параметры: request.nextUrl.searchParams
//    - q — поисковый запрос (обязательный, если нет — 400)
//    - page — страница (по умолчанию 1)
//    - limit — количество (по умолчанию 10)
//    - Верни: { query: q, page, limit, results: [] }
//
// 2. Напиши GET /api/protected:
//    - Проверь заголовок Authorization: request.headers.get("Authorization")
//    - Если нет — верни 401 { error: "Не авторизован" }
//    - Если есть — верни { message: "Доступ разрешён", token: "..." }
//
// 3. Напиши GET /api/products?category=...&sort=...&minPrice=...&maxPrice=...:
//    - Фильтрация по категории
//    - Сортировка (price-asc, price-desc, name)
//    - Фильтр по цене (minPrice, maxPrice)
//    - Верни отфильтрованные товары из hardcoded массива
//
// Пиши код ниже:
// ==================================================
