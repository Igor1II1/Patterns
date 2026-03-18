// ========== Задание Итераторы #1 — Symbol.iterator вручную ==========
// Уровень: 🟢
//
// 1. Проверь, есть ли Symbol.iterator у массива, строки и обычного объекта.
// 2. Для массива [10, 20, 30] вызови Symbol.iterator вручную и пройди через .next()
//
// Тесты:
// console.log(typeof [1,2,3][Symbol.iterator]);  // "function"
// console.log(typeof "hello"[Symbol.iterator]);   // "function"
// console.log(typeof {}[Symbol.iterator]);        // "undefined"
//
// const arr = [10, 20, 30];
// const it = arr[Symbol.iterator]();
// console.log(it.next()); // { value: 10, done: false }
// console.log(it.next()); // { value: 20, done: false }
// console.log(it.next()); // { value: 30, done: false }
// console.log(it.next()); // { value: undefined, done: true }
//
// 📖 Раздел учебника: "Symbol.iterator" → notes/js-advanced/09-iterators.md
// ================================================

// Пиши код ниже:
