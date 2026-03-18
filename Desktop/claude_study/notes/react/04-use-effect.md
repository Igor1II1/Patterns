# Глава 4. useEffect -- побочные эффекты

> [[react/03-use-state|<-- Назад: useState]] | [[react-fundamentals|<-- Назад к оглавлению React]] | [[react/05-lists-keys|Далее: Списки и ключи -->]]

---

## Зачем эта тема существует?

Компонент -- это функция, которая описывает UI. Но реальные приложения делают не только это: загружают данные с сервера, запускают таймеры, подписываются на события, взаимодействуют с localStorage. Все это -- **побочные эффекты** (side effects). Они не связаны с отрисовкой напрямую, но без них приложение бесполезно.

`useEffect` -- это хук, который говорит React: "после рендера выполни вот этот код". Он связывает жизненный цикл компонента с внешним миром.

---

## 1. Что такое побочные эффекты

### Что это такое?

**Чистая функция** -- это функция, которая зависит только от своих аргументов и не влияет ни на что снаружи. Компоненты React стремятся быть чистыми: получили props -- вернули JSX.

**Побочный эффект (side effect)** -- это любое действие, которое выходит за рамки "получить данные, вернуть JSX":

- Запрос к API (fetch)
- Работа с localStorage / sessionStorage
- Запуск таймера (setTimeout, setInterval)
- Подписка на события (addEventListener)
- Изменение заголовка страницы (document.title)
- Работа с DOM напрямую (фокус, скролл)

### Почему нельзя делать эффекты прямо в теле компонента?

```jsx
// Плохо: fetch при каждом рендере -- бесконечный цикл!
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // Этот код выполнится при КАЖДОМ рендере
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => setUser(data)); // setUser вызовет новый рендер -> fetch -> setUser -> ...

  return <div>{user?.name}</div>;
}
```

Тело компонента вызывается при каждом рендере. Если поместить fetch туда, произойдет: рендер -> fetch -> setState -> рендер -> fetch -> setState -> ... бесконечный цикл.

### Мини-проверка

1. Что такое побочный эффект?
2. Почему fetch нельзя вызывать прямо в теле компонента?

---

## 2. useEffect -- базовый синтаксис

### Что это такое?

`useEffect` -- хук, который выполняет код **после** рендера компонента. Он принимает два аргумента: функцию-эффект и массив зависимостей.

### Как работает?

```jsx
import { useState, useEffect } from 'react';

useEffect(() => {
  // Этот код выполнится ПОСЛЕ рендера
  console.log('Компонент отрисован');
}, []); // массив зависимостей
```

Три варианта использования:

```jsx
// 1. Без массива зависимостей -- выполняется после КАЖДОГО рендера
useEffect(() => {
  console.log('Каждый рендер');
});

// 2. Пустой массив -- выполняется ОДИН раз после первого рендера
useEffect(() => {
  console.log('Только при монтировании');
}, []);

// 3. С зависимостями -- выполняется при изменении зависимостей
useEffect(() => {
  console.log(`userId изменился: ${userId}`);
}, [userId]);
```

**Аналогия:** представь, что `useEffect` -- это записка, которую ты оставляешь себе: "Когда закончишь рисовать картину (рендер), сделай вот это (эффект)". Массив зависимостей -- условие: "но только если изменился вот этот цвет".

### Плохой пример -- Хороший пример

```jsx
// Плохо: эффект без зависимостей -- запускается при каждом рендере
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`/api/search?q=${query}`)
      .then(res => res.json())
      .then(data => setResults(data));
  }); // нет массива зависимостей!
  // Любое изменение state -> рендер -> fetch -> setState -> рендер -> ...

  return <div>...</div>;
}

// Хорошо: эффект с зависимостью -- запускается только при изменении query
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`/api/search?q=${query}`)
      .then(res => res.json())
      .then(data => setResults(data));
  }, [query]); // Запустится только когда query изменится

  return <div>...</div>;
}
```

### Мини-проверка

1. Когда выполняется useEffect с пустым массивом `[]`?
2. Что произойдет, если не передать массив зависимостей?

---

## 3. Массив зависимостей

### Что это такое?

Массив зависимостей -- второй аргумент `useEffect`. Он указывает React, **при изменении каких значений** нужно перезапустить эффект. React сравнивает значения из предыдущего рендера с текущими через `Object.is()`.

### Как работает?

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  // Эффект зависит от userId
  // Если userId изменился -- fetch перезапустится
  // Если theme изменился -- эффект НЕ запустится (theme нет в зависимостях)
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  return (
    <div className={theme}>
      <p>{user?.name}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Тема
      </button>
    </div>
  );
}
```

**Правило:** в массив зависимостей должны попасть **все** значения из внешней области видимости, которые используются внутри эффекта. ESLint-плагин `react-hooks/exhaustive-deps` предупредит, если ты что-то пропустил.

```jsx
// Плохо: userId используется, но не указан в зависимостях
useEffect(() => {
  fetch(`/api/users/${userId}`); // userId из props
}, []); // ESLint предупредит: "userId" is missing in dependency array

// Хорошо:
useEffect(() => {
  fetch(`/api/users/${userId}`);
}, [userId]);
```

### Частые заблуждения

- "Я не хочу, чтобы эффект перезапускался, поэтому не добавлю зависимость" -- это ошибка. Эффект будет работать с устаревшими данными (stale closure). Если эффект перезапускается слишком часто, нужно рефакторить, а не убирать зависимости.
- "Объект/массив в зависимостях -- безопасно" -- нет! Объекты сравниваются по ссылке. Если объект создается заново при каждом рендере, эффект будет перезапускаться каждый раз.

```jsx
// Проблема: options создается заново при каждом рендере
function Search({ query }) {
  const options = { limit: 10, query }; // новый объект каждый рендер

  useEffect(() => {
    fetchData(options);
  }, [options]); // будет срабатывать КАЖДЫЙ рендер!

  // Решение: используй примитивные значения в зависимостях
  useEffect(() => {
    fetchData({ limit: 10, query });
  }, [query]); // query -- строка, сравнивается по значению
}
```

### Мини-проверка

1. Что должно быть в массиве зависимостей?
2. Почему объект в зависимостях может вызвать бесконечный цикл?

---

## 4. Функция очистки (cleanup)

### Что это такое?

Некоторые эффекты нужно **убирать**: отменять подписки, очищать таймеры, отменять запросы. Для этого функция эффекта может **вернуть другую функцию** -- функцию очистки.

### Как работает?

```jsx
useEffect(() => {
  // Эффект: запускаем

  return () => {
    // Очистка: вызывается перед следующим запуском эффекта
    // или при размонтировании компонента
  };
}, [dependencies]);
```

**Когда вызывается очистка:**
1. Перед повторным запуском эффекта (если зависимости изменились)
2. При размонтировании компонента (удалении из DOM)

```jsx
// Пример: таймер
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Очистка: останавливаем таймер
    return () => {
      clearInterval(intervalId);
    };
  }, []); // пустой массив -- запускаем один раз

  return <p>Прошло: {seconds} сек</p>;
}
```

### Плохой пример -- Хороший пример

```jsx
// Плохо: нет очистки -- утечка памяти
function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    // Если компонент удалится, обработчик останется!
    // Утечка памяти + ошибки
  }, []);

  return <p>Ширина: {width}px</p>;
}

// Хорошо: очистка в return
function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <p>Ширина: {width}px</p>;
}
```

### Частые заблуждения

- "Очистка нужна только при размонтировании" -- нет. Она вызывается и при каждом перезапуске эффекта. Это важно для предотвращения гонок данных.

### Мини-проверка

1. Когда вызывается функция очистки?
2. Почему важно очищать подписки и таймеры?

---

## 5. Типичные паттерны useEffect

### Загрузка данных (fetch)

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // флаг для предотвращения гонки

    async function fetchUser() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();

        if (!cancelled) {   // проверяем, не устарел ли запрос
          setUser(data);
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

    fetchUser();

    return () => {
      cancelled = true; // при смене userId старый запрос игнорируется
    };
  }, [userId]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  return <h1>{user.name}</h1>;
}
```

**Зачем флаг `cancelled`?** Представь: userId = 1, начинается загрузка. Пользователь быстро переключается на userId = 2. Начинается новая загрузка. Если ответ для userId = 1 придет позже, он перезапишет данные для userId = 2. Флаг `cancelled` предотвращает это.

### Таймеры

```jsx
// Обратный отсчет
function Countdown({ seconds: initial }) {
  const [seconds, setSeconds] = useState(initial);

  useEffect(() => {
    if (seconds <= 0) return; // не запускать, если уже 0

    const timerId = setTimeout(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [seconds]); // перезапускается при каждом изменении seconds

  return <p>{seconds > 0 ? `Осталось: ${seconds}` : 'Время вышло!'}</p>;
}
```

### Подписка на события

```jsx
// Отслеживание положения мыши
function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <p>Мышь: {position.x}, {position.y}</p>;
}
```

### Изменение заголовка страницы

```jsx
function PageTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <h1>{title}</h1>;
}
```

### Работа с localStorage

```jsx
function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // Ленивая инициализация -- читаем из localStorage один раз
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]); // сохраняем при каждом изменении

  return (
    <button onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}>
      Тема: {theme}
    </button>
  );
}
```

### Мини-проверка

1. Зачем нужен флаг `cancelled` при загрузке данных?
2. Какой паттерн используется для подписки на события браузера?

---

## Итог

- **Побочные эффекты** -- действия, выходящие за рамки рендеринга: fetch, таймеры, подписки, работа с DOM
- **useEffect** выполняет код **после** рендера. Принимает функцию и массив зависимостей
- **Массив зависимостей** управляет перезапуском: `[]` -- один раз, `[a, b]` -- при изменении a или b, без массива -- каждый рендер
- **Функция очистки** (return) -- убирает эффект при перезапуске или размонтировании. Обязательна для таймеров и подписок
- **Все значения** из внешней области видимости, используемые в эффекте, должны быть в зависимостях
- **Типичные паттерны:** загрузка данных с `cancelled`, подписки с очисткой, синхронизация с localStorage

---

> [[react/03-use-state|<-- Назад: useState]] | [[react-fundamentals|<-- Назад к оглавлению React]] | [[react/05-lists-keys|Далее: Списки и ключи -->]]
