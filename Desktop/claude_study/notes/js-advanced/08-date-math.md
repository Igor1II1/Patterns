# Date, Math и Number — работа с числами и датами

> [[js-fundamentals|← Назад к оглавлению JS]]

JavaScript предоставляет три мощных встроенных инструмента для работы с числами и датами: объект `Math` со статическими математическими функциями, расширенные методы объекта `Number` и класс `Date` для работы со временем. Разберём каждый из них подробно.

---

## 1. Объект Math

`Math` — это не класс, а обычный объект со статическими свойствами и методами. Его нельзя создать через `new Math()`, он уже существует глобально.

Думайте о `Math` как о математическом калькуляторе, встроенном прямо в язык.

### Округление чисел

JavaScript предлагает четыре способа округления, каждый со своей логикой:

```js
// Math.round() — стандартное округление (к ближайшему целому)
Math.round(4.5);  // 5
Math.round(4.4);  // 4
Math.round(-4.5); // -4 (к бОльшему числу!)

// Math.floor() — "пол" — всегда вниз
Math.floor(4.9);  // 4
Math.floor(-4.1); // -5

// Math.ceil() — "потолок" — всегда вверх
Math.ceil(4.1);   // 5
Math.ceil(-4.9);  // -4

// Math.trunc() — отрезает дробную часть (к нулю)
Math.trunc(4.9);  // 4
Math.trunc(-4.9); // -4 (в отличие от floor!)
```

Аналогия: представьте этаж здания. `floor` — вы всегда спускаетесь на нижний этаж, `ceil` — поднимаетесь на верхний, `round` — идёте на ближайший, `trunc` — просто смотрите на номер этажа, игнорируя лестничный пролёт.

### Максимум и минимум

```js
Math.max(1, 5, 3, 9, 2); // 9
Math.min(1, 5, 3, 9, 2); // 1

// Трюк со spread-оператором для массивов
const prices = [299, 149, 499, 99, 399];
const cheapest = Math.min(...prices); // 99
const mostExpensive = Math.max(...prices); // 499

// Без spread это не работает:
Math.max(prices); // NaN — метод ждёт отдельные аргументы, не массив
```

### Абсолютное значение, степень, корень

```js
// Абсолютное значение (модуль числа)
Math.abs(-42);  // 42
Math.abs(42);   // 42
Math.abs(-3.7); // 3.7

// Возведение в степень
Math.pow(2, 10); // 1024
Math.pow(3, 3);  // 27
// Современная альтернатива: оператор **
2 ** 10; // 1024

// Квадратный корень
Math.sqrt(16); // 4
Math.sqrt(2);  // 1.4142135623730951
```

### Math.random() — генерация случайных чисел

`Math.random()` возвращает случайное число от 0 (включительно) до 1 (не включая 1).

```js
Math.random(); // например: 0.7392847561

// Формула для случайного числа в диапазоне [min, max)
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Случайное целое число в диапазоне [min, max] включительно
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

randomInt(1, 6);   // как бросок кубика: 1, 2, 3, 4, 5 или 6
randomInt(0, 100); // случайный процент

// Случайный элемент массива
const fruits = ['яблоко', 'банан', 'вишня'];
const randomFruit = fruits[randomInt(0, fruits.length - 1)];
```

### Математические константы

```js
Math.PI; // 3.141592653589793 — число π
Math.E;  // 2.718281828459045 — число Эйлера

// Пример: площадь круга
function circleArea(radius) {
  return Math.PI * Math.pow(radius, 2);
}
circleArea(5); // 78.53981633974483
```

---

## 2. Объект Number

`Number` в JavaScript — это и конструктор, и объект со статическими методами для работы с числами.

### Проверка значений

```js
// Number.isNaN() vs глобальный isNaN() — важная разница!
isNaN('hello');        // true — сначала конвертирует строку в число, потом проверяет
isNaN(undefined);      // true — undefined преобразуется в NaN
isNaN('123');          // false — '123' конвертируется в 123

Number.isNaN('hello'); // false — строка это не NaN, это строка!
Number.isNaN(NaN);     // true — только настоящий NaN
Number.isNaN(undefined); // false — undefined это не NaN

// Правило: всегда используйте Number.isNaN() — он точнее
const result = parseInt('abc');
Number.isNaN(result); // true — вот это правильная проверка
```

Аналогия: глобальный `isNaN` — это охранник, который сначала пытается превратить всех в числа, а потом проверяет. `Number.isNaN` — строгий охранник, который пропускает только настоящий `NaN`.

```js
// Number.isFinite() — проверка на конечное число
Number.isFinite(42);         // true
Number.isFinite(Infinity);   // false
Number.isFinite(-Infinity);  // false
Number.isFinite(NaN);        // false
Number.isFinite('42');       // false — строка, не число

// Number.isInteger() — проверка на целое число
Number.isInteger(42);    // true
Number.isInteger(42.0);  // true — 42.0 это целое число!
Number.isInteger(42.5);  // false
```

### Парсинг строк в числа

```js
// Number.parseInt() — извлекает целое число из строки
Number.parseInt('42px');     // 42 — берёт числа до первого нечислового символа
Number.parseInt('3.14rem');  // 3 — дробная часть отбрасывается
Number.parseInt('abc');      // NaN — строка не начинается с цифры
Number.parseInt('0xFF', 16); // 255 — второй аргумент: система счисления

// Number.parseFloat() — извлекает число с плавающей точкой
Number.parseFloat('3.14px'); // 3.14
Number.parseFloat('1.5em');  // 1.5
Number.parseFloat('100%');   // 100

// Практический пример: парсинг CSS-значений
const cssValue = '16px';
const pixels = Number.parseInt(cssValue); // 16
```

### Форматирование числа

```js
// .toFixed(n) — округляет до n знаков после запятой
// ВАЖНО: возвращает СТРОКУ, а не число!
const price = 19.9;
price.toFixed(2);  // '19.90' — строка!
price.toFixed(0);  // '20' — строка!

// Чтобы получить число обратно, оборачивайте в Number():
const formatted = Number(price.toFixed(2)); // 19.9

// .toString(radix) — перевод в другую систему счисления
(255).toString(16);  // 'ff' — шестнадцатеричная
(255).toString(2);   // '11111111' — двоичная
(255).toString(8);   // '377' — восьмеричная
(10).toString(10);   // '10' — десятичная (по умолчанию)

// Практический пример: генерация hex-цвета
function randomHexColor() {
  const r = randomInt(0, 255).toString(16).padStart(2, '0');
  const g = randomInt(0, 255).toString(16).padStart(2, '0');
  const b = randomInt(0, 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}
```

### Проблема точности чисел с плавающей точкой

```js
// Знаменитый баг JavaScript
0.1 + 0.2; // 0.30000000000000004, а не 0.3!

// Почему? Компьютеры хранят числа в двоичной системе.
// 0.1 в двоичной — бесконечная дробь (как 1/3 в десятичной).
// При сложении накапливается ошибка округления.

// Способ 1: сравнивать с погрешностью (epsilon)
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // true

// Способ 2: умножить на 10 и работать с целыми числами
(0.1 * 10 + 0.2 * 10) / 10; // 0.3

// Способ 3: использовать toFixed для вывода
(0.1 + 0.2).toFixed(1); // '0.3'

// Практический пример: денежные расчёты (работаем в копейках/центах)
function addPrices(price1, price2) {
  // Переводим в целые числа, складываем, переводим обратно
  return Math.round(price1 * 100 + price2 * 100) / 100;
}
addPrices(0.1, 0.2); // 0.3 — правильно!
```

---

## 3. Объект Date

`Date` — это класс для работы с датами и временем. Внутри он хранит количество миллисекунд, прошедших с 1 января 1970 года (Unix timestamp).

### Создание объекта Date

```js
// Текущая дата и время
const now = new Date();
console.log(now); // 2024-03-15T10:30:00.000Z

// Из Unix timestamp (миллисекунды с 01.01.1970)
const fromTimestamp = new Date(0);        // 1 января 1970
const specific = new Date(1705276800000); // какая-то дата

// Из строки (осторожно: формат зависит от браузера!)
const fromString = new Date('2024-01-15');
const fromISO = new Date('2024-01-15T10:30:00');

// Из отдельных компонентов: (год, месяц, день, часы, минуты, секунды)
// ВАЖНО: месяцы считаются с 0! Январь = 0, Декабрь = 11
const birthday = new Date(1995, 5, 15); // 15 июня 1995 (месяц 5 = июнь!)
const newYear = new Date(2024, 0, 1);   // 1 января 2024
```

Аналогия: `Date` похож на секундомер, который запустили 1 января 1970 года. Все даты — это просто количество миллисекунд с того момента.

### Получение компонентов даты (геттеры)

```js
const date = new Date(2024, 2, 15, 10, 30, 45); // 15 марта 2024, 10:30:45

date.getFullYear();  // 2024 — год
date.getMonth();     // 2 — МАРТ (помните: 0 = январь!)
date.getDate();      // 15 — день месяца (1-31)
date.getDay();       // пятница = 5 (0 = воскресенье, 1 = понедельник... 6 = суббота)
date.getHours();     // 10 — часы
date.getMinutes();   // 30 — минуты
date.getSeconds();   // 45 — секунды
date.getMilliseconds(); // 0 — миллисекунды

// getTime() — Unix timestamp в миллисекундах
date.getTime(); // например: 1710494445000

// Date.now() — текущий timestamp (быстрее, чем new Date().getTime())
Date.now(); // текущий момент в миллисекундах

// Проверяем день недели (пример)
const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const dayName = days[date.getDay()]; // 'Пятница'
```

### Форматирование дат

```js
const date = new Date(2024, 2, 15, 10, 30);

// Встроенные методы локализации
date.toLocaleDateString('ru-RU');
// '15.03.2024'

date.toLocaleTimeString('ru-RU');
// '10:30:00'

date.toLocaleString('ru-RU');
// '15.03.2024, 10:30:00'

// Расширенные опции форматирования
date.toLocaleDateString('ru-RU', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
});
// 'пятница, 15 марта 2024 г.'

// Ручное форматирование (если нужен точный формат)
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 потому что 0-based
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
formatDate(new Date(2024, 2, 15)); // '15.03.2024'
```

### Арифметика с датами

```js
// Разница между датами
const start = new Date(2024, 0, 1);  // 1 января 2024
const end = new Date(2024, 11, 31);  // 31 декабря 2024

const diffMs = end - start; // вычитание работает через getTime()
const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
// 365 дней

// Добавление дней к дате
function addDays(date, days) {
  const result = new Date(date); // копируем, чтобы не мутировать оригинал
  result.setDate(result.getDate() + days);
  return result;
}

const today = new Date(2024, 2, 15);
const nextWeek = addDays(today, 7);  // 22 марта 2024
const yesterday = addDays(today, -1); // 14 марта 2024
```

---

## 4. Практические примеры

### Сколько дней до дедлайна

```js
function daysUntilDeadline(deadlineDate) {
  const now = Date.now();
  const deadline = new Date(deadlineDate).getTime();
  const diffMs = deadline - now;

  if (diffMs < 0) {
    return 'Дедлайн уже прошёл!';
  }

  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Дедлайн сегодня!';
  if (days === 1) return 'Завтра последний день!';
  return `До дедлайна осталось ${days} дней`;
}

daysUntilDeadline('2024-12-31'); // 'До дедлайна осталось 291 дней'
daysUntilDeadline('2020-01-01'); // 'Дедлайн уже прошёл!'
```

