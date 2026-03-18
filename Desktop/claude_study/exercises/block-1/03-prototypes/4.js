// ========== Задание Прототипы #4 — hasOwnProperty vs in ==========
// Уровень: 🟢
//
// 1. Создай объект `parent` с свойством `inherited: true`.
// 2. Создай объект `child` через Object.create(parent).
// 3. Добавь child собственное свойство `own: "моё"`.
//
// 4. Для каждого свойства проверь оба варианта: `in` и `hasOwnProperty`.
//
// Тесты:
// console.log("own" in child);       // true
// console.log("inherited" in child); // true
// console.log("missing" in child);   // false
//
// console.log(child.hasOwnProperty("own"));       // true
// console.log(child.hasOwnProperty("inherited")); // false
//
// // Бонус: используй Object.keys() — что он покажет?
// console.log(Object.keys(child)); // ["own"]
//
// 📖 Раздел учебника: "hasOwnProperty vs оператор in" → notes/js-advanced/03-prototypes.md
// ================================================

// Пиши код ниже:
