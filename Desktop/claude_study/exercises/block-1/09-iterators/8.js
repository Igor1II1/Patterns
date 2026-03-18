// ========== Задание Итераторы #8 — Генератор пагинации ==========
// Уровень: 🟡
//
// Напиши генератор `paginate(items, pageSize)`, который разбивает
// массив на страницы (подмассивы) указанного размера.
//
// Тесты:
// const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// const pages = paginate(items, 3);
//
// console.log(pages.next().value); // [1, 2, 3]
// console.log(pages.next().value); // [4, 5, 6]
// console.log(pages.next().value); // [7, 8, 9]
// console.log(pages.next().value); // [10]
// console.log(pages.next().done);  // true
//
// // Через for...of:
// for (const page of paginate([..."abcdefgh"], 3)) {
//   console.log(page); // ["a","b","c"], ["d","e","f"], ["g","h"]
// }
//
// 📖 Раздел учебника: "Пагинация" → notes/js-advanced/09-iterators.md
// ================================================

// Пиши код ниже:
