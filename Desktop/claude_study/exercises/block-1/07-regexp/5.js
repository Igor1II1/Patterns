// ========== Задание RegExp #5 — Якоря и границы слов ==========
// Уровень: 🟡
//
// 1. Напиши regexp, который находит слово "cat" только как отдельное слово,
//    а не внутри "category" или "concatenate".
//    Подсказка: используй \b
//
// 2. Напиши regexp, проверяющий что строка начинается с "Hello" и заканчивается "!"
//
// 3. Используй флаг m — найди все слова в начале каждой строки
//    в многострочном тексте.
//
// Тесты:
// const catWord = /\bcat\b/;
// console.log(catWord.test("I love my cat"));     // true
// console.log(catWord.test("category"));          // false
// console.log(catWord.test("the cat sat"));       // true
//
// const helloExcl = /^Hello.*!$/;
// console.log(helloExcl.test("Hello world!"));    // true
// console.log(helloExcl.test("Hello world."));    // false
// console.log(helloExcl.test("Say Hello!"));      // false
//
// const multiLine = "first\nsecond\nthird";
// console.log(multiLine.match(/^\w+/gm)); // ["first", "second", "third"]
//
// 📖 Раздел учебника: "Якоря" → notes/js-advanced/07-regexp.md
// ================================================

// Пиши код ниже:
