// ========== Задание Итераторы #2 — Свой итератор вручную ==========
// Уровень: 🟡
//
// Напиши функцию `createRange(start, end)`, которая возвращает
// итерируемый объект для перебора чисел от start до end.
//
// Объект должен иметь:
// - Метод `next()` — возвращает { value, done }
// - Метод `[Symbol.iterator]()` — возвращает this (чтобы работал for...of)
//
// Тесты:
// const range = createRange(1, 5);
// console.log(range.next()); // { value: 1, done: false }
// console.log(range.next()); // { value: 2, done: false }
//
// // Через for...of:
// for (const n of createRange(3, 6)) {
//   console.log(n); // 3, 4, 5, 6
// }
//
// // Через spread:
// console.log([...createRange(1, 5)]); // [1, 2, 3, 4, 5]
//
// 📖 Раздел учебника: "Создание своего итератора вручную" → notes/js-advanced/09-iterators.md
// ================================================

// Пиши код ниже:
