// ========== Задание React #2 — Правила хуков ==========
// Уровень: 🟢
//
// Найди ошибки в использовании хуков. Ответь в комментариях.
//
// Код 1: Хук внутри if
// function Profile({ userId }) {
//   if (userId) {
//     const [user, setUser] = useState(null);
//   }
// }
// Ошибка: ???
// Как исправить: ???
//
// Код 2: Хук после раннего return
// function Profile({ userId }) {
//   if (!userId) return <p>Нет данных</p>;
//   const [user, setUser] = useState(null);
// }
// Ошибка: ???
// Как исправить: ???
//
// Код 3: Хук в обычной функции
// function calculateTotal(items) {
//   const [total, setTotal] = useState(0);
// }
// Ошибка: ???
//
// Код 4: Хук в обработчике
// function MyComponent() {
//   function handleClick() {
//     const [x, setX] = useState(0);
//   }
// }
// Ошибка: ???
//
// 📖 Раздел учебника: "Правила хуков" → notes/react/09-custom-hooks.md
// ================================================
