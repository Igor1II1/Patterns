# Объекты

> [[js-fundamentals|← Назад к оглавлению JS]]

---

## Зачем эта тема существует?

В реальных программах данные редко существуют по отдельности — имя пользователя связано с его возрастом, email, ролью. Объекты позволяют группировать связанные данные в одну сущность. Это основная структура данных в JavaScript: ответы сервера, конфигурации, DOM-элементы, события — всё это объекты.

---

## Что такое объект?

**Объект** — это коллекция связанных данных и функций, хранящихся под одним именем в виде пар **ключ: значение**.

Если переменная — это коробка с одним значением, то объект — это **ящик с отделениями**, у каждого из которых есть подпись (ключ) и содержимое (значение).

**Зачем нужны объекты:**

Без объектов для описания одного пользователя нужны отдельные переменные:

```js
// Без объекта — переменные не связаны между собой
let userName = "Игорь";
let userAge = 25;
let userCity = "Москва";
let userIsAdmin = false;
// Непонятно что эти переменные относятся к одной сущности

// С объектом — всё связано, всё в одном месте
const user = {
  name: "Игорь",
  age: 25,
  city: "Москва",
  isAdmin: false,
};
```

Объекты позволяют:
- Группировать связанные данные
- Передавать набор данных одним аргументом
- Создавать модели реальных сущностей (пользователь, товар, заказ)

---

## Создание объекта

### Литерал объекта — основной способ

```js
const user = {
  name: "Игорь",    // ключ: значение
  age: 25,
  isAdmin: false,
};

// Пустой объект
const empty = {};

// Ключи могут содержать пробелы — нужны кавычки
const obj = {
  "first name": "Игорь",   // доступ только через скобки: obj["first name"]
  "123key": "значение",    // ключ начинается с цифры — тоже нужны кавычки
};
```

### Вложенные объекты

```js
const user = {
  name: "Игорь",
  age: 25,
  address: {               // значение — другой объект
    city: "Москва",
    street: "Арбат, 10",
    zip: "121069",
  },
  hobbies: ["программирование", "чтение", "спорт"], // значение — массив
};

// Доступ к вложенным данным
user.address.city;      // "Москва"
user.hobbies[0];        // "программирование"
user.address.country;   // undefined — нет такого поля, не ошибка
```

---

## Доступ к свойствам

### Через точку (dot notation)

```js
const user = { name: "Игорь", age: 25 };

user.name;   // "Игорь"
user.age;    // 25
```

**Когда использовать:** всегда, когда знаешь имя свойства заранее.

### Через квадратные скобки (bracket notation)

```js
const user = { name: "Игорь", age: 25 };

user["name"];   // "Игорь" — то же самое
user["age"];    // 25
```

**Когда использовать:**
1. Ключ хранится в переменной (динамический доступ)
2. Ключ содержит пробелы или специальные символы

```js
// Динамический ключ
const key = "name";
user[key];          // "Игорь" ✅
user.key;           // undefined ❌ — ищет свойство с именем "key", не значение key

// Ключ со спецсимволами
const data = { "first-name": "Игорь" };
data["first-name"]; // "Игорь" ✅
data.first-name;    // ❌ Не работает — интерпретируется как data.first минус name → NaN
```

> **Механика: как JS ищет свойство объекта**
>
> ```js
> const user = { name: "Игорь", age: 25 };
> user.name;  // как это работает внутри?
> ```
> Шаг 1: JS берёт объект `user`
> Шаг 2: ищет ключ `"name"` среди **собственных** свойств объекта
> Шаг 3: нашёл → возвращает значение `"Игорь"`
>
> Если свойства нет (`user.role`):
> Шаг 2: ищет `"role"` среди собственных свойств → не нашёл
> Шаг 3: ищет в **прототипе** (цепочка наследования, глава [[js-advanced/03-prototypes|Прототипы]])
> Шаг 4: не нашёл нигде → возвращает `undefined` (не ошибка!)
>
> Это объясняет почему `user.role` = `undefined`, но `user.role.length` = TypeError:
> `undefined` — это не объект, у него нет свойств.

### Обращение к несуществующему свойству

В JavaScript это **не ошибка** — возвращает `undefined`:

```js
const user = { name: "Игорь" };

user.age;           // undefined — нет ошибки
user.role;          // undefined
user.address.city;  // ❌ TypeError — пытаемся читать .city у undefined!
```

Если нужно обратиться к глубоко вложенному свойству которого может не быть — используй Optional Chaining.

---

