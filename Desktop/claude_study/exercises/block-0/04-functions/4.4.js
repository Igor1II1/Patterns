// ============================================
// Задание 4.4 — return и ранний return (guard clause)
// Уровень: 🟢 Базовый
// ============================================
//
// 📖 Раздел учебника: "return", "Ранний return" (04-functions.md)
//
// --- Описание ---
// return прерывает выполнение функции и отдаёт значение.
// "Ранний return" (guard clause) — проверяем плохие случаи в начале
// и выходим, чтобы основной код не был вложен в if.
//
// --- Что нужно сделать ---
//
// 1. Перепиши функцию processOrder БЕЗ вложенных if (через ранний return):
//
// // ПЛОХО — много вложенности:
// function processOrder(order) {
//   if (order) {
//     if (order.items.length > 0) {
//       if (order.paid) {
//         return "Заказ обработан: " + order.items.length + " товаров";
//       } else {
//         return "Ошибка: заказ не оплачен";
//       }
//     } else {
//       return "Ошибка: корзина пуста";
//     }
//   } else {
//     return "Ошибка: нет заказа";
//   }
// }
//
// // ХОРОШО — через guard clauses:
// function processOrder(order) {
//   if (!order) return "Ошибка: нет заказа";
//   // ... дальше без вложенности
// }
//
// 2. Напиши функцию getGrade(score) с ранним return:
//    - если score не число → "Ошибка: нужно число"
//    - если score < 0 или score > 100 → "Ошибка: от 0 до 100"
//    - 90-100 → "A"
//    - 80-89 → "B"
//    - 70-79 → "C"
//    - 60-69 → "D"
//    - ниже 60 → "F"
//
// --- Тесты ---
// processOrder(null)                          → "Ошибка: нет заказа"
// processOrder({ items: [], paid: true })     → "Ошибка: корзина пуста"
// processOrder({ items: [1,2], paid: false }) → "Ошибка: заказ не оплачен"
// processOrder({ items: [1,2], paid: true })  → "Заказ обработан: 2 товаров"
//
// getGrade(95)    → "A"
// getGrade(72)    → "C"
// getGrade(-5)    → "Ошибка: от 0 до 100"
// getGrade("abc") → "Ошибка: нужно число"
//
// --- Ключевая концепция ---
// Guard clause = проверь плохое → выйди рано → основной код без вложенности

function processOrder(order) {
  if (!order) {
    return "Ошибка: нет заказа";
  }
  if (order.items.length === 0) {
    return "Ошибка: корзина пуста";
  }
  if (!order.paid) {
    return "Ошибка: заказ не оплачен";
  } else {
    return "Заказ обработан: " + order.items.length + " товаров";
  }
}

// --- Тесты ---
console.log(processOrder(null)); // → "Ошибка: нет заказа"
console.log(processOrder({ items: [], paid: true })); //→ "Ошибка: корзина пуста"
console.log(processOrder({ items: [1, 2], paid: false })); //→ "Ошибка: заказ не оплачен"
console.log(processOrder({ items: [1, 2], paid: true })); //→ "Заказ обработан: 2 товаров

function getGrade(score) {
  if (typeof score!=="number") {
    return "Ошибка: нужно число";
  }
  if (score < 0 || score > 100) {
    return "Ошибка: от 0 до 100";
  }

  if (score >= 90) {
    return "A";
  }
  if (score >= 80) {
    return "B";
  }

  if (score >= 70) {
    return "C";
  }
  if (score >= 60) {
    return "D";
  } else{
    return "F"
  }
}



 console.log(getGrade(95))   // → "A"
 console.log(getGrade(72))    //→ "C"
 console.log(getGrade(-5))   // → "Ошибка: от 0 до 100"
 console.log(getGrade("abc")) //→ "Ошибка: нужно число"


// ========== РАЗБОР ЗАДАНИЯ ==========
//
// --- Что делали ---
// Две функции с ранним return (guard clause):
// processOrder — переписали вложенные if в плоские проверки.
// getGrade — оценка по баллам с проверкой типа и диапазона.
//
// --- Пошаговый разбор ---
//
// processOrder({ items: [1,2], paid: true }):
// Шаг 1: !order → !{...} → false → пропускаем (заказ есть)
// Шаг 2: order.items.length === 0 → 2 === 0 → false → пропускаем (корзина не пуста)
// Шаг 3: !order.paid → !true → false → пропускаем (оплачен)
// Шаг 4: return "Заказ обработан: 2 товаров"
//
// getGrade("abc"):
// Шаг 1: typeof "abc" !== "number" → "string" !== "number" → true → return ошибку
// Функция завершилась на первой проверке — до оценок не дошла.
//
// getGrade(72):
// Шаг 1: typeof 72 !== "number" → false → пропускаем
// Шаг 2: 72 < 0 || 72 > 100 → false → пропускаем
// Шаг 3: 72 >= 90 → false → пропускаем
// Шаг 4: 72 >= 80 → false → пропускаем
// Шаг 5: 72 >= 70 → true → return "C"
//
// --- Ошибки при решении ---
// Ошибка: if (!score) для проверки типа
// Почему неправильно: !score проверяет falsy, а "abc" — truthy, проскочит
// Как правильно: typeof score !== "number" — проверяет именно тип
// Как мыслить: "это число?" → typeof. "это пустое?" → falsy-проверка.
//
// --- Что должен был усвоить ---
// 1. Guard clause: проверяй плохие случаи в начале, выходи рано
// 2. Код читается сверху вниз без вложенности — проще понять
// 3. typeof для проверки типа, ! для проверки falsy — разные вещи
// 4. Порядок if важен: >= 90 перед >= 80 (иначе 95 попадёт в "B")
//
// --- Для чего в реальной разработке ---
// Guard clause — стандартный паттерн в любом проекте.
// Валидация входных данных (API, формы) всегда начинается с проверок.