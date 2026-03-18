// ========== Задание Проверка типов #1 — typeof ==========
// Уровень: 🟢
//
// 1. Определи тип каждого значения через typeof:
//    42, "hello", true, undefined, null, [1,2], {a:1}, function(){}, Symbol("id")
//
// 2. Обрати внимание на "ловушки":
//    - typeof null === ???
//    - typeof [] === ???
//    - typeof function(){} === ???
//
// 3. Напиши в комментариях, почему typeof НЕ подходит для определения
//    массива или null.
//
// Тесты:
// console.log(typeof 42);            // "number"
// console.log(typeof "hello");       // "string"
// console.log(typeof true);          // "boolean"
// console.log(typeof undefined);     // "undefined"
// console.log(typeof null);          // "object" (!)
// console.log(typeof [1, 2]);        // "object" (!)
// console.log(typeof { a: 1 });      // "object"
// console.log(typeof function(){}); // "function"
// console.log(typeof Symbol("id")); // "symbol"
//
// 📖 Раздел учебника: "Проверка типов" → notes/js-advanced/11-type-checking.md
// ================================================

// Пиши код ниже:
