// ========== Задание ООП #7 — Абстрактный класс (new.target) ==========
// Уровень: 🟡
//
// 1. Создай абстрактный класс `Storage`:
//    - В конструкторе проверяй `new.target === Storage` — если да, бросай ошибку
//      `"Storage — абстрактный класс, нельзя создать напрямую"`
//    - Метод `save(data)` — бросает ошибку `"Метод save() должен быть реализован"`
//    - Метод `load()` — бросает ошибку `"Метод load() должен быть реализован"`
//
// 2. Создай класс `LocalStorage` (наследует `Storage`):
//    - Приватное поле `#data = null`
//    - Реализуй `save(data)` — сохраняет data в `#data`
//    - Реализуй `load()` — возвращает `#data`
//
// 3. Создай класс `SessionStorage` (наследует `Storage`):
//    - Аналогично, но пусть `load()` возвращает копию данных (через spread)
//
// Тесты:
// try { new Storage(); } catch (e) { console.log(e.message); }
// // "Storage — абстрактный класс, нельзя создать напрямую"
//
// const ls = new LocalStorage();
// ls.save({ theme: "dark" });
// console.log(ls.load()); // { theme: "dark" }
//
// const ss = new SessionStorage();
// ss.save({ lang: "ru" });
// const data = ss.load();
// console.log(data); // { lang: "ru" }
//
// 📖 Раздел учебника: "Абстракция" → notes/js-advanced/01-oop-basics.md
// ================================================

// Пиши код ниже:
