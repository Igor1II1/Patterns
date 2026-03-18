// ==================================================
// Задание 1: Базовый Route Handler (GET)
// Уровень: 🟢 Лёгкий
// Тема: Route Handlers, GET запрос, NextResponse
// Ссылка: notes/nextjs/04-api-routes.md — "Route Handlers"
// ==================================================
//
// 1. Напиши app/api/hello/route.ts:
//    export async function GET() {
//      return NextResponse.json({ message: "Привет, мир!" })
//    }
//
// 2. Напиши app/api/users/route.ts:
//    - GET возвращает массив пользователей (hardcoded)
//    - Формат: { data: [...users], total: число }
//
// 3. Напиши app/api/time/route.ts:
//    - GET возвращает текущее время сервера
//    - { time: new Date().toISOString() }
//
// 4. Напиши в комментарии:
//    - Чем Route Handler отличается от обычной страницы?
//    - Почему файл называется route.ts, а не page.tsx?
//    - Можно ли иметь page.tsx и route.ts в одной папке?
//
// Пиши код ниже:
// ==================================================
