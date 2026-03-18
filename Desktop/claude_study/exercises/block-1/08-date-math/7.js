// ========== Задание Date и Math #7 — Арифметика с датами ==========
// Уровень: 🟡
//
// 1. Вычисли разницу в днях между 1 января 2024 и 31 декабря 2024.
//
// 2. Напиши функцию `addDays(date, days)`:
//    - Возвращает НОВУЮ дату (не мутирует оригинал)
//    - Поддерживает отрицательные значения (вычитание дней)
//
// 3. Напиши функцию `daysUntil(targetDate)`:
//    - Возвращает количество дней до указанной даты
//    - Если дата прошла — возвращает отрицательное число
//
// Тесты:
// const start = new Date(2024, 0, 1);
// const end = new Date(2024, 11, 31);
// const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
// console.log(diffDays); // 365
//
// const today = new Date(2024, 2, 15);
// const nextWeek = addDays(today, 7);
// console.log(nextWeek.getDate()); // 22
// console.log(today.getDate());    // 15 (не изменилось!)
//
// const yesterday = addDays(today, -1);
// console.log(yesterday.getDate()); // 14
//
// 📖 Раздел учебника: "Арифметика с датами" → notes/js-advanced/08-date-math.md
// ================================================

// Пиши код ниже:
