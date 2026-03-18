# Глава 9. Кастомные хуки

> [[react/08-use-ref|<-- Назад: useRef]] | [[react-fundamentals|<-- Назад к оглавлению React]] | [[react/10-router|Далее: React Router -->]]

---

## Зачем эта тема существует?

Когда одна и та же логика повторяется в нескольких компонентах -- загрузка данных, работа с localStorage, отслеживание размера окна -- дублирование кода становится проблемой. Кастомные хуки позволяют **извлечь** повторяющуюся логику с состоянием в отдельную функцию и переиспользовать ее в любом компоненте. Это как создание своей функции, но для логики React.

---

## 1. Что такое кастомный хук

### Что это такое?

Кастомный хук -- это обычная JavaScript-функция, которая:
- Начинается с `use` (обязательное соглашение)
- Может вызывать другие хуки (useState, useEffect, useRef и т.д.)
- Извлекает и инкапсулирует переиспользуемую логику

### Как работает?

```jsx
// Без кастомного хука -- логика размера окна в компоненте
function Header() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <header>{width > 768 ? 'Десктоп' : 'Мобильный'}</header>;
}

// Та же логика нужна в Footer -- копируем? Нет!

// С кастомным хуком -- логика вынесена
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

// Используем в любом компоненте
function Header() {
  const width = useWindowWidth();
  return <header>{width > 768 ? 'Десктоп' : 'Мобильный'}</header>;
}

function Footer() {
  const width = useWindowWidth();
  return <footer>{width > 768 ? 'Полное меню' : 'Краткое меню'}</footer>;
}
```

**Важно:** каждый вызов `useWindowWidth()` создает **независимую** копию состояния. Header и Footer не делят один state -- у каждого свой.

### Мини-проверка

1. Что обязательно для имени кастомного хука?
2. Делят ли два компонента state, если оба вызывают один кастомный хук?

---

## 2. Правила хуков

### Что это такое?

Хуки (и встроенные, и кастомные) подчиняются строгим правилам. Нарушение приведет к багам, которые сложно отследить.

### Правило 1: Вызывай хуки только на верхнем уровне

```jsx
// НЕЛЬЗЯ: хук внутри условия
function Profile({ userId }) {
  if (userId) {
    const [user, setUser] = useState(null); // React потеряет порядок хуков!
  }
}

// НЕЛЬЗЯ: хук внутри цикла
function List({ items }) {
  for (const item of items) {
    const [selected, setSelected] = useState(false); // Количество хуков меняется!
  }
}

// НЕЛЬЗЯ: хук после раннего return
function Profile({ userId }) {
  if (!userId) return <p>Нет данных</p>;
  const [user, setUser] = useState(null); // После return -- нарушение!
}

// МОЖНО: все хуки в начале, условия потом
function Profile({ userId }) {
  const [user, setUser] = useState(null);

  if (!userId) return <p>Нет данных</p>;
  // ...
}
```

**Почему?** React отслеживает хуки по **порядку вызова**. При каждом рендере порядок должен быть одинаковым. Если хук внутри `if` -- при одном рендере он вызовется, при другом нет. React запутается, какой хук какому state соответствует.

### Правило 2: Вызывай хуки только из React-функций

```jsx
// МОЖНО: в компоненте
function MyComponent() {
  const [count, setCount] = useState(0);  // OK
}

// МОЖНО: в кастомном хуке
function useCounter() {
  const [count, setCount] = useState(0);  // OK
}

// НЕЛЬЗЯ: в обычной функции
function calculateTotal(items) {
  const [total, setTotal] = useState(0);  // ОШИБКА!
}

// НЕЛЬЗЯ: в обработчике события
function MyComponent() {
  function handleClick() {
    const [x, setX] = useState(0);  // ОШИБКА!
  }
}
```

### ESLint-плагин

Установи `eslint-plugin-react-hooks` -- он автоматически проверяет эти правила:

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Мини-проверка

1. Почему нельзя вызывать хук внутри `if`?
2. Можно ли вызвать `useState` в обычной функции (не компоненте и не хуке)?

---

## 3. Паттерн: useLocalStorage

### Что это такое?

Хук, который синхронизирует state с localStorage. Значение сохраняется при обновлении страницы.

### Как работает?

```jsx
function useLocalStorage(key, initialValue) {
  // Ленивая инициализация: читаем из localStorage один раз
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Синхронизация с localStorage при каждом изменении
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Ошибка записи в localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue];
}
```

Использование -- точно как useState, но данные переживают перезагрузку:

```jsx
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16);

  return (
    <div>
      <button onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}>
        Тема: {theme}
      </button>
      <input
        type="range"
        min={12}
        max={24}
        value={fontSize}
        onChange={e => setFontSize(Number(e.target.value))}
      />
      <p style={{ fontSize }}>Размер шрифта: {fontSize}px</p>
    </div>
  );
}
```

### Мини-проверка

1. Зачем нужна ленивая инициализация (`useState(() => ...)`) в useLocalStorage?
2. Что произойдет при перезагрузке страницы с useLocalStorage?

---

## 4. Паттерн: useFetch

### Что это такое?

Хук для загрузки данных с сервера. Инкапсулирует логику loading/error/data, которая повторяется в каждом компоненте с fetch.

### Как работает?

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json();

        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
```

Использование:

```jsx
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

function PostList() {
  const { data: posts, loading, error } = useFetch('/api/posts');

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

Два компонента, одна и та же логика загрузки -- ноль дублирования.

### Расширенная версия с перезагрузкой

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      if (!cancelled) setData(json);
    } catch (err) {
      if (!cancelled) setError(err.message);
    } finally {
      if (!cancelled) setLoading(false);
    }

    return () => { cancelled = true; };
  }, [url]);

  useEffect(() => {
    const cleanup = fetchData();
    return () => cleanup?.then?.(fn => fn?.());
  }, [fetchData]);

  // Возвращаем refetch для ручной перезагрузки
  return { data, loading, error, refetch: fetchData };
}

// Использование
function PostList() {
  const { data: posts, loading, error, refetch } = useFetch('/api/posts');

  return (
    <div>
      <button onClick={refetch}>Обновить</button>
      {/* ...список... */}
    </div>
  );
}
```

### Мини-проверка

1. Зачем нужен флаг `cancelled` в useFetch?
2. Что возвращает useFetch?

---

## 5. Паттерн: useToggle

### Что это такое?

Простой хук для переключения boolean-значений. Кажется тривиальным, но убирает повторяющийся код.

### Как работает?

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}
```

Использование:

```jsx
function Accordion({ title, children }) {
  const { value: isOpen, toggle } = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>
        {title} {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && <div className="content">{children}</div>}
    </div>
  );
}

function App() {
  const { value: isDark, toggle: toggleTheme } = useToggle(false);
  const { value: showSidebar, toggle: toggleSidebar } = useToggle(true);

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={toggleTheme}>Тема</button>
      <button onClick={toggleSidebar}>Боковая панель</button>
      {showSidebar && <Sidebar />}
    </div>
  );
}
```

### Мини-проверка

1. Зачем `useCallback` в useToggle?
2. Когда useToggle полезнее, чем просто `useState(false)`?

---

## 6. Другие полезные кастомные хуки

### useDebounce -- задержка обновления

```jsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
}

// Использование: поиск с задержкой
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  // fetch запустится через 300мс после последнего нажатия
  const { data } = useFetch(
    debouncedQuery ? `/api/search?q=${debouncedQuery}` : null
  );

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Поиск..."
      />
      {data && <SearchResults results={data} />}
    </div>
  );
}
```

### useOnClickOutside -- клик вне элемента

```jsx
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, handler]);
}

// Использование: закрытие дропдауна при клике снаружи
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(prev => !prev)}>Меню</button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li>Профиль</li>
          <li>Настройки</li>
          <li>Выход</li>
        </ul>
      )}
    </div>
  );
}
```

### useMediaQuery -- медиа-запросы в JS

```jsx
function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    function handleChange(e) {
      setMatches(e.matches);
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

// Использование
function ResponsiveLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  if (isMobile) return <MobileLayout />;
  if (isTablet) return <TabletLayout />;
  return <DesktopLayout />;
}
```

### Мини-проверка

1. Что делает useDebounce и когда он полезен?
2. Как useOnClickOutside определяет, что клик был вне элемента?

---

## Итог

- **Кастомный хук** -- функция, начинающаяся с `use`, которая извлекает переиспользуемую логику с состоянием
- **Правила хуков:** только на верхнем уровне, только в компонентах или других хуках, всегда в одном порядке
- **useLocalStorage** -- синхронизация state с localStorage. API как у useState
- **useFetch** -- инкапсуляция паттерна loading/error/data для запросов к API
- **useToggle** -- переключение boolean-значений с удобным API
- **useDebounce** -- задержка обновления значения, полезна для поиска
- Каждый вызов кастомного хука создает **независимую** копию состояния

---

> [[react/08-use-ref|<-- Назад: useRef]] | [[react-fundamentals|<-- Назад к оглавлению React]] | [[react/10-router|Далее: React Router -->]]
