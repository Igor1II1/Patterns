// ========== Задание 2.7 ==========
// Напиши функцию getDiscount(user, cart) которая рассчитывает скидку:
//   - VIP пользователь → 20%
//   - Заказ > 5000 руб. → 10%
//   - Первый заказ (user.ordersCount === 0) → 5%
//   - Скидки суммируются, но не более 30%
//   - Если скидок нет → 0
//
// getDiscount({ vip: true, ordersCount: 5 }, { total: 3000 })  // 20
// getDiscount({ vip: false, ordersCount: 0 }, { total: 6000 }) // 15
// getDiscount({ vip: true, ordersCount: 0 }, { total: 6000 })  // 30 (максимум!)
// getDiscount({ vip: false, ordersCount: 3 }, { total: 2000 }) // 0
//
// Раздел учебника: "if / else if / else", "Логические операторы"
//
// Забегая вперёд — объекты (глава 7):
// user.vip          // true или false
// user.ordersCount  // число заказов
// cart.total        // сумма заказа в рублях

function getDiscount(user, cart) {
  let discount = 0;

  if (user.vip) {
    discount += 20;
  }
  if (cart.total > 5000) {
    discount += 10;
  }
  if (user.ordersCount === 0) {
    discount += 5;
  }
  if (discount > 30) {
    discount = 30;
  } 
    return discount;
  
}

console.log(getDiscount({ vip: true, ordersCount: 5 }, { total: 3000 })); // 20
console.log(getDiscount({ vip: false, ordersCount: 0 }, { total: 6000 })); // 15
console.log(getDiscount({ vip: true, ordersCount: 0 }, { total: 6000 })); // 30 (максимум!)
console.log(getDiscount({ vip: false, ordersCount: 3 }, { total: 2000 })); // 0

// ========== Разбор задания ==========
// Что делали:    накапливали скидку через несколько независимых if (не else if!).
// Почему так:    скидки суммируются — значит каждое условие проверяется НЕЗАВИСИМО.
//                else if пропустил бы остальные после первого совпадения.
//                Отдельные if — каждый проверяется всегда, результат накапливается в discount.
//                В конце — ограничение (cap): если > 30, обрезаем до 30.
// Для чего:      паттерн "накопление + ограничение" очень частый: скидки, бонусы, штрафы,
//                расчёт рейтинга. Важно понять разницу между if и else if.
// Главное понять: if + if + if = все проверки независимы, каждая может добавить к результату.
//                if + else if + else if = только ОДНА ветка выполнится.
//                return должен быть ОДИН в конце, а не в каждом if.
//                let discount = 0 → накопитель (аккумулятор).
//
// Пошагово для ({ vip: true, ordersCount: 0 }, { total: 6000 }):
//   discount = 0
//   if (user.vip) → true       → discount = 0 + 20 = 20
//   if (total > 5000) → true   → discount = 20 + 10 = 30
//   if (ordersCount === 0) → true → discount = 30 + 5 = 35
//   if (discount > 30) → true  → discount = 30 (обрезали)
//   return 30
