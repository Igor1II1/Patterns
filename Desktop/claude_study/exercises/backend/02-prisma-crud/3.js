// ==================================================
// Задание 3: Update и Delete
// Уровень: 🟡 Средний
// Тема: update, updateMany, upsert, delete, deleteMany
// Ссылка: notes/backend/02-prisma-crud.md — "Update", "Delete"
// ==================================================
//
// 1. Обнови имя пользователя:
//    await prisma.user.update({
//      where: { id: 1 },
//      data: { name: "Игорь Петров" }
//    })
//
// 2. Обнови несколько пользователей:
//    await prisma.user.updateMany({
//      where: { isActive: false },
//      data: { isActive: true }
//    })
//
// 3. Upsert — создай или обнови:
//    await prisma.user.upsert({
//      where: { email: "igor@mail.ru" },
//      update: { name: "Игорь Updated" },
//      create: { name: "Игорь", email: "igor@mail.ru" }
//    })
//
// 4. Удали пользователя:
//    await prisma.user.delete({ where: { id: 1 } })
//
// 5. Удали всех неактивных:
//    await prisma.user.deleteMany({ where: { isActive: false } })
//
// 6. Транзакция — перевод баллов:
//    await prisma.$transaction([
//      prisma.user.update({ where: { id: 1 }, data: { points: { decrement: 100 } } }),
//      prisma.user.update({ where: { id: 2 }, data: { points: { increment: 100 } } }),
//    ])
//
// 7. Напиши в комментарии:
//    - Когда использовать upsert?
//    - Что такое { increment: 100 } и { decrement: 100 }?
//    - Зачем нужна транзакция ($transaction)?
//
// Пиши код ниже:
// ==================================================
