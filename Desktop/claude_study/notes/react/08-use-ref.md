# Глава 8. useRef -- ссылки и мутабельные значения

> [[react/07-use-context|<-- Назад: useContext]] | [[react-fundamentals|<-- Назад к оглавлению React]] | [[react/09-custom-hooks|Далее: Кастомные хуки -->]]

---

## Зачем эта тема существует?

Иногда в React нужно выйти за рамки декларативного подхода: программно установить фокус на input, измерить размер элемента, анимировать DOM-элемент, сохранить значение между рендерами без перерисовки. Для всего этого существует `useRef` -- хук, который создает "коробку" для хранения любого значения, не вызывая перерисовку при изменении.

---

## 1. useRef -- базовое понимание

### Что это такое?

`useRef` создает объект с единственным свойством `.current`. Этот объект:
- Сохраняется между рендерами (как state)
- **Не вызывает перерисовку** при изменении (в отличие от state)
- Мутабелен -- можно менять `.current` напрямую

### Как работает?

```jsx
import { useRef } from 'react';

function Timer() {
  const intervalRef = useRef(null);
  //                         ^
  //                   начальное значение

  console.log(intervalRef);        // { current: null }
  console.log(intervalRef.current); // null

  // Можно менять напрямую
  intervalRef.current = 42;
  // Перерисовки НЕ будет!
}
```

**Аналогия:** `useState` -- это полка с сигнализацией: когда кладешь новый предмет, срабатывает уведомление (перерисовка). `useRef` -- это ящик стола: кладешь что хочешь, достаешь когда нужно, никто не узнает что ты его открывал.

### Мини-проверка

1. Что возвращает `useRef()`?
2. Что произойдет при изменении `ref.current`?

---

## 2. Доступ к DOM-элементам

### Что это такое?

Самое распространенное применение `useRef` -- получить прямую ссылку на DOM-элемент. Это нужно для операций, которые невозможны декларативно: фокус, скролл, измерение размеров, интеграция со сторонними библиотеками.

### Как работает?

```jsx
import { useRef, useEffect } from 'react';

function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    // После монтирования -- устанавливаем фокус
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} placeholder="Фокус будет здесь" />;
  //            ^^^
  //     атрибут ref связывает DOM-элемент с нашим ref-объектом
}
```

Что происходит:

1. `useRef(null)` создает `{ current: null }`
2. React рендерит `<input>` и записывает DOM-элемент в `inputRef.current`
3. `useEffect` срабатывает после рендера
4. `inputRef.current` теперь указывает на реальный DOM-элемент `<input>`
5. Вызываем `.focus()` на нем

### Примеры использования

```jsx
// Скролл к элементу
function ScrollToBottom() {
  const bottomRef = useRef(null);

  function scrollDown() {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      <button onClick={scrollDown}>Прокрутить вниз</button>
      {/* ...много контента... */}
      <div ref={bottomRef} />
    </div>
  );
}

// Измерение размеров
function MeasureBox() {
  const boxRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const rect = boxRef.current.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });
  }, []);

  return (
    <div>
      <div ref={boxRef} className="box">Контент</div>
      <p>Размер: {size.width} x {size.height}</p>
    </div>
  );
}

// Работа с video/audio
function VideoPlayer() {
  const videoRef = useRef(null);

  function play() {
    videoRef.current.play();
  }

  function pause() {
    videoRef.current.pause();
  }

  return (
    <div>
      <video ref={videoRef} src="movie.mp4" />
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
    </div>
  );
}
```

### Плохой пример -- Хороший пример

```jsx
// Плохо: ищем элемент через DOM API
function BadSearch() {
  function handleClick() {
    const input = document.querySelector('#search-input');
    input.focus();  // Работает, но не "по-реактовски"
  }

  return <input id="search-input" />;
}

// Хорошо: используем ref
function GoodSearch() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return <input ref={inputRef} />;
}
```

### Частые заблуждения

- "Можно просто использовать document.getElementById" -- технически да, но в React это антипаттерн. Ref привязан к конкретному экземпляру компонента, а DOM-запросы глобальны.
- "ref доступен сразу после создания" -- нет. DOM-элемент появится в `ref.current` только после рендера. Поэтому используй `useEffect` или обработчики событий.

### Мини-проверка

1. Как связать ref с DOM-элементом?
2. Когда `ref.current` получит ссылку на DOM-элемент?

---

## 3. Хранение мутабельных значений

### Что это такое?

`useRef` можно использовать не только для DOM. Любое значение, которое нужно сохранить между рендерами, но которое **не должно вызывать перерисовку** при изменении -- кандидат для ref.

### Как работает?

```jsx
// Хранение ID таймера
function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);  // ID интервала не влияет на UI

  function start() {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);  // Используем сохраненный ID
    intervalRef.current = null;
    setIsRunning(false);
  }

  function reset() {
    stop();
    setSeconds(0);
  }

  return (
    <div>
      <p>{seconds} сек</p>
      <button onClick={start}>Старт</button>
      <button onClick={stop}>Стоп</button>
      <button onClick={reset}>Сброс</button>
    </div>
  );
}
```

```jsx
// Хранение предыдущего значения
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;  // Обновляется ПОСЛЕ рендера
  }, [value]);

  return ref.current;     // Возвращает значение ДО обновления
}

function PriceTracker({ price }) {
  const prevPrice = usePrevious(price);

  return (
    <div>
      <p>Цена: {price}</p>
      {prevPrice !== undefined && (
        <p>
          {price > prevPrice ? 'Выросла' : price < prevPrice ? 'Упала' : 'Без изменений'}
        </p>
      )}
    </div>
  );
}
```

```jsx
// Счетчик рендеров (для отладки)
function RenderCounter() {
  const renderCount = useRef(0);
  renderCount.current += 1;  // Увеличиваем при каждом рендере

  return <p>Рендеров: {renderCount.current}</p>;
}
```

### Мини-проверка

1. Зачем хранить ID таймера в ref, а не в state?
2. Как с помощью ref отследить предыдущее значение props?

---

## 4. forwardRef -- передача ref дочернему компоненту

### Что это такое?

По умолчанию `ref` нельзя передать как prop в кастомный компонент -- React его проигнорирует. `forwardRef` решает эту проблему: он позволяет "пробросить" ref через компонент к его внутреннему DOM-элементу.

### Как работает?

```jsx
// Без forwardRef -- ref не работает
function MyInput(props) {
  return <input {...props} />;
}

function App() {
  const inputRef = useRef(null);
  // ref не попадет в MyInput!
  return <MyInput ref={inputRef} />;
  // Warning: Function components cannot be given refs
}
```

```jsx
import { forwardRef, useRef } from 'react';

// С forwardRef -- ref пробрасывается
const MyInput = forwardRef(function MyInput(props, ref) {
  //                                              ^^^
  //                              второй аргумент -- пробрасываемый ref
  return (
    <input
      {...props}
      ref={ref}     // Привязываем к реальному input
      className="custom-input"
    />
  );
});

function App() {
  const inputRef = useRef(null);

  function focusInput() {
    inputRef.current.focus();  // Работает!
  }

  return (
    <div>
      <MyInput ref={inputRef} placeholder="Кастомный input" />
      <button onClick={focusInput}>Фокус</button>
    </div>
  );
}
```

### Практический пример: компонент-обертка

```jsx
const Card = forwardRef(function Card({ children, title }, ref) {
  return (
    <div ref={ref} className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
});

function App() {
  const cardRef = useRef(null);

  function scrollToCard() {
    cardRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      <button onClick={scrollToCard}>К карточке</button>
      {/* ...контент... */}
      <Card ref={cardRef} title="Важная карточка">
        <p>Содержимое</p>
      </Card>
    </div>
  );
}
```

