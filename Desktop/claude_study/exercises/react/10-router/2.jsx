// ========== Задание React #2 — Link и NavLink ==========
// Уровень: 🟢
//
// Создай навигационное меню с Link и NavLink.
//
// Шаги:
// 1. Создай компонент Navigation
// 2. Добавь 3 ссылки: Главная (/), О нас (/about), Контакты (/contact)
// 3. Первые две сделай через NavLink с динамическим className:
//    - Если isActive → className="nav-link active"
//    - Иначе → className="nav-link"
// 4. Третью сделай через обычный Link (без активного состояния)
// 5. Встрой Navigation в App над Routes
// 6. Объясни в комментарии: почему нельзя использовать <a href="..."> вместо Link?
//
// Подсказки:
// - Link: <Link to="/about">О нас</Link>
// - NavLink: className={({ isActive }) => isActive ? 'active' : ''}
// - <a href> перезагружает страницу, Link — нет
//
// 📖 Раздел учебника: "Link и NavLink" → notes/react/10-router.md
// ================================================

// Пиши код ниже:
