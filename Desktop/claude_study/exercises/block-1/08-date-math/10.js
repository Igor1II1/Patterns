// ========== Задание Date и Math #10 — КОМПЛЕКСНАЯ ЗАДАЧА: Утилиты ==========
// Уровень: 🔴
//
// Создай два объекта-утилиты, используя ВСЕ концепции:
//
// 1. Объект `Random`:
//    - `float(min, max)` — случайное дробное [min, max)
//    - `int(min, max)` — случайное целое [min, max]
//    - `pick(array)` — случайный элемент массива
//    - `bool()` — случайный true/false
//    - `shuffle(array)` — перемешать массив (Fisher-Yates)
//      Алгоритм: от конца к началу, swap текущий с случайным до текущего
//
// 2. Объект `DateUtils`:
//    - `format(date)` — "ДД.ММ.ГГГГ"
//    - `formatTime(date)` — "ЧЧ:ММ"
//    - `addDays(date, n)` — новая дата + n дней
//    - `diffDays(date1, date2)` — разница в днях (абсолютное значение)
//    - `isWeekend(date)` — true если суббота или воскресенье
//    - `daysInMonth(year, month)` — количество дней в месяце
//      Подсказка: new Date(year, month + 1, 0).getDate()
//
// Тесты:
// console.log(Random.int(1, 100));      // случайное 1-100
// console.log(Random.pick(["a","b","c"])); // случайный элемент
// console.log(Random.bool());           // true или false
// console.log(Random.shuffle([1,2,3,4,5])); // перемешанный массив
//
// const d = new Date(2024, 2, 15);
// console.log(DateUtils.format(d));      // "15.03.2024"
// console.log(DateUtils.formatTime(new Date(2024, 0, 1, 9, 5))); // "09:05"
// console.log(DateUtils.isWeekend(new Date(2024, 2, 16))); // true (суббота)
// console.log(DateUtils.isWeekend(new Date(2024, 2, 15))); // false (пятница)
// console.log(DateUtils.daysInMonth(2024, 1)); // 29 (февраль високосного)
// console.log(DateUtils.daysInMonth(2023, 1)); // 28
// console.log(DateUtils.diffDays(
//   new Date(2024, 0, 1),
//   new Date(2024, 0, 31)
// )); // 30
//
// 📖 Раздел учебника: ВСЕ разделы → notes/js-advanced/08-date-math.md
// ================================================

// Пиши код ниже:
