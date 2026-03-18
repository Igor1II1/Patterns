// ========== Задание Хранилище #7 — Cookies ==========
// Уровень: 🟡
//
// Напиши вспомогательные функции для работы с cookies.
//
// Шаги:
// 1. Напиши функцию setCookie(name, value, days)
//    - Формат: "name=value; max-age=секунды; path=/"
//    - Используй encodeURIComponent для значения
//
// 2. Напиши функцию getCookie(name)
//    - Разбери document.cookie через split("; ")
//    - Найди нужный ключ
//    - Верни значение или null
//
// 3. Напиши функцию deleteCookie(name)
//    - Установи max-age=0
//
// Тесты:
// setCookie("lang", "ru", 30);
// getCookie("lang"); // "ru"
// deleteCookie("lang");
// getCookie("lang"); // null
//
// 📖 Раздел учебника: "Cookies" → notes/dom/05-storage.md
// ================================================

// Пиши код ниже:
