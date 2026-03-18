// ========== Задание ООП #3 — Геттер и сеттер с валидацией ==========
// Уровень: 🟢
//
// Создай класс `Product` с:
// - приватным полем `#price`
// - конструктором, принимающим `name` и `price`
// - методом `getPrice()`, возвращающим цену
// - методом `setPrice(newPrice)`:
//   - если newPrice <= 0 — ничего не менять
//   - если newPrice > 0 — обновить #price
// - методом `getInfo()`, возвращающим `"[name]: [price] руб."`
//
// Тесты:
// const p = new Product("Молоко", 80);
// console.log(p.getPrice());  // 80
// console.log(p.getInfo());   // "Молоко: 80 руб."
// p.setPrice(-10);
// console.log(p.getPrice());  // 80 (не изменилось)
// p.setPrice(95);
// console.log(p.getPrice());  // 95
//
// 📖 Раздел учебника: "Инкапсуляция" → notes/js-advanced/01-oop-basics.md
// ================================================

// Пиши код ниже:
