// ========== Практикум R1.3 -- Темы 1+2+3 ==========
// Напиши функцию gradeStudents(students) которая проходит по массиву студентов,
// пропускает невалидных (continue), и возвращает массив с оценками.
//
// Правила оценки:
//   90-100 → "A"
//   80-89  → "B"
//   70-79  → "C"
//   60-69  → "D"
//   0-59   → "F"
//
// Пропускать если:
//   - score не число (typeof !== "number")
//   - score — NaN (Number.isNaN)
//   - score < 0 или score > 100
//
// Используй:
//   - for...of для перебора (тема 3)
//   - continue для пропуска невалидных (тема 3)
//   - typeof для проверки типа (тема 1)
//   - if/else if для определения оценки (тема 2)
//   - push для сборки результата
//
// const students = [
//   { name: "Игорь", score: 85 },
//   { name: "Анна", score: "отлично" },
//   { name: "Петя", score: 45 },
//   { name: "Маша", score: 92 },
//   { name: "Дима", score: -10 },
//   { name: "Лена", score: 70 },
// ];
//
// gradeStudents(students)
// → [
//   { name: "Игорь", score: 85, grade: "B" },
//   { name: "Петя", score: 45, grade: "F" },
//   { name: "Маша", score: 92, grade: "A" },
//   { name: "Лена", score: 70, grade: "C" },
// ]
//
// (Анна и Дима пропущены — невалидные)
//
// Забегая вперёд — массивы (глава 6):
// result.push({ name: s.name, score: s.score, grade: "A" });
//
// Раздел учебника: "for...of" + "break и continue" (js/03-loops.md)
//                  + "typeof" (js/01-variables.md) + "if/else if" (js/02-conditions.md)

const students = [
  { name: "Игорь", score: 85 },
  { name: "Анна", score: "отлично" },
  { name: "Петя", score: 45 },
  { name: "Маша", score: 92 },
  { name: "Дима", score: -10 },
  { name: "Лена", score: 70 },
];

function gradeStudents(students) {
  const result = [];
  for (const el of students) {
    if (typeof el.score !== "number") {
      continue;
    }
    if (Number.isNaN(el.score)) {
      continue;
    }
    if (el.score < 0 || el.score > 100) {
      continue;
    }
    let grade;
    if(el.score>=90){
        grade="A"
    }else if( el.score>=80){
        grade="B"
    }else if(  el.score>=70){
        grade="C"
    }else if( el.score>=60){
        grade = "D"
    }else{
        grade ="F"
    }
    result.push({name:el.name,score:el.score, grade:grade});
  }
   return result;
}

console.log(gradeStudents(students));

// ========== Разбор задания ==========
//
// Что делали:    Функция проходит по массиву студентов, отсеивает невалидных
//                через continue, определяет буквенную оценку, собирает результат.
//
// === Пошаговый разбор кода ===
//
// 1. const result = [];
//    Пустой массив для сбора результатов.
//
// 2. for (const el of students)
//    Перебираем массив. el — один объект-студент за итерацию.
//
// 3. ТРИ ОТДЕЛЬНЫХ if + continue — фильтры невалидных данных:
//
//    if (typeof el.score !== "number") continue;
//    → Если score не число (например "отлично") — пропускаем.
//    → typeof "отлично" === "string", "string" !== "number" → true → continue
//
//    if (Number.isNaN(el.score)) continue;
//    → typeof NaN === "number" (ловушка JS!), поэтому typeof его НЕ поймает.
//    → Number.isNaN — единственный способ поймать NaN.
//    → Две проверки работают в паре: typeof ловит строки, Number.isNaN ловит NaN.
//
//    if (el.score < 0 || el.score > 100) continue;
//    → Если вне диапазона — пропускаем.
//    → || (ИЛИ): число может быть ИЛИ < 0, ИЛИ > 100 (не оба сразу!).
//    → && тут НЕЛЬЗЯ: число не может быть одновременно < 0 И > 100.
//
//    Почему ОТДЕЛЬНЫЕ if, а не if/else if:
//    Каждый фильтр проверяет СВОЁ условие независимо. Может сработать любой.
//    Отдельные if = "проверяем всё по очереди, каждый сам по себе".
//
// 4. let grade; + if/else if — определяем оценку:
//
//    if (el.score >= 90)      → grade = "A"
//    else if (el.score >= 80) → grade = "B"   (уже знаем что < 90)
//    else if (el.score >= 70) → grade = "C"   (уже знаем что < 80)
//    else if (el.score >= 60) → grade = "D"   (уже знаем что < 70)
//    else                     → grade = "F"   (всё что < 60)
//
//    Почему if/else if, а не отдельные if:
//    Оценка может быть ТОЛЬКО ОДНА (A или B или C...). Взаимоисключающие варианты.
//    if/else if = "найди ОДИН подходящий и остановись".
//
// 5. result.push({name: el.name, score: el.score, grade: grade})
//    Создаём НОВЫЙ объект из 3 частей:
//    - el.name    → берём из старого объекта
//    - el.score   → берём из старого объекта
//    - grade      → берём из переменной (определили выше)
//    push() добавляет этот объект в массив result.
//
// === Полная трассировка ===
//
// Итерация 1: el = { name: "Игорь", score: 85 }
//   typeof 85 !== "number"? → false → идём дальше
//   Number.isNaN(85)?       → false → идём дальше
//   85 < 0 || 85 > 100?    → false → идём дальше
//   85 >= 90? нет → 85 >= 80? ДА → grade = "B"
//   push → { name: "Игорь", score: 85, grade: "B" }
//
// Итерация 2: el = { name: "Анна", score: "отлично" }
//   typeof "отлично" !== "number"? → "string" !== "number" → true → continue!
//   (пропущена, не попадает в result)
//
// Итерация 5: el = { name: "Дима", score: -10 }
//   typeof -10 !== "number"? → false → идём дальше
//   Number.isNaN(-10)?       → false → идём дальше
//   -10 < 0 || -10 > 100?   → true (< 0!) → continue!
//   (пропущен, невалидный диапазон)
//
// Для чего:      Валидация + классификация — очень частая задача.
//                Пример: проверить входные данные формы, потом рассортировать.
// Главное понять: Отдельные if = независимые фильтры (может сработать любой).
//                if/else if = один результат из нескольких (взаимоисключающие).
