// ==================================================
// Задание 6: Комплексная задача — generic-хранилище данных
// Уровень: 🔴 Сложный
// Тема: Все концепции 03-generics вместе
// Ссылка: notes/typescript/03-generics.md — вся глава
// ==================================================
//
// Создай универсальное хранилище данных (in-memory database):
//
// 1. Интерфейс Entity: id (number), createdAt (string)
//
// 2. Интерфейс Storage<T extends Entity>:
//    - items: T[]
//    - add(item: Omit<T, "id" | "createdAt">): T
//    - getById(id: number): T | undefined
//    - getAll(): T[]
//    - update(id: number, updates: Partial<Omit<T, "id" | "createdAt">>): T | undefined
//    - remove(id: number): boolean
//    - findBy<K extends keyof T>(field: K, value: T[K]): T[]
//
// 3. Функция createStorage<T extends Entity>(): Storage<T>
//    Реализуй все методы:
//    - add: генерирует id (автоинкремент), createdAt (new Date().toISOString())
//    - getById: ищет по id
//    - update: обновляет поля (кроме id и createdAt)
//    - remove: удаляет по id, возвращает true/false
//    - findBy: фильтрует по значению поля
//
// 4. Интерфейс User extends Entity: name (string), email (string), role ("admin" | "user")
//    Интерфейс Post extends Entity: title (string), body (string), authorId (number)
//
// 5. Создай userStorage = createStorage<User>()
//    Создай postStorage = createStorage<Post>()
//
// 6. Добавь 3 пользователя и 2 поста.
//    Найди пользователя по role "admin".
//    Обнови email пользователя.
//    Удали пост.
//    Выведи все результаты.
//
// Пиши код ниже:
// ==================================================
