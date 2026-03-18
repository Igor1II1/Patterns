# Глава 3. useState -- состояние компонента

> [[react/02-props|<-- Назад: Props]] | [[react-fundamentals|<-- Назад к оглавлению React]] | [[react/04-use-effect|Далее: useEffect -->]]

---

## Зачем эта тема существует?

Props позволяют передать данные в компонент, но что если данные должны **меняться** внутри самого компонента? Счетчик кликов, текст в поле ввода, открыто ли модальное окно -- все это внутреннее состояние. Обычная переменная не подойдет: React не узнает, что она изменилась, и не перерисует компонент. Для этого существует `useState` -- хук, который связывает данные с перерисовкой.

---

## 1. useState -- хук для хранения состояния

### Что это такое?

`useState` -- это функция (хук) из React, которая создает "переменную с памятью". При изменении этой переменной React автоматически перерисовывает компонент с новым значением.

### Как работает?

```jsx
import { useState } from 'react';

function Counter() {
  // useState возвращает массив из двух элементов:
  // [текущее значение, функция для обновления]
  const [count, setCount] = useState(0);
  //      ^       ^                  ^
  //      |       |                  |
  //   значение  сеттер     начальное значение

  return (
    <div>
      <p>Счетчик: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  );
}
```

Что происходит по шагам:

1. `useState(0)` создает ячейку состояния с начальным значением `0`
2. Возвращает массив: `[0, setCount]`
3. Деструктуризация: `count = 0`, `setCount` -- функция-сеттер
4. При клике вызывается `setCount(1)`
5. React запоминает новое значение и **перерисовывает** компонент
6. При повторном вызове `Counter()` `useState(0)` вернет `[1, setCount]` (начальное значение игнорируется)

### Плохой пример -- Хороший пример

```jsx
// Плохо: обычная переменная -- React не знает об изменении
function Counter() {
  let count = 0;

  function handleClick() {
    count += 1; // Значение меняется, но компонент НЕ перерисуется
    console.log(count); // В консоли видно, что count растет
  }

  return (
    <div>
      <p>Счетчик: {count}</p> {/* Всегда показывает 0 */}
      <button onClick={handleClick}>+1</button>
    </div>
  );
}

// Хорошо: useState -- React перерисует компонент
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // React запланирует перерисовку
  }

  return (
    <div>
      <p>Счетчик: {count}</p> {/* Обновляется при каждом клике */}
      <button onClick={handleClick}>+1</button>
    </div>
  );
}
```

### Частые заблуждения

- "useState меняет значение мгновенно" -- нет. `setCount(5)` не меняет `count` прямо сейчас. Новое значение будет доступно при **следующем** рендере.
- "Можно вызвать useState внутри if/for" -- нельзя. Хуки вызываются только на верхнем уровне функции компонента, всегда в одном порядке.

### Мини-проверка

1. Почему обычная переменная `let` не подходит для хранения состояния?
2. Что возвращает `useState`?
3. Когда компонент "увидит" новое значение после `setState`?

---

## 2. Обновление состояния

### Что это такое?

`setState` (сеттер) -- единственный способ обновить состояние. Прямое изменение переменной ничего не даст. Важно понимать, что обновление **асинхронно** -- React группирует несколько обновлений в одну перерисовку.

### Как работает?

```jsx
function Example() {
  const [name, setName] = useState('Игорь');
  const [age, setAge] = useState(25);

  function handleBirthday() {
    setAge(age + 1);          // age станет 26 при следующем рендере
    console.log(age);          // Все еще 25! Старое значение
    setName('Игорь-именинник'); // Тоже при следующем рендере
    // React сгруппирует оба обновления в одну перерисовку
  }

  return (
    <div>
      <p>{name}, {age} лет</p>
      <button onClick={handleBirthday}>День рождения</button>
    </div>
  );
}
```

**Батчинг (группировка):** React не перерисовывает компонент после каждого `setState`. Внутри обработчика событий все вызовы `setState` группируются, и компонент перерисовывается один раз с учетом всех изменений.

```jsx
function handleClick() {
  setA(1);  // React запомнит
  setB(2);  // React запомнит
  setC(3);  // React запомнит
  // Перерисовка произойдет ОДИН раз, а не три
}
```

### Мини-проверка

1. Что такое батчинг?
2. Почему `console.log(count)` сразу после `setCount(count + 1)` показывает старое значение?

---

## 3. Иммутабельность -- не изменяй, а создавай новое

### Что это такое?

Иммутабельность (immutability) -- принцип, при котором ты **никогда не изменяешь** существующие данные, а **создаешь новую копию** с нужными изменениями. В React это критически важно: если мутировать объект или массив, React не заметит изменение и не перерисует компонент.

### Как работает?

React определяет, изменилось ли состояние, через сравнение **ссылок** (===). Если ты мутируешь объект, ссылка остается той же -- React думает, что ничего не изменилось.

```jsx
// Плохо: мутация объекта -- React НЕ перерисует
function UserForm() {
  const [user, setUser] = useState({ name: 'Игорь', age: 25 });

  function handleClick() {
    user.age = 26;     // Мутация! Объект тот же, ссылка не изменилась
    setUser(user);      // React видит ту же ссылку -- пропускает рендер
  }

  return <p>{user.age}</p>; // Не обновится
}

// Хорошо: создаем новый объект через spread
function UserForm() {
  const [user, setUser] = useState({ name: 'Игорь', age: 25 });

  function handleClick() {
    setUser({ ...user, age: 26 }); // Новый объект! Новая ссылка
    // spread копирует все поля и перезаписывает age
  }

  return <p>{user.age}</p>; // Обновится
}
```

### Частые заблуждения

- "Spread делает глубокую копию" -- нет, spread (`...`) делает **поверхностную** копию. Для вложенных объектов нужно копировать каждый уровень:

```jsx
const [user, setUser] = useState({
  name: 'Игорь',
  address: { city: 'Москва', street: 'Ленина' }
});

// Плохо: мутация вложенного объекта
setUser({ ...user, address: { ...user.address, city: 'Питер' } }); // правильно, но вот так -- нет:
// user.address.city = 'Питер'; // мутация!

// Хорошо: копируем каждый уровень
setUser({
  ...user,
  address: {
    ...user.address,
    city: 'Питер'
  }
});
```

### Мини-проверка

1. Почему `user.name = 'Анна'; setUser(user)` не вызовет перерисовку?
2. Что делает spread-оператор `...`?

---

## 4. Обновление объектов и массивов в state

### Что это такое?

Объекты и массивы -- самые частые типы данных в state. Для каждого есть свои паттерны иммутабельного обновления.

### Как работает?

**Объекты:**

```jsx
const [form, setForm] = useState({
  name: '',
  email: '',
  age: 0
});

// Обновить одно поле
setForm({ ...form, name: 'Игорь' });

// Обновить несколько полей
setForm({ ...form, name: 'Игорь', email: 'igor@mail.ru' });

// Динамическое имя поля (полезно для форм)
function handleChange(e) {
  setForm({
    ...form,
    [e.target.name]: e.target.value   // [name]: value -- computed property
  });
}
```

**Массивы:**

```jsx
const [items, setItems] = useState(['яблоко', 'банан', 'вишня']);

// Добавить элемент
setItems([...items, 'груша']);              // в конец
setItems(['груша', ...items]);              // в начало

// Удалить элемент (по индексу или значению)
setItems(items.filter(item => item !== 'банан'));
setItems(items.filter((_, index) => index !== 1));

// Заменить элемент
setItems(items.map(item =>
  item === 'банан' ? 'апельсин' : item
));

// Обновить элемент-объект в массиве
const [todos, setTodos] = useState([
  { id: 1, text: 'Купить молоко', done: false },
  { id: 2, text: 'Позвонить маме', done: false },
]);

setTodos(todos.map(todo =>
  todo.id === 1 ? { ...todo, done: true } : todo
));
```

### Плохой пример -- Хороший пример

```jsx
// Плохо: мутирующие методы массива
function TodoList() {
  const [todos, setTodos] = useState([]);

  function addTodo(text) {
    todos.push({ text, done: false }); // push мутирует массив!
    setTodos(todos);                    // та же ссылка -- React не обновит
  }

  return <div>...</div>;
}

// Хорошо: иммутабельные методы
function TodoList() {
  const [todos, setTodos] = useState([]);

  function addTodo(text) {
    setTodos([...todos, { text, done: false }]); // новый массив
  }

  return <div>...</div>;
}
```

**Шпаргалка: мутирующие vs иммутабельные методы массива:**

| Мутирует (нельзя) | Не мутирует (можно) |
|---|---|
| `push`, `pop` | `[...arr, item]`, `arr.slice(0, -1)` |
| `splice` | `arr.filter()` |
| `sort`, `reverse` | `[...arr].sort()`, `[...arr].reverse()` |
| `arr[i] = x` | `arr.map((el, idx) => idx === i ? x : el)` |

### Мини-проверка

1. Как добавить элемент в массив в state?
2. Как удалить элемент из массива в state?
3. Почему `push` нельзя использовать с state?

---

## 5. Функциональные обновления

### Что это такое?

Когда новое значение зависит от предыдущего, безопаснее передавать в `setState` **функцию**, а не значение. Эта функция получит актуальное предыдущее состояние.

### Как работает?

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleTripleClick() {
    // Плохо: все три вызова используют одно и то же значение count
    setCount(count + 1); // count = 0, установит 1
    setCount(count + 1); // count все еще 0, установит 1
    setCount(count + 1); // count все еще 0, установит 1
    // Результат: count = 1 (а не 3!)

    // Хорошо: функциональное обновление
    setCount(prev => prev + 1); // prev = 0, вернет 1
    setCount(prev => prev + 1); // prev = 1, вернет 2
    setCount(prev => prev + 1); // prev = 2, вернет 3
    // Результат: count = 3
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleTripleClick}>+3</button>
    </div>
  );
}
```

**Правило:** если новое значение зависит от предыдущего -- используй функциональное обновление `setState(prev => ...)`.

```jsx
// Примеры функциональных обновлений

// Переключатель (toggle)
const [isOpen, setIsOpen] = useState(false);
setIsOpen(prev => !prev);

// Добавление в массив
const [items, setItems] = useState([]);
setItems(prev => [...prev, newItem]);

// Обновление счетчика в объекте
const [stats, setStats] = useState({ clicks: 0, views: 0 });
setStats(prev => ({ ...prev, clicks: prev.clicks + 1 }));
```

### Частые заблуждения

- "Функциональное обновление нужно всегда" -- нет. Если новое значение не зависит от предыдущего, можно передавать значение напрямую: `setName('Игорь')`.
- "setState синхронный с функцией" -- нет, он все равно асинхронный. Но функция гарантирует, что `prev` -- это актуальное значение.

### Мини-проверка

1. Когда нужно использовать `setState(prev => ...)`?
2. Почему `setCount(count + 1)` три раза подряд дает +1, а не +3?

---

## 6. Несколько переменных состояния

### Что это такое?

Компонент может иметь сколько угодно вызовов `useState`. Каждый вызов создает независимую "ячейку" состояния.

### Как работает?

```jsx
function RegistrationForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(18);
  const [agreed, setAgreed] = useState(false);

  return (
    <form>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} />
      <label>
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
        />
        Согласен с правилами
      </label>
    </form>
  );
}
```

### Когда объединять в один объект, а когда разделять?

```jsx
// Раздельные -- когда переменные независимы
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);

// Один объект -- когда данные связаны и всегда обновляются вместе
const [position, setPosition] = useState({ x: 0, y: 0 });
// Перемещение мыши всегда меняет x и y одновременно

// Один объект -- когда много полей формы
const [form, setForm] = useState({
  name: '',
  email: '',
  phone: '',
  address: ''
});
```

**Рекомендация:** начни с отдельных `useState`. Объединяй в объект, только если данные логически связаны и обновляются вместе.

### Частые заблуждения

- "Один useState с большим объектом лучше" -- не всегда. Каждый `setForm({...form, name: 'x'})` требует копирования всего объекта. Отдельные переменные проще обновлять.
- "Порядок useState важен" -- да! React отслеживает хуки по порядку вызова. Поэтому нельзя вызывать `useState` условно.

### Мини-проверка

1. Сколько раз можно вызвать `useState` в одном компоненте?
2. Когда лучше объединить данные в один объект, а когда разделить?

---

## Итог

- **useState** создает "переменную с памятью". При изменении React перерисовывает компонент
- **Обновление асинхронно** -- новое значение доступно только при следующем рендере. React группирует обновления (батчинг)
- **Иммутабельность обязательна** -- никогда не мутируй объекты и массивы в state. Создавай новые копии через spread (`...`)
- **Функциональное обновление** `setState(prev => ...)` -- используй, когда новое значение зависит от предыдущего
- **Несколько useState** -- можно вызывать сколько угодно раз. Разделяй независимые данные, объединяй связанные

---

> [[react/02-props|<-- Назад: Props]] | [[react-fundamentals|<-- Назад к оглавлению React]] | [[react/04-use-effect|Далее: useEffect -->]]
