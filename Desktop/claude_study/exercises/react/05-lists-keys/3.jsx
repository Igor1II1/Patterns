// ========== Задание React #3 — Ключи (keys): правильные и неправильные ==========
// Уровень: 🟡
//
// Объясни проблемы с ключами. Ответь в комментариях и исправь код.
//
// Вариант 1 (плохой): index как ключ
// {items.map((item, index) => <li key={index}>{item.name}</li>)}
// Почему плохо: ???
//
// Вариант 2 (плохой): Math.random() как ключ
// {items.map(item => <li key={Math.random()}>{item.name}</li>)}
// Почему плохо: ???
//
// Вариант 3 (хороший): id из данных
// {items.map(item => <li key={item.id}>{item.name}</li>)}
// Почему хорошо: ???
//
// Вопрос: key передаётся как prop внутрь компонента?
// Ответ: ???
//
// 📖 Раздел учебника: "Ключи (keys)" → notes/react/05-lists-keys.md
// ================================================

// Исправь код ниже (замени ключи на правильные):
const items = [
  { id: 1, name: 'React' },
  { id: 2, name: 'Vue' },
  { id: 3, name: 'Angular' },
];

function BadList() {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.name}</li>
      ))}
    </ul>
  );
}
