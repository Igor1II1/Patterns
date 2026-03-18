// ==================================================
// Задание 3: Ограничения дженериков (extends)
// Уровень: 🟡 Средний
// Тема: Constraints — ограничение типа параметра
// Ссылка: notes/typescript/03-generics.md — "Ограничения (Constraints)"
// ==================================================
//
// 1. Напиши функцию getLength<T extends { length: number }>(value: T): number
//    Возвращает value.length.
//    Вызови: getLength("hello"), getLength([1,2,3]), getLength({ length: 10 })
//    Попробуй getLength(123) — должна быть ошибка (закомментируй).
//
// 2. Напиши функцию getProperty<T extends object, K extends keyof T>(obj: T, key: K): T[K]
//    Возвращает значение свойства объекта по ключу.
//    Вызови: getProperty({ name: "Игорь", age: 20 }, "name")
//    Попробуй getProperty({ name: "Игорь" }, "email") — ошибка (закомментируй).
//
// 3. Напиши функцию merge<T extends object, U extends object>(a: T, b: U): T & U
//    Объединяет два объекта: merge({ name: "Игорь" }, { age: 20 })
//
// 4. Напиши функцию filterByField<T extends Record<string, any>>(
//      items: T[], field: keyof T, value: T[keyof T]
//    ): T[]
//    Фильтрует массив объектов по значению поля.
//
// Пиши код ниже:
// ==================================================
