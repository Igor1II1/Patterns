// ========== Задание Date и Math #3 — Number: isNaN, parseInt, toFixed ==========
// Уровень: 🟢
//
// 1. Покажи разницу между isNaN() и Number.isNaN():
//    - Проверь "hello", undefined, NaN через оба метода
//
// 2. Извлеки числа из CSS-значений через parseInt и parseFloat:
//    - "42px", "3.14rem", "100%"
//
// 3. Округли число 19.9 до 2 знаков через toFixed.
//    Какой ТИПА результат? (строка или число?)
//
// Тесты:
// console.log(isNaN("hello"));        // true
// console.log(Number.isNaN("hello")); // false (!)
// console.log(Number.isNaN(NaN));     // true
//
// console.log(Number.parseInt("42px"));      // 42
// console.log(Number.parseFloat("3.14rem")); // 3.14
//
// const formatted = (19.9).toFixed(2);
// console.log(formatted);        // "19.90"
// console.log(typeof formatted); // "string" (!)
//
// 📖 Раздел учебника: "Объект Number" → notes/js-advanced/08-date-math.md
// ================================================

// Пиши код ниже:
