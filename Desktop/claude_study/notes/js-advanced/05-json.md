# JSON — работа с данными

> [[js-fundamentals|← Назад к оглавлению JS]]

Данные нужно передавать между клиентом и сервером, сохранять в файлы, читать из баз данных. JSON — универсальный язык для всего этого. Он настолько распространён, что знание его тонкостей — обязательный навык любого JavaScript-разработчика.

---

## 1. Что такое JSON

**JSON** (JavaScript Object Notation) — текстовый формат для хранения и передачи структурированных данных. Придуман Дугласом Крокфордом в начале 2000-х как облегчённая альтернатива XML.

Аналогия: JSON — это как **накладная на товар**. Не сам товар, а стандартизированный документ, в котором записано, что именно пересылается. Любая система, знающая стандарт, может эту накладную прочитать — независимо от языка программирования.

- JSON поддерживается во всех современных языках: Python, Java, Go, PHP, Ruby...
- Стандарт описан в [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259)
- Расширение файлов: `.json`
- MIME-тип: `application/json`

---

## 2. Синтаксис JSON — правила

JSON похож на JavaScript-объект, но строже. Несколько ключевых правил:

| Правило | JSON | JavaScript |
|---|---|---|
| Ключи | Только в **двойных** кавычках | Можно без кавычек |
| Строки | Только **двойные** кавычки | Одинарные и обратные тоже |
| Функции | **Запрещены** | Разрешены |
| `undefined` | **Запрещён** | Разрешён |
| Комментарии | **Запрещены** | Разрешены |
| Trailing comma | **Запрещена** | Разрешена |

```json
{
  "name": "Alice",
  "age": 30,
  "isActive": true,
  "score": null,
  "tags": ["admin", "user"],
  "address": {
    "city": "Moscow",
    "zip": "101000"
  }
}
```

### Допустимые типы в JSON

```js
// Примитивы
"строка"        // string (только двойные кавычки)
42              // number
3.14            // number
true / false    // boolean
null            // null

// Составные
{ "key": "value" }    // object
[1, 2, 3]             // array

// НЕ поддерживаются в JSON:
undefined
NaN
Infinity
function() {}
Symbol()
new Date()   // дата превращается в строку "2025-01-01T00:00:00.000Z"
```

---

## 3. JSON.parse() — строка в объект

`JSON.parse()` берёт JSON-строку и превращает её в JavaScript-значение.

```js
const jsonString = '{"name":"Bob","age":25,"hobbies":["chess","coding"]}';

const user = JSON.parse(jsonString);
console.log(user.name);       // Bob
console.log(user.hobbies[1]); // coding
console.log(typeof user);     // object
```

### Пример с API-ответом

```js
// Так выглядит типичный ответ сервера
async function fetchUser(id) {
  const response = await fetch(`https://api.example.com/users/${id}`);
  const jsonText = await response.text();   // получили строку

  const user = JSON.parse(jsonText);        // разобрали в объект
  return user;
}

// fetch().json() делает это автоматически, но понимать механизм важно
```

### Что бросает ошибку

`JSON.parse()` выбрасывает `SyntaxError` при невалидном JSON:

```js
// Все эти вызовы — SyntaxError

JSON.parse("hello");               // не строка в кавычках
JSON.parse("{name: 'Alice'}");     // одинарные кавычки и ключ без кавычек
JSON.parse('{"a": 1,}');           // trailing comma
JSON.parse(undefined);             // undefined

// Безопасный парсинг с try/catch
function safeParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.warn('Невалидный JSON:', error.message);
    return fallback;
  }
}

const result = safeParse('not json', {});
console.log(result); // {}
```

---

## 4. JSON.stringify() — объект в строку

`JSON.stringify()` сериализует JavaScript-значение в JSON-строку.

```js
const user = {
  name: 'Carol',
  age: 28,
  city: 'Saint Petersburg'
};

const json = JSON.stringify(user);
console.log(json);
// {"name":"Carol","age":28,"city":"Saint Petersburg"}
```

### Форматирование — третий аргумент

Сигнатура: `JSON.stringify(value, replacer, space)`

`space` — количество пробелов для отступов (или строка):

```js
const data = { id: 1, name: 'Product', price: 99.99, tags: ['sale', 'new'] };

// Без форматирования — компактно
console.log(JSON.stringify(data));
// {"id":1,"name":"Product","price":99.99,"tags":["sale","new"]}

// С отступами — читаемо
console.log(JSON.stringify(data, null, 2));
// {
//   "id": 1,
//   "name": "Product",
//   "price": 99.99,
//   "tags": [
//     "sale",
//     "new"
//   ]
// }

// Со строкой в качестве отступа
console.log(JSON.stringify(data, null, '\t')); // табуляция
```

### Что теряется при сериализации

```js
const obj = {
  name: 'Test',
  value: undefined,          // потеряется (undefined — не JSON)
  fn: () => 'hello',         // потеряется (функции — не JSON)
  sym: Symbol('id'),         // потеряется (Symbol — не JSON)
  num: NaN,                  // станет null
  inf: Infinity,             // станет null
  date: new Date('2025-01-01'), // станет строкой "2025-01-01T00:00:00.000Z"
  nested: { a: 1 }           // сохранится
};

console.log(JSON.stringify(obj));
// {"name":"Test","num":null,"inf":null,"date":"2025-01-01T00:00:00.000Z","nested":{"a":1}}
// Обратите внимание: value, fn и sym полностью исчезли!
```

---

## 5. Replacer в stringify — фильтрация полей

Второй аргумент `replacer` позволяет контролировать, что попадёт в JSON.

### Replacer как массив — белый список полей

```js
const user = {
  id: 1,
  name: 'Dave',
  password: 'secret123',   // не хотим это в JSON!
  email: 'dave@example.com',
  internalData: { debug: true }
};

// Только указанные поля попадут в результат
const safeJson = JSON.stringify(user, ['id', 'name', 'email'], 2);
console.log(safeJson);
// {
//   "id": 1,
//   "name": "Dave",
//   "email": "dave@example.com"
// }
```

### Replacer как функция — гибкая трансформация

```js
const data = {
  title: 'Report',
  revenue: 1500000,
  cost: 750000,
  internalCode: 'XYZ-99',    // хотим скрыть
  updatedAt: new Date()
};

const result = JSON.stringify(data, (key, value) => {
  // Скрываем поля с "internal" в названии
  if (key.includes('internal')) return undefined;

  // Форматируем число в читаемый вид
  if (key === 'revenue' || key === 'cost') {
    return `${value.toLocaleString('ru-RU')} ₽`;
  }

  return value; // всё остальное — как есть
}, 2);

console.log(result);
// {
//   "title": "Report",
//   "revenue": "1 500 000 ₽",
//   "cost": "750 000 ₽",
//   "updatedAt": "2025-..."
// }
```

---

## 6. Reviver в parse — преобразование при парсинге

`JSON.parse(str, reviver)` — функция `reviver` вызывается для каждого значения при разборе и позволяет его преобразовать.

Самый частый сценарий: дата сохраняется как строка, при парсинге хочется получить объект `Date`.

```js
const jsonFromServer = `{
  "id": 42,
  "title": "Meeting",
  "startDate": "2025-06-15T10:00:00.000Z",
  "endDate": "2025-06-15T11:30:00.000Z",
  "attendees": 12
}`;

const event = JSON.parse(jsonFromServer, (key, value) => {
  // Превращаем строки с датами в объекты Date
  if (key === 'startDate' || key === 'endDate') {
    return new Date(value);
  }
  return value;
});

console.log(event.startDate instanceof Date); // true
console.log(event.startDate.getHours());      // 10

// Более надёжный вариант — распознаём даты по формату
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function dateReviver(key, value) {
  if (typeof value === 'string' && ISO_DATE_REGEX.test(value)) {
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date;
  }
  return value;
}

const parsed = JSON.parse(jsonFromServer, dateReviver);
console.log(parsed.endDate.getMonth()); // 5 (июнь — месяц 5, т.к. отсчёт с 0)
```

---

## 7. Глубокое копирование через JSON

Самый простой способ сделать **глубокую копию** объекта — сериализовать и сразу разобрать.

```js
const original = {
  name: 'Eve',
  scores: [10, 20, 30],
  address: { city: 'Kazan', zip: '420000' }
};

// Поверхностная копия — вложенные объекты всё ещё общие!
const shallow = { ...original };
shallow.address.city = 'Ufa';
console.log(original.address.city); // 'Ufa' — оригинал изменился!

// Глубокая копия через JSON
const deep = JSON.parse(JSON.stringify(original));
deep.address.city = 'Sochi';
console.log(original.address.city); // 'Ufa' — оригинал не тронут
```

### Ограничения JSON-копирования

```js
const complex = {
  fn: () => 'hello',        // исчезнет
  date: new Date(),         // станет строкой
  undef: undefined,         // исчезнет
  regexp: /pattern/g,       // станет {}
  map: new Map([[1, 'a']]), // станет {}
  set: new Set([1, 2, 3])   // станет {}
};

const copy = JSON.parse(JSON.stringify(complex));
console.log(copy);
// { date: '2025-...', regexp: {}, map: {}, set: {} }
// fn и undef исчезли

// Для сложных структур используйте structuredClone()
const betterCopy = structuredClone(complex);
// поддерживает Date, Map, Set, RegExp, но не функции
```

---

## 8. Типичные ошибки

### Ошибка 1: Trailing comma

```js
// SyntaxError в JSON!
const bad = '{"name": "Frank", "age": 30,}';
//                                          ^ лишняя запятая

JSON.parse(bad); // SyntaxError: Unexpected token }
```

### Ошибка 2: Одинарные кавычки

```js
// SyntaxError: JSON требует двойные кавычки
JSON.parse("{'name': 'Grace'}"); // SyntaxError
JSON.parse('{"name": "Grace"}'); // OK
```

### Ошибка 3: Потеря undefined

```js
const obj = { a: 1, b: undefined, c: 3 };
const json = JSON.stringify(obj);
console.log(json); // {"a":1,"c":3}  — b исчезло!

const restored = JSON.parse(json);
console.log('b' in restored); // false
```

### Ошибка 4: Циклические ссылки

```js
const parent = { name: 'parent' };
const child = { name: 'child', parent: parent };
parent.child = child; // цикл!

JSON.stringify(parent);
// TypeError: Converting circular structure to JSON
```

Решение для циклических структур:

```js
function stringifyCircular(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return '[Circular]';
      seen.add(value);
    }
    return value;
  });
}

console.log(stringifyCircular(parent));
// {"name":"parent","child":{"name":"child","parent":"[Circular]"}}
```

---

## 9. Практический пример: работа с localStorage

`localStorage` хранит только строки. JSON — мост между объектами JavaScript и строковым хранилищем.

```js
// Утилиты для работы с localStorage через JSON
const storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Ошибка записи в localStorage:', error);
    }
  },

  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item);
    } catch (error) {
      console.error('Ошибка чтения из localStorage:', error);
      return fallback;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  }
};

// Использование
const userSettings = {
  theme: 'dark',
  language: 'ru',
  notifications: true,
  fontSize: 16
};

storage.set('settings', userSettings);

const loaded = storage.get('settings', { theme: 'light' });
console.log(loaded.theme); // 'dark'

// Работа с массивами
const cart = [
  { id: 1, name: 'Ноутбук', price: 75000, qty: 1 },
  { id: 2, name: 'Мышь', price: 2500, qty: 2 }
];

storage.set('cart', cart);

const savedCart = storage.get('cart', []);
const total = savedCart.reduce((sum, item) => sum + item.price * item.qty, 0);
console.log(`Итого: ${total.toLocaleString('ru-RU')} ₽`); // 80 000 ₽
```

### Кэширование данных с TTL

```js
function createCachedStorage(ttlMs = 5 * 60 * 1000) {
  return {
    set(key, value) {
      storage.set(key, {
        data: value,
        expiresAt: Date.now() + ttlMs
      });
    },

    get(key) {
      const wrapper = storage.get(key);
      if (!wrapper) return null;
      if (Date.now() > wrapper.expiresAt) {
        storage.remove(key);
        return null; // кэш устарел
      }
      return wrapper.data;
    }
  };
}

const cache = createCachedStorage(60_000); // 1 минута
cache.set('apiUsers', [{ id: 1, name: 'Alice' }]);
const users = cache.get('apiUsers'); // вернёт данные, если не истёк срок
```

---

## 10. Итог

```js
// --- Синтаксис JSON ---
// Только двойные кавычки, нет функций/undefined/Symbol/trailing comma

// --- JSON.parse ---
const obj = JSON.parse('{"key":"value"}');       // строка -> объект
const safe = JSON.parse(str) || fallback;        // без try/catch ненадёжно

// С reviver
JSON.parse(str, (key, value) => {
  if (key === 'date') return new Date(value);
  return value;
});

// --- JSON.stringify ---
JSON.stringify(obj);              // без форматирования
JSON.stringify(obj, null, 2);     // с отступами (читаемо)
JSON.stringify(obj, null, '\t');  // с табуляцией

// С replacer-массивом (белый список)
JSON.stringify(obj, ['id', 'name']);

// С replacer-функцией
JSON.stringify(obj, (key, value) => {
  if (key === 'password') return undefined; // скрываем поле
  return value;
});

// --- Что теряется в stringify ---
// undefined -> исчезает
// function  -> исчезает
// Symbol    -> исчезает
// NaN       -> null
// Infinity  -> null
// Date      -> строка ISO

// --- Глубокое копирование ---
const copy = JSON.parse(JSON.stringify(original)); // просто, но теряет типы
const copy2 = structuredClone(original);           // лучше, нет функций

// --- Циклические ссылки ---
// JSON.stringify(circular) -> TypeError
// Решение: replacer с WeakSet для отслеживания посещённых объектов

// --- localStorage ---
localStorage.setItem('key', JSON.stringify(value));
const value = JSON.parse(localStorage.getItem('key') || 'null');
```

---

← [[js-advanced/04-classes-advanced|Продвинутые классы]] | [[js-advanced/06-map-set|Map и Set]] → | [[js-fundamentals|К оглавлению]]
