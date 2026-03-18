// ========== Задание DOM: Структура #6 — Типы узлов ==========
// Уровень: 🟡
//
// Исследуй типы узлов в DOM-дереве.
//
// HTML:
// <div id="container">
//   <!-- Комментарий -->
//   <p>Текст</p>
// </div>
//
// Шаги:
// 1. Получи элемент #container
// 2. Перебери container.childNodes (ВСЕ узлы, включая текстовые)
// 3. Для каждого узла выведи: nodeType, nodeName, nodeValue
// 4. Объясни, почему childNodes.length больше чем children.length
//
// Тесты:
// Узел: nodeType=3, nodeName="#text"        (перенос строки)
// Узел: nodeType=8, nodeName="#comment"     (комментарий)
// Узел: nodeType=3, nodeName="#text"        (перенос строки)
// Узел: nodeType=1, nodeName="P"            (элемент)
// Узел: nodeType=3, nodeName="#text"        (перенос строки)
//
// 📖 Раздел учебника: "Типы узлов" → notes/dom/01-dom-structure.md
// ================================================

// Пиши код ниже:
