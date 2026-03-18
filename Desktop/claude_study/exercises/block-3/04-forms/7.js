// ========== Задание Формы #7 — FormData ==========
// Уровень: 🟡
//
// Используй FormData для сбора всех данных формы.
//
// HTML:
// <form id="profileForm">
//   <input name="name" value="Игорь">
//   <input name="email" value="igor@test.com">
//   <input name="age" type="number" value="25">
//   <select name="city">
//     <option value="msk" selected>Москва</option>
//     <option value="spb">СПб</option>
//   </select>
//   <button type="submit">Сохранить</button>
// </form>
//
// Шаги:
// 1. Перехвати submit
// 2. Создай new FormData(form)
// 3. Перебери все поля через for...of
// 4. Преобразуй в объект через Object.fromEntries
// 5. Выведи объект
//
// Тесты:
// { name: "Игорь", email: "igor@test.com", age: "25", city: "msk" }
// Обрати внимание: age — строка "25", не число!
//
// 📖 Раздел учебника: "FormData API" → notes/dom/04-forms.md
// ================================================

// Пиши код ниже:
