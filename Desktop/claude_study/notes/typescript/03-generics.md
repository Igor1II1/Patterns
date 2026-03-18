# Глава 3. Дженерики и утилитарные типы

> << [[typescript/02-interfaces]] | [[typescript-fundamentals]] | **Дженерики** | [[typescript/04-ts-react]] >>

---

## Зачем эта тема существует?

Ты уже умеешь описывать типы для конкретных данных. Но что, если нужна функция, которая работает с **любым** типом данных, но при этом сохраняет информацию о типе? Например, функция-обертка, которая принимает число и возвращает число, принимает строку и возвращает строку. Без дженериков пришлось бы писать отдельную функцию для каждого типа или использовать `any`. Дженерики решают эту проблему --- они делают типы **параметризуемыми**.

---

## 1. Зачем нужны дженерики

### Что это такое?

Дженерик (generic) --- это тип-параметр. Как функция принимает параметры-значения, так дженерик принимает параметры-типы.

### Как это работает?

```typescript
// Проблема: хотим функцию, которая возвращает первый элемент массива
// Вариант 1 --- жестко привязан к типу
function firstNumber(arr: number[]): number {
  return arr[0];
}

function firstString(arr: string[]): string {
  return arr[0];
}

// Вариант 2 --- any (теряем информацию о типе)
function firstAny(arr: any[]): any {
  return arr[0];
}
const result = firstAny([1, 2, 3]); // тип: any --- TypeScript не знает, что это number

// Вариант 3 --- дженерик (решение)
function first<T>(arr: T[]): T {
  return arr[0];
}

const num = first([1, 2, 3]);         // тип: number (TypeScript вывел сам)
const str = first(["а", "б", "в"]);   // тип: string
const bool = first([true, false]);     // тип: boolean
```

`T` --- это **типовая переменная**. При вызове функции TypeScript подставляет конкретный тип вместо `T`. Буква `T` --- это просто соглашение (от слова "Type"), можно назвать как угодно.

### Плохой и хороший пример

```typescript
// Плохо --- потеря информации о типе
function wrapInArray(value: any): any[] {
  return [value];
}
const arr = wrapInArray("привет"); // тип: any[] --- бесполезно

// Хорошо --- дженерик сохраняет тип
function wrapInArray<T>(value: T): T[] {
  return [value];
}
const arr = wrapInArray("привет"); // тип: string[]
```

### Мини-проверка

Что такое `T` в записи `function first<T>(arr: T[]): T`?

---

## 2. Дженерик-функции

### Что это такое?

Функции, параметризованные типами. TypeScript обычно выводит тип автоматически, но можно указать явно.

### Как это работает?

```typescript
// Функция с одним типовым параметром
function identity<T>(value: T): T {
  return value;
}

// TypeScript выводит тип автоматически
identity(42);        // T = number
identity("привет");  // T = string

// Явное указание типа
identity<string>("привет"); // T = string

// Функция с несколькими типовыми параметрами
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const p1 = pair("имя", 25);       // тип: [string, number]
const p2 = pair(true, [1, 2, 3]); // тип: [boolean, number[]]

// Стрелочная функция с дженериком
const toArray = <T>(value: T): T[] => [value];

// Функция, которая работает с массивами любого типа
function lastElement<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[arr.length - 1] : undefined;
}

lastElement([1, 2, 3]);    // number | undefined
lastElement(["а", "б"]);   // string | undefined
lastElement([]);            // undefined
```

### Частые заблуждения

- "Дженерик --- это то же самое, что `any`". Нет. `any` отключает проверку типов. Дженерик **сохраняет** конкретный тип --- TypeScript знает, что `first([1,2,3])` возвращает `number`, а не `any`.

### Мини-проверка

Чем `function f<T>(x: T): T` лучше, чем `function f(x: any): any`?

---

## 3. Дженерик-интерфейсы

### Что это такое?

Интерфейсы тоже могут быть параметризованы типами. Это позволяет создавать переиспользуемые структуры данных.

### Как это работает?

```typescript
// Контейнер для любого типа данных
interface Box<T> {
  value: T;
  label: string;
}

const numberBox: Box<number> = { value: 42, label: "Ответ" };
const stringBox: Box<string> = { value: "привет", label: "Приветствие" };

// Ответ от API --- всегда одна структура, но данные разные
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
}

// Один интерфейс --- разные данные
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "Игорь" },
  status: 200,
  message: "OK"
};

const productResponse: ApiResponse<Product> = {
  data: { id: 1, title: "Ноутбук", price: 80000 },
  status: 200,
  message: "OK"
};

// Список с пагинацией
interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}

const userList: PaginatedList<User> = {
  items: [{ id: 1, name: "Игорь" }, { id: 2, name: "Аня" }],
  total: 50,
  page: 1,
  perPage: 10
};
```

### Плохой и хороший пример

```typescript
// Плохо --- отдельный интерфейс для каждого типа ответа
interface UserResponse {
  data: User;
  status: number;
  message: string;
}
interface ProductResponse {
  data: Product;
  status: number;
  message: string;
}

// Хорошо --- один дженерик-интерфейс
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
// ApiResponse<User>, ApiResponse<Product> --- готово
```

### Мини-проверка

Зачем делать интерфейс дженериком, а не создавать отдельный интерфейс для каждого случая?

---

## 4. Ограничения дженериков (constraints)

### Что это такое?

Иногда дженерик должен быть не "любым типом", а типом с определенными свойствами. Ключевое слово `extends` ограничивает, какие типы можно подставить.

### Как это работает?

```typescript
// Без ограничения --- TypeScript не знает, что у T есть length
function logLength<T>(value: T): void {
  // console.log(value.length); // Ошибка: Property 'length' does not exist on type 'T'
}

// С ограничением --- T должен иметь свойство length
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(value: T): void {
  console.log(value.length); // Теперь ок --- TypeScript знает, что length есть
}

logLength("привет");      // ок --- у строки есть length
logLength([1, 2, 3]);     // ок --- у массива есть length
logLength({ length: 10 }); // ок --- объект с length
// logLength(42);          // Ошибка: number не имеет length

// Ограничение на ключи объекта
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Игорь", age: 25, email: "igor@test.com" };

getProperty(user, "name");  // тип: string
getProperty(user, "age");   // тип: number
// getProperty(user, "phone"); // Ошибка: "phone" не существует в user
```

`keyof T` --- это union всех ключей типа `T`. Для `user` это `"name" | "age" | "email"`.

### Плохой и хороший пример

```typescript
// Плохо --- приведение типов, нет безопасности
function getProperty(obj: any, key: string): any {
  return obj[key];
}

// Хорошо --- TypeScript проверяет, что ключ существует
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### Мини-проверка

Что означает `T extends HasLength`?

---

## 5. Утилитарные типы (Utility Types)

### Что это такое?

TypeScript предоставляет встроенные дженерик-типы, которые трансформируют другие типы. Это как функции, но для типов.

### Как это работает?

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// --- Partial<T> --- все свойства становятся необязательными
type PartialUser = Partial<User>;
// = { id?: number; name?: string; email?: string; age?: number }

// Идеально для функций обновления
function updateUser(id: number, changes: Partial<User>): void {
  // Можно передать только те поля, которые меняются
}
updateUser(1, { name: "Новое имя" });  // ок, не нужно передавать все поля
updateUser(1, { age: 26, email: "new@test.com" }); // тоже ок

// --- Required<T> --- все свойства становятся обязательными (противоположность Partial)
interface Config {
  host: string;
  port?: number;
  ssl?: boolean;
}

type StrictConfig = Required<Config>;
// = { host: string; port: number; ssl: boolean } --- всё обязательно

// --- Pick<T, Keys> --- выбирает только указанные свойства
type UserPreview = Pick<User, "id" | "name">;
// = { id: number; name: string }

// --- Omit<T, Keys> --- убирает указанные свойства
type UserWithoutEmail = Omit<User, "email">;
// = { id: number; name: string; age: number }

// Omit полезен для создания DTO (Data Transfer Object)
type CreateUserDTO = Omit<User, "id">;
// = { name: string; email: string; age: number } --- id генерируется на сервере

// --- Record<Keys, Value> --- создает тип-словарь
type UserRoles = Record<string, "admin" | "user" | "guest">;

const roles: UserRoles = {
  igor: "admin",
  anna: "user",
  guest1: "guest"
};

// Record с конкретными ключами
type ThemeColors = Record<"primary" | "secondary" | "background", string>;

const colors: ThemeColors = {
  primary: "#3498db",
  secondary: "#2ecc71",
  background: "#ffffff"
};
```

### Комбинирование утилитарных типов

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Тип для API-ответа: без пароля
type PublicUser = Omit<User, "password">;

// Тип для формы создания: без id и createdAt
type CreateUserForm = Omit<User, "id" | "createdAt">;

// Тип для формы редактирования: без id/createdAt, все поля необязательные
type UpdateUserForm = Partial<Omit<User, "id" | "createdAt">>;

// Тип для карточки пользователя: только имя и email
type UserCard = Pick<User, "name" | "email">;
```

### Плохой и хороший пример

```typescript
// Плохо --- дублирование типов
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}
interface PublicUser {
  id: number;
  name: string;
  email: string;
  // password убрали вручную, но если добавить поле в User --- забудем добавить тут
}

// Хорошо --- вывод из основного типа
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}
type PublicUser = Omit<User, "password">;
// Добавили поле в User --- оно автоматически появится в PublicUser
```

### Частые заблуждения

- "Утилитарные типы создают новые объекты". Нет, они работают только на уровне типов. В скомпилированном JS их нет.
- "Partial делает все вложенные свойства необязательными". Нет, `Partial` работает только на первом уровне вложенности.

### Мини-проверка

Как создать тип, в котором все поля `User` необязательные, кроме `id`?

---

## Итог

Дженерики --- это способ писать типобезопасный переиспользуемый код. Утилитарные типы --- встроенные инструменты для трансформации типов.

**Ключевые идеи главы:**

- **Дженерик** (`<T>`) --- типовая переменная, сохраняет конкретный тип (в отличие от `any`)
- **Дженерик-функции** --- работают с любыми типами, сохраняя безопасность
- **Дженерик-интерфейсы** --- переиспользуемые структуры (например, `ApiResponse<T>`)
- **Constraints** (`extends`) --- ограничивают, какие типы можно подставить
- **keyof T** --- union всех ключей типа `T`
- **Partial\<T\>** --- все свойства необязательные
- **Required\<T\>** --- все свойства обязательные
- **Pick\<T, K\>** --- выбирает указанные свойства
- **Omit\<T, K\>** --- убирает указанные свойства
- **Record\<K, V\>** --- создает тип-словарь

---

> << [[typescript/02-interfaces]] | [[typescript-fundamentals]] | **Дженерики** | [[typescript/04-ts-react]] >>
