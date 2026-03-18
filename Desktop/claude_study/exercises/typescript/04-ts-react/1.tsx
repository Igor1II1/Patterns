// ==================================================
// Задание 1: Типизация props компонента
// Уровень: 🟢 Лёгкий
// Тема: Interface для props, базовые типы в React
// Ссылка: notes/typescript/04-ts-react.md — "Типизация props"
// ==================================================
//
// 1. Создай интерфейс UserCardProps:
//    - name: string
//    - age: number
//    - email: string
//    - isOnline?: boolean (опциональное)
//
// 2. Напиши компонент UserCard({ name, age, email, isOnline }: UserCardProps)
//    Он возвращает JSX:
//    <div>
//      <h2>{name}</h2>
//      <p>Возраст: {age}</p>
//      <p>Email: {email}</p>
//      {isOnline && <span>В сети</span>}
//    </div>
//
// 3. Создай интерфейс ButtonProps:
//    - label: string
//    - variant: "primary" | "secondary" | "danger"
//    - disabled?: boolean
//
// 4. Напиши компонент Button({ label, variant, disabled }: ButtonProps)
//    Возвращает: <button disabled={disabled} className={variant}>{label}</button>
//
// 5. Покажи пример использования обоих компонентов (в комментарии или JSX).
//
// Пиши код ниже:
// ==================================================
