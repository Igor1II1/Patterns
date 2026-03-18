# Глава 2. Интерфейсы и псевдонимы типов

> << [[typescript/01-basics]] | [[typescript-fundamentals]] | **Интерфейсы** | [[typescript/03-generics]] >>

---

## Зачем эта тема существует?

Базовые типы (`string`, `number`) описывают простые значения. Но в реальных программах ты работаешь с объектами --- пользователями, товарами, заказами. Нужен способ описать **форму объекта**: какие у него свойства и какого они типа. Для этого в TypeScript есть интерфейсы и псевдонимы типов.

---

## 1. Интерфейсы (interface)

### Что это такое?

Интерфейс --- это описание формы объекта. Он говорит: "объект с таким типом должен иметь такие-то свойства с такими-то типами".

### Как это работает?

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

// Объект ДОЛЖЕН соответствовать интерфейсу
const user: User = {
  name: "Игорь",
  age: 25,
  email: "igor@example.com"
};

// Ошибка --- не хватает свойства email
// const user2: User = { name: "Аня", age: 22 };

// Ошибка --- лишнее свойство
// const user3: User = { name: "Борис", age: 30, email: "b@b.com", phone: "123" };

// В функциях
function greetUser(user: User): string {
  return `Привет, ${user.name}! Тебе ${user.age} лет.`;
}
```

### Плохой и хороший пример

```typescript
// Плохо --- описываем структуру прямо в параметре (нечитаемо, не переиспользуемо)
function sendEmail(user: { name: string; age: number; email: string }) {
  // ...
}

// Хорошо --- выносим в интерфейс
interface User {
  name: string;
  age: number;
  email: string;
}

function sendEmail(user: User) {
  // ...
}
```

### Мини-проверка

Что произойдет, если объект не содержит всех свойств, указанных в интерфейсе?

---

## 2. Необязательные свойства и readonly

### Что это такое?

Не все свойства объекта обязательны. Знак `?` делает свойство необязательным. Модификатор `readonly` запрещает изменение свойства после создания.

### Как это работает?

```typescript
interface User {
  readonly id: number;      // нельзя изменить после создания
  name: string;             // обязательное
  age: number;              // обязательное
  email?: string;           // необязательное
  phone?: string;           // необязательное
}

const user: User = {
  id: 1,
  name: "Игорь",
  age: 25
  // email и phone можно не указывать
};

// user.id = 2;  // Ошибка: Cannot assign to 'id' because it is a read-only property

// Необязательное свойство имеет тип string | undefined
console.log(user.email);           // undefined
console.log(user.email?.toUpperCase()); // безопасный доступ через ?.
```

### Плохой и хороший пример

```typescript
// Плохо --- все свойства обязательные, приходится передавать пустые строки
interface Config {
  host: string;
  port: number;
  database: string;
  password: string;  // не всегда нужен
  ssl: boolean;      // не всегда нужен
}
const config: Config = {
  host: "localhost",
  port: 5432,
  database: "mydb",
  password: "",    // вынуждены передавать пустую строку
  ssl: false       // вынуждены передавать значение по умолчанию
};

// Хорошо --- необязательные свойства отмечены
interface Config {
  host: string;
  port: number;
  database: string;
  password?: string;
  ssl?: boolean;
}
const config: Config = {
  host: "localhost",
  port: 5432,
  database: "mydb"
  // password и ssl просто не указываем
};
```

### Мини-проверка

Какой тип будет у свойства `email`, если оно описано как `email?: string`?

---

## 3. Псевдонимы типов (type alias)

### Что это такое?

`type` --- это способ дать имя любому типу. В отличие от `interface`, `type` может описывать не только объекты, но и примитивы, объединения, кортежи --- что угодно.

### Как это работает?

```typescript
// Псевдоним для примитива
type ID = string | number;

// Псевдоним для объекта (похоже на interface)
type User = {
  name: string;
  age: number;
  email?: string;
};

// Псевдоним для функции
type Formatter = (input: string) => string;

// Псевдоним для кортежа
type Coordinates = [number, number];

// Псевдоним для литерального объединения
type Theme = "light" | "dark" | "system";

// Использование
let userId: ID = "abc-123";
let coords: Coordinates = [55.75, 37.61];
let currentTheme: Theme = "dark";

const toUpper: Formatter = (s) => s.toUpperCase();
```

### Мини-проверка

Можно ли создать `type` для union type? А `interface`?

---

## 4. interface vs type

### Что это такое?

Оба инструмента описывают типы, но между ними есть различия.

### Как это работает?

```typescript
// --- Общее: оба описывают объекты ---

interface UserI {
  name: string;
  age: number;
}

type UserT = {
  name: string;
  age: number;
};

// Оба работают одинаково для описания объектов
const user1: UserI = { name: "Аня", age: 22 };
const user2: UserT = { name: "Борис", age: 30 };
```

### Ключевые различия

```typescript
// 1. type может описывать примитивы и union --- interface не может
type ID = string | number;     // ок
type Theme = "light" | "dark"; // ок
// interface ID = string | number; // невозможно

// 2. interface можно "дополнить" (declaration merging) --- type нельзя
interface Animal {
  name: string;
}
interface Animal {
  age: number;
}
// Теперь Animal = { name: string; age: number } --- объединились!

// type Animal = { name: string };
// type Animal = { age: number }; // Ошибка: Duplicate identifier

// 3. Расширение --- разный синтаксис
interface Dog extends Animal {
  breed: string;
}

type Cat = Animal & {
  indoor: boolean;
};
```

### Когда что использовать?

| Ситуация | Используй |
|----------|-----------|
| Описание объекта | `interface` (по соглашению) |
| Union type (`"a" \| "b"`) | `type` (interface не умеет) |
| Расширение библиотечных типов | `interface` (declaration merging) |
| Типы для props в React | `interface` (стандарт) или `type` (оба ок) |

**Правило на практике:** используй `interface` для объектов, `type` для всего остального.

### Частые заблуждения

- "interface и type --- это одно и то же". Нет. `interface` расширяется через `extends` и поддерживает declaration merging. `type` может описывать union types и примитивы.
- "type лучше, потому что более гибкий". На практике `interface` лучше для объектов --- он дает понятные ошибки и работает с declaration merging.

### Мини-проверка

Почему для описания `"light" | "dark"` нельзя использовать `interface`?

---

## 5. Расширение интерфейсов (extends)

### Что это такое?

Интерфейс может наследовать свойства другого интерфейса через `extends`. Это как сказать "этот тип --- такой же, как родительский, плюс дополнительные свойства".

### Как это работает?

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  company: string;
  position: string;
}

// Employee имеет все свойства Person + свои
const employee: Employee = {
  name: "Игорь",
  age: 25,
  company: "Яндекс",
  position: "Junior Developer"
};

// Множественное наследование
interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

interface Article extends Person, Timestamps {
  title: string;
  content: string;
}
// Article = { name, age, createdAt, updatedAt, title, content }
```

### Мини-проверка

Может ли интерфейс расширять несколько других интерфейсов одновременно?

---

## 6. Индексные сигнатуры

### Что это такое?

Когда ты не знаешь заранее, какие ключи будут у объекта, но знаешь типы ключей и значений --- используй индексную сигнатуру.

### Как это работает?

```typescript
// Объект-словарь: ключи --- строки, значения --- числа
interface WordCount {
  [word: string]: number;
}

const counts: WordCount = {
  "привет": 5,
  "мир": 3,
  "код": 10
};

counts["новое_слово"] = 1; // ок, любой строковый ключ

// Комбинация с обычными свойствами
interface UserData {
  name: string;                    // обязательное свойство
  [key: string]: string | number;  // остальные ключи
}

const data: UserData = {
  name: "Игорь",
  age: 25,          // ок, number входит в string | number
  city: "Москва"    // ок, string входит в string | number
};
```

### Плохой и хороший пример

```typescript
// Плохо --- используем any для объекта с неизвестными ключами
function processConfig(config: any) {
  // ...
}

// Хорошо --- индексная сигнатура описывает структуру
interface Config {
  [key: string]: string | number | boolean;
}
function processConfig(config: Config) {
  // TypeScript знает, что значения --- string | number | boolean
}
```

### Мини-проверка

Для чего нужны индексные сигнатуры?

---

## 7. Intersection types (пересечения)

### Что это такое?

Intersection type (`&`) объединяет несколько типов в один. Объект должен соответствовать **всем** типам одновременно.

### Как это работает?

```typescript
type HasName = {
  name: string;
};

type HasAge = {
  age: number;
};

type HasEmail = {
  email: string;
};

// Пересечение --- объект должен иметь ВСЕ свойства
type Person = HasName & HasAge & HasEmail;

const person: Person = {
  name: "Игорь",
  age: 25,
  email: "igor@example.com"
  // Все три свойства обязательны
};

// Практический пример: добавляем метаданные к любому типу
type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

type User = {
  name: string;
  email: string;
};

type UserWithTimestamps = WithTimestamps<User>;
// = { name: string; email: string; createdAt: Date; updatedAt: Date }
```

### Разница между union и intersection

```typescript
// Union (|) --- ИЛИ: значение одного из типов
type StringOrNumber = string | number;
let a: StringOrNumber = "текст"; // ок
let b: StringOrNumber = 42;      // тоже ок

// Intersection (&) --- И: значение всех типов одновременно
type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged;
// Объект ДОЛЖЕН иметь и name, и age
```

### Частые заблуждения

- "Intersection значит пересечение свойств (общие свойства)". Нет, наоборот. `A & B` означает **объединение** всех свойств --- объект должен иметь и свойства A, и свойства B.

### Мини-проверка

Чем `A & B` отличается от `A | B`?

---

## Итог

Интерфейсы и псевдонимы типов --- основной инструмент для описания структуры данных в TypeScript.

**Ключевые идеи главы:**

- **interface** --- описывает форму объекта, расширяется через `extends`, поддерживает declaration merging
- **type** --- дает имя любому типу (объекты, union, кортежи, примитивы)
- **Правило:** `interface` для объектов, `type` для всего остального
- **Необязательные свойства** (`?`) --- можно не указывать при создании объекта
- **readonly** --- свойство нельзя изменить после создания
- **extends** --- наследование интерфейсов (включая множественное)
- **Индексные сигнатуры** (`[key: string]: T`) --- для объектов с неизвестными ключами
- **Intersection types** (`&`) --- объект должен соответствовать всем типам одновременно

---

> << [[typescript/01-basics]] | [[typescript-fundamentals]] | **Интерфейсы** | [[typescript/03-generics]] >>
