// ==================================================
// Задание 5: Index Signatures
// Уровень: 🟡 Средний
// Тема: Динамические ключи в интерфейсах
// Ссылка: notes/typescript/02-interfaces.md — "Index Signatures"
// ==================================================
//
// 1. Создай интерфейс Dictionary:
//    [key: string]: string
//    Создай объект translations: Dictionary с 3 парами (en-ru перевод).
//
// 2. Создай интерфейс NumberMap:
//    [key: string]: number
//    Создай объект scores: NumberMap с оценками 3 студентов.
//
// 3. Создай интерфейс Config:
//    - version: string (обязательное)
//    - [key: string]: string | number | boolean (остальные — любые)
//    Создай объект config с version и 2 дополнительными свойствами.
//
// 4. Напиши функцию countEntries(dict: Dictionary): number
//    Возвращает количество ключей (Object.keys().length).
//
// 5. Напиши функцию getOrDefault(dict: Dictionary, key: string, fallback: string): string
//    Возвращает значение по ключу или fallback если ключа нет.
//
// Пиши код ниже:
// ==================================================
