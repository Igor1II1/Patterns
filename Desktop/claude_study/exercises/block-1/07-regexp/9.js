// ========== Задание RegExp #9 — Валидация email ==========
// Уровень: 🟡
//
// Напиши функцию `isValidEmail(email)`, которая проверяет формат email:
// - Локальная часть: буквы, цифры, точки, дефисы, подчёркивания
// - Символ @
// - Домен: буквы, цифры, дефисы
// - Точка
// - Доменная зона: 2-6 букв
//
// Regexp: /^[\w.-]+@[\w-]+\.[a-zA-Z]{2,6}$/
//
// Тесты:
// console.log(isValidEmail("user@example.com"));    // true
// console.log(isValidEmail("user.name@mail.ru"));   // true
// console.log(isValidEmail("invalid-email"));        // false
// console.log(isValidEmail("missing@domain"));       // false
// console.log(isValidEmail("@nodomain.com"));        // false
// console.log(isValidEmail("user@.com"));            // false
//
// 📖 Раздел учебника: "Валидация email" → notes/js-advanced/07-regexp.md
// ================================================

// Пиши код ниже:
