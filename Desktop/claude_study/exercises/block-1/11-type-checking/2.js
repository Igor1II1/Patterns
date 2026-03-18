// ========== Задание Проверка типов #2 — instanceof и Array.isArray ==========
// Уровень: 🟢
//
// 1. Создай массив, объект, дату, Map, Set.
// 2. Проверь каждый через instanceof.
// 3. Покажи, почему для массивов лучше использовать Array.isArray().
//
// Тесты:
// const arr = [1, 2, 3];
// const obj = { a: 1 };
// const date = new Date();
// const map = new Map();
// const set = new Set();
//
// console.log(arr instanceof Array);   // true
// console.log(arr instanceof Object);  // true (массив тоже Object!)
// console.log(obj instanceof Array);   // false
// console.log(date instanceof Date);   // true
// console.log(map instanceof Map);     // true
// console.log(set instanceof Set);     // true
//
// // Лучший способ проверить массив:
// console.log(Array.isArray(arr));  // true
// console.log(Array.isArray(obj));  // false
// console.log(Array.isArray("строка")); // false
//
// 📖 Раздел учебника: "instanceof" → notes/js-advanced/11-type-checking.md
// ================================================

// Пиши код ниже:
