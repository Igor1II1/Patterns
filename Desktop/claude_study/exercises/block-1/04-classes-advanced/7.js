// ========== Задание Продвинутые классы #7 — Публичные поля ==========
// Уровень: 🟢
//
// Создай класс `GameCharacter` с:
// - Публичными полями (со значениями по умолчанию):
//   - `name = "Unknown"`
//   - `health = 100`
//   - `level = 1`
// - Конструктором, принимающим `name`
// - Методом `takeDamage(amount)` — уменьшает health (но не ниже 0)
// - Геттером `isAlive` — true если health > 0
// - Методом `getStats()` — возвращает объект { name, health, level }
//
// Тесты:
// const hero = new GameCharacter("Aragorn");
// console.log(hero.getStats()); // { name: "Aragorn", health: 100, level: 1 }
//
// hero.takeDamage(30);
// console.log(hero.health);  // 70
// console.log(hero.isAlive); // true
//
// hero.takeDamage(200);
// console.log(hero.health);  // 0 (не отрицательное!)
// console.log(hero.isAlive); // false
//
// 📖 Раздел учебника: "Публичные поля экземпляра" → notes/js-advanced/04-classes-advanced.md
// ================================================

// Пиши код ниже:
