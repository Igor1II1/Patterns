// ==================================================
// Задание 2: Read — чтение данных
// Уровень: 🟢 Лёгкий
// Тема: findUnique, findFirst, findMany, include, select
// Ссылка: notes/backend/02-prisma-crud.md — "Read"
// ==================================================
//
// 1. Найди пользователя по id:
//    const user = await prisma.user.findUnique({ where: { id: 1 } })
//
// 2. Найди пользователя по email:
//    const user = await prisma.user.findUnique({ where: { email: "igor@mail.ru" } })
//
// 3. Найди первого активного пользователя:
//    await prisma.user.findFirst({ where: { isActive: true } })
//
// 4. Найди всех пользователей:
//    await prisma.user.findMany()
//
// 5. Пользователи с постами (include):
//    await prisma.user.findMany({ include: { posts: true } })
//
// 6. Только имя и email (select):
//    await prisma.user.findMany({ select: { name: true, email: true } })
//
// 7. Фильтрация + сортировка + пагинация:
//    await prisma.user.findMany({
//      where: { isActive: true },
//      orderBy: { createdAt: "desc" },
//      take: 10,
//      skip: 0,
//    })
//
// 8. Напиши в комментарии:
//    - Чем findUnique отличается от findFirst?
//    - Чем include отличается от select?
//    - Что вернёт findUnique если не нашёл? (null)
//
// Пиши код ниже:
// ==================================================
