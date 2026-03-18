// ==================================================
// Задание 2: Связи 1:N (один ко многим)
// Уровень: 🟢 Лёгкий
// Тема: @relation, связь один ко многим
// Ссылка: notes/backend/01-prisma-schema.md — "Связи 1:N"
// ==================================================
//
// 1. Создай модели User и Post со связью 1:N:
//    (Один пользователь → много постов)
//
//    model User {
//      id    Int    @id @default(autoincrement())
//      name  String
//      email String @unique
//      posts Post[]   // Массив постов (виртуальное поле)
//    }
//
//    model Post {
//      id       Int    @id @default(autoincrement())
//      title    String
//      content  String
//      author   User   @relation(fields: [authorId], references: [id])
//      authorId Int    // Реальный FK в базе
//    }
//
// 2. Создай модели Category и Product со связью 1:N:
//    (Одна категория → много товаров)
//
// 3. Создай модели Post и Comment со связью 1:N:
//    (Один пост → много комментариев)
//
// 4. Напиши в комментарии:
//    - Какое поле создаётся в БД: posts[] или authorId?
//    - Зачем нужен @relation(fields: [...], references: [...])?
//    - Что такое виртуальное поле (posts Post[])?
//
// Пиши schema.prisma ниже (в комментариях):
// ==================================================
