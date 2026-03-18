// ==================================================
// Задание 4: Middleware
// Уровень: 🟡 Средний
// Тема: middleware.ts, перехват запросов, редиректы
// Ссылка: notes/nextjs/04-api-routes.md — "Middleware"
// ==================================================
//
// 1. Напиши middleware.ts в корне проекта:
//    import { NextResponse } from "next/server"
//    import type { NextRequest } from "next/server"
//
//    export function middleware(request: NextRequest) {
//      // Логика здесь
//    }
//
//    export const config = {
//      matcher: ["/dashboard/:path*", "/api/:path*"]
//    }
//
// 2. Добавь логику:
//    - Если путь начинается с /dashboard и нет cookie "session":
//      → редирект на /auth/login
//    - Если путь /api/* — добавь заголовок X-Request-Time
//
// 3. Напиши middleware для rate limiting (упрощённый):
//    - Считай запросы по IP (Map в памяти)
//    - Если больше 10 запросов в минуту — верни 429
//
// 4. Напиши в комментарии:
//    - Где выполняется middleware? (Edge Runtime)
//    - Чем middleware отличается от проверки в API route?
//    - Что такое matcher?
//
// Пиши код ниже:
// ==================================================