## Optional Chaining (?.) — безопасный доступ

### Что это?

`?.` — оператор который позволяет безопасно обращаться к свойствам объекта. Если левая часть `null` или `undefined` — возвращает `undefined` вместо ошибки.

### Зачем нужен?

Когда данные приходят с сервера или от пользователя и ты не уверен что какое-то поле существует.

```js
const user = {
  name: "Игорь",
  address: null  // адрес не заполнен
};

// Без ?. — ошибка если address = null
user.address.city;   // ❌ TypeError: Cannot read properties of null

// С ?. — безопасно
user.address?.city;  // undefined — не выбросил ошибку

// Можно цепочкой
user?.address?.city?.toLowerCase(); // undefined — на каждом уровне

// С методами
user.getName?.();      // undefined если метода нет (не ошибка)

// С массивами
user.hobbies?.[0];     // undefined если hobbies нет
```

### Где заканчивается Optional Chaining?

`?.` останавливает выполнение **только если левая часть null или undefined**. Если левая часть — другое значение, продолжает обычно:

```js
const user = null;
user?.address;         // undefined ✅

const user2 = {};
user2?.address;        // undefined ✅ (address нет, но это не null/undefined ошибка)
user2?.address?.city;  // undefined ✅
```

---

## Добавление, изменение, удаление свойств

```js
const user = { name: "Игорь" };

// Добавить свойство
user.age = 25;
user["city"] = "Москва";
console.log(user); // { name: "Игорь", age: 25, city: "Москва" }

// Изменить существующее
user.name = "Иван";
console.log(user.name); // "Иван"

// Удалить свойство
delete user.city;
console.log(user); // { name: "Иван", age: 25 }
```

---

## Shorthand свойства — сокращённая запись

### Что это?

**Shorthand (сокращение)** — синтаксис ES6 позволяющий не дублировать имя если переменная и ключ объекта называются одинаково.

### Зачем нужен?

Уменьшает повторяемость кода — один из самых частых синтаксисов в современном JS.

```js
const name = "Игорь";
const age = 25;
const city = "Москва";

// Старая запись — дублирование
const user1 = { name: name, age: age, city: city };

// Shorthand — то же самое, но короче
const user2 = { name, age, city };
```

**Практический пример — функция возвращающая объект:**

```js
function createUser(name, age, role) {
  // Без shorthand
  return { name: name, age: age, role: role };

  // С shorthand
  return { name, age, role };
}
```

---

## Методы объекта

### Что такое метод?

**Метод** — это функция, которая является свойством объекта. Метод описывает **поведение** объекта.

```js
const user = {
  name: "Игорь",
  age: 25,

  // Метод — краткий синтаксис (рекомендуется)
  greet() {
    return `Привет, я ${this.name}, мне ${this.age} лет`;
  },
};

user.greet(); // "Привет, я Игорь, мне 25 лет"
```

Существуют три способа записи методов — но рекомендуется только первый:

```js
// ✅ Краткий синтаксис (рекомендуется)
const obj1 = {
  greet() { return `Привет, я ${this.name}`; }
};

// Старый способ через function expression (работает, но многословнее)
const obj2 = {
  greet: function() { return `Привет, я ${this.name}`; }
};

// ❌ Стрелочная — НЕ используй для методов (проблема с this)
const obj3 = {
  greet: () => { return `Привет, я ${this.name}`; } // this.name = undefined!
};
```

`this` внутри метода указывает на объект которому метод принадлежит. Подробно в главе [[js/08-this|this]].

---

## Деструктуризация объекта

### Что такое деструктуризация?

**Деструктуризация** — синтаксис для извлечения свойств объекта в отдельные переменные за одну операцию.

### Зачем нужна?

Вместо многократного написания `user.name`, `user.age` — один раз извлечь нужные свойства в переменные.

### Базовая деструктуризация

```js
const user = { name: "Игорь", age: 25, city: "Москва", role: "admin" };

// Без деструктуризации
const name = user.name;
const age  = user.age;

// С деструктуризацией — значительно короче
const { name, age } = user;
console.log(name); // "Игорь"
console.log(age);  // 25
// city и role не извлекали — это нормально, берём только нужное
```

> **Механика: как деструктуризация извлекает значения пошагово**
>
> ```js
> const user = { name: "Игорь", age: 25, city: "Москва" };
> const { name, age } = user;
> ```
> Шаг 1: JS смотрит на левую часть `{ name, age }` — это список ключей для извлечения
> Шаг 2: для каждого ключа ищет его в объекте справа:
>   `name` → `user.name` → `"Игорь"` → создаёт переменную `name = "Игорь"`
>   `age`  → `user.age`  → `25`      → создаёт переменную `age = 25`
> Шаг 3: `city` не указан слева — игнорируется, переменная не создаётся
>
> По сути `const { name, age } = user` — это **сокращение** для:
> `const name = user.name; const age = user.age;`

### Переименование при деструктуризации

```js
const user = { name: "Игорь" };

// Деструктурируем name как userName
const { name: userName } = user;
console.log(userName); // "Игорь" ✅
// Переменной name нет — только userName
```

**Зачем переименовывать:** избежать конфликта имён если переменная `name` уже существует.

### Значения по умолчанию при деструктуризации

```js
const user = { name: "Игорь", age: 25 };

// role нет в объекте — берём дефолтное значение
const { name, age, role = "user" } = user;
console.log(role); // "user" — взялось дефолтное

// Комбинация: переименование + дефолт
const { name: userName = "Гость", role: userRole = "visitor" } = user;
console.log(userName); // "Игорь" — из объекта
console.log(userRole); // "visitor" — дефолт (role нет в объекте)
```

### Вложенная деструктуризация

```js
const user = {
  name: "Игорь",
  address: {
    city: "Москва",
    zip: "121069"
  }
};

// Деструктурируем вложенный объект
const { name, address: { city, zip } } = user;
console.log(city); // "Москва"
console.log(zip);  // "121069"
// ВАЖНО: переменная address НЕ создаётся! Только city и zip
```

### Деструктуризация в параметрах функции

```js
// Без деструктуризации — многословно
function showUser(user) {
  console.log(`${user.name}, ${user.age} лет, роль: ${user.role}`);
}

// С деструктуризацией — сразу видно какие поля нужны
function showUser({ name, age, role = "user" }) {
  console.log(`${name}, ${age} лет, роль: ${role}`);
}

showUser({ name: "Игорь", age: 25 }); // "Игорь, 25 лет, роль: user"
```

### Rest в деструктуризации объекта

**Rest (`...`)** в деструктуризации собирает все **оставшиеся** свойства в новый объект:

```js
const user = { name: "Игорь", age: 25, city: "Москва", role: "admin" };

// Извлечь name, а всё остальное — в rest
const { name, ...rest } = user;
console.log(name); // "Игорь"
console.log(rest); // { age: 25, city: "Москва", role: "admin" }

// Практический пример: убрать свойство из объекта (иммутабельно)
const { role, ...userWithoutRole } = user;
console.log(userWithoutRole); // { name: "Игорь", age: 25, city: "Москва" }
// user не изменился — мы создали новый объект без role
```

**Зачем нужен rest:** создание функций типа `pick` и `omit`, передача "остальных" пропсов в React-компонентах.

### Деструктуризация массива

```js
const point = [10, 20, 30];

// Извлечь элементы по позиции
const [x, y, z] = point;
console.log(x); // 10
console.log(y); // 20

// Пропустить элемент — ставим пустую запятую
const [first, , third] = [1, 2, 3];
console.log(first); // 1
console.log(third); // 3

// Rest в деструктуризации
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Обмен переменных местами
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a); // 2
console.log(b); // 1
```

---

## Spread оператор с объектами

### Что такое spread для объектов?

**Spread (`...`)** — оператор который "разворачивает" объект в набор пар ключ-значение. Используется для копирования, объединения, обновления объектов.

### Зачем нужен?

Создавать новые объекты на основе существующих без мутации оригинала — ключевой паттерн в React.

> **Механика: как spread копирует объект пошагово**
>
> ```js
> const user = { name: "Игорь", age: 25 };
> const copy = { ...user, age: 30 };
> ```
> Шаг 1: JS создаёт новый пустой объект `{}`
> Шаг 2: `...user` — перебирает все свойства `user` и копирует их:
>   `name: "Игорь"` → `{ name: "Игорь" }`
>   `age: 25`       → `{ name: "Игорь", age: 25 }`
> Шаг 3: `age: 30` — записывает свойство `age` поверх существующего:
>   → `{ name: "Игорь", age: 30 }`
> Результат: новый объект. Порядок важен: **последнее значение побеждает**.
> Поэтому `{ age: 30, ...user }` даст `age: 25` — spread перезапишет 30.

### Копирование объекта

```js
const original = { name: "Игорь", age: 25 };

// ❌ Присваивание — не копия, а ссылка!
const bad = original;
bad.name = "Иван";
console.log(original.name); // "Иван" — оригинал изменился!

// ✅ Spread — поверхностная копия
const good = { ...original };
good.name = "Иван";
console.log(original.name); // "Игорь" — оригинал не тронут ✅
```

### Объединение объектов

```js
const base = { name: "Игорь", age: 25 };
const extra = { role: "admin", active: true };

const full = { ...base, ...extra };
// { name: "Игорь", age: 25, role: "admin", active: true }
```

### Иммутабельное обновление (паттерн из React)

**Что это:** создать новый объект с изменённым полем не изменяя оригинал.

**Зачем:** в React нельзя мутировать state — нужно создавать новый объект.

```js
const user = { name: "Игорь", age: 25, role: "user" };

// Обновить age без мутации оригинала
const updatedUser = { ...user, age: 26 };
// { name: "Игорь", age: 26, role: "user" }
console.log(user);        // { name: "Игорь", age: 25, role: "user" } — не изменился ✅

// При конфликте ключей — побеждает последний
const withNewRole = { ...user, role: "admin" };
// { name: "Игорь", age: 25, role: "admin" }
```

### Ограничение: поверхностная копия

Spread копирует только **первый уровень**. Вложенные объекты по-прежнему копируются по ссылке:

```js
const user = {
  name: "Игорь",
  address: { city: "Москва" } // вложенный объект
};

const copy = { ...user };

copy.name = "Иван";              // ✅ не влияет на оригинал
copy.address.city = "СПб";       // ❌ влияет на оригинал! address — общий

console.log(user.name);           // "Игорь" ✅
console.log(user.address.city);   // "СПб" ❌ — изменился!
```

**Как сделать глубокую копию:**

```js
const deepCopy = structuredClone(user); // современный способ
// или
const deepCopy2 = JSON.parse(JSON.stringify(user)); // старый способ (не работает с функциями)
```

---

## Перебор свойств объекта

### Object.keys — массив ключей

**Что делает:** возвращает массив **имён** всех перечисляемых свойств объекта.

```js
const user = { name: "Игорь", age: 25, city: "Москва" };

Object.keys(user); // ["name", "age", "city"]

// Полезно для перебора
Object.keys(user).forEach(key => {
  console.log(`${key}: ${user[key]}`);
});
```

### Object.values — массив значений

**Что делает:** возвращает массив **значений** всех перечисляемых свойств.

```js
Object.values(user); // ["Игорь", 25, "Москва"]

// Найти максимальное значение
const scores = { math: 90, english: 85, history: 95 };
const maxScore = Math.max(...Object.values(scores)); // 95
```

### Object.entries — массив пар [ключ, значение]

**Что делает:** возвращает массив массивов `[ключ, значение]`.

```js
Object.entries(user);
// [["name", "Игорь"], ["age", 25], ["city", "Москва"]]

// Очень удобно с деструктуризацией
Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

// Трансформировать объект через map (+ fromEntries)
const doubled = Object.fromEntries(
  Object.entries(scores).map(([key, value]) => [key, value * 2])
);
// { math: 180, english: 170, history: 190 }
```

### Object.fromEntries — создать объект из пар

**Что делает:** обратная операция к `Object.entries` — принимает массив пар и создаёт объект.

```js
const entries = [["name", "Игорь"], ["age", 25]];
Object.fromEntries(entries); // { name: "Игорь", age: 25 }

// Часто используется после трансформации entries
const prices = { apple: 100, banana: 50, orange: 80 };
const discounted = Object.fromEntries(
  Object.entries(prices).map(([fruit, price]) => [fruit, price * 0.9])
);
// { apple: 90, banana: 45, orange: 72 }
```

### for...in — перебор ключей (устаревший способ)

```js
const user = { name: "Игорь", age: 25 };

for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}
```

> Предпочитай `Object.keys().forEach()` — он не перебирает унаследованные свойства.

---

## Проверка наличия свойства

```js
const user = { name: "Игорь", age: undefined }; // age есть, но = undefined

// ❌ Плохо — не различает "нет свойства" и "свойство = undefined"
user.name !== undefined; // true ✅
user.age !== undefined;  // false ❌ — свойство есть, но мы думаем что нет

// ✅ Оператор in — проверяет само наличие свойства
"name" in user;          // true ✅
"age" in user;           // true ✅ — свойство есть!
"role" in user;          // false ✅

// ✅ Object.hasOwn (ES2022) — современный способ
Object.hasOwn(user, "name"); // true
Object.hasOwn(user, "role"); // false
```

---

## Nullish Coalescing (??) — значение по умолчанию

### Что это?

`??` — оператор который возвращает правую часть **только если** левая — `null` или `undefined`. В отличие от `||`, не реагирует на другие "ложные" значения (`0`, `""`, `false`).

### Зачем нужен?

Когда `0` или пустая строка — валидные значения, а не "отсутствие":

```js
// Проблема с ||
function setVolume(volume) {
  const level = volume || 50; // дефолт если нет volume
}
setVolume(0);  // level = 50 ❌ — 0 это "falsy", заменился!

// Решение с ??
function setVolume(volume) {
  const level = volume ?? 50; // дефолт только для null/undefined
}
setVolume(0);          // level = 0 ✅
setVolume(undefined);  // level = 50 ✅
setVolume(null);       // level = 50 ✅
setVolume(30);         // level = 30 ✅
```

```js
// Таблица сравнения:
//                value  ||  дефолт    value  ??  дефолт
null           //  "дефолт"              "дефолт"
undefined      //  "дефолт"              "дефолт"
0              //  "дефолт"  ← проблема  0         ← правильно
""             //  "дефолт"  ← проблема  ""        ← правильно
false          //  "дефолт"  ← проблема  false     ← правильно
"строка"       //  "строка"              "строка"
42             //  42                    42
```

---

> **Частые заблуждения:**
> - Многие думают что `const obj = {}` запрещает изменять объект — на самом деле `const` запрещает **переприсвоить переменную** (`obj = другой`), но свойства менять можно: `obj.name = "Иван"` работает.
> - Кажется что `{ ...obj }` создаёт полную независимую копию — на самом деле это **поверхностная** копия. Вложенные объекты и массивы остаются общими (по ссылке).
> - Часто путают `Object.keys` и `for...in`: `Object.keys` возвращает только **собственные** свойства, а `for...in` перебирает и **унаследованные** (из прототипа).
> - Деструктуризация `const { address: { city } } = user` **не создаёт** переменную `address` — только `city`.

---

> **Мини-проверка:** что выведет этот код? Подумай до запуска.
> ```js
> const a = { x: 1, y: 2 };
> const b = a;
> b.x = 99;
> console.log(a.x);
> ```
> <details><summary>Ответ</summary>
>
> `99` — потому что `b = a` не копирует объект, а создаёт ещё одну ссылку на тот же объект. Изменение через `b` видно и через `a`. Для копии нужен spread: `const b = { ...a }`.
> </details>

---

> **Мини-проверка:** что выведет этот код?
> ```js
> const user = { name: "Игорь", age: 25 };
> const { name: userName, role = "guest" } = user;
> console.log(userName);
> console.log(role);
> ```
> <details><summary>Ответ</summary>
>
> `"Игорь"` — свойство `name` извлечено и переименовано в `userName`.
> `"guest"` — свойства `role` в объекте нет, поэтому берётся значение по умолчанию.
> </details>

---

## Итог

```
СОЗДАНИЕ:
  const obj = { key: value, method() {} }

ДОСТУП:
  obj.key          → через точку (имя известно)
  obj["key"]       → через скобки (динамический ключ)
  obj?.prop?.nest  → Optional Chaining — безопасный доступ (не ошибка если null)

SHORTHAND:
  { name, age }    → вместо { name: name, age: age }

ДЕСТРУКТУРИЗАЦИЯ:
  const { name, age = 0 } = obj       → извлечь свойства
  const { name: userName } = obj      → с переименованием
  const { name, ...rest } = obj       → rest: всё остальное в новый объект
  function f({ name, age }) {}        → в параметрах функции

SPREAD:
  { ...obj }                  → поверхностная копия
  { ...obj, key: newVal }     → копия с изменением поля
  { ...obj1, ...obj2 }        → объединить объекты
  ⚠️ вложенные объекты — по ссылке! Для глубокой: structuredClone(obj)

ПЕРЕБОР:
  Object.keys(obj)     → массив ключей
  Object.values(obj)   → массив значений
  Object.entries(obj)  → массив пар [ключ, значение]
  Object.fromEntries() → обратно: из пар в объект

ПРОВЕРКИ:
  "key" in obj         → есть ли свойство (лучше чем !== undefined)
  value ?? "дефолт"    → дефолт только для null/undefined (не для 0 или "")
```

---

*← [[js/06-arrays|Массивы]] | [[js/08-this|this]] → | [[js-fundamentals|К оглавлению]]*
