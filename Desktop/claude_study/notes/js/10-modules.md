# Модули — import/export

> [[js-fundamentals|← Назад к оглавлению JS]]
> Задания главы: `exercises/block-0/10-modules/script.js`

---

## Зачем эта тема существует?

В ранние годы JavaScript программы были маленькими — один скрипт на 50 строк. Все переменные и функции жили в одном глобальном пространстве. Когда приложения выросли до тысяч строк, начался хаос: конфликты имён, невозможность понять что от чего зависит, один файл на 3000 строк который никто не может прочитать.

Модули решают эту проблему: каждый файл — отдельная единица с чётким входом (import) и выходом (export). Переменные внутри файла изолированы — они не видны снаружи, если ты их явно не экспортировал.

```
Без модулей:                    С модулями:
app.js (2000 строк)             utils/math.js    (30 строк)
  — всё в одном месте            utils/string.js  (40 строк)
  — переменные конфликтуют       components/User.js (50 строк)
  — невозможно переиспользовать  api/fetch.js     (60 строк)
                                 main.js          (20 строк)
```

---

## Модульная система: основы

### Что это такое

Модуль — это обычный JS-файл, который может **экспортировать** (отдавать наружу) свои функции, классы, переменные и **импортировать** (брать) чужие.

**Аналогия:** модуль — как отдел в компании. У каждого отдела своя зона ответственности (файл), свои внутренние дела (локальные переменные), и публичный интерфейс (export) — то, что другие отделы могут использовать.

### Ключевые свойства модулей

1. **Изоляция** — переменные внутри модуля не видны снаружи (если не экспортированы)
2. **Явные зависимости** — `import` сразу показывает что откуда берётся
3. **Однократное выполнение** — код модуля выполняется один раз при первом импорте, дальше используется кэш
4. **Строгий режим** — модули всегда работают в `"use strict"` автоматически

```js
// counter.js
let count = 0; // эта переменная НЕ видна снаружи

export function increment() {
  count++;
  return count;
}
```

```js
// main.js
import { increment } from "./counter.js";

increment(); // 1
increment(); // 2

// console.log(count); // ReferenceError — count не виден снаружи
```

> **Механика: что происходит при загрузке модулей**
> 1. JS встречает `import { increment } from "./counter.js"` в `main.js`
> 2. **До выполнения кода** JS анализирует все `import`/`export` и строит граф зависимостей
> 3. Загружает `counter.js`, выполняет его код один раз (создаёт `count = 0`, функцию `increment`)
> 4. Создаёт "связь" (binding): имя `increment` в `main.js` указывает на ту же функцию из `counter.js`
> 5. При повторном `import` из другого файла — `counter.js` НЕ выполняется заново (используется кэш)
> ```
> main.js:   import { increment } ──┐
>                                    ├──► counter.js выполняется ОДИН раз
> other.js:  import { increment } ──┘    count = 0, function increment() {}
> ```

> **Механика: почему импорты — "живые связи", а не копии**
> Именованный импорт создаёт не копию значения, а **ссылку на оригинал** в модуле-источнике.
> Если значение в модуле изменится — все импортёры увидят новое значение.
> ```js
> // counter.js
> export let count = 0;              // экспортируем переменную
> export function increment() { count++; }
>
> // main.js
> import { count, increment } from "./counter.js";
> console.log(count); // 0
> increment();        // меняет count ВНУТРИ counter.js
> console.log(count); // 1 ← мы видим изменение!
> ```
> Это работает потому, что `import { count }` — не `const count = 0`, а "окно"
> в модуль `counter.js`, которое всегда показывает текущее значение.
> **Важно:** присвоить `count = 5` из `main.js` нельзя — импорт доступен только для чтения.

---

## export — что отдаём наружу

### Именованный экспорт (Named export)

Экспортирует значения **по имени**. Из одного файла можно экспортировать сколько угодно именованных значений.

**Вариант 1: `export` перед объявлением**

```js
// math.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export class Calculator {
  constructor() {
    this.history = [];
  }
}
```

**Вариант 2: `export` в конце файла (все экспорты в одном месте)**

```js
// math.js
const PI = 3.14159;

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

export { PI, add, multiply };
```

Оба варианта полностью эквивалентны. Второй удобен тем, что все экспорты видны в одном месте — в конце файла.

### Дефолтный экспорт (Default export)

Один **главный** экспорт из файла. Используется когда файл содержит одну главную сущность (один класс, одну функцию).

```js
// User.js
export default class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Привет, я ${this.name}`;
  }
}
```

```js
// formatDate.js
export default function formatDate(date) {
  return date.toLocaleDateString("ru-RU");
}
```

> ⚠️ **Важно:** в одном файле может быть **только один** `export default`. Именованных экспортов — сколько угодно.

### Именованный + дефолтный в одном файле

Можно совмещать — дефолтный для главной сущности, именованные для вспомогательных:

```js
// user.js
export default class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

export function validateUser(user) {
  if (!user.name) return "Имя обязательно";
  if (!user.email.includes("@")) return "Невалидный email";
  return null; // null = ошибок нет
}
```

### Плохой пример → Хороший пример

```js
// ❌ Плохо: default export объекта со всем подряд
export default {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  PI: 3.14159,
};
// Проблема: нельзя импортировать отдельные части,
// IDE не может подсказать содержимое,
// tree-shaking (удаление неиспользуемого кода) не работает

// ✅ Хорошо: именованные экспорты для утилит
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export const PI = 3.14159;
// Можно импортировать только нужное: import { add } from "./math.js"
```

> ❌ **Частые заблуждения:**
> - "`export default` лучше именованного" — не всегда. Для файла с одной главной сущностью (класс, компонент) — да. Для файла с несколькими утилитами — используй именованный экспорт.
> - "Можно сделать несколько `export default`" — нет. Будет ошибка. Только один default на файл.

---

## import — что берём из других модулей

### Именованный импорт

Имя в фигурных скобках должно **точно совпадать** с именем экспорта:

```js
import { add, multiply } from "./math.js";

add(2, 3);       // 5
multiply(4, 5);  // 20
```

### Импорт с переименованием (as)

Если имя конфликтует или неудобно — переименуй через `as`:

```js
import { add as sum, multiply as mult } from "./math.js";

sum(2, 3);    // 5
mult(4, 5);   // 20
```

### Импорт всего модуля как объект (*)

```js
import * as math from "./math.js";

math.add(2, 3);       // 5
math.multiply(4, 5);  // 20
math.PI;              // 3.14159
```

### Дефолтный импорт

Имя выбираешь **сам** — оно не обязано совпадать с именем в файле-источнике:

```js
import User from "./User.js";        // имя User — твой выбор
import MyUser from "./User.js";      // можно и так — это тот же класс
import formatDate from "./formatDate.js";
```

### Смешанный импорт (default + именованные)

```js
// user.js экспортирует: default class User + named function validateUser

import User, { validateUser } from "./user.js";
//     ^          ^
//     default    именованный
```

> **Механика: чем named и default export отличаются внутри**
> Именованный и дефолтный экспорт — это разные "слоты" в модуле:
> ```
> math.js внутри хранит таблицу экспортов:
> ┌─────────────┬──────────────────┐
> │ Имя слота   │ Значение         │
> ├─────────────┼──────────────────┤
> │ "add"       │ function add()   │  ← именованный: ключ = имя функции
> │ "PI"        │ 3.14159          │  ← именованный: ключ = имя константы
> │ "default"   │ class Calculator │  ← дефолтный: ключ ВСЕГДА "default"
> └─────────────┴──────────────────┘
> ```
> - `import { add }` — ищет слот с ключом `"add"` (имя должно совпасть)
> - `import Calc` — ищет слот `"default"` (имя `Calc` выбираешь сам, потому что ключ всегда один)
> - Именованных слотов — сколько угодно. Слот `"default"` — только один.

> 🔍 **Мини-проверка:** найди ошибку в коде.
> ```js
> // math.js
> export function add(a, b) { return a + b; }
> export function subtract(a, b) { return a - b; }
>
> // main.js
> import { sum, subtract } from "./math.js";
> console.log(sum(2, 3));
> ```
> <details><summary>Ответ</summary>
>
> Ошибка: `sum` не экспортируется из `math.js`. Экспортируется `add`. Именованный импорт требует точного совпадения имён. Правильно: `import { add, subtract } from "./math.js"` или `import { add as sum } from "./math.js"`.
> </details>

---

## Пути при импорте

### Относительные пути (от текущего файла)

```js
import { fn } from "./utils.js";       // файл в той же папке
import { fn } from "../utils.js";      // файл на уровень выше
import { fn } from "../lib/utils.js";  // файл в другой папке на уровне выше
import { fn } from "./sub/utils.js";   // файл в подпапке
```

**Правило:** если путь начинается с `./` или `../` — это **относительный** путь от текущего файла.

### Пути из node_modules (пакеты)

```js
import React from "react";
import { useState } from "react";
import lodash from "lodash";
```

**Правило:** если путь **без** `./` — JS ищет модуль в папке `node_modules` (установленные пакеты). Это будет актуально когда начнёшь работать с npm/yarn.

### Расширение файла (.js)

```js
// В браузере — расширение .js ОБЯЗАТЕЛЬНО:
import { add } from "./math.js";

// В Node.js и сборщиках (webpack, Vite) — можно опускать:
import { add } from "./math";

// Рекомендация для обучения: ВСЕГДА пиши .js — это явнее и работает везде
```

> ❌ **Частые заблуждения:**
> - "`import { add } from 'math.js'`" (без `./`) — это НЕ относительный путь. Без `./` JS будет искать пакет `math.js` в `node_modules` и не найдёт. Для своих файлов **всегда** пиши `./`.
> - "Можно импортировать из любого файла на компьютере" — нет. Только из файлов проекта (относительные пути) или из установленных пакетов (node_modules).

> 🔍 **Мини-проверка:** какой путь правильный?
> ```
> Структура:
>   src/
>     utils/
>       math.js     ← экспортирует add
>     components/
>       App.js      ← хочет импортировать add
> ```
> ```js
> // Вариант A:
> import { add } from "./math.js";
> // Вариант B:
> import { add } from "../utils/math.js";
> // Вариант C:
> import { add } from "utils/math.js";
> ```
> <details><summary>Ответ</summary>
>
> Правильный — **Вариант B**. Из `components/App.js` нужно подняться на уровень (`../` → в `src/`), затем зайти в `utils/math.js`.
> Вариант A ищет `math.js` в `components/` — неправильно.
> Вариант C (без `./`) ищет в `node_modules` — неправильно.
> </details>

---

## Реэкспорт и barrel-файлы

### Что такое реэкспорт

Реэкспорт — это когда файл импортирует что-то из другого модуля и тут же экспортирует наружу. Используется для создания "единой точки входа" в папку.

```js
// Синтаксис реэкспорта — короткая форма:
export { add, subtract } from "./math.js";
export { default as User } from "./User.js";

// Это эквивалентно:
import { add, subtract } from "./math.js";
export { add, subtract };
```

### index.js — barrel файл

Когда в папке много файлов, неудобно импортировать из каждого отдельно. Barrel файл (`index.js`) собирает все экспорты папки в одном месте:

```js
// utils/format.js
export function formatName(name) { return name.trim(); }
export function formatPrice(n) { return `${n} ₽`; }

// utils/validate.js
export function validateEmail(email) { return email.includes("@"); }
export function validateAge(age) { return age >= 0 && age <= 150; }

// utils/string.js
export function truncate(str, max) {
  return str.length <= max ? str : str.slice(0, max) + "...";
}
```

```js
// utils/index.js — barrel файл, реэкспортирует всё:
export { formatName, formatPrice } from "./format.js";
export { validateEmail, validateAge } from "./validate.js";
export { truncate } from "./string.js";
```

```js
// main.js — теперь можно импортировать из папки:
import { formatName, validateEmail, truncate } from "./utils/index.js";
// Или короче (сборщики автоматически находят index.js):
// import { formatName, validateEmail, truncate } from "./utils";
```

**Без barrel файла** пришлось бы писать три отдельных импорта:

```js
import { formatName } from "./utils/format.js";
import { validateEmail } from "./utils/validate.js";
import { truncate } from "./utils/string.js";
```

---

## Организация проекта — типичная структура

```
src/
  components/          ← UI-компоненты (каждый — default export)
    Button.js            export default function Button() {}
    Header.js            export default function Header() {}
    UserCard.js          export default function UserCard() {}
    index.js             barrel: export { default as Button } from ...

  utils/               ← утилиты (именованные экспорты)
    format.js            export function formatDate(), formatPrice()
    validate.js          export function validateEmail(), validateAge()
    index.js             barrel: export { formatDate, ... } from ...

  api/                 ← работа с сервером
    users.js             export function getUsers(), createUser()

  constants/           ← константы
    config.js            export const API_URL, MAX_ITEMS

  main.js              ← точка входа, импортирует всё нужное
```

**Правила именования:**
- Файл с одним классом/компонентом → имя файла = имя класса: `User.js`, `Button.js`
- Файл с утилитами → описательное имя: `format.js`, `validate.js`, `math.js`
- Точка входа → `main.js` или `index.js`

---

## Модули в браузере

Чтобы `import/export` работали в браузере, нужен атрибут `type="module"` у тега `<script>`:

```html
<script type="module" src="main.js"></script>
```

Особенности модулей в браузере:
- Автоматический `"use strict"`
- Каждый модуль имеет своё пространство имён (переменные не утекают в `window`)
- `import/export` работают только через HTTP-сервер (не через `file://`)
- Скрипт загружается с `defer` по умолчанию (не блокирует рендер страницы)

> 💡 **На заметку:** в современных проектах (Vite, webpack, Next.js) настройка модулей происходит автоматически. Тебе не нужно думать про `type="module"` — сборщик делает это за тебя. Но полезно знать как это работает "под капотом".

---

## Динамический импорт

### Что это и зачем

Обычный `import` загружает модуль **при старте** программы. Динамический `import()` загружает модуль **по требованию** — когда он действительно нужен. Это полезно для ускорения загрузки больших приложений.

### Синтаксис

```js
// Обычный import — загружается сразу при старте:
import { drawChart } from "./chart.js";

// Динамический import() — загружается когда вызвали:
async function loadChart() {
  const { drawChart } = await import("./chart.js");
  drawChart(data);
}
```

> **Забегая вперёд:** `await` — оператор для работы с асинхронными операциями. Подробно — в блоке "Асинхронность". Сейчас достаточно знать: `import()` возвращает "обещание" (Promise), и `await` ждёт его выполнения.

### Пример: загрузка по клику

```js
// Модуль modal.js загрузится только когда пользователь кликнет:
button.addEventListener("click", async () => {
  const { openModal } = await import("./modal.js");
  openModal();
});
// Пока не кликнул — modal.js вообще не загружается
```

Динамический импорт используется в Next.js, React и других фреймворках для **code splitting** — разбивки приложения на части, которые загружаются по мере необходимости.

---

## Заметка про localStorage (для задания 10.5)

Задание 10.5 использует `localStorage` — встроенный браузерный API для хранения данных. Вот минимум который нужен для задания:

```js
// Сохранить строку:
localStorage.setItem("key", "value");

// Прочитать строку (или null если ключа нет):
localStorage.getItem("key"); // "value"
localStorage.getItem("нет такого"); // null

// Удалить:
localStorage.removeItem("key");

// Очистить всё:
localStorage.clear();
```

`localStorage` хранит только **строки**. Чтобы сохранить объект или массив — сериализуй в JSON:

```js
// Сохранить объект:
const user = { name: "Игорь", age: 25 };
localStorage.setItem("user", JSON.stringify(user));

// Прочитать и распарсить обратно:
const saved = localStorage.getItem("user");
const parsed = JSON.parse(saved); // { name: "Игорь", age: 25 }
```

> 💡 **На заметку:** `localStorage` — это тема блока DOM/Browser API. Здесь дан минимум для практики модулей. Суть задания 10.5 — не в localStorage, а в том, чтобы создать модуль с чётким API (`save`, `load`, `remove`, `clear`) и экспортировать его.

---

## Итог

```
EXPORT — что отдаём наружу:
  export function fn() {}       → именованный
  export const VALUE = 42;      → именованный
  export { fn, VALUE };         → именованный, в конце файла
  export default class Foo {}   → дефолтный (один на файл)
  export { x } from "./file.js" → реэкспорт

IMPORT — что берём из других модулей:
  import { fn } from "./file.js"        → именованный (имя должно совпадать)
  import { fn as alias } from "..."     → с переименованием
  import * as mod from "..."            → весь модуль как объект
  import Default from "..."             → дефолтный (имя любое)
  import Default, { named } from "..."  → оба вида сразу
  const { fn } = await import("...")    → динамический импорт

ПУТИ:
  "./file.js"   → та же папка (относительный)
  "../file.js"  → уровень выше (относительный)
  "react"       → из node_modules (без ./)

BARREL ФАЙЛ (index.js):
  Реэкспортирует всё из папки в одном месте
  Позволяет: import { a, b, c } from "./utils"
  Вместо трёх отдельных import

ПРАВИЛА:
  - Один файл — одна ответственность
  - Default export — одна главная сущность в файле (класс, компонент)
  - Named exports — несколько утилит в одном файле
  - Для своих файлов — всегда начинай путь с ./
  - Всегда пиши расширение .js (для ясности)
  - Модули всегда работают в strict mode
```

---

*← [[js/09-errors|Ошибки]] | [[js-advanced/01-oop-basics|ООП]] → | [[js-fundamentals|К оглавлению]]*
