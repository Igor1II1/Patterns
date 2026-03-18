// ========== Задание Замыкания #6 — Приватные данные через замыкание ==========
// Уровень: 🟡
//
// Напиши функцию `createBankAccount(initialBalance)`, которая возвращает объект с:
// - `deposit(amount)` — пополнение (amount должен быть > 0, иначе бросить ошибку)
// - `withdraw(amount)` — снятие (если amount > balance — бросить ошибку "Недостаточно средств")
// - `getBalance()` — возвращает текущий баланс
// - `getHistory()` — возвращает КОПИЮ массива транзакций (формат: "+500", "-200")
//
// Переменные balance и history должны быть скрыты в замыкании.
//
// Тесты:
// const acc = createBankAccount(1000);
// acc.deposit(500);
// acc.withdraw(200);
// console.log(acc.getBalance()); // 1300
// console.log(acc.getHistory()); // ["+500", "-200"]
//
// // Проверка приватности:
// console.log(acc.balance); // undefined
//
// // Проверка что getHistory возвращает копию:
// const history = acc.getHistory();
// history.push("хакерская запись");
// console.log(acc.getHistory().length); // 2 (не 3!)
//
// // Проверка ошибок:
// try { acc.withdraw(5000); } catch(e) { console.log(e.message); } // "Недостаточно средств"
// try { acc.deposit(-100); } catch(e) { console.log(e.message); }  // ошибка
//
// 📖 Раздел учебника: "Приватные данные через замыкания" → notes/js-advanced/02-closures.md
// ================================================

// Пиши код ниже:
