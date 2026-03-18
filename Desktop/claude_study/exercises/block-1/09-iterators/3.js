// ========== Задание Итераторы #3 — Базовый генератор ==========
// Уровень: 🟢
//
// 1. Напиши генераторную функцию `simpleGen()`, которая yield 1, 2, 3.
// 2. Создай объект-генератор и вызови next() 4 раза.
// 3. Используй for...of с генератором.
// 4. Используй spread с генератором.
//
// Тесты:
// const gen = simpleGen();
// console.log(gen.next()); // { value: 1, done: false }
// console.log(gen.next()); // { value: 2, done: false }
// console.log(gen.next()); // { value: 3, done: false }
// console.log(gen.next()); // { value: undefined, done: true }
//
// for (const val of simpleGen()) {
//   console.log(val); // 1, 2, 3
// }
//
// console.log([...simpleGen()]); // [1, 2, 3]
//
// 📖 Раздел учебника: "Генераторы (Generator functions)" → notes/js-advanced/09-iterators.md
// ================================================

// Пиши код ниже:
