// ==================================================
// Задание 4: keyof и индексные типы
// Уровень: 🟡 Средний
// Тема: keyof, T[K], типизация по ключам
// Ссылка: notes/typescript/03-generics.md — "keyof"
// ==================================================
//
// 1. Создай интерфейс User: name (string), age (number), email (string)
//    Создай тип UserKeys = keyof User
//    Напиши в комментарии: какие значения может принимать UserKeys?
//
// 2. Напиши функцию getValue<T, K extends keyof T>(obj: T, key: K): T[K]
//    Вызови:
//    const user = { name: "Игорь", age: 20, email: "igor@mail.ru" }
//    getValue(user, "name")  — тип возврата string
//    getValue(user, "age")   — тип возврата number
//
// 3. Напиши функцию pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>
//    Возвращает новый объект только с указанными ключами.
//    pick(user, ["name", "email"]) → { name: "Игорь", email: "igor@mail.ru" }
//    Подсказка: используй reduce или forEach.
//
// 4. Напиши функцию hasKey<T extends object>(obj: T, key: string): key is keyof T
//    Type guard — проверяет есть ли ключ в объекте.
//
// Пиши код ниже:
// ==================================================
