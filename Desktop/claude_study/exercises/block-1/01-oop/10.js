// ========== Задание ООП #10 — КОМПЛЕКСНАЯ ЗАДАЧА: Библиотека ==========
// Уровень: 🔴
//
// Создай систему управления библиотекой с использованием ВСЕХ концепций ООП:
//
// 1. Абстрактный класс `Publication`:
//    - Запрет создания напрямую (new.target)
//    - Абстрактный метод `getInfo()` (бросает ошибку если не переопределён)
//    - Конструктор принимает `title` и `year`
//
// 2. Класс `Book` (наследует `Publication`):
//    - Конструктор: `title`, `author`, `year`, `pages`
//    - Приватное поле `#isAvailable = true`
//    - Метод `borrow()` — устанавливает `#isAvailable = false`, возвращает `true`
//      Если книга уже взята — возвращает `false`
//    - Метод `return()` — устанавливает `#isAvailable = true`
//    - Геттер `available` — возвращает `#isAvailable`
//    - Переопредели `getInfo()`: `"[title] — [author] ([year]), [pages] стр."`
//
// 3. Класс `Magazine` (наследует `Publication`):
//    - Конструктор: `title`, `year`, `issue` (номер выпуска)
//    - Переопредели `getInfo()`: `"[title] №[issue] ([year])"`
//
// 4. Класс `Library`:
//    - Приватное поле `#items` (массив)
//    - Метод `add(item)` — добавляет Publication в библиотеку
//    - Метод `findByTitle(title)` — ищет по названию (частичное совпадение, без учёта регистра)
//    - Метод `getAvailableBooks()` — возвращает массив доступных книг
//    - Метод `listAll()` — возвращает массив строк getInfo() всех элементов (полиморфизм!)
//
// Тесты:
// const lib = new Library();
//
// const book1 = new Book("1984", "Оруэлл", 1949, 328);
// const book2 = new Book("Дюна", "Герберт", 1965, 412);
// const mag1 = new Magazine("National Geographic", 2024, 3);
//
// lib.add(book1);
// lib.add(book2);
// lib.add(mag1);
//
// console.log(lib.listAll());
// // ["1984 — Оруэлл (1949), 328 стр.", "Дюна — Герберт (1965), 412 стр.", "National Geographic №3 (2024)"]
//
// book1.borrow();
// console.log(book1.available); // false
// console.log(book1.borrow()); // false (уже взята)
// console.log(lib.getAvailableBooks().length); // 1 (только Дюна)
//
// book1.return();
// console.log(lib.getAvailableBooks().length); // 2
//
// console.log(lib.findByTitle("дюна")); // [Book объект]
//
// try { new Publication("test", 2024); } catch(e) { console.log(e.message); }
// // "Publication — абстрактный класс..."
//
// 📖 Раздел учебника: ВСЕ разделы → notes/js-advanced/01-oop-basics.md
// ================================================

// Пиши код ниже:
