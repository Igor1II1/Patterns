// ========== Задание Формы #4 — Обработка submit ==========
// Уровень: 🟡
//
// Перехвати отправку формы, прочитай данные и выведи в консоль.
// Страница НЕ должна перезагружаться!
//
// HTML:
// <form id="loginForm">
//   <input name="email" type="email" value="test@test.com">
//   <input name="password" type="password" value="123456">
//   <button type="submit">Войти</button>
// </form>
// <div id="result"></div>
//
// Шаги:
// 1. Повесь обработчик submit на ФОРМУ (не на кнопку!)
// 2. Вызови event.preventDefault()
// 3. Прочитай email и password через form.elements
// 4. Выведи в #result: "Вход: email=..., пароль=..."
//
// Тесты:
// При нажатии "Войти": страница НЕ перезагружается
// В #result: "Вход: email=test@test.com, пароль=123456"
//
// 📖 Раздел учебника: "Обработка отправки формы" → notes/dom/04-forms.md
// ================================================

// Пиши код ниже:
