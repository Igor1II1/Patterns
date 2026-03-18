// ========== Задание Формы #10 — КОМПЛЕКСНАЯ ЗАДАЧА: Форма регистрации ==========
// Уровень: 🔴
//
// Создай полноценную форму регистрации с:
// 1. Валидацией в реальном времени (при вводе)
// 2. Валидацией при отправке (все ошибки сразу)
// 3. FormData для сбора данных
// 4. Сбросом формы после успешной отправки
//
// HTML:
// <form id="regForm">
//   <input name="name" placeholder="Имя">
//   <span class="hint" id="nameHint"></span>
//
//   <input name="email" type="email" placeholder="Email">
//   <span class="hint" id="emailHint"></span>
//
//   <input name="password" type="password" placeholder="Пароль">
//   <span class="hint" id="passHint"></span>
//
//   <input name="confirmPassword" type="password" placeholder="Повтор пароля">
//   <span class="hint" id="confirmHint"></span>
//
//   <select name="city">
//     <option value="">Выберите город</option>
//     <option value="msk">Москва</option>
//     <option value="spb">СПб</option>
//   </select>
//
//   <label><input name="agree" type="checkbox"> Согласен с правилами</label>
//
//   <button type="submit">Зарегистрироваться</button>
// </form>
// <div id="result"></div>
//
// Валидация:
// - Имя: 2+ символов
// - Email: содержит @
// - Пароль: 6+ символов, цифра, заглавная буква
// - Повтор пароля: совпадает с паролем
// - Город: выбран (не пустая строка)
// - Чекбокс: отмечен
//
// Концепции: submit, preventDefault, FormData, Object.fromEntries,
// input-событие, валидация, classList, textContent, form.reset()
//
// 📖 Раздел учебника: все разделы → notes/dom/04-forms.md
// ================================================

// Пиши код ниже:
