// ========== Задание Проверка типов #3 — Object.prototype.toString ==========
// Уровень: 🟡
//
// Object.prototype.toString.call(value) — самый надёжный способ
// определить внутренний тип значения.
//
// 1. Проверь через Object.prototype.toString.call():
//    число, строку, boolean, null, undefined, массив, объект, Date, Map, Set, RegExp
//
// 2. Напиши функцию `getType(value)`, которая возвращает тип в нижнем регистре:
//    "number", "string", "array", "null", "date", "map", "set", "regexp"
//    Подсказка: вырежи нужную часть из "[object Array]" через slice или match
//
// Тесты:
// console.log(Object.prototype.toString.call(42));         // "[object Number]"
// console.log(Object.prototype.toString.call(null));       // "[object Null]"
// console.log(Object.prototype.toString.call([]));         // "[object Array]"
// console.log(Object.prototype.toString.call(new Date())); // "[object Date]"
// console.log(Object.prototype.toString.call(new Map()));  // "[object Map]"
// console.log(Object.prototype.toString.call(/regex/));    // "[object RegExp]"
//
// console.log(getType(42));         // "number"
// console.log(getType(null));       // "null"
// console.log(getType([]));         // "array"
// console.log(getType(new Date())); // "date"
// console.log(getType(new Map()));  // "map"
//
// 📖 Раздел учебника: "Проверка типов" → notes/js-advanced/11-type-checking.md
// ================================================

// Пиши код ниже:
