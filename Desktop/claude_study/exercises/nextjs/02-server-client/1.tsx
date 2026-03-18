// ==================================================
// Задание 1: Server Component — загрузка данных
// Уровень: 🟢 Лёгкий
// Тема: Server Components, async компоненты, прямой доступ к БД
// Ссылка: notes/nextjs/02-server-client.md — "Server Components"
// ==================================================
//
// 1. Напиши Server Component UsersPage:
//    - Это async функция (Server Components могут быть async!)
//    - Загружает пользователей из "БД" (для задания — из массива)
//    - Отображает список пользователей
//
//    async function getUsers() {
//      // Имитация запроса к БД
//      return [
//        { id: 1, name: "Игорь", email: "igor@mail.ru" },
//        { id: 2, name: "Анна", email: "anna@mail.ru" },
//      ]
//    }
//
//    export default async function UsersPage() {
//      const users = await getUsers()
//      return (...)
//    }
//
// 2. Напиши Server Component PostPage:
//    - Загружает пост по id
//    - Отображает title и content
//
// 3. Напиши в комментарии: почему Server Component может быть async,
//    а Client Component — нет?
//
// Пиши код ниже:
// ==================================================
