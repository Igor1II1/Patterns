// ==================================================
// Задание 5: Утилитарные типы (Utility Types)
// Уровень: 🟡 Средний
// Тема: Partial, Required, Pick, Omit, Record
// Ссылка: notes/typescript/03-generics.md — "Utility Types"
// ==================================================
//
// Дан интерфейс:
// interface User {
//   id: number
//   name: string
//   email: string
//   age: number
//   isAdmin: boolean
// }
//
// 1. Создай тип PartialUser = Partial<User>
//    Создай объект с только name — должно работать.
//
// 2. Создай тип RequiredUser = Required<PartialUser>
//    Теперь все поля снова обязательны.
//
// 3. Создай тип UserPreview = Pick<User, "name" | "email">
//    Создай объект preview: UserPreview.
//
// 4. Создай тип UserWithoutAdmin = Omit<User, "isAdmin">
//    Создай объект noAdmin: UserWithoutAdmin.
//
// 5. Создай тип UserRoles = Record<string, "admin" | "user" | "moderator">
//    Создай объект roles: UserRoles с 3 пользователями.
//
// 6. Напиши функцию updateUser(user: User, updates: Partial<User>): User
//    Возвращает объект с обновлёнными полями: { ...user, ...updates }
//
// Пиши код ниже:
// ==================================================
