// ==================================================
// Задание 4: Шрифты и переменные окружения
// Уровень: 🟡 Средний
// Тема: next/font, env variables, .env.local
// Ссылка: notes/nextjs/05-built-in.md — "Шрифты", "Env variables"
// ==================================================
//
// 1. Подключи Google Font через next/font:
//    import { Inter, Roboto_Mono } from "next/font/google"
//
//    const inter = Inter({ subsets: ["latin", "cyrillic"] })
//    const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" })
//
//    В layout.tsx: <body className={`${inter.className} ${robotoMono.variable}`}>
//
// 2. Напиши .env.local (в комментарии):
//    DATABASE_URL=postgresql://...
//    NEXTAUTH_SECRET=my-secret
//    NEXT_PUBLIC_API_URL=http://localhost:3000/api
//
// 3. Покажи использование env переменных:
//    - В Server Component: process.env.DATABASE_URL (серверная)
//    - В Client Component: process.env.NEXT_PUBLIC_API_URL (публичная)
//    - Объясни разницу: NEXT_PUBLIC_ и без
//
// 4. Напиши .env.example (в комментарии):
//    Шаблон без реальных значений для README.
//
// 5. Напиши в комментарии: почему нельзя использовать process.env.DATABASE_URL
//    в Client Component? (Безопасность!)
//
// Пиши код ниже:
// ==================================================
