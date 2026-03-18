// ========== Задание Проверка типов #4 — Proxy (get, set) ==========
// Уровень: 🟡
//
// Proxy позволяет перехватывать операции с объектами.
//
// 1. Создай объект `user = { name: "Игорь", age: 20 }`.
//
// 2. Создай Proxy для user с обработчиками (handler):
//    - `get(target, prop)`:
//      - Если свойство не существует — вернуть `"Свойство [prop] не найдено"`
//      - Иначе — вернуть значение
//    - `set(target, prop, value)`:
//      - Если prop === "age" и value < 0 — бросить ошибку
//      - Иначе — установить значение, вернуть true
//
// Тесты:
// const proxy = new Proxy(user, handler);
//
// console.log(proxy.name);     // "Игорь"
// console.log(proxy.missing);  // "Свойство missing не найдено"
//
// proxy.age = 25;
// console.log(proxy.age);      // 25
//
// try { proxy.age = -5; } catch(e) { console.log(e.message); }
// // "Возраст не может быть отрицательным"
//
// 📖 Раздел учебника: "Proxy (обзор)" → notes/js-advanced/11-type-checking.md
// ================================================

// Пиши код ниже:
