// ========== Задание React #2 — Правила JSX ==========
// Уровень: 🟢
//
// Исправь ошибки в JSX. В коде ниже 6 ошибок.
//
// Ошибки:
// 1. Нет корневого элемента
// 2. Незакрытый тег
// 3. class вместо className
// 4. for вместо htmlFor
// 5. Атрибут не в camelCase
// 6. JS-выражение без фигурных скобок
//
// 📖 Раздел учебника: "Правила JSX" → notes/react/01-intro-jsx.md
// ================================================

// Исправь код ниже:

function Profile() {
  const name = 'Игорь';

  return (
    <h1 class="title">Профиль</h1>
    <img src="avatar.jpg">
    <label for="email">Email</label>
    <input type="email" id="email" tabindex="1">
    <p>Имя: name</p>
  );
}
