// ========== Задание Прототипы #2 — Object.getPrototypeOf ==========
// Уровень: 🟢
//
// 1. Создай объект `parent` с свойством `role: "parent"`.
// 2. Создай объект `child` с свойством `role: "child"`.
// 3. Установи parent прототипом child через Object.setPrototypeOf.
//
// 4. Ответь в комментариях и проверь кодом:
//    - Что вернёт Object.getPrototypeOf(child)?
//    - Что вернёт child.role? Почему не "parent"?
//    - Что вернёт Object.getPrototypeOf(parent)?
//
// Тесты:
// console.log(Object.getPrototypeOf(child) === parent); // true
// console.log(child.role);                              // "child"
// console.log(Object.getPrototypeOf(parent) === Object.prototype); // true
//
// 📖 Раздел учебника: "[[Prototype]] — внутренний слот" → notes/js-advanced/03-prototypes.md
// ================================================

// Пиши код ниже:
