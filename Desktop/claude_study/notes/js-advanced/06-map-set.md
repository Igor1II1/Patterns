# Map и Set — коллекции данных

> [[js-fundamentals|← Назад к оглавлению JS]]

JavaScript предоставляет не только объекты и массивы, но и специализированные коллекции: **Map**, **Set**, **WeakMap** и **WeakSet**. Каждая из них решает определённый круг задач лучше, чем обычный объект или массив. В этой главе разберём, когда и почему стоит выбирать эти структуры данных.

---

## 1. Зачем нужны Map и Set

### Проблемы обычных объектов

Объект — это словарь с ключами-строками (или символами). Когда ключ является чем-то иным, JavaScript молча преобразует его в строку:

```js
const obj = {};
const keyA = { id: 1 };
const keyB = { id: 2 };

obj[keyA] = "первый";
obj[keyB] = "второй";

console.log(obj); // { "[object Object]": "второй" }
// Оба ключа превратились в одну строку — данные потеряны
```

Кроме того, объект несёт «мусор» из прототипа (`toString`, `constructor` и т.д.), а порядок ключей не гарантирован для всех типов.

### Проблемы массивов при проверке уникальности

Проверка `arr.includes(value)` перебирает весь массив — O(n). При большом наборе данных это медленно. Удалять дубликаты тоже неудобно: нужны вложенные циклы или `filter` + `indexOf`.

**Map** решает проблему ключей, **Set** — проблему уникальности.

---

## 2. Map

Map — это коллекция пар «ключ → значение», где ключом может быть **любое значение**: строка, число, объект, функция, `null`.

Аналогия: Map похож на гардероб с пронумерованными ячейками, где номером ячейки может быть не только число, но и любой предмет.

### Создание

```js
// Пустой Map
const map = new Map();

// Map с начальными данными (массив пар [ключ, значение])
const prices = new Map([
  ["apple", 50],
  ["banana", 30],
  ["cherry", 120],
]);
```

### Основные методы

```js
const userRoles = new Map();

// set(key, value) — добавить или обновить пару
userRoles.set("alice", "admin");
userRoles.set("bob", "editor");
userRoles.set("carol", "viewer");

// get(key) — получить значение по ключу
console.log(userRoles.get("alice")); // "admin"
console.log(userRoles.get("dave"));  // undefined

// has(key) — проверить наличие ключа
console.log(userRoles.has("bob"));   // true
console.log(userRoles.has("dave"));  // false

// delete(key) — удалить пару
userRoles.delete("carol");

// size — количество пар (не метод, а свойство)
console.log(userRoles.size); // 2

// clear() — очистить всю коллекцию
// userRoles.clear();
```

Методы `set()` возвращают сам Map, поэтому их можно цепочить:

```js
const config = new Map()
  .set("host", "localhost")
  .set("port", 5432)
  .set("db", "myapp");
```

### Объект как ключ

```js
const user1 = { name: "Alice" };
const user2 = { name: "Bob" };

const sessions = new Map();
sessions.set(user1, { loginAt: "10:00", token: "abc" });
sessions.set(user2, { loginAt: "11:30", token: "xyz" });

console.log(sessions.get(user1)); // { loginAt: "10:00", token: "abc" }
console.log(sessions.size);       // 2
```

### Итерация по Map

Map хранит пары в порядке вставки.

```js
const capitals = new Map([
  ["Russia", "Moscow"],
  ["France", "Paris"],
  ["Japan", "Tokyo"],
]);

// forEach
capitals.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// for...of с entries() (по умолчанию итератор Map возвращает entries)
for (const [country, city] of capitals) {
  console.log(`${country} → ${city}`);
}

// Только ключи
for (const country of capitals.keys()) {
  console.log(country);
}

// Только значения
for (const city of capitals.values()) {
  console.log(city);
}

// Преобразование в массив
const pairs = [...capitals.entries()];
// [["Russia","Moscow"], ["France","Paris"], ["Japan","Tokyo"]]
```

### Map vs Object — когда что использовать

| Критерий | Object | Map |
|---|---|---|
| Тип ключа | Строка / Symbol | Любой тип |
| Порядок ключей | Частично гарантирован | Порядок вставки |
| Узнать размер | `Object.keys(o).length` | `map.size` |
| Итерация | `for...in`, `Object.entries()` | `for...of`, `forEach` |
| Производительность (частые add/delete) | Хуже | Лучше |
| JSON-сериализация | `JSON.stringify()` | Нужна конвертация |
| Прототип с «мусором» | Есть | Нет |

**Используйте Object**, когда:
- структура данных фиксирована и известна заранее (конфиг, DTO);
- нужна JSON-сериализация;
- ключи — только строки.

**Используйте Map**, когда:
- ключи могут быть любого типа;
- часто добавляете/удаляете пары;
- важен порядок итерации.

---

## 3. Set

Set — это коллекция **уникальных** значений. Дубликаты автоматически отбрасываются.

Аналогия: Set — как список гостей на вечеринке. Каждый гость может быть в списке только один раз, сколько бы раз его ни пытались добавить.

### Создание

```js
// Пустой Set
const ids = new Set();

// Set из массива (дубликаты удалятся)
const tags = new Set(["js", "css", "html", "js", "css"]);
console.log(tags); // Set(3) { "js", "css", "html" }
```

### Основные методы

```js
const favorites = new Set();

// add(value) — добавить элемент
favorites.add("cats");
favorites.add("coffee");
favorites.add("code");
favorites.add("coffee"); // дубликат — игнорируется

// has(value) — проверить наличие (O(1), быстрее Array.includes)
console.log(favorites.has("cats"));   // true
console.log(favorites.has("dogs"));   // false

// delete(value) — удалить элемент
favorites.delete("cats");

// size — количество элементов
console.log(favorites.size); // 2

// clear() — очистить Set
// favorites.clear();
```

### Итерация по Set

```js
const colors = new Set(["red", "green", "blue"]);

// forEach
colors.forEach((color) => {
  console.log(color);
});

// for...of
for (const color of colors) {
  console.log(color);
}

// Преобразование в массив
const colorArray = [...colors];         // ["red", "green", "blue"]
const colorArray2 = Array.from(colors); // то же самое
```

### Удаление дубликатов из массива

Это одно из самых популярных применений Set:

```js
const raw = [1, 2, 3, 2, 4, 1, 5, 3];
const unique = [...new Set(raw)];
console.log(unique); // [1, 2, 3, 4, 5]

// Удаление дублирующихся строк
const words = ["hello", "world", "hello", "js", "world"];
const uniqueWords = Array.from(new Set(words));
console.log(uniqueWords); // ["hello", "world", "js"]
```

### Set vs Array — когда что использовать

| Критерий | Array | Set |
|---|---|---|
| Уникальность | Нет | Да (автоматически) |
| Проверка наличия | `includes()` — O(n) | `has()` — O(1) |
| Индексированный доступ | `arr[0]` | Нет |
| Порядок | Порядок вставки | Порядок вставки |
| Дубликаты | Разрешены | Запрещены |

**Используйте Array**, когда важен индексированный доступ или нужны дубликаты.
**Используйте Set**, когда важна уникальность или частая проверка наличия элемента.

---

## 4. WeakMap

WeakMap работает как Map, но с двумя принципиальными ограничениями:

1. **Ключами могут быть только объекты** (не примитивы).
2. **Ссылки «слабые»**: если объект-ключ больше нигде не используется, сборщик мусора (GC) может удалить его из памяти вместе с соответствующей записью в WeakMap.

Аналогия: WeakMap — как стикер, приклеенный к объекту. Когда объект выбрасывают, стикер пропадает вместе с ним.

### Методы WeakMap

```js
const wm = new WeakMap();

const key = { id: 1 };

wm.set(key, "data");
wm.get(key);        // "data"
wm.has(key);        // true
wm.delete(key);     // true

// Итерация НЕВОЗМОЖНА — нет keys(), values(), entries(), forEach, size
```

### Практический пример: кэш для DOM-элементов

```js
const cache = new WeakMap();

function processElement(element) {
  if (cache.has(element)) {
    return cache.get(element); // вернуть кэшированный результат
  }

  const result = expensiveCalculation(element);
  cache.set(element, result);
  return result;
}

function expensiveCalculation(el) {
  // имитация тяжёлой операции
  return el.getBoundingClientRect();
}

const btn = document.querySelector("#myButton");
processElement(btn); // вычисляет и кэширует
processElement(btn); // возвращает из кэша

// Когда btn будет удалён из DOM и потеряет все ссылки,
// GC автоматически очистит запись в cache — утечки памяти нет
```

---

## 5. WeakSet

WeakSet работает как Set, но хранит только объекты, и ссылки на них слабые.

### Методы WeakSet

```js
const ws = new WeakSet();

const obj = { name: "test" };

ws.add(obj);
ws.has(obj);    // true
ws.delete(obj); // true

// Нет итерации, нет size
```

### Практический пример: отслеживание посещённых объектов

```js
const visited = new WeakSet();

function processNode(node) {
  if (visited.has(node)) {
    console.log("Узел уже обработан, пропускаем");
    return;
  }

  visited.add(node);
  // ... обработка узла
  console.log(`Обрабатываем: ${node.name}`);
}

const nodeA = { name: "A", children: [] };
const nodeB = { name: "B", children: [] };

processNode(nodeA); // "Обрабатываем: A"
processNode(nodeB); // "Обрабатываем: B"
processNode(nodeA); // "Узел уже обработан, пропускаем"

// Когда nodeA выйдет из области видимости,
// GC автоматически удалит его из visited
```

---

## Итог

### Сравнительная таблица всех четырёх коллекций

| Свойство | Map | Set | WeakMap | WeakSet |
|---|---|---|---|---|
| Хранит | Пары ключ-значение | Уникальные значения | Пары ключ-значение | Уникальные объекты |
| Тип ключей/элементов | Любой | Любой | Только объекты | Только объекты |
| Слабые ссылки (GC) | Нет | Нет | Да | Да |
| Итерация | Да | Да | Нет | Нет |
| `size` | Да | Да | Нет | Нет |
| Основное применение | Словарь с любыми ключами | Уникальные значения | Приватные данные / кэш | Маркировка объектов |

### Ключевой синтаксис

```js
// Map
const map = new Map([["key", "value"]]);
map.set(key, value);
map.get(key);
map.has(key);
map.delete(key);
map.size;
for (const [k, v] of map) { }

// Set
const set = new Set([1, 2, 3]);
set.add(value);
set.has(value);
set.delete(value);
set.size;
const unique = [...new Set(array)]; // удаление дубликатов

// WeakMap
const wm = new WeakMap();
wm.set(objKey, value);
wm.get(objKey);
wm.has(objKey);

// WeakSet
const ws = new WeakSet();
ws.add(obj);
ws.has(obj);
ws.delete(obj);
```

---

← [[js-advanced/05-json|JSON]] | [[js-advanced/07-regexp|Регулярные выражения]] → | [[js-fundamentals|К оглавлению]]
