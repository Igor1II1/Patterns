// ========== Задание Формы #8 — HTML5 валидация + Constraint API ==========
// Уровень: 🟡
//
// Используй встроенную HTML-валидацию и Constraint Validation API.
//
// HTML:
// <form id="testForm">
//   <input name="email" type="email" required id="emailField">
//   <input name="code" pattern="[A-Z]{3}-\d{3}" placeholder="ABC-123" id="codeField">
//   <button type="submit">Проверить</button>
// </form>
//
// Шаги:
// 1. Прочитай validity объект для email-поля:
//    - validity.valid
//    - validity.valueMissing (пустое + required)
//    - validity.typeMismatch (не email)
// 2. Проверь всю форму через form.checkValidity()
// 3. Установи кастомное сообщение через setCustomValidity()
// 4. Не забудь сбросить: setCustomValidity("") при следующем вводе!
//
// Тесты:
// Пустой email: validity.valueMissing = true
// "abc": validity.typeMismatch = true
// "a@b.c": validity.valid = true
//
// 📖 Раздел учебника: "Constraint Validation API" → notes/dom/04-forms.md
// ================================================

// Пиши код ниже:
