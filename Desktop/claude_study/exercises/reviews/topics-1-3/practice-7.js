// ========== Практикум R1.7 -- Темы 1+2+3 (финальное) ==========
// Напиши функцию analyzeShop(orders) которая анализирует массив заказов
// и возвращает объект со статистикой.
//
// Каждый заказ: { customer: "имя", amount: число, status: "строка" }
// status бывает: "completed", "pending", "cancelled"
//
// Функция должна вернуть:
// {
//   total: сумма amount всех completed заказов,
//   count: количество completed заказов,
//   average: средняя сумма completed заказов (total / count),
//   cancelled: количество cancelled заказов,
//   largest: имя клиента с самым большим completed заказом
// }
//
// Используй:
//   - for...of для перебора заказов (тема 3)
//   - continue для пропуска pending (тема 3)
//   - if/else if для проверки status (тема 2)
//   - typeof, сравнение === (тема 1)
//   - let для аккумуляторов (total, count, max)
//
// const orders = [
//   { customer: "Игорь", amount: 5000, status: "completed" },
//   { customer: "Анна", amount: 3000, status: "cancelled" },
//   { customer: "Петя", amount: 8000, status: "completed" },
//   { customer: "Маша", amount: 1000, status: "pending" },
//   { customer: "Дима", amount: 2000, status: "cancelled" },
//   { customer: "Лена", amount: 12000, status: "completed" },
// ];
//
// analyzeShop(orders)
// → {
//   total: 25000,          // 5000 + 8000 + 12000
//   count: 3,              // 3 completed
//   average: 8333.33,      // 25000 / 3, округлить до 2 знаков
//   cancelled: 2,          // Анна + Дима
//   largest: "Лена"        // 12000 — максимальный completed
// }
//
// Подсказка: для округления используй Math.round(число * 100) / 100
// Для поиска максимума: заведи переменную let maxAmount = 0
// и сравнивай каждый completed заказ с ней.
//
// Забегая вперёд — объекты (глава 7):
// order.amount   // доступ к полю объекта
// { total, count, ... }  // создание объекта-результата
//
// Раздел учебника: "for...of" + "continue" (js/03-loops.md)
//                  + "===" (js/01-variables.md) + "if/else if" (js/02-conditions.md)

const orders = [
  { customer: "Игорь", amount: 5000, status: "completed" },
  { customer: "Анна", amount: 3000, status: "cancelled" },
  { customer: "Петя", amount: 8000, status: "completed" },
  { customer: "Маша", amount: 1000, status: "pending" },
  { customer: "Дима", amount: 2000, status: "cancelled" },
  { customer: "Лена", amount: 12000, status: "completed" },
];

function analyzeShop(orders) {
  let total = 0;
  let count = 0;
  let maxAmount = 0;
  let cancelled = 0;
  let largest = "";
  for (const el of orders) {
    if (el.status === "pending") {
      continue;
    }
    if (el.status === "cancelled") {
      cancelled += 1;
    }
    if (el.status === "completed") {
      count += 1;
      total += el.amount;
      if (el.amount > maxAmount) {
        maxAmount = el.amount;
        largest = el.customer;
      }
    }
  }
  return {
    total: total,
    count: count,
    average: Math.round(total / count * 100) / 100,
    cancelled: cancelled,
    largest: largest
}
}

console.log(analyzeShop(orders))

// ========== Разбор задания ==========
//
// Что делали:    Функция анализирует массив заказов магазина.
//                Считает статистику: сумму, количество, среднее, отменённые, самый большой заказ.
//
// === Пошаговый разбор кода ===
//
// 1. СЧЁТЧИКИ (аккумуляторы) — переменные которые копят значения в цикле:
//
//    let total = 0;       — сумма всех completed заказов (будем += каждый amount)
//    let count = 0;       — количество completed заказов (будем += 1)
//    let maxAmount = 0;   — сумма самого большого заказа (для сравнения)
//    let cancelled = 0;   — количество отменённых заказов
//    let largest = "";    — ИМЯ клиента с самым большим заказом
//
//    ВАЖНО: начальные значения = 0 и "".
//    Без = 0 будет: undefined + 5000 = NaN (сломается вся математика).
//
// 2. for (const el of orders)
//    el — один заказ за итерацию.
//    Итерация 1: el = { customer: "Игорь", amount: 5000, status: "completed" }
//    Итерация 2: el = { customer: "Анна", amount: 3000, status: "cancelled" }
//    ... и так 6 раз.
//
// 3. СТРУКТУРА ВНУТРИ ЦИКЛА — три блока:
//
//    БЛОК 1: if (el.status === "pending") continue;
//    ─────────────────────────────────────────────
//    "Если заказ в ожидании — пропустить, не считать вообще."
//    continue перескакивает на следующую итерацию — код ниже НЕ выполняется.
//
//    БЛОК 2: if (el.status === "cancelled") cancelled += 1;
//    ─────────────────────────────────────────────────────
//    "Если заказ отменён — увеличить счётчик отменённых."
//    cancelled += 1 это то же что cancelled = cancelled + 1.
//    Больше ничего с отменёнными не делаем — не нужна их сумма.
//
//    БЛОК 3: if (el.status === "completed") { ... }
//    ──────────────────────────────────────────────
//    "Если заказ завершён — собираем всю статистику."
//
//    count += 1;          — ещё один завершённый заказ
//    total += el.amount;  — прибавляем сумму заказа к общей
//
//    if (el.amount > maxAmount) {  — ПОИСК МАКСИМУМА
//        maxAmount = el.amount;    — запоминаем новый рекорд
//        largest = el.customer;    — запоминаем кто это
//    }
//
//    Как работает поиск максимума:
//    maxAmount начинается с 0. Каждый completed заказ сравниваем с ним.
//    Если текущий больше — обновляем. В конце maxAmount = самый большой.
//
// 4. return { total, count, average, cancelled, largest }
//    Создаём НОВЫЙ объект с результатами.
//    total: total  — свойство "total" со значением из переменной total.
//    average: Math.round(total / count * 100) / 100  — округление до 2 знаков.
//
//    Как работает Math.round(total / count * 100) / 100:
//    25000 / 3 = 8333.333333...
//    8333.333... * 100 = 833333.333...
//    Math.round(833333.333...) = 833333
//    833333 / 100 = 8333.33
//    Результат: 8333.33 (ровно 2 знака после запятой).
//
// === Полная трассировка ===
//
// Начальное состояние:
//   total=0, count=0, maxAmount=0, cancelled=0, largest=""
//
// --- Итерация 1: el = { customer: "Игорь", amount: 5000, status: "completed" } ---
//   "pending"?  "completed" === "pending" → false. Идём дальше.
//   "cancelled"? "completed" === "cancelled" → false. Идём дальше.
//   "completed"? "completed" === "completed" → true! Заходим:
//     count = 0 + 1 = 1
//     total = 0 + 5000 = 5000
//     5000 > 0 (maxAmount)? → true!
//       maxAmount = 5000
//       largest = "Игорь"
//   Состояние: total=5000, count=1, maxAmount=5000, cancelled=0, largest="Игорь"
//
// --- Итерация 2: el = { customer: "Анна", amount: 3000, status: "cancelled" } ---
//   "pending"?  "cancelled" === "pending" → false. Идём дальше.
//   "cancelled"? "cancelled" === "cancelled" → true!
//     cancelled = 0 + 1 = 1
//   "completed"? "cancelled" === "completed" → false. Пропускаем.
//   Состояние: total=5000, count=1, maxAmount=5000, cancelled=1, largest="Игорь"
//
// --- Итерация 3: el = { customer: "Петя", amount: 8000, status: "completed" } ---
//   "pending"? → false.
//   "cancelled"? → false.
//   "completed"? → true!
//     count = 1 + 1 = 2
//     total = 5000 + 8000 = 13000
//     8000 > 5000 (maxAmount)? → true!
//       maxAmount = 8000
//       largest = "Петя"
//   Состояние: total=13000, count=2, maxAmount=8000, cancelled=1, largest="Петя"
//
// --- Итерация 4: el = { customer: "Маша", amount: 1000, status: "pending" } ---
//   "pending"? "pending" === "pending" → true! → CONTINUE!
//   (всё ниже пропущено, переходим к следующей итерации)
//   Состояние: без изменений
//
// --- Итерация 5: el = { customer: "Дима", amount: 2000, status: "cancelled" } ---
//   "pending"? → false.
//   "cancelled"? → true!
//     cancelled = 1 + 1 = 2
//   "completed"? → false.
//   Состояние: total=13000, count=2, maxAmount=8000, cancelled=2, largest="Петя"
//
// --- Итерация 6: el = { customer: "Лена", amount: 12000, status: "completed" } ---
//   "pending"? → false.
//   "cancelled"? → false.
//   "completed"? → true!
//     count = 2 + 1 = 3
//     total = 13000 + 12000 = 25000
//     12000 > 8000 (maxAmount)? → true!
//       maxAmount = 12000
//       largest = "Лена"
//   Состояние: total=25000, count=3, maxAmount=12000, cancelled=2, largest="Лена"
//
// --- Цикл закончился ---
//
// return {
//   total: 25000,
//   count: 3,
//   average: Math.round(25000 / 3 * 100) / 100 = 8333.33,
//   cancelled: 2,
//   largest: "Лена"
// }
//
// === Ключевые паттерны в этом задании ===
//
// 1. АККУМУЛЯТОР (total += el.amount):
//    Переменная которая копит значения в цикле.
//    Начинаем с 0, каждую итерацию прибавляем.
//    Используется для: сумм, подсчёта, конкатенации строк.
//
// 2. ПОИСК МАКСИМУМА (if el.amount > maxAmount):
//    Храним текущий рекорд. Каждый элемент сравниваем с рекордом.
//    Если больше — обновляем рекорд. В конце рекорд = максимум.
//
// 3. CONTINUE для пропуска (pending):
//    Ненужные элементы отсекаем сразу, чтобы не засорять код.
//
// 4. ОТДЕЛЬНЫЕ if (не if/else if):
//    Здесь можно было бы использовать if/else if (статус взаимоисключающий).
//    Но отдельные if тоже работают — просто лишние проверки для уже найденного статуса.
//
// Для чего:      Аналитика заказов — реальная задача бэкенда интернет-магазина.
//                Считать выручку, средний чек, найти лучшего клиента — ежедневная работа.
// Главное понять: Аккумулятор (total += ...) и поиск максимума (if > max) —
//                два базовых паттерна которые встречаются постоянно.
