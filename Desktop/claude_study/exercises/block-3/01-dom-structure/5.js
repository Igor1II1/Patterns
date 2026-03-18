// ========== Задание DOM: Структура #5 — NodeList vs HTMLCollection ==========
// Уровень: 🟡
//
// Покажи разницу между NodeList (querySelectorAll) и HTMLCollection
// (getElementsByClassName). Продемонстрируй "живую" коллекцию.
//
// HTML:
// <div id="box">
//   <p class="text">Первый</p>
//   <p class="text">Второй</p>
// </div>
//
// Шаги:
// 1. Получи NodeList через querySelectorAll(".text")
// 2. Получи HTMLCollection через getElementsByClassName("text")
// 3. Выведи length обоих
// 4. Создай новый <p class="text">Третий</p> и добавь в #box
// 5. Снова выведи length обоих — какой изменился?
// 6. Попробуй вызвать forEach на обоих — где сработает?
//
// Тесты:
// До добавления: NodeList.length = 2, HTMLCollection.length = 2
// После добавления: NodeList.length = 2, HTMLCollection.length = 3
// NodeList.forEach — работает
// HTMLCollection.forEach — ошибка!
//
// 📖 Раздел учебника: "NodeList vs HTMLCollection" → notes/dom/01-dom-structure.md
// ================================================

// Пиши код ниже:
