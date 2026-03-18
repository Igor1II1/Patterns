// ========== Задание Прототипы #3 — Откуда берётся toString? ==========
// Уровень: 🟢
//
// 1. Создай обычный объект `user` с полями `name` и `age`.
// 2. Вызови `user.toString()` — он работает, хотя ты его не писал. Почему?
//
// 3. Нарисуй в комментарии прототипную цепочку user:
//    user → ??? → ??? → null
//
// 4. Проверь кодом:
//    - Есть ли toString у user напрямую? (hasOwnProperty)
//    - Есть ли toString у Object.prototype?
//
// Тесты:
// console.log(user.toString());                           // "[object Object]"
// console.log(user.hasOwnProperty("toString"));           // false
// console.log(Object.prototype.hasOwnProperty("toString")); // true
//
// 📖 Раздел учебника: "Прототипная цепочка" → notes/js-advanced/03-prototypes.md
// ================================================

// Пиши код ниже:
