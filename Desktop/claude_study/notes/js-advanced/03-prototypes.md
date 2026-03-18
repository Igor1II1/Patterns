# Глава 3: Прототипы и прототипное наследование

> [[js-fundamentals|← Назад к оглавлению JS]]

---

## Что такое прототип?

**Прототип** — это объект, которому другой объект «делегирует» поиск свойств и методов, которых у него самого нет.

**Аналогия — цепочка делегирования:** представь стажёра в офисе. Ему задают вопрос. Если он знает ответ — отвечает сам. Не знает — спрашивает старшего коллегу. Тот не знает — идёт к менеджеру. Менеджер не знает — к директору. Каждый следующий в цепочке — это прототип предыдущего. Если никто не знает — приходит ошибка `undefined`.

JavaScript работает точно так же: когда ты обращаешься к свойству объекта, JS ищет его сначала в самом объекте, потом в его прототипе, потом в прототипе прототипа — и так до конца цепочки.

```js
const animal = {
  isAlive: true,
  breathe() {
    return "breathing...";
  }
};

const dog = {
  name: "Rex",
  bark() {
    return "Woof!";
  }
};

// Делаем animal прототипом dog
Object.setPrototypeOf(dog, animal);

console.log(dog.name);      // "Rex"     — собственное свойство dog
console.log(dog.isAlive);   // true      — взято из прототипа animal
console.log(dog.breathe()); // "breathing..." — метод из прототипа
```

---

## `[[Prototype]]` — внутренний слот

Каждый объект в JavaScript имеет внутренний скрытый слот `[[Prototype]]`. Это либо ссылка на другой объект (его прототип), либо `null` (конец цепочки).

### Как получить доступ к прототипу

**Устаревший способ — `__proto__`** (дандер-прото):

```js
const obj = { x: 1 };

console.log(obj.__proto__);              // Object.prototype (прототип всех объектов)
console.log(obj.__proto__.__proto__);   // null — конец цепочки
```

> `__proto__` — это историческое нестандартное свойство. Оно есть во всех браузерах, но не рекомендуется к использованию в современном коде.

**Современный способ — `Object.getPrototypeOf()` и `Object.setPrototypeOf()`:**

```js
const parent = { role: "parent" };
const child  = { role: "child" };

Object.setPrototypeOf(child, parent); // устанавливаем прототип

console.log(Object.getPrototypeOf(child) === parent); // true
console.log(child.role);                              // "child" — своё свойство
```

> **Правило:** для чтения используй `Object.getPrototypeOf()`, для записи — `Object.setPrototypeOf()`. Не трогай `__proto__` в новом коде.

---

## Прототипная цепочка — как JS ищет методы

Разберём на конкретном примере — откуда берётся метод `toString()`.

```js
const user = {
  name: "Alice",
  age: 30
};

console.log(user.toString()); // "[object Object]"
// Но мы не писали toString() в user!
```

Что делает JS при `user.toString()`:

1. Смотрит в `user` — свойства `name`, `age`. Метода `toString` нет.
2. Смотрит в `user[[Prototype]]` — это `Object.prototype`.
3. Находит `toString` в `Object.prototype` — вызывает его.

```
user
  ├── name: "Alice"
  ├── age: 30
  └── [[Prototype]] → Object.prototype
                        ├── toString()
                        ├── hasOwnProperty()
                        ├── valueOf()
                        └── [[Prototype]] → null  (конец цепочки)
```

> 🔧 **Механика: как JS ищет метод при наследовании (method lookup)**
>
> При вызове `obj.method()` JS выполняет поиск по цепочке:
> ```
> Шаг 1: Есть method в самом obj?           → Да → вызвать, СТОП
> Шаг 2: Есть в obj.__proto__ (родитель)?    → Да → вызвать, СТОП
> Шаг 3: Есть в obj.__proto__.__proto__?     → Да → вызвать, СТОП
> ...продолжаем вверх...
> Шаг N: Дошли до null (конец цепочки)?      → undefined (TypeError при вызове)
> ```
> Пример для `rex.speak()` (Dog extends Animal):
> ```
> rex.speak → rex (нет speak) → Dog.prototype (нет speak) → Animal.prototype (ЕСТЬ!) → вызов
> rex.bark  → rex (нет bark)  → Dog.prototype (ЕСТЬ!)     → вызов
> ```
> Первое найденное совпадение побеждает — так работает переопределение (override).

Для массивов цепочка длиннее:

```js
const arr = [1, 2, 3];

// arr → Array.prototype → Object.prototype → null

console.log(arr.map);         // функция — из Array.prototype
console.log(arr.toString);    // функция — из Object.prototype (делегирование)
console.log(arr.hasOwnProperty("length")); // true — length — собственное свойство массива
```

---

## `.prototype` на функциях-конструкторах

Каждая функция в JavaScript имеет свойство `.prototype` (не путать с `[[Prototype]]`!). Оно используется как прототип для объектов, созданных через `new`.

```js
function Person(name, age) {
  this.name = name;
  this.age  = age;
}

// Добавляем метод в prototype — он будет доступен всем экземплярам
Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}, ${this.age} years old`;
};

Person.prototype.isAdult = function() {
  return this.age >= 18;
};

const alice = new Person("Alice", 30);
const bob   = new Person("Bob", 15);

console.log(alice.greet());    // "Hi, I'm Alice, 30 years old"
console.log(bob.isAdult());    // false
```

**Что происходит при `new Person(...)`:**
1. Создаётся новый пустой объект `{}`
2. Его `[[Prototype]]` устанавливается в `Person.prototype`
3. `this` внутри конструктора указывает на этот новый объект
4. Конструктор записывает свойства через `this`
5. Новый объект возвращается

```js
// Метод не копируется в каждый объект — он один на всех через прототип
console.log(alice.greet === bob.greet); // true — одна и та же функция!
```

> **Важно:** методы живут в `.prototype` — экономия памяти. Если бы метод копировался в каждый объект, при 10 000 экземпляров у нас было бы 10 000 копий одной функции.

---

## Как работает `class` под капотом

`class` в JavaScript — это **синтаксический сахар** над прототипами. Под капотом тот же механизм.

### Сравнение: функция-конструктор vs class

```js
// === СТАРЫЙ СПОСОБ: функция-конструктор ===
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

// Наследование через Object.create
function Dog(name, breed) {
  Animal.call(this, name); // вызываем конструктор родителя
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // восстанавливаем конструктор

Dog.prototype.bark = function() {
  return `${this.name} barks!`;
};

const rex = new Dog("Rex", "Labrador");
console.log(rex.speak()); // "Rex makes a sound" — из Animal.prototype
console.log(rex.bark());  // "Rex barks!" — из Dog.prototype
```

```js
// === НОВЫЙ СПОСОБ: class (ES6) — тот же результат ===
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // вызываем constructor Animal
    this.breed = breed;
  }

  bark() {
    return `${this.name} barks!`;
  }
}

const rex = new Dog("Rex", "Labrador");
console.log(rex.speak()); // "Rex makes a sound"
console.log(rex.bark());  // "Rex barks!"
```

**Под капотом результат идентичен.** `class` просто удобнее читать и писать. Можно проверить:

```js
console.log(typeof Animal); // "function" — class это функция!

console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype); // true
// Это именно то, что мы делали вручную через Object.create
```

---

## `Object.create()` — создание объекта с заданным прототипом

`Object.create(proto)` создаёт новый пустой объект с указанным прототипом.

```js
const vehicleProto = {
  move() {
    return `${this.type} is moving at ${this.speed} km/h`;
  },
  stop() {
    return `${this.type} stopped`;
  }
};

// Создаём объект, у которого прототип — vehicleProto
const car = Object.create(vehicleProto);
car.type  = "Car";
car.speed = 120;

const bike = Object.create(vehicleProto);
bike.type  = "Bike";
bike.speed = 25;

console.log(car.move());  // "Car is moving at 120 km/h"
console.log(bike.stop()); // "Bike stopped"

// Методы move и stop — в прототипе, не в самих объектах
console.log(car.hasOwnProperty("move")); // false — метод в прототипе
console.log(car.hasOwnProperty("type")); // true  — собственное свойство
```

**`Object.create(null)`** — объект вообще без прототипа (чистый словарь):

```js
const pureDict = Object.create(null);
pureDict.key = "value";

// У него нет toString, hasOwnProperty и других унаследованных методов
console.log(pureDict.toString); // undefined — нет прототипа, нет метода
```

---

## `instanceof` — как работает

`instanceof` проверяет, встречается ли `.prototype` конструктора **в прототипной цепочке** объекта.

```js
class Shape {}
class Circle extends Shape {}
class Triangle extends Shape {}

const c = new Circle();

console.log(c instanceof Circle);  // true  — Circle.prototype в цепочке c
console.log(c instanceof Shape);   // true  — Shape.prototype тоже в цепочке!
console.log(c instanceof Triangle); // false — Triangle.prototype не встречается

// Цепочка c:  c → Circle.prototype → Shape.prototype → Object.prototype → null
```

**Ручная имитация `instanceof`:**

```js
function myInstanceOf(obj, Constructor) {
  let proto = Object.getPrototypeOf(obj);

  while (proto !== null) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto); // идём вверх по цепочке
  }

  return false;
}

console.log(myInstanceOf(c, Circle)); // true
console.log(myInstanceOf(c, Shape));  // true
console.log(myInstanceOf(c, Array));  // false
```

> **Осторожно:** `instanceof` проверяет прототипную цепочку, а не «тип» в классическом смысле. Это может дать неожиданный результат при работе с объектами из разных `iframe` или после смены `prototype`.

---

## `hasOwnProperty` vs оператор `in`

Два способа проверить наличие свойства — они отличаются тем, смотрят ли в прототипную цепочку.

```js
const parent = { inherited: true };
const child  = Object.create(parent);
child.own = "mine";

// in — проверяет ВСЮ цепочку (собственное + унаследованное)
console.log("own"       in child); // true  — собственное свойство
console.log("inherited" in child); // true  — унаследованное от parent
console.log("missing"   in child); // false — нигде нет

// hasOwnProperty — проверяет ТОЛЬКО собственные свойства
console.log(child.hasOwnProperty("own"));       // true  — собственное
console.log(child.hasOwnProperty("inherited")); // false — это в прототипе!
```

**Практическое правило:** если тебе важно отделить собственные свойства от унаследованных — используй `hasOwnProperty`. Например, при итерации через `for...in`:

```js
const obj = Object.create({ protoMethod() {} });
obj.name = "Alice";
obj.age  = 30;

// for...in проходит по ВСЕМ свойствам, включая прототип
for (const key in obj) {
  console.log(key); // "name", "age", "protoMethod" — всё подряд!
}

// Фильтруем только собственные
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key); // "name", "age" — только свои
  }
}

// Современная альтернатива: Object.keys() — только собственные, перечисляемые
console.log(Object.keys(obj)); // ["name", "age"]
```

---

## Переопределение методов прототипа

Объект может иметь собственный метод с тем же именем, что и метод в прототипе. JS найдёт собственный первым — это и есть переопределение (override).

```js
function Vehicle(type) {
  this.type = type;
}

Vehicle.prototype.describe = function() {
  return `I am a ${this.type}`;
};

Vehicle.prototype.toString = function() {
  return `[Vehicle: ${this.type}]`;
};

const car = new Vehicle("car");
const bus = new Vehicle("bus");

// Переопределяем describe ТОЛЬКО для конкретного объекта
bus.describe = function() {
  return `I am a big ${this.type} with many seats`;
};

console.log(car.describe()); // "I am a car"        — из прототипа
console.log(bus.describe()); // "I am a big bus with many seats" — собственный

// Как вызвать метод прототипа явно, если он переопределён:
const protoDescribe = Vehicle.prototype.describe;
console.log(protoDescribe.call(bus)); // "I am a bus" — метод прототипа с bus как this
```

---

## Итог — схема прототипной цепочки

```js
// Вся схема в одном примере:

class Animal {
  constructor(name) { this.name = name; }
  speak()           { return `${this.name} speaks`; }
}

class Dog extends Animal {
  constructor(name) { super(name); }
  bark()            { return `${this.name} barks`; }
}

const rex = new Dog("Rex");

/*
Прототипная цепочка rex:

  rex (объект)
  ├── name: "Rex"              ← собственное свойство
  └── [[Prototype]] ──────────→ Dog.prototype
                                  ├── bark()
                                  └── [[Prototype]] ──→ Animal.prototype
                                                          ├── speak()
                                                          └── [[Prototype]] ──→ Object.prototype
                                                                                  ├── toString()
                                                                                  ├── hasOwnProperty()
                                                                                  └── [[Prototype]] → null

Итог ключевых правил:

  [[Prototype]]              — внутренний слот, ссылка на прототип объекта
  Object.getPrototypeOf(obj) — правильный способ получить прототип (не __proto__)
  Object.create(proto)       — создать объект с заданным прототипом
  fn.prototype               — объект, который станет прототипом экземпляров new fn()
  instanceof                 — проверяет цепочку через .prototype конструктора
  hasOwnProperty             — только собственные свойства (не из прототипа)
  in                         — собственные + унаследованные
  class = function + .prototype (синтаксический сахар, не новая сущность)
*/
```

---

| Инструмент | Что делает |
|---|---|
| `Object.getPrototypeOf(obj)` | Читает прототип объекта |
| `Object.setPrototypeOf(obj, proto)` | Устанавливает прототип (медленная операция) |
| `Object.create(proto)` | Создаёт объект с нужным прототипом |
| `obj.hasOwnProperty(key)` | Проверяет только собственные свойства |
| `key in obj` | Проверяет все свойства включая цепочку |
| `obj instanceof Constructor` | Проверяет цепочку через `.prototype` |
| `Object.keys(obj)` | Массив собственных перечисляемых ключей |

---

*← [[js-advanced/02-closures|Замыкания]] | [[js-advanced/04-classes-advanced|Продвинутые классы]] → | [[js-fundamentals|К оглавлению]]*
