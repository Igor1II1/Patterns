// ========== Задание DOM: Структура #9 — closest ==========
// Уровень: 🟡
//
// Используй closest() для поиска предка элемента.
//
// HTML:
// <div class="app">
//   <div class="card" data-id="42">
//     <div class="card-body">
//       <button class="btn">Нажми</button>
//     </div>
//   </div>
// </div>
//
// Шаги:
// 1. Получи кнопку .btn
// 2. Найди ближайший .card через closest
// 3. Прочитай data-id из найденной карточки
// 4. Попробуй найти несуществующий предок "form" — что вернёт?
//
// Тесты:
// console.log(card.dataset.id);       // "42"
// console.log(btn.closest("form"));   // null
//
// 📖 Раздел учебника: "Метод closest" → notes/dom/01-dom-structure.md
// ================================================

// Пиши код ниже:
