// ========== Задание RegExp #4 — Квантификаторы ==========
// Уровень: 🟢
//
// Напиши регулярные выражения:
//
// 1. Проверить, что строка — ровно 5 цифр (почтовый индекс): /^\d{5}$/
// 2. Проверить формат "colour" или "color" (u необязательна)
// 3. Найти числа из 2 и более цифр в строке "1 22 333 4444"
// 4. Проверить, что строка содержит от 3 до 8 букв (только буквы)
//
// Тесты:
// const zipCode = /^\d{5}$/;
// console.log(zipCode.test("12345"));  // true
// console.log(zipCode.test("1234"));   // false
// console.log(zipCode.test("123456")); // false
//
// const colorRe = ???;
// console.log(colorRe.test("color"));  // true
// console.log(colorRe.test("colour")); // true
//
// console.log("1 22 333 4444".match(/\d{2,}/g)); // ["22", "333", "4444"]
//
// const onlyLetters = ???;
// console.log(onlyLetters.test("hello")); // true
// console.log(onlyLetters.test("hi"));    // false (меньше 3)
// console.log(onlyLetters.test("toolongword")); // false (больше 8)
//
// 📖 Раздел учебника: "Квантификаторы" → notes/js-advanced/07-regexp.md
// ================================================

// Пиши код ниже:
