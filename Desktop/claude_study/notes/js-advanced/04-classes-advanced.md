# Продвинутые классы: static, геттеры/сеттеры, миксины

> [[js-fundamentals|← Назад к оглавлению JS]]

Базовый синтаксис классов мы уже разобрали. Теперь — инструменты, которые делают классы по-настоящему мощными: статические методы и свойства, геттеры и сеттеры, приватные поля, публичные поля экземпляра и паттерн миксинов.

---

## 1. Static методы — что это и когда использовать

`static` метод принадлежит самому **классу**, а не его экземплярам. Вызвать его через экземпляр нельзя — только через имя класса.

Аналогия: представьте завод по производству машин. Завод умеет **считать**, сколько машин он выпустил, и **создавать** машины по шаблонам. Но конкретная машина с завода не умеет строить другие машины — это задача завода как такового.

```js
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // Обычный метод — доступен экземплярам
  greet() {
    return `Привет, меня зовут ${this.name}`;
  }

  // Статический метод — принадлежит классу
  static create(data) {
    return new User(data.name, data.age);
  }

  static isAdult(user) {
    return user.age >= 18;
  }
}

const alice = User.create({ name: 'Alice', age: 25 });
console.log(alice.greet());           // Привет, меня зовут Alice
console.log(User.isAdult(alice));     // true

// alice.create(...)  — ошибка! Экземпляр не знает о static методах
```

### Фабричный метод (factory method)

Паттерн «фабричный метод» — один из главных сценариев применения `static`. Он позволяет создавать объекты разными способами, не перегружая `constructor`.

```js
class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  // Фабрика из hex-строки
  static fromHex(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return new Color(r, g, b);
  }

  // Фабрика из массива
  static fromArray([r, g, b]) {
    return new Color(r, g, b);
  }

  toString() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
}

const red = Color.fromHex('#ff0000');
const green = Color.fromArray([0, 255, 0]);
console.log(red.toString());    // rgb(255, 0, 0)
console.log(green.toString());  // rgb(0, 255, 0)
```

### Утилитарные методы

```js
class MathUtils {
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

console.log(MathUtils.clamp(150, 0, 100)); // 100
console.log(MathUtils.randomInt(1, 6));    // случайное число от 1 до 6
```

---

## 2. Static свойства — счётчики и конфигурация

Static свойства хранят данные на уровне класса — общие для всех экземпляров.

```js
class Connection {
  static count = 0;
  static maxConnections = 10;

  constructor(url) {
    if (Connection.count >= Connection.maxConnections) {
      throw new Error('Превышен лимит соединений');
    }
    this.url = url;
    Connection.count++;
  }

  close() {
    Connection.count--;
    console.log(`Соединение с ${this.url} закрыто`);
  }
}

const c1 = new Connection('db://localhost');
const c2 = new Connection('api://example.com');
console.log(Connection.count); // 2
c1.close();
console.log(Connection.count); // 1
```

---

## 3. Геттеры (get) — вычисляемые свойства

Геттер — это метод, который **выглядит как свойство**. При обращении к нему JavaScript автоматически вызывает функцию.

Аналогия: спидометр в машине. Вы смотрите на него как на показание, но за панелью — вычисление на основе оборотов колеса.

```js
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  get area() {
    return this.width * this.height;
  }

  get perimeter() {
    return 2 * (this.width + this.height);
  }

  get isSquare() {
    return this.width === this.height;
  }
}

const rect = new Rectangle(5, 10);
console.log(rect.area);      // 50   — вызов без ()
console.log(rect.perimeter); // 30
console.log(rect.isSquare);  // false
```

Геттеры также удобны для форматирования данных:

```js
class Person {
  constructor(firstName, lastName, birthYear) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthYear = birthYear;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get age() {
    return new Date().getFullYear() - this.birthYear;
  }
}

const person = new Person('Ivan', 'Petrov', 1995);
console.log(person.fullName); // Ivan Petrov
console.log(person.age);      // 30 (в 2025 году)
```

---

## 4. Сеттеры (set) — валидация при записи

Сеттер вызывается автоматически при **присвоении** значения свойству. Это идеальное место для валидации.

```js
class Temperature {
  #celsius = 0;

  get celsius() {
    return this.#celsius;
  }

  set celsius(value) {
    if (typeof value !== 'number') {
      throw new TypeError('Температура должна быть числом');
    }
    if (value < -273.15) {
      throw new RangeError('Температура не может быть ниже абсолютного нуля');
    }
    this.#celsius = value;
  }

  get fahrenheit() {
    return this.#celsius * 9 / 5 + 32;
  }

  set fahrenheit(value) {
    this.celsius = (value - 32) * 5 / 9; // использует валидацию celsius
  }
}

const temp = new Temperature();
temp.celsius = 100;
console.log(temp.fahrenheit); // 212

temp.fahrenheit = 32;
console.log(temp.celsius);    // 0

temp.celsius = -300; // RangeError: Температура не может быть ниже абсолютного нуля
```

---

## 5. Приватные поля # — углублённо

Приватные поля объявляются с символом `#` и **недоступны снаружи класса** — это жёсткое ограничение на уровне языка, не просто соглашение.

> 🔧 **Механика: как JS защищает приватные поля `#field`**
>
> Приватные поля — это НЕ соглашение (как `_field`), а жёсткое ограничение движка:
> ```
> 1. При создании класса JS запоминает список его # полей в скрытом слоте [[PrivateFields]]
> 2. При обращении к #field JS проверяет: "этот код написан ВНУТРИ тела класса?"
> 3. Если код снаружи — SyntaxError ещё на этапе парсинга (до выполнения!)
> 4. Даже через obj["#field"] не достучаться — # не часть имени, а спецсинтаксис
> ```
> Отличие от замыканий: замыкание прячет переменную в функции,
> `#field` прячет свойство в классе. Оба способа дают настоящую приватность,
> но `#field` работает на уровне синтаксиса языка.

### Приватные методы

```js
class BankAccount {
  #balance = 0;
  #transactionHistory = [];

  constructor(owner, initialBalance) {
    this.owner = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    this.#validateAmount(amount);
    this.#balance += amount;
    this.#logTransaction('deposit', amount);
  }

  withdraw(amount) {
    this.#validateAmount(amount);
    if (amount > this.#balance) {
      throw new Error('Недостаточно средств');
    }
    this.#balance -= amount;
    this.#logTransaction('withdrawal', amount);
  }

  get balance() {
    return this.#balance;
  }

  get history() {
    return [...this.#transactionHistory]; // копия, не ссылка
  }

  // Приватные методы — вспомогательная логика
  #validateAmount(amount) {
    if (amount <= 0 || typeof amount !== 'number') {
      throw new Error('Сумма должна быть положительным числом');
    }
  }

  #logTransaction(type, amount) {
    this.#transactionHistory.push({
      type,
      amount,
      date: new Date().toISOString(),
      balance: this.#balance
    });
  }
}

const account = new BankAccount('Alice', 1000);
account.deposit(500);
account.withdraw(200);
console.log(account.balance);  // 1300
console.log(account.history);  // массив транзакций

// account.#balance  — SyntaxError (снаружи класса недоступно)
```

### Приватные static поля и методы

```js
class IdGenerator {
  static #nextId = 1;

  static #generateId() {
    return `ID-${String(IdGenerator.#nextId++).padStart(5, '0')}`;
  }

  static get() {
    return IdGenerator.#generateId();
  }
}

console.log(IdGenerator.get()); // ID-00001
console.log(IdGenerator.get()); // ID-00002
```

---

## 6. Публичные поля экземпляра (Class Fields)

Поля можно объявлять прямо в теле класса, без `constructor`. Это делает структуру класса нагляднее.

```js
class GameCharacter {
  // Публичные поля с дефолтными значениями
  name = 'Unknown';
  health = 100;
  level = 1;
  isAlive = true;

  // Приватные поля
  #experience = 0;

  constructor(name) {
    this.name = name;
  }

  gainExperience(points) {
    this.#experience += points;
    if (this.#experience >= this.level * 100) {
      this.#levelUp();
    }
  }

  #levelUp() {
    this.level++;
    this.health += 20;
    this.#experience = 0;
    console.log(`${this.name} достиг ${this.level} уровня!`);
  }

  getStats() {
    return {
      name: this.name,
      level: this.level,
      health: this.health,
      experience: this.#experience
    };
  }
}

const hero = new GameCharacter('Aragorn');
hero.gainExperience(150); // Aragorn достиг 2 уровня!
console.log(hero.getStats());
```

---

## 7. Mixins — паттерн множественного наследования

JavaScript поддерживает только одиночное наследование (`extends` от одного класса). Миксины — способ добавить функциональность из нескольких источников через `Object.assign`.

Аналогия: конструктор LEGO. Базовый класс — это корпус машины. Миксины — модули (GPS-навигатор, музыкальная система, парктроник), которые можно «подключить» к любому корпусу.

```js
// Миксины — просто объекты с методами
const Serializable = {
  serialize() {
    return JSON.stringify(this);
  },
  toJSON() {
    return Object.fromEntries(
      Object.entries(this).filter(([key]) => !key.startsWith('_'))
    );
  }
};

const Validatable = {
  validate() {
    const errors = [];
    if (!this.name || this.name.trim() === '') {
      errors.push('Имя не может быть пустым');
    }
    if (this.age !== undefined && (this.age < 0 || this.age > 150)) {
      errors.push('Некорректный возраст');
    }
    return errors;
  },
  isValid() {
    return this.validate().length === 0;
  }
};

const Timestampable = {
  setTimestamps() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  },
  touch() {
    this.updatedAt = new Date().toISOString();
  }
};

// Применяем миксины к классу
class UserModel {
  constructor(name, age) {
    this.name = name;
    this.age = age;
    this.setTimestamps(); // метод из Timestampable
  }
}

// Смешиваем функциональность в прототип класса
Object.assign(UserModel.prototype, Serializable, Validatable, Timestampable);

const user = new UserModel('Bob', 30);
console.log(user.isValid());    // true
console.log(user.serialize());  // JSON-строка
user.touch();                   // обновляет updatedAt
```

### Функциональный подход к миксинам

Более гибкий способ — миксины как функции, принимающие базовый класс:

```js
const WithLogging = (Base) => class extends Base {
  log(message) {
    console.log(`[${this.constructor.name}] ${message}`);
  }
};

const WithEvents = (Base) => class extends Base {
  #listeners = {};

  on(event, callback) {
    if (!this.#listeners[event]) this.#listeners[event] = [];
    this.#listeners[event].push(callback);
  }

  emit(event, data) {
    (this.#listeners[event] || []).forEach(cb => cb(data));
  }
};

class BaseService {
  constructor(name) {
    this.name = name;
  }
}

class DataService extends WithLogging(WithEvents(BaseService)) {
  fetchData(url) {
    this.log(`Запрашиваем данные с ${url}`);
    this.emit('fetch', { url });
    // ... логика запроса
  }
}

const service = new DataService('UserService');
service.on('fetch', ({ url }) => console.log(`Событие: запрос к ${url}`));
service.fetchData('https://api.example.com/users');
```

---

## 8. Когда использовать class, когда — просто объект

| Ситуация | Рекомендация |
|---|---|
| Нужно создавать **много экземпляров** с одинаковой структурой | `class` |
| Нужно **наследование** | `class` |
| Нужна **инкапсуляция** (приватные поля) | `class` |
| Логика с **состоянием**, которое меняется | `class` |
| Просто **набор данных** (конфиг, словарь) | Обычный объект `{}` |
| **Утилитарные функции** без состояния | Модуль (объект с методами или просто функции) |
| **Один экземпляр** на всё приложение (Singleton) | Обычный объект или модуль |

```js
// Хорошо: класс для сущностей с поведением
class Order {
  #items = [];
  constructor(customerId) {
    this.customerId = customerId;
    this.createdAt = new Date();
  }
  addItem(item) { this.#items.push(item); }
  get total() { return this.#items.reduce((sum, i) => sum + i.price, 0); }
}

// Хорошо: просто объект для конфигурации
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
};

// Хорошо: просто функции для утилит (не нужен класс)
const formatDate = (date) => date.toLocaleDateString('ru-RU');
const formatPrice = (price) => `${price.toFixed(2)} ₽`;
```

---

## 9. Типичные ошибки с классами

### Ошибка 1: Вызов без new

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const p = Point(1, 2); // TypeError: Cannot call a class as a function
```

### Ошибка 2: Потеря контекста this в коллбэке

```js
class Timer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    // Ошибка: this будет undefined внутри setTimeout
    setTimeout(function() {
      this.seconds++; // TypeError!
    }, 1000);

    // Правильно: стрелочная функция сохраняет this
    setTimeout(() => {
      this.seconds++;
    }, 1000);
  }
}
```

### Ошибка 3: Мутация приватного массива через геттер

```js
class Library {
  #books = ['Война и мир', '1984'];

  // Плохо: возвращает ссылку, массив можно изменить снаружи
  get booksBad() {
    return this.#books;
  }

  // Хорошо: возвращает копию
  get books() {
    return [...this.#books];
  }
}

const lib = new Library();
lib.booksBad.push('Хакер'); // изменяет приватный массив!
lib.books.push('Хакер');    // безопасно — изменяет копию
```

### Ошибка 4: Объявление методов в constructor (дублирование в памяти)

```js
// Плохо: каждый экземпляр создаёт новую функцию
class BadExample {
  constructor() {
    this.greet = function() { return 'Hello'; }; // новая функция для каждого!
  }
}

// Хорошо: метод в прототипе — один на всех
class GoodExample {
  greet() { return 'Hello'; }
}
```

---

## 10. Итог

```js
// --- Static ---
class MyClass {
  static count = 0;                        // статическое свойство
  static create(...args) {                 // статический метод (фабрика)
    return new MyClass(...args);
  }
}
MyClass.count;       // обращение к статике через класс
MyClass.create();

// --- Геттеры и сеттеры ---
class Circle {
  #radius = 0;
  get radius() { return this.#radius; }    // геттер — чтение
  set radius(v) {                          // сеттер — запись с валидацией
    if (v < 0) throw new RangeError('radius >= 0');
    this.#radius = v;
  }
  get area() { return Math.PI * this.#radius ** 2; } // вычисляемое свойство
}

// --- Приватные поля и методы ---
class Secure {
  #secret = 'hidden';                      // приватное поле
  #validate() { /* ... */ }               // приватный метод
  static #instances = 0;                  // приватное статическое поле
}

// --- Публичные поля ---
class Config {
  debug = false;                           // поле с дефолтом без constructor
  version = '1.0.0';
}

// --- Миксин через Object.assign ---
const Flyable = { fly() { console.log('flying'); } };
Object.assign(MyClass.prototype, Flyable);

// --- Миксин через функцию ---
const WithLog = (Base) => class extends Base {
  log(msg) { console.log(msg); }
};
class Extended extends WithLog(MyClass) {}
```

---

← [[js-advanced/03-prototypes|Прототипы]] | [[js-advanced/05-json|JSON]] → | [[js-fundamentals|К оглавлению]]
