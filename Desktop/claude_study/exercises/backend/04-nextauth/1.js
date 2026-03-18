// ==================================================
// Задание 1: Настройка NextAuth.js
// Уровень: 🟢 Лёгкий
// Тема: Установка NextAuth, базовая конфигурация
// Ссылка: Глава отсутствует — основано на теме "NextAuth"
// ==================================================
//
// 1. Напиши команду установки (в комментарии):
//    npm install next-auth @auth/prisma-adapter
//
// 2. Напиши файл app/api/auth/[...nextauth]/route.ts:
//    import NextAuth from "next-auth"
//    import { authOptions } from "@/lib/auth"
//    const handler = NextAuth(authOptions)
//    export { handler as GET, handler as POST }
//
// 3. Напиши lib/auth.ts с базовой конфигурацией:
//    - PrismaAdapter для хранения сессий в БД
//    - GitHub Provider (clientId, clientSecret из env)
//    - session: { strategy: "jwt" }
//
// 4. Напиши .env переменные (в комментарии):
//    NEXTAUTH_URL=http://localhost:3000
//    NEXTAUTH_SECRET=...
//    GITHUB_ID=...
//    GITHUB_SECRET=...
//
// 5. Напиши в комментарии:
//    - Что такое NextAuth.js?
//    - Что такое Provider?
//    - Чем JWT стратегия отличается от database?
//
// Пиши код ниже:
// ==================================================
