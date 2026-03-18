// ==================================================
// Задание 4: CORS и middleware
// Уровень: 🟡 Средний
// Тема: CORS headers, API middleware
// Ссылка: notes/backend/03-api-prisma.md — "CORS"
// ==================================================
//
// 1. Добавь CORS заголовки в API Route:
//    const headers = {
//      "Access-Control-Allow-Origin": "*",
//      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
//      "Access-Control-Allow-Headers": "Content-Type, Authorization",
//    }
//    return NextResponse.json(data, { headers })
//
// 2. Обработай preflight запрос (OPTIONS):
//    export async function OPTIONS() {
//      return new NextResponse(null, { status: 204, headers })
//    }
//
// 3. Создай helper-функцию для API ответов:
//    function apiResponse(data, status = 200) {
//      return NextResponse.json(data, { status, headers: corsHeaders })
//    }
//    function apiError(message, status = 400) {
//      return NextResponse.json({ error: message }, { status, headers: corsHeaders })
//    }
//
// 4. Напиши в комментарии:
//    - Что такое CORS и зачем он нужен?
//    - Что такое preflight запрос (OPTIONS)?
//    - Почему "Access-Control-Allow-Origin: *" небезопасно на продакшне?
//
// Пиши код ниже:
// ==================================================
