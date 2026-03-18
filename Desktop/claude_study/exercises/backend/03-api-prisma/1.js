// ==================================================
// Задание 1: GET API Route + Prisma
// Уровень: 🟢 Лёгкий
// Тема: Route Handler GET с Prisma findMany
// Ссылка: notes/backend/03-api-prisma.md — "GET"
// ==================================================
//
// 1. Напиши app/api/users/route.ts:
//    GET — возвращает всех пользователей
//    import { prisma } from "@/lib/prisma"
//    import { NextResponse } from "next/server"
//
//    export async function GET() {
//      const users = await prisma.user.findMany()
//      return NextResponse.json(users)
//    }
//
// 2. Добавь пагинацию через query параметры:
//    GET /api/users?page=1&limit=10
//    - Извлеки page и limit из searchParams
//    - Верни: { data: users, total, page, totalPages }
//
// 3. Добавь поиск:
//    GET /api/users?search=Игорь
//    - Ищет по name (contains, insensitive)
//
// 4. Напиши app/api/users/[id]/route.ts:
//    GET — возвращает одного пользователя по id
//    - Если не найден → 404
//
// Пиши код ниже:
// ==================================================
