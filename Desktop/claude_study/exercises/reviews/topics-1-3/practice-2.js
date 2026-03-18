// ========== Практикум R1.2 -- Темы 1+2+3 ==========
// Напиши функцию applyDefaults(users, defaults) которая проходит по массиву
// пользователей и для каждого заполняет недостающие поля значениями по умолчанию.
// Возвращает новый массив с заполненными объектами.
//
// ВАЖНО: volume = 0 и darkMode = false — это ВАЛИДНЫЕ значения, не "пусто"!
// Используй ?? (не ||) для проверки null/undefined.
//
// Используй:
//   - for...of для перебора массива пользователей (тема 3)
//   - ?? для проверки null/undefined (тема 1)
//   - push для сборки результата
//
// const defaults = { volume: 50, darkMode: true, language: "ru" };
//
// const users = [
//   { name: "Игорь", volume: 0, language: "en" },
//   { name: "Анна", darkMode: false },
//   { name: "Петя" },
// ];
//
// applyDefaults(users, defaults)
// → [
//   { name: "Игорь", volume: 0, darkMode: true, language: "en" },
//   { name: "Анна", volume: 50, darkMode: false, language: "ru" },
//   { name: "Петя", volume: 50, darkMode: true, language: "ru" },
// ]
//
// Забегая вперёд — объекты (глава 7):
// obj.key            // доступ к полю
// obj.key ?? дефолт  // если поле undefined/null — взять дефолт
//
// Раздел учебника: "for...of" (js/03-loops.md) + "??" (js/01-variables.md)

const defaults = { volume: 50, darkMode: true, language: "ru" };
const users = [
  { name: "Игорь", volume: 0, language: "en" },
  { name: "Анна", darkMode: false },
  { name: "Петя" },
];

function applyDefaults(users, defaults){
    const result =[];
    for(const el of users){
        result.push({
            name: el.name,
            volume: el.volume ?? defaults.volume,
            darkMode: el.darkMode ?? defaults.darkMode,
            language: el.language ?? defaults.language,
        });
    }
    return result;
}


console.log(applyDefaults(users, defaults))

// ========== Разбор задания ==========
//
// Что делали:    Функция проходит по массиву пользователей и заполняет
//                недостающие поля (volume, darkMode, language) значениями по умолчанию.
//
// === Пошаговый разбор кода ===
//
// 1. const result = [];
//    Создаём пустой массив — сюда будем складывать новых пользователей.
//
// 2. for (const el of users)
//    Перебираем массив users. el — это ОДИН объект-пользователь за итерацию.
//    Одна итерация = один элемент массива (один объект = один пользователь).
//    Итерация 1: el = { name: "Игорь", volume: 0, language: "en" }
//    Итерация 2: el = { name: "Анна", darkMode: false }
//    Итерация 3: el = { name: "Петя" }
//
// 3. result.push({ ... })
//    push() ДОБАВЛЯЕТ новый объект в конец массива result.
//    Внутри push() мы создаём НОВЫЙ объект с помощью { }.
//
// 4. el.volume ?? defaults.volume
//    ?? (nullish coalescing) — "если слева null или undefined, бери справа"
//
//    Почему ?? а не ||:
//    ||  считает 0 и false "пустыми" → заменит их на дефолт (НЕПРАВИЛЬНО)
//    ??  считает "пустым" только null и undefined → 0 и false сохраняются (ПРАВИЛЬНО)
//
//    Пример для Игоря (volume: 0):
//      el.volume ?? defaults.volume
//      0 ?? 50
//      0 — это НЕ null и НЕ undefined → результат = 0 (сохранили!)
//
//      Если бы использовали ||:
//      0 || 50  → 50 (ЗАТЁРЛИ бы настоящее значение 0!)
//
//    Пример для Пети (volume не задан):
//      el.volume ?? defaults.volume
//      undefined ?? 50
//      undefined — это null/undefined → результат = 50 (взяли дефолт)
//
// === Полная трассировка ===
//
// Итерация 1: el = { name: "Игорь", volume: 0, language: "en" }
//   name:     el.name = "Игорь"
//   volume:   0 ?? 50 = 0         (0 — валидное значение, сохраняем)
//   darkMode: undefined ?? true = true  (нет поля → берём дефолт)
//   language: "en" ?? "ru" = "en" (есть своё значение)
//   push → { name: "Игорь", volume: 0, darkMode: true, language: "en" }
//
// Итерация 2: el = { name: "Анна", darkMode: false }
//   name:     "Анна"
//   volume:   undefined ?? 50 = 50       (нет поля → дефолт)
//   darkMode: false ?? true = false      (false — валидное, сохраняем!)
//   language: undefined ?? "ru" = "ru"   (нет поля → дефолт)
//   push → { name: "Анна", volume: 50, darkMode: false, language: "ru" }
//
// Итерация 3: el = { name: "Петя" }
//   Все поля кроме name отсутствуют → все берут дефолты.
//   push → { name: "Петя", volume: 50, darkMode: true, language: "ru" }
//
// Для чего:      Настройки пользователя — частая задача. Пользователь указывает
//                только то что хочет поменять, остальное заполняется дефолтами.
//                ?? незаменим когда 0 и false — валидные значения (громкость 0, тёмная тема выкл).
// Главное понять: ?? проверяет ТОЛЬКО null/undefined, || проверяет ВСЕ falsy (0, false, "").
