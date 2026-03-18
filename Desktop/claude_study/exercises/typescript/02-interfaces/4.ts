// ==================================================
// Задание 4: Наследование интерфейсов (extends)
// Уровень: 🟡 Средний
// Тема: extends для интерфейсов
// Ссылка: notes/typescript/02-interfaces.md — "Наследование интерфейсов"
// ==================================================
//
// 1. Создай интерфейс BaseEntity:
//    - id: number
//    - createdAt: string
//
// 2. Создай интерфейс User extends BaseEntity:
//    - name: string
//    - email: string
//
// 3. Создай интерфейс Admin extends User:
//    - permissions: string[]
//
// 4. Создай объект admin типа Admin — он должен иметь ВСЕ поля
//    (id, createdAt, name, email, permissions).
//
// 5. Создай интерфейс Timestamped:
//    - updatedAt: string
//
// 6. Создай интерфейс Post extends BaseEntity, Timestamped:
//    - title: string
//    - content: string
//    (множественное наследование!)
//
// 7. Создай объект post типа Post и заполни все поля.
//
// Пиши код ниже:
// ==================================================