### Форматирование даты для отображения

```js
function friendlyDate(date) {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays} дней назад`;

  return d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

friendlyDate(new Date()); // 'Сегодня'
friendlyDate(new Date(Date.now() - 86400000)); // 'Вчера'
```

### Утилита для случайных чисел

```js
// Все полезные функции в одном месте
const Random = {
  // Случайное число в диапазоне [min, max)
  float(min, max) {
    return Math.random() * (max - min) + min;
  },

  // Случайное целое в диапазоне [min, max] включительно
  int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Случайный элемент массива
  pick(array) {
    return array[this.int(0, array.length - 1)];
  },

  // Случайный булеан (true или false)
  bool() {
    return Math.random() < 0.5;
  }
};

Random.int(1, 100);                 // например: 42
Random.float(0, 1);                 // например: 0.7392
Random.pick(['красный', 'синий', 'зелёный']); // случайный цвет
Random.bool();                      // true или false
```

---

## Итог

### Math

| Метод | Назначение | Пример |
|-------|-----------|--------|
| `Math.round(x)` | Стандартное округление | `Math.round(4.5)` → `5` |
| `Math.floor(x)` | Округление вниз | `Math.floor(4.9)` → `4` |
| `Math.ceil(x)` | Округление вверх | `Math.ceil(4.1)` → `5` |
| `Math.trunc(x)` | Отброс дробной части | `Math.trunc(-4.9)` → `-4` |
| `Math.max(...arr)` | Максимум | `Math.max(1, 5, 3)` → `5` |
| `Math.min(...arr)` | Минимум | `Math.min(1, 5, 3)` → `1` |
| `Math.abs(x)` | Модуль числа | `Math.abs(-5)` → `5` |
| `Math.pow(x, n)` | Степень | `Math.pow(2, 8)` → `256` |
| `Math.sqrt(x)` | Корень | `Math.sqrt(9)` → `3` |
| `Math.random()` | Случайное [0, 1) | `Math.random()` → `0.731...` |

### Number

| Метод | Назначение |
|-------|-----------|
| `Number.isNaN(x)` | Строгая проверка на NaN (не конвертирует!) |
| `Number.isFinite(x)` | Проверка на конечное число |
| `Number.isInteger(x)` | Проверка на целое число |
| `Number.parseInt(str)` | Парсинг целого числа из строки |
| `Number.parseFloat(str)` | Парсинг дробного числа из строки |
| `num.toFixed(n)` | Округление до n знаков (возвращает строку!) |
| `num.toString(radix)` | Перевод в систему счисления |

### Date

```js
// Создание
const d = new Date();                    // сейчас
const d = new Date(timestamp);           // из миллисекунд
const d = new Date(2024, 0, 15);         // год, месяц(0-based!), день

// Геттеры
d.getFullYear()  // год
d.getMonth()     // месяц 0-11 (0 = январь!)
d.getDate()      // день месяца 1-31
d.getDay()       // день недели 0-6 (0 = воскресенье)
d.getTime()      // Unix timestamp в мс
Date.now()       // текущий timestamp

// Форматирование
d.toLocaleDateString('ru-RU')  // '15.01.2024'
d.toLocaleString('ru-RU')      // '15.01.2024, 10:30:00'

// Разница между датами
const diffDays = Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
```

**Ключевые моменты:**
- Месяцы в `Date` считаются с 0 (январь = 0, декабрь = 11)
- `0.1 + 0.2 !== 0.3` из-за двоичного представления чисел
- `toFixed()` возвращает строку, а не число
- `Number.isNaN()` строже глобального `isNaN()`
- `Date.now()` быстрее чем `new Date().getTime()`

---

← [[js-advanced/07-regexp|Регулярные выражения]] | [[js-advanced/09-iterators|Итераторы и генераторы]] → | [[js-fundamentals|К оглавлению]]
