// ========== Задание Итераторы #9 — Итерируемый объект (класс) ==========
// Уровень: 🔴
//
// Создай класс `NumberRange`, который является итерируемым:
// - Конструктор принимает `start` и `end`
// - Реализует метод [Symbol.iterator]() через генератор
// - Добавь метод `toArray()` — возвращает массив всех чисел
// - Добавь метод `includes(n)` — проверяет, входит ли число в диапазон
// - Добавь геттер `length` — количество чисел в диапазоне
//
// Тесты:
// const range = new NumberRange(1, 5);
//
// for (const n of range) {
//   console.log(n); // 1, 2, 3, 4, 5
// }
//
// console.log([...range]);       // [1, 2, 3, 4, 5]
// console.log(range.toArray());  // [1, 2, 3, 4, 5]
// console.log(range.includes(3)); // true
// console.log(range.includes(6)); // false
// console.log(range.length);     // 5
//
// // Деструктуризация:
// const [first, second] = new NumberRange(10, 15);
// console.log(first, second); // 10, 11
//
// 📖 Раздел учебника: "Протокол итерации" → notes/js-advanced/09-iterators.md
// ================================================

// Пиши код ниже:
