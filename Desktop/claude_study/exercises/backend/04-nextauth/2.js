// ==================================================
// Задание 2: Получение сессии и защита маршрутов
// Уровень: 🟡 Средний
// Тема: getServerSession, useSession, middleware
// Ссылка: Глава отсутствует — основано на теме "NextAuth"
// ==================================================
//
// 1. Получение сессии в Server Component:
//    import { getServerSession } from "next-auth"
//    import { authOptions } from "@/lib/auth"
//
//    export default async function DashboardPage() {
//      const session = await getServerSession(authOptions)
//      if (!session) redirect("/auth/login")
//      return <div>Привет, {session.user?.name}</div>
//    }
//
// 2. Получение сессии в Client Component:
//    "use client"
//    import { useSession } from "next-auth/react"
//    const { data: session, status } = useSession()
//    // status: "loading" | "authenticated" | "unauthenticated"
//
// 3. SessionProvider в layout:
//    import { SessionProvider } from "next-auth/react"
//    <SessionProvider>{children}</SessionProvider>
//
// 4. Кнопки входа/выхода:
//    import { signIn, signOut } from "next-auth/react"
//    <button onClick={() => signIn("github")}>Войти через GitHub</button>
//    <button onClick={() => signOut()}>Выйти</button>
//
// 5. Защита API route:
//    const session = await getServerSession(authOptions)
//    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//
// 6. Напиши middleware.ts для защиты /dashboard/*:
//    export { default } from "next-auth/middleware"
//    export const config = { matcher: ["/dashboard/:path*"] }
//
// Пиши код ниже:
// ==================================================
