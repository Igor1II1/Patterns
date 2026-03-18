// ==================================================
// Задание 1: PrismaClient и Create
// Уровень: 🟢 Лёгкий
// Тема: PrismaClient singleton, create, createMany
// Ссылка: notes/backend/02-prisma-crud.md — "PrismaClient", "Create"
// ==================================================
//
// 1. Напиши singleton для PrismaClient (lib/prisma.ts):
//    import { PrismaClient } from "@prisma/client"
//    const globalForPrisma = globalThis as { prisma?: PrismaClient }
//    export const prisma = globalForPrisma.prisma ?? new PrismaClient()
//    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
//
// 2. Создай одного пользователя:
//    const user = await prisma.user.create({
//      data: { name: "Игорь", email: "igor@mail.ru" }
//    })
//
// 3. Создай пользователя с вложенными данными (связь):
//    const user = await prisma.user.create({
//      data: {
//        name: "Анна",
//        email: "anna@mail.ru",
//        posts: {
//          create: [
//            { title: "Первый пост", content: "..." },
//            { title: "Второй пост", content: "..." },
//          ]
//        }
//      }
//    })
//
// 4. Создай несколько пользователей одним запросом:
//    await prisma.user.createMany({ data: [...] })
//
// 5. Напиши в комментарии: зачем нужен singleton PrismaClient?
//    Что будет если создавать new PrismaClient() в каждом запросе?
//
// Пиши код ниже:
// ==================================================