### Частые заблуждения

- "forwardRef нужен всегда" -- нет, только когда родитель должен получить доступ к DOM-элементу дочернего компонента. Большинство компонентов не нуждаются в forwardRef.
- "ref можно передать как обычный prop" -- нет, `ref` -- зарезервированное имя. React обрабатывает его особым образом.

### Мини-проверка

1. Зачем нужен `forwardRef`?
2. Что будет, если передать `ref` обычному функциональному компоненту без `forwardRef`?

---

## 5. useRef vs useState -- когда что использовать

### Сравнительная таблица

| Критерий | useState | useRef |
|---|---|---|
| Вызывает перерисовку | Да | Нет |
| Значение обновляется | При следующем рендере | Мгновенно |
| Мутабельность | Иммутабельный (через setter) | Мутабельный (`.current =`) |
| Отображается в UI | Обычно да | Обычно нет |
| Сохраняется между рендерами | Да | Да |

### Как выбрать?

```
Значение отображается на экране?
  Да → useState
  Нет → useRef

Изменение должно вызвать перерисовку?
  Да → useState
  Нет → useRef
```

```jsx
// useState: значение видно на экране
const [count, setCount] = useState(0);    // отображается в <p>{count}</p>
const [name, setName] = useState('');      // отображается в UI
const [isOpen, setIsOpen] = useState(false); // управляет видимостью

// useRef: значение НЕ видно на экране напрямую
const timerRef = useRef(null);            // ID таймера -- служебное значение
const prevValueRef = useRef(undefined);    // предыдущее значение -- для логики
const inputRef = useRef(null);            // DOM-элемент -- для императивных операций
const isMountedRef = useRef(false);       // флаг монтирования
```

### Плохой пример -- Хороший пример

```jsx
// Плохо: state для служебного значения -- лишние перерисовки
function Timer() {
  const [intervalId, setIntervalId] = useState(null);
  // Каждый setIntervalId вызовет перерисовку -- зачем?
  // intervalId не отображается в UI

  function start() {
    const id = setInterval(() => { /* ... */ }, 1000);
    setIntervalId(id);  // ненужная перерисовка!
  }
}

// Хорошо: ref для служебного значения -- без перерисовок
function Timer() {
  const intervalRef = useRef(null);

  function start() {
    intervalRef.current = setInterval(() => { /* ... */ }, 1000);
    // Нет перерисовки -- и не нужна
  }
}
```

```jsx
// Плохо: ref для значения в UI -- не обновится на экране
function BadCounter() {
  const countRef = useRef(0);

  function increment() {
    countRef.current += 1;
    // Значение изменилось, но компонент НЕ перерисуется
  }

  return <p>{countRef.current}</p>;  // Всегда показывает 0!
}

// Хорошо: state для значения в UI
function GoodCounter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(prev => prev + 1);  // Вызовет перерисовку
  }

  return <p>{count}</p>;  // Обновляется
}
```

### Мини-проверка

1. Когда использовать useRef вместо useState?
2. Почему ref не подходит для хранения данных, отображаемых в UI?

---

## Итог

- **useRef** создает объект `{ current: value }`, который сохраняется между рендерами и **не вызывает перерисовку** при изменении
- **Доступ к DOM:** `<input ref={myRef} />` связывает DOM-элемент с ref. Используй для фокуса, скролла, измерений
- **Мутабельные значения:** ID таймеров, предыдущие значения, счетчики рендеров -- все, что не отображается в UI
- **forwardRef** позволяет пробросить ref через кастомный компонент к его внутреннему DOM-элементу
- **useState vs useRef:** если значение влияет на UI -- state. Если нет -- ref

---

> [[react/07-use-context|<-- Назад: useContext]] | [[react-fundamentals|<-- Назад к оглавлению React]] | [[react/09-custom-hooks|Далее: Кастомные хуки -->]]
