// ==================================================
// Задание 3: Связи M:N и 1:1
// Уровень: 🟡 Средний
// Тема: Многие ко многим (implicit/explicit), один к одному
// Ссылка: notes/backend/01-prisma-schema.md — "Связи M:N", "Связи 1:1"
// ==================================================
//
// 1. Создай связь M:N (implicit) между Post и Tag:
//    model Post {
//      id   Int    @id @default(autoincrement())
//      tags Tag[]
//    }
//    model Tag {
//      id    Int    @id @default(autoincrement())
//      name  String @unique
//      posts Post[]
//    }
//    Prisma создаст таблицу _PostToTag автоматически.
//
// 2. Создай связь 1:1 между User и Profile:
//    model User {
//      id      Int      @id @default(autoincrement())
//      profile Profile?
//    }
//    model Profile {
//      id     Int    @id @default(autoincrement())
//      bio    String
//      user   User   @relation(fields: [userId], references: [id])
//      userId Int    @unique  // @unique делает связь 1:1!
//    }
//
// 3. Создай explicit M:N (промежуточная таблица):
//    User и Course через Enrollment:
//    model Enrollment {
//      id        Int      @id @default(autoincrement())
//      user      User     @relation(...)
//      userId    Int
//      course    Course   @relation(...)
//      courseId  Int
//      grade     Float?
//      enrolledAt DateTime @default(now())
//      @@unique([userId, courseId])
//    }
//
// 4. Напиши в комментарии:
//    - Чем implicit M:N отличается от explicit?
//    - Когда нужен explicit? (когда есть доп. поля в связи)
//    - Почему @unique на userId делает связь 1:1?
//
// Пиши schema.prisma ниже (в комментариях):
// ==================================================
