// ========== Задание Проверка типов #5 — Symbol.hasInstance ==========
// Уровень: 🔴
//
// Symbol.hasInstance позволяет кастомизировать поведение instanceof.
//
// 1. Создай класс `EvenNumber` с:
//    - Статическим методом [Symbol.hasInstance](value):
//      - Возвращает true если value — число и чётное
//
// 2. Создай класс `NonEmptyString` с:
//    - [Symbol.hasInstance] проверяет, что value — непустая строка
//
// Тесты:
// console.log(4 instanceof EvenNumber);    // true
// console.log(3 instanceof EvenNumber);    // false
// console.log("hi" instanceof EvenNumber); // false
//
// console.log("hello" instanceof NonEmptyString); // true
// console.log("" instanceof NonEmptyString);      // false
// console.log(42 instanceof NonEmptyString);      // false
//
// 📖 Раздел учебника: "Symbol.hasInstance" → notes/js-advanced/11-type-checking.md
// ================================================

// Пиши код ниже:
