// ========== Задание Продвинутые классы #6 — Приватные поля и методы ==========
// Уровень: 🟡
//
// Создай класс `Wallet` с:
// - Приватным полем `#balance = 0`
// - Приватным полем `#history = []`
// - Приватным методом `#log(type, amount)` — добавляет запись в #history
// - Приватным методом `#validate(amount)` — бросает ошибку если amount <= 0 или не число
//
// Публичные методы:
// - `topUp(amount)` — пополнение (с валидацией и логированием)
// - `pay(amount)` — оплата (с валидацией; если не хватает средств — ошибка)
// - Геттер `balance` — текущий баланс
// - Геттер `history` — КОПИЯ истории
//
// Тесты:
// const w = new Wallet();
// w.topUp(1000);
// w.pay(300);
// w.topUp(200);
// console.log(w.balance); // 900
// console.log(w.history); // [{type: "topUp", amount: 1000}, {type: "pay", amount: 300}, ...]
//
// try { w.pay(5000); } catch(e) { console.log(e.message); }
// try { w.topUp(-50); } catch(e) { console.log(e.message); }
//
// // w.#balance — SyntaxError
//
// 📖 Раздел учебника: "Приватные поля # — углублённо" → notes/js-advanced/04-classes-advanced.md
// ================================================

// Пиши код ниже:
