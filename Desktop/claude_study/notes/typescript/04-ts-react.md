# Глава 4. TypeScript в React

> << [[typescript/03-generics]] | [[typescript-fundamentals]] | **TS + React** |

---

## Зачем эта тема существует?

React без TypeScript --- это как ехать без навигатора. Можно, но рано или поздно свернешь не туда. Когда компонент принимает 5 пропсов, а ты передал 4 или передал строку вместо числа --- без TypeScript ошибка выстрелит в рантайме. С TypeScript ты увидишь ее мгновенно в редакторе. Эта глава учит, как правильно типизировать React-компоненты.

---

## 1. Типизация пропсов

### Что это такое?

Пропсы --- это данные, которые компонент получает от родителя. TypeScript проверяет, что ты передаешь правильные пропсы с правильными типами.

### Как это работает?

```typescript
// Способ 1: Inline-типизация (тип прямо в параметрах)
function Greeting({ name, age }: { name: string; age: number }) {
  return <p>Привет, {name}! Тебе {age} лет.</p>;
}

// Способ 2: Отдельный interface (рекомендуется)
interface GreetingProps {
  name: string;
  age: number;
}

function Greeting({ name, age }: GreetingProps) {
  return <p>Привет, {name}! Тебе {age} лет.</p>;
}

// Использование --- TypeScript проверяет пропсы
<Greeting name="Игорь" age={25} />     // ок
// <Greeting name="Игорь" />            // Ошибка: не хватает age
// <Greeting name="Игорь" age="двадцать пять" /> // Ошибка: age должен быть number
```

### FC vs inline-типизация

```typescript
import { FC } from "react";

// Вариант с FC (Function Component) --- старый стиль
const Greeting: FC<GreetingProps> = ({ name, age }) => {
  return <p>Привет, {name}!</p>;
};

// Вариант без FC --- современный стиль (рекомендуется)
function Greeting({ name, age }: GreetingProps) {
  return <p>Привет, {name}!</p>;
}
```

**Почему без FC лучше:**
- `FC` неявно добавлял `children` в пропсы (в React 18 убрали, но путаница осталась)
- Без `FC` проще читать и не нужен дополнительный импорт
- TypeScript лучше выводит тип возвращаемого значения

### Необязательные пропсы и значения по умолчанию

```typescript
interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "danger";  // необязательный
  disabled?: boolean;                              // необязательный
  size?: "sm" | "md" | "lg";                      // необязательный
}

function Button({
  label,
  variant = "primary",  // значение по умолчанию
  disabled = false,
  size = "md"
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

// Все варианты использования
<Button label="Отправить" />
<Button label="Удалить" variant="danger" />
<Button label="Сохранить" variant="secondary" disabled />
```

### Плохой и хороший пример

```typescript
// Плохо --- any отключает все проверки
function UserCard({ user }: { user: any }) {
  return <p>{user.name}</p>; // Если name нет --- ошибка в рантайме
}

// Хорошо --- явное описание типа
interface User {
  id: number;
  name: string;
  email: string;
}

function UserCard({ user }: { user: User }) {
  return <p>{user.name}</p>; // TypeScript гарантирует, что name есть
}
```

### Мини-проверка

Почему современный подход предпочитает типизацию без `FC`?

---

## 2. Типизация children

### Что это такое?

`children` --- это содержимое между открывающим и закрывающим тегами компонента. TypeScript требует явно указать тип.

### Как это работает?

```typescript
import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;  // любой допустимый JSX: текст, элементы, массив, null
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Использование
<Card title="Профиль">
  <p>Имя: Игорь</p>
  <p>Возраст: 25</p>
</Card>
```

### Типы для children

```typescript
import { ReactNode, ReactElement } from "react";

// ReactNode --- самый общий, принимает всё (рекомендуется)
// Включает: string, number, boolean, null, undefined, ReactElement, массивы
interface WrapperProps {
  children: ReactNode;
}

// ReactElement --- только JSX-элементы (не строки и числа)
interface LayoutProps {
  children: ReactElement;
}

// string --- только текст
interface LabelProps {
  children: string;
}
```

### Мини-проверка

Какой тип использовать для `children`, если компонент принимает любое содержимое?

---

## 3. Типизация событий

### Что это такое?

Обработчики событий в React имеют свои типы. TypeScript помогает правильно работать с объектом события.

### Как это работает?

```typescript
import { ChangeEvent, FormEvent, MouseEvent, KeyboardEvent } from "react";

// --- Клик ---
function handleClick(event: MouseEvent<HTMLButtonElement>) {
  console.log("Кликнули по кнопке:", event.currentTarget.textContent);
}

// --- Изменение input ---
function handleChange(event: ChangeEvent<HTMLInputElement>) {
  console.log("Новое значение:", event.target.value);
}

// --- Отправка формы ---
function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  console.log("Форма отправлена");
}

// --- Нажатие клавиши ---
function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
  if (event.key === "Enter") {
    console.log("Enter нажат");
  }
}

// Использование в компоненте
function SearchForm() {
  const [query, setQuery] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Ищем:", query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={handleChange} />
      <button type="submit">Найти</button>
    </form>
  );
}
```

### Передача обработчика через пропсы

```typescript
interface ButtonProps {
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// Если не нужен event, можно упростить
interface SimpleButtonProps {
  label: string;
  onClick: () => void;  // без параметров
}
```

### Частые заблуждения

- "Можно писать `(e: any) => ...`". Технически можно, но теряется вся польза TypeScript --- автоподсказки и проверка свойств события.

### Мини-проверка

Какой тип у события для `onChange` на `<input>`?

---

## 4. Типизация состояния (useState)

### Что это такое?

`useState` --- дженерик-хук. TypeScript обычно выводит тип автоматически из начального значения, но иногда нужна явная аннотация.

### Как это работает?

```typescript
import { useState } from "react";

// --- Автоматический вывод типа ---
const [count, setCount] = useState(0);         // тип: number
const [name, setName] = useState("Игорь");     // тип: string
const [active, setActive] = useState(true);    // тип: boolean

// --- Явное указание типа нужно, когда ---

// 1. Начальное значение null или undefined
interface User {
  id: number;
  name: string;
  email: string;
}

const [user, setUser] = useState<User | null>(null);
// Без <User | null> TypeScript подумает, что тип --- всегда null

// 2. Начальное значение --- пустой массив
const [items, setItems] = useState<string[]>([]);
// Без <string[]> TypeScript не знает тип элементов

// 3. Тип шире, чем начальное значение
type Status = "idle" | "loading" | "success" | "error";
const [status, setStatus] = useState<Status>("idle");
// Без <Status> тип будет "idle" (литеральный), а не Status
```

### Плохой и хороший пример

```typescript
// Плохо --- забыли указать тип, TypeScript думает что это всегда null
const [user, setUser] = useState(null);
// setUser({ id: 1, name: "Игорь" }); // Ошибка: нельзя присвоить объект к null

// Хорошо --- явный union тип
const [user, setUser] = useState<User | null>(null);
setUser({ id: 1, name: "Игорь", email: "igor@test.com" }); // ок

// Безопасный доступ к данным
if (user) {
  console.log(user.name); // TypeScript знает, что user не null внутри if
}
```

### Мини-проверка

Когда нужно явно указывать тип в `useState<T>`?

---

## 5. Типизация useRef

### Что это такое?

`useRef` используется для ссылок на DOM-элементы и для хранения мутабельных значений. Типизация зависит от назначения.

### Как это работает?

```typescript
import { useRef, useEffect } from "react";

// --- Ссылка на DOM-элемент ---
function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  // Тип: RefObject<HTMLInputElement> --- readonly, управляется React

  useEffect(() => {
    inputRef.current?.focus(); // ?. потому что current может быть null
  }, []);

  return <input ref={inputRef} placeholder="Имя" />;
}

// --- Ссылка на div ---
function ScrollBox() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    containerRef.current?.scrollTo(0, 0);
  };

  return (
    <div ref={containerRef} style={{ overflow: "auto", height: 300 }}>
      {/* содержимое */}
      <button onClick={scrollToTop}>Наверх</button>
    </div>
  );
}

// --- Хранение мутабельного значения (не DOM) ---
function Timer() {
  const intervalRef = useRef<number | null>(null);
  // Начальное значение не null --- MutableRefObject

  const start = () => {
    intervalRef.current = window.setInterval(() => {
      console.log("tick");
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <>
      <button onClick={start}>Старт</button>
      <button onClick={stop}>Стоп</button>
    </>
  );
}
```

### Частые HTML-элементы и их типы

```typescript
useRef<HTMLInputElement>(null);    // <input>
useRef<HTMLTextAreaElement>(null); // <textarea>
useRef<HTMLButtonElement>(null);   // <button>
useRef<HTMLDivElement>(null);      // <div>
useRef<HTMLFormElement>(null);     // <form>
useRef<HTMLAnchorElement>(null);   // <a>
useRef<HTMLImageElement>(null);    // <img>
useRef<HTMLVideoElement>(null);    // <video>
```

### Мини-проверка

Почему при обращении к `ref.current` нужно использовать `?.`?

---

## 6. Дженерик-компоненты

### Что это такое?

Иногда компонент должен работать с данными **любого** типа. Дженерик-компоненты параметризуются типом так же, как дженерик-функции.

### Как это работает?

```typescript
// Компонент-список, который работает с любым типом данных
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Использование --- TypeScript выводит T автоматически
interface User {
  id: number;
  name: string;
}

<List
  items={[{ id: 1, name: "Игорь" }, { id: 2, name: "Аня" }]}
  renderItem={(user) => <span>{user.name}</span>}  // user типизирован как User
/>

<List
  items={["яблоко", "банан", "вишня"]}
  renderItem={(fruit) => <span>{fruit.toUpperCase()}</span>}  // fruit --- string
/>

// Компонент Select с дженериком
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
}

function Select<T>({ options, value, onChange, getLabel }: SelectProps<T>) {
  return (
    <select
      value={getLabel(value)}
      onChange={(e) => {
        const selected = options.find(
          (opt) => getLabel(opt) === e.target.value
        );
        if (selected) onChange(selected);
      }}
    >
      {options.map((option, i) => (
        <option key={i} value={getLabel(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}
```

### Плохой и хороший пример

```typescript
// Плохо --- any убивает безопасность
interface ListProps {
  items: any[];
  renderItem: (item: any) => ReactNode;
}

// Хорошо --- дженерик сохраняет тип
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
}
```

### Мини-проверка

В чем преимущество дженерик-компонента перед компонентом с `any`?

---

## Итог

TypeScript в React --- это не дополнительная работа, а страховочная сетка. Правильная типизация ловит ошибки до того, как ты увидишь белый экран в браузере.

**Ключевые идеи главы:**

- **Пропсы** --- описывай через `interface`, используй без `FC`
- **children** --- тип `ReactNode` для любого содержимого
- **События** --- `ChangeEvent<HTMLInputElement>`, `FormEvent<HTMLFormElement>`, `MouseEvent<HTMLButtonElement>`
- **useState** --- явный тип нужен для `null`, пустых массивов и union типов
- **useRef** --- указывай тип DOM-элемента: `useRef<HTMLInputElement>(null)`
- **Дженерик-компоненты** --- параметризуются типом для переиспользования

---

> << [[typescript/03-generics]] | [[typescript-fundamentals]] | **TS + React** |
