// ========== Задание DOM: Изменение #4 — textContent vs innerHTML ==========
// Уровень: 🟡
//
// Покажи разницу между textContent и innerHTML.
// Покажи опасность innerHTML с пользовательскими данными.
//
// HTML:
// <div id="safe"></div>
// <div id="unsafe"></div>
//
// Шаги:
// 1. Задай переменную userInput = '<b>Жирный</b>'
// 2. Вставь через textContent в #safe — теги отобразятся как текст
// 3. Вставь через innerHTML в #unsafe — теги применятся
// 4. Попробуй опасный ввод: '<img src=x onerror="alert(1)">'
//    через textContent (безопасно) и innerHTML (опасно!)
//
// Тесты:
// #safe: показывает "<b>Жирный</b>" как текст
// #unsafe: показывает **Жирный** (жирным шрифтом)
//
// 📖 Раздел учебника: "textContent vs innerHTML" → notes/dom/02-dom-manipulation.md
// ================================================

// Пиши код ниже:
