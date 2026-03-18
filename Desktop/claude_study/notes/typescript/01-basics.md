# Глава 1. Основы TypeScript

> [[typescript-fundamentals]] | **Основы** | [[typescript/02-interfaces]] >>

---

## Зачем эта тема существует?

JavaScript --- язык с динамической типизацией. Это значит, что переменная может хранить число, потом строку, потом объект --- и никто не пожалуется. Это удобно для маленьких скриптов, но в большом проекте превращается в кошмар: ошибки всплывают только во время выполнения, подсказки в редакторе работают плохо, а рефакторинг становится опасным.

TypeScript решает эту проблему. Это **надмножество JavaScript** --- любой JS-код является валидным TS-кодом, но TypeScript добавляет систему типов, которая ловит ошибки **до** запуска программы, прямо в редакторе.

---

## 1. Что такое TypeScript и зачем он нужен

### Что это такое?

TypeScript --- это язык программирования от Microsoft, который компилируется в обычный JavaScript. Браузер и Node.js не понимают TypeScript напрямую --- сначала код проходит через компилятор `tsc`, который убирает все аннотации типов и выдает чистый JS.

### Как это работает?

```
Ты пишешь:     app.ts  (TypeScript)
       |
   компилятор tsc
       |
Браузер получает: app.js  (JavaScript)
```

Типы существуют **только на этапе разработки**. В готовом JS-файле их нет. Это называется **стирание типов** (type erasure).

### Зачем нужен TypeScript?

```typescript
// JavaScript --- ошибка обнаружится только при запуске
function greet(name) {
  return "Привет, " + name.toUpperCase();
}
greet(42); // Runtime Error: name.toUpperCase is not a function

// TypeScript --- ошибка видна сразу в редакторе
function greet(name: string): string {
  return "Привет, " + name.toUpperCase();
}
greet(42); // Ошибка компиляции: Argument of type 'number' is not assignable to parameter of type 'string'
```

### Установка

```bash
# Глобально (для учебы)
npm install -g typescript

# Проверка версии
tsc --version

# Компиляция файла
tsc app.ts

# Инициализация проекта (создает tsconfig.json)
tsc --init
```

Файл `tsconfig.json` --- конфигурация компилятора. Пока достаточно знать, что он существует. В проектах на React/Next.js он создается автоматически.

### Частые заблуждения

- "TypeScript --- это другой язык". Нет, это JavaScript с типами. Весь JS-синтаксис работает в TS.
- "TypeScript замедляет программу". Нет, типы удаляются при компиляции. Итоговый JS работает с той же скоростью.
- "Нужно типизировать всё". Нет, TypeScript умеет выводить типы автоматически.

### Мини-проверка

Что произойдет с типами TypeScript после компиляции в JavaScript?

---

## 2. Базовые типы

### Что это такое?

TypeScript предоставляет набор базовых типов, которые описывают, какие значения может хранить переменная.

### Как это работает?

```typescript
// --- Примитивные типы ---
let name: string = "Игорь";
let age: number = 25;
let isStudent: boolean = true;

// --- Массивы ---
let scores: number[] = [90, 85, 92];
let names: Array<string> = ["Аня", "Борис"];  // альтернативный синтаксис

// --- Кортеж (tuple) --- массив фиксированной длины с типами для каждой позиции
let coordinates: [number, number] = [55.75, 37.61];
let userInfo: [string, number] = ["Игорь", 25];
// userInfo = [25, "Игорь"]; // Ошибка: типы перепутаны

// --- Enum --- набор именованных констант
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right    // 3
}
let move: Direction = Direction.Up;

enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Banned = "BANNED"
}
let userStatus: Status = Status.Active;
```

### Плохой и хороший пример

```typescript
// Плохо --- тип any отключает проверки
let data: any = "привет";
data = 42;
data = true;
data.someMethod(); // Никакой ошибки в редакторе, но упадет в рантайме

// Хорошо --- конкретные типы
let message: string = "привет";
let count: number = 42;
let isReady: boolean = true;
```

### Мини-проверка

Чем `number[]` отличается от `[number, number]`?

---

## 3. any, unknown, void, never

### Что это такое?

Это специальные типы TypeScript для особых случаев.

### Как это работает?

```typescript
// --- any --- отключает проверку типов (избегай!)
let anything: any = "строка";
anything = 42;
anything.foo.bar; // TypeScript не ругается, но это опасно

// --- unknown --- безопасная альтернатива any
let something: unknown = "строка";
// something.toUpperCase(); // Ошибка! Нельзя использовать без проверки

if (typeof something === "string") {
  something.toUpperCase(); // Теперь можно --- TypeScript знает, что это string
}

// --- void --- функция ничего не возвращает
function logMessage(msg: string): void {
  console.log(msg);
  // return --- не нужен
}

// --- never --- функция никогда не завершается
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // бесконечный цикл
  }
}
```

### Плохой и хороший пример

```typescript
// Плохо --- используем any для данных от API
function processData(data: any) {
  return data.name.toUpperCase(); // Может упасть
}

// Хорошо --- используем unknown и проверяем
function processData(data: unknown) {
  if (typeof data === "object" && data !== null && "name" in data) {
    return (data as { name: string }).name.toUpperCase();
  }
  return "Неизвестные данные";
}
```

### Частые заблуждения

- "any и unknown --- одно и то же". Нет. `any` отключает проверки, `unknown` требует проверки перед использованием.
- "void и never --- одно и то же". Нет. `void` --- функция завершается, но ничего не возвращает. `never` --- функция не завершается вообще.

### Мини-проверка

Почему `unknown` безопаснее, чем `any`?

---

## 4. Аннотации типов и вывод типов

### Что это такое?

**Аннотация типа** --- ты явно указываешь тип. **Вывод типа** (type inference) --- TypeScript определяет тип сам по значению.

### Как это работает?

```typescript
// Явная аннотация --- ты указываешь тип
let city: string = "Москва";

// Вывод типа --- TypeScript понимает сам
let country = "Россия"; // TypeScript: тип string
let year = 2026;        // TypeScript: тип number
let active = true;      // TypeScript: тип boolean

// Вывод типа работает и для функций
function add(a: number, b: number) {
  return a + b; // TypeScript понимает, что возвращается number
}
```

### Когда нужна явная аннотация?

```typescript
// 1. Параметры функций --- ВСЕГДА указывай типы
function greet(name: string): string {
  return `Привет, ${name}!`;
}

// 2. Когда начальное значение не дает понять тип
let items: string[] = []; // Без аннотации TypeScript не знает тип элементов

// 3. Когда функция может вернуть разные типы
function parse(input: string): number | null {
  const result = Number(input);
  return isNaN(result) ? null : result;
}
```

### Плохой и хороший пример

```typescript
// Плохо --- избыточные аннотации (TypeScript и так знает)
let name: string = "Игорь";
let age: number = 25;
let scores: number[] = [90, 85, 92];

// Хорошо --- доверяй выводу типов, указывай только где нужно
let name = "Игорь";       // очевидно string
let age = 25;             // очевидно number
let scores = [90, 85, 92]; // очевидно number[]
```

### Мини-проверка

Нужна ли аннотация типа для `let x = 10`? Почему?

---

## 5. Union types (объединения)

### Что это такое?

Union type --- тип, который может быть одним из нескольких вариантов. Записывается через вертикальную черту `|`.

### Как это работает?

```typescript
// Переменная может быть строкой или числом
let id: string | number;
id = "abc-123";  // ок
id = 42;         // тоже ок
// id = true;    // Ошибка: boolean не входит в string | number

// В функциях
function formatId(id: string | number): string {
  // Нужно сузить тип перед использованием специфичных методов
  if (typeof id === "string") {
    return id.toUpperCase();
  }
  return `#${id}`;
}

// С массивами
let mixed: (string | number)[] = [1, "два", 3, "четыре"];
```

### Сужение типа (narrowing)

Когда переменная имеет union type, TypeScript не позволит вызвать метод, который есть не у всех вариантов. Нужно сначала сузить тип:

```typescript
function printLength(value: string | string[]): void {
  // value.toUpperCase(); // Ошибка: у массива нет toUpperCase

  if (typeof value === "string") {
    console.log(value.toUpperCase()); // Тут TypeScript знает: это string
  } else {
    console.log(value.join(", "));    // Тут TypeScript знает: это string[]
  }
}
```

### Частые заблуждения

- "Union type --- это тип, который одновременно и string, и number". Нет, это тип, который **или** string, **или** number.

### Мини-проверка

Зачем нужно сужение типа при работе с union types?

---

## 6. Literal types (литеральные типы)

### Что это такое?

Literal type --- тип, который принимает только **конкретное значение**, а не любое значение данного типа.

### Как это работает?

```typescript
// Обычный тип --- любая строка
let color: string = "любая строка подойдет";

// Литеральный тип --- только конкретные значения
let direction: "up" | "down" | "left" | "right";
direction = "up";     // ок
direction = "down";   // ок
// direction = "forward"; // Ошибка: нет такого варианта

// Часто используется для ограничения параметров функции
function setTheme(theme: "light" | "dark"): void {
  document.body.className = theme;
}
setTheme("light"); // ок
// setTheme("blue"); // Ошибка

// С числами тоже работает
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let roll: DiceRoll = 3; // ок
// let roll2: DiceRoll = 7; // Ошибка

// const автоматически создает литеральный тип
const greeting = "привет"; // Тип: "привет" (не string)
let farewell = "пока";     // Тип: string
```

### Плохой и хороший пример

```typescript
// Плохо --- string слишком широкий тип, легко ошибиться
function setStatus(status: string): void {
  // "activ" вместо "active" --- ошибка не видна
}

// Хорошо --- литеральный тип ограничивает варианты
function setStatus(status: "active" | "inactive" | "banned"): void {
  // setStatus("activ") --- ошибка видна сразу!
}
```

### Мини-проверка

Почему `const x = "hello"` имеет тип `"hello"`, а `let x = "hello"` имеет тип `string`?

---

## Итог

TypeScript --- это JavaScript с системой типов, которая ловит ошибки до запуска программы. Типы существуют только во время разработки и удаляются при компиляции.

**Ключевые идеи главы:**

- **Базовые типы:** `string`, `number`, `boolean`, `number[]`, `[string, number]` (tuple), `enum`
- **Специальные типы:** `any` (опасно), `unknown` (безопасно), `void` (нет возврата), `never` (не завершается)
- **Вывод типов** --- TypeScript часто определяет тип сам, не нужно писать аннотации везде
- **Union types** (`string | number`) --- переменная может быть одним из вариантов
- **Literal types** (`"light" | "dark"`) --- переменная принимает только конкретные значения
- **Сужение типа** --- проверка `typeof` перед использованием методов в union types

---

> [[typescript-fundamentals]] | **Основы** | [[typescript/02-interfaces]] >>
