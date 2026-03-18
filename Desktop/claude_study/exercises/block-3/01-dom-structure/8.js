// ========== Задание DOM: Структура #8 — firstChild vs firstElementChild ==========
// Уровень: 🟡
//
// Покажи ловушку: firstChild может вернуть текстовый узел!
//
// HTML:
// <ul id="list">
//   <li>Первый</li>
// </ul>
//
// Шаги:
// 1. Получи #list
// 2. Выведи list.firstChild — что это? (nodeType, nodeName)
// 3. Выведи list.firstElementChild — что это?
// 4. Объясни разницу в комментариях
//
// Тесты:
// list.firstChild.nodeType;        // 3 (текстовый узел — перенос строки!)
// list.firstElementChild.nodeType; // 1 (элемент <li>)
//
// 📖 Раздел учебника: "Навигация по дереву" → notes/dom/01-dom-structure.md
// ================================================

// Пиши код ниже:
