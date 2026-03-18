# Регулярные выражения (RegExp)

> [[js-fundamentals|← Назад к оглавлению JS]]

Регулярные выражения — один из самых мощных инструментов работы с текстом. Они позволяют искать, проверять и заменять фрагменты строк по гибким шаблонам. В этой главе разберём синтаксис, флаги, специальные символы и практические применения.

---

## 1. Что такое регулярное выражение

Регулярное выражение (regexp, regex) — это **шаблон поиска**, описывающий, как должен выглядеть искомый текст.

Аналогия: представьте, что вы ищете книгу в библиотеке. Обычная строка — это точный заголовок ("Война и мир"). Регулярное выражение — это описание: «книга, название которой начинается с заглавной буквы, содержит слово "и" посередине, и заканчивается любым словом». Regexp описывает **форму** искомого, а не конкретное значение.

---

## 2. Синтаксис

Существуют два способа создать регулярное выражение:

```js
// Литеральный синтаксис (предпочтительный)
const re1 = /hello/;
const re2 = /hello/gi; // с флагами

// Конструктор (когда паттерн создаётся динамически)
const pattern = "hello";
const re3 = new RegExp(pattern);
const re4 = new RegExp(pattern, "gi"); // второй аргумент — флаги

// Динамический паттерн из переменной
const word = "world";
const re5 = new RegExp(`\\b${word}\\b`, "i");
```

Литеральный синтаксис `/pattern/flags` удобнее для статических паттернов. Конструктор `new RegExp()` нужен, когда паттерн формируется во время выполнения программы.

---

## 3. Флаги

Флаги изменяют поведение поиска. Их можно комбинировать.

| Флаг | Название | Описание |
|---|---|---|
| `g` | global | Найти все совпадения, а не только первое |
| `i` | ignoreCase | Регистронезависимый поиск |
| `m` | multiline | `^` и `$` применяются к каждой строке, а не ко всей строке целиком |
| `s` | dotAll | Точка `.` совпадает в том числе с `\n` |

```js
const text = "Hello WORLD, hello world";

console.log(text.match(/hello/));   // ["Hello"] — только первое
console.log(text.match(/hello/gi)); // ["Hello", "hello", "hello"] — все, без учёта регистра

const multiLine = "first\nsecond\nthird";
console.log(multiLine.match(/^\w+/gm)); // ["first", "second", "third"]
// без флага m: ["first"] — только начало всей строки
```

---

## 4. Символьные классы

Символьные классы позволяют описывать категории символов вместо конкретных букв.

### Встроенные классы

```js
// \d — любая цифра (0-9)
// \D — любой символ, кроме цифры
/\d/.test("abc3def"); // true
/\D/.test("123");     // false

// \w — буква, цифра или _ (word character: [a-zA-Z0-9_])
// \W — всё остальное
/\w+/.exec("hello_world");  // ["hello_world"]
/\W/.test("hello world");   // true (пробел — не \w)

// \s — пробельный символ (пробел, таб, \n, \r)
// \S — непробельный символ
/\s/.test("hello world"); // true
/\s/.test("helloworld");  // false

// . — любой символ, кроме \n (и \r в не-dotAll режиме)
/h.llo/.test("hello"); // true
/h.llo/.test("hllo");  // false
```

### Пользовательские классы в скобках

```js
// [abc] — один из перечисленных символов
/[aeiou]/.test("hello"); // true (есть гласные)

// [a-z] — любой символ в диапазоне
/[a-z]/.test("Hello"); // true (есть строчная 'e')
/[A-Z]/.test("hello"); // false (нет заглавных)
/[0-9]/.test("abc");   // false

// [^abc] — любой символ, КРОМЕ перечисленных (отрицание)
/[^aeiou]/.test("aeiou"); // false — только гласные, нет других
/[^aeiou]/.test("hello"); // true — есть 'h', 'l', 'l'

// Комбинирование диапазонов
/[a-zA-Z0-9]/.test("Hello123"); // true
```

---

## 5. Квантификаторы

Квантификаторы указывают, сколько раз должен повторяться предшествующий элемент.

### Основные квантификаторы

```js
// + — один и более раз
/\d+/.exec("abc 42 def"); // ["42"]
/\d+/.exec("abc def");    // null

// * — ноль и более раз
/\d*/.exec("abc"); // [""] — совпадение нулевой длины

// ? — ноль или один раз (элемент необязателен)
/colou?r/.test("color");  // true (u — ноль раз)
/colou?r/.test("colour"); // true (u — один раз)

// {n} — ровно n раз
/\d{4}/.test("2024"); // true
/\d{4}/.test("202");  // false

// {n,m} — от n до m раз
/\d{2,4}/.test("42");   // true
/\d{2,4}/.test("1234"); // true
/\d{2,4}/.test("1");    // false

// {n,} — n и более раз
/\d{3,}/.test("12345"); // true
```

### Жадные vs ленивые квантификаторы

По умолчанию квантификаторы **жадные** — захватывают как можно больше символов.
Добавление `?` делает их **ленивыми** — захватывают как можно меньше.

```js
const html = "<b>жирный</b> и <i>курсив</i>";

// Жадный: захватывает от первого < до последнего >
html.match(/<.+>/);  // ["<b>жирный</b> и <i>курсив</i>"]

// Ленивый: останавливается при первом >
html.match(/<.+?>/); // ["<b>"]
html.match(/<.+?>/g); // ["<b>", "</b>", "<i>", "</i>"]
```

---

## 6. Якоря

Якоря не совпадают с символами, а фиксируют **позицию** в строке.

```js
// ^ — начало строки (или строки при флаге m)
/^Hello/.test("Hello world"); // true
/^Hello/.test("Say Hello");   // false

// $ — конец строки
/world$/.test("Hello world"); // true
/world$/.test("world peace"); // false

// \b — граница слова (переход между \w и \W)
/\bcat\b/.test("cat");        // true
/\bcat\b/.test("category");   // false — "cat" внутри слова
/\bcat\b/.test("the cat sat"); // true

// Комбинирование якорей
/^\d{5}$/.test("12345");  // true — строка состоит ровно из 5 цифр
/^\d{5}$/.test("123456"); // false
/^\d{5}$/.test("1234a");  // false
```

---

## 7. Группы

Скобки группируют части паттерна и позволяют извлекать найденные фрагменты.

```js
// () — захватывающая группа (capturing group)
const dateStr = "2024-03-15";
const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
// match[0] — полное совпадение: "2024-03-15"
// match[1] — группа 1: "2024"
// match[2] — группа 2: "03"
// match[3] — группа 3: "15"

// (?:) — незахватывающая группа (non-capturing group)
// группирует, но не сохраняет результат
const re = /(?:Mr|Ms|Dr)\. (\w+)/;
const m = re.exec("Dr. Smith");
// m[0] = "Dr. Smith"
// m[1] = "Smith" (только имя, обращение не захвачено)

// (?<name>) — именованная группа (named capturing group)
const dateRe = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const result = "2024-03-15".match(dateRe);
console.log(result.groups.year);  // "2024"
console.log(result.groups.month); // "03"
console.log(result.groups.day);   // "15"
```

---

## 8. Методы

### Методы RegExp

```js
const re = /\d+/g;
const str = "Мне 25 лет, а брату 18";

// .test(str) — возвращает true/false
/^\d+$/.test("12345"); // true
/^\d+$/.test("123ab"); // false

// .exec(str) — возвращает первое совпадение (объект) или null
// При флаге g — каждый вызов возвращает следующее совпадение
let m;
const reG = /\d+/g;
while ((m = reG.exec(str)) !== null) {
  console.log(`Найдено: ${m[0]} на позиции ${m.index}`);
}
// "Найдено: 25 на позиции 3"
// "Найдено: 18 на позиции 15"
```

### Методы String

```js
const text = "JavaScript — лучший язык, а javascript — весёлый язык";

// .match(re) — без флага g: как exec (объект с группами)
//              с флагом g: массив всех совпадений (без групп)
text.match(/javascript/i);  // ["JavaScript", index: 0, ...]
text.match(/javascript/gi); // ["JavaScript", "javascript"]

// .matchAll(re) — итератор всех совпадений с группами (требует флаг g)
const re2 = /(\w+) язык/gi;
for (const match of text.matchAll(re2)) {
  console.log(match[0], "→", match[1]);
}
// "лучший язык → лучший"
// "весёлый язык → весёлый"

// .search(re) — возвращает индекс первого совпадения или -1
text.search(/лучший/); // 18 (или другое число)
text.search(/плохой/); // -1

// .split(re) — разбить строку по паттерну
"one1two2three3four".split(/\d/); // ["one","two","three","four"]
"a,b;  c|d".split(/[,;|]\s*/);   // ["a","b","c","d"]

// .replace(re, replacement) — замена строкой
text.replace(/язык/gi, "language");

// .replace(re, function) — замена функцией
"hello world".replace(/\b\w/g, (char) => char.toUpperCase());
// "Hello World"
```

---

## 9. Практические примеры

### Валидация email

```js
function isValidEmail(email) {
  // Упрощённая, но рабочая валидация:
  // - локальная часть: буквы, цифры, точки, дефисы, подчёркивания
  // - символ @
  // - домен: буквы, цифры, дефисы
  // - точка
  // - доменная зона: 2-6 букв
  const emailRe = /^[\w.-]+@[\w-]+\.[a-zA-Z]{2,6}$/;
  return emailRe.test(email);
}

console.log(isValidEmail("user@example.com"));    // true
console.log(isValidEmail("user.name@mail.ru"));   // true
console.log(isValidEmail("invalid-email"));        // false
console.log(isValidEmail("missing@domain"));       // false
console.log(isValidEmail("@nodomain.com"));        // false
```

### Валидация телефона

```js
function isValidPhone(phone) {
  // Формат: +7 (900) 123-45-67 или 8-900-123-45-67 и т.п.
  const phoneRe = /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
  return phoneRe.test(phone);
}

console.log(isValidPhone("+7 (900) 123-45-67")); // true
console.log(isValidPhone("8-900-123-45-67"));    // true
console.log(isValidPhone("89001234567"));         // true
console.log(isValidPhone("123-456"));             // false
```

### Извлечение данных из строки

```js
// Извлечь все ссылки из текста
const article = `
  Читайте на https://developer.mozilla.org/ru/
  и https://javascript.info/regexp-introduction
`;

const urlRe = /https?:\/\/[^\s]+/g;
const urls = article.match(urlRe);
console.log(urls);
// ["https://developer.mozilla.org/ru/", "https://javascript.info/regexp-introduction"]

// Разбор строки лога
const logLine = "[2024-03-15 14:30:22] ERROR: Connection timeout (attempt 3)";
const logRe = /\[(?<date>[\d-]+) (?<time>[\d:]+)\] (?<level>\w+): (?<message>.+)/;
const logMatch = logLine.match(logRe);

if (logMatch) {
  const { date, time, level, message } = logMatch.groups;
  console.log(`Дата: ${date}`);      // "2024-03-15"
  console.log(`Время: ${time}`);     // "14:30:22"
  console.log(`Уровень: ${level}`);  // "ERROR"
  console.log(`Сообщение: ${message}`); // "Connection timeout (attempt 3)"
}
```

### Замена в тексте

```js
// Форматирование числа: добавить пробелы-разделители тысяч
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

console.log(formatNumber(1234567));   // "1 234 567"
console.log(formatNumber(9876543210)); // "9 876 543 210"

// Конвертация camelCase в kebab-case
function camelToKebab(str) {
  return str.replace(/([a-z])([A-Z])/g, (_, lower, upper) => {
    return `${lower}-${upper.toLowerCase()}`;
  });
}

console.log(camelToKebab("backgroundColor")); // "background-color"
console.log(camelToKebab("borderTopWidth"));  // "border-top-width"
console.log(camelToKebab("fontSize"));        // "font-size"

// Маскировка чувствительных данных
function maskEmail(email) {
  return email.replace(/(?<=.).(?=[^@]*@)/g, "*");
}

console.log(maskEmail("user@example.com"));    // "u***@example.com"
console.log(maskEmail("alice@mail.ru"));       // "a****@mail.ru"
```

---

## Итог

### Шпаргалка по символам

```
Символьные классы:
  \d  — цифра          \D  — не цифра
  \w  — слово [a-zA-Z0-9_]   \W  — не слово
  \s  — пробел         \S  — не пробел
  .   — любой кроме \n

Пользовательские классы:
  [abc]   — один из: a, b, c
  [a-z]   — диапазон
  [^abc]  — не a, не b, не c

Квантификаторы (жадные):
  +     — 1 и более
  *     — 0 и более
  ?     — 0 или 1
  {n}   — ровно n
  {n,m} — от n до m

Ленивые (добавить ?):
  +? *? ??

Якоря:
  ^   — начало строки
  $   — конец строки
  \b  — граница слова

Группы:
  (...)        — захватывающая группа
  (?:...)      — незахватывающая группа
  (?<name>...) — именованная группа

Флаги: g, i, m, s
```

### Ключевые методы

```js
// RegExp
/pattern/.test(str)        // boolean
/pattern/.exec(str)        // объект совпадения или null

// String
str.match(/re/)            // совпадение (без g) или массив (с g)
str.matchAll(/re/g)        // итератор всех совпадений с группами
str.search(/re/)           // индекс первого совпадения или -1
str.replace(/re/, val)     // замена строкой или функцией
str.split(/re/)            // разбивка по паттерну
```

---

← [[js-advanced/06-map-set|Map и Set]] | [[js-advanced/08-date-math|Date и Math]] → | [[js-fundamentals|К оглавлению]]
