# Глава 7. useContext -- глобальное состояние

> [[react/06-forms|<-- Назад: Формы]] | [[react-fundamentals|<-- Назад к оглавлению React]] | [[react/08-use-ref|Далее: useRef -->]]

---

## Зачем эта тема существует?

Представь: тема оформления (светлая/темная) нужна в Header, Sidebar, Button, Footer -- в десятках компонентов на разных уровнях вложенности. Передавать `theme` через props каждому промежуточному компоненту -- утомительно и засоряет код. Это называется **prop drilling** (проброс пропсов). Context решает эту проблему: он позволяет передавать данные "через стену", минуя промежуточные компоненты.

---

## 1. Проблема prop drilling

### Что это такое?

Prop drilling -- ситуация, когда props передаются через много уровней компонентов, хотя промежуточные компоненты сами эти данные не используют.

### Как выглядит проблема?

```jsx
// Prop drilling: theme проходит через 4 уровня
function App() {
  const [theme, setTheme] = useState('light');
  return <Layout theme={theme} />;          // 1. App -> Layout
}

function Layout({ theme }) {
  return <Main theme={theme} />;             // 2. Layout -> Main (не использует theme)
}

function Main({ theme }) {
  return <Sidebar theme={theme} />;          // 3. Main -> Sidebar (не использует theme)
}

function Sidebar({ theme }) {
  return <Button theme={theme} />;           // 4. Sidebar -> Button (не использует theme)
}

function Button({ theme }) {
  return (                                    // Наконец-то используется!
    <button className={`btn-${theme}`}>
      Нажми
    </button>
  );
}
```

Layout, Main и Sidebar не используют `theme`, но вынуждены его принимать и передавать. Если props изменится или добавится новый -- нужно менять все промежуточные компоненты.

### Мини-проверка

1. Что такое prop drilling?
2. Почему это проблема?

---

## 2. Создание контекста

### Что это такое?

Context -- это способ передать данные напрямую от "поставщика" (Provider) к любому "потребителю" (consumer) внутри дерева компонентов, минуя промежуточные уровни.

### Как работает?

Три шага: создать -- предоставить -- использовать.

**Шаг 1: Создание контекста**

```jsx
// ThemeContext.js
import { createContext } from 'react';

// createContext принимает значение по умолчанию
// Оно используется, если компонент не обернут в Provider
const ThemeContext = createContext('light');

export default ThemeContext;
```

**Шаг 2: Предоставление через Provider**

```jsx
// App.jsx
import { useState } from 'react';
import ThemeContext from './ThemeContext';

function App() {
  const [theme, setTheme] = useState('light');

  return (
    // Provider оборачивает дерево и передает value
    <ThemeContext.Provider value={theme}>
      <Layout />  {/* Никаких props! */}
    </ThemeContext.Provider>
  );
}

function Layout() {
  return <Main />;  // Не знает про theme -- и не должен
}

function Main() {
  return <Sidebar />;  // Не знает про theme
}
```

**Шаг 3: Использование через useContext**

```jsx
// Button.jsx
import { useContext } from 'react';
import ThemeContext from './ThemeContext';

function Button() {
  const theme = useContext(ThemeContext);  // Получает значение напрямую!

  return (
    <button className={`btn-${theme}`}>
      Нажми
    </button>
  );
}
```

**Аналогия:** Context -- это как радиостанция. Provider -- передатчик, он вещает на определенной частоте. `useContext` -- приемник, который настроен на ту же частоту. Промежуточные компоненты -- здания между вышкой и радио. Сигнал проходит через них, не задевая.

### Мини-проверка

1. Какие три шага нужны для работы с Context?
2. Что произойдет, если компонент вызовет useContext без Provider выше в дереве?

---

## 3. Передача функций через Context

### Что это такое?

Часто нужно не только читать контекст, но и **изменять** его. Для этого через Context передают и данные, и функцию обновления.

### Как работает?

```jsx
// ThemeContext.js
import { createContext } from 'react';

// Контекст хранит и значение, и функцию изменения
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},  // заглушка по умолчанию
});

export default ThemeContext;
```

```jsx
// App.jsx
import { useState } from 'react';
import ThemeContext from './ThemeContext';

function App() {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }

  // Передаем объект с данными и функцией
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}
```

```jsx
// ThemeToggle.jsx
import { useContext } from 'react';
import ThemeContext from './ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      Тема: {theme === 'light' ? 'Светлая' : 'Темная'}
    </button>
  );
}
```

### Паттерн: вынесение логики в отдельный Provider-компонент

```jsx
// ThemeProvider.jsx -- вся логика темы в одном месте
import { useState, createContext, useContext } from 'react';

const ThemeContext = createContext(null);

// Кастомный Provider
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Кастомный хук для удобства
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme должен использоваться внутри ThemeProvider');
  }
  return context;
}
```

```jsx
// App.jsx -- чистый и простой
import { ThemeProvider } from './ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}
```

```jsx
// Любой компонент -- просто вызывает useTheme()
import { useTheme } from './ThemeProvider';

function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>Сменить тему</button>
    </header>
  );
}
```

### Мини-проверка

1. Как передать функцию обновления через Context?
2. Зачем выносить логику в отдельный Provider-компонент?

---

## 4. Когда использовать Context vs prop drilling

### Как решить?

Context -- не замена props. Это инструмент для **конкретной проблемы**: данные, которые нужны многим компонентам на разных уровнях.

**Используй props когда:**
- Данные нужны 1-2 уровням вложенности
- Связь между компонентами очевидна (родитель -> ребенок)
- Компонент должен быть переиспользуемым

**Используй Context когда:**
- Данные нужны многим компонентам на разных уровнях
- Промежуточные компоненты не используют эти данные
- Данные "глобальные": тема, язык, авторизация, настройки

```
Примеры хороших кандидатов для Context:
- Тема оформления (light/dark)
- Текущий пользователь (авторизация)
- Язык/локализация
- Настройки приложения

Примеры того, что НЕ нужно в Context:
- Данные формы (локальны для формы)
- Состояние модалки (локально для страницы)
- Данные одного компонента
```

### Плохой пример -- Хороший пример

```jsx
// Плохо: всё в Context -- невозможно понять зависимости
<AppContext.Provider value={{
  user, theme, language, cart, notifications,
  setUser, setTheme, setLanguage, addToCart, clearNotifications
}}>
  <App />
</AppContext.Provider>

// Хорошо: раздельные контексты для разных доменов
<AuthProvider>
  <ThemeProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </ThemeProvider>
</AuthProvider>
```

### Альтернатива: композиция компонентов

Иногда prop drilling можно решить без Context, через **композицию**:

```jsx
// Проблема: нужно передать user через 3 уровня
<Page user={user} />
  <PageLayout user={user} />
    <NavigationBar user={user} />
      <Avatar url={user.avatarUrl} />

// Решение: передать готовый компонент
function Page({ user }) {
  const avatar = <Avatar url={user.avatarUrl} />;
  return <PageLayout avatar={avatar} />;
}

function PageLayout({ avatar }) {
  return (
    <nav>
      {avatar}  {/* Не знает про user, получает готовый компонент */}
    </nav>
  );
}
```

### Мини-проверка

1. Назови три примера данных, подходящих для Context
2. Почему не стоит хранить все данные в одном контексте?

---

## 5. Производительность Context

### Что это такое?

При изменении значения в Provider **все** компоненты, которые используют этот контекст через `useContext`, перерендерятся. Это может быть проблемой, если контекст меняется часто или содержит много данных.

### Как работает?

```jsx
// Проблема: при каждом рендере App создается новый объект value
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);

  // Новый объект при каждом рендере -> все потребители перерендерятся
  return (
    <AppContext.Provider value={{ theme, user, setTheme, setUser }}>
      <Content />
    </AppContext.Provider>
  );
}
```

### Оптимизации

**1. Разделяй контексты по частоте обновления:**

```jsx
// Тема меняется редко, а user -- часто
// Разделяем, чтобы смена user не перерисовывала компоненты, зависящие от темы
<ThemeContext.Provider value={theme}>
  <UserContext.Provider value={user}>
    <App />
  </UserContext.Provider>
</ThemeContext.Provider>
```

**2. Разделяй данные и функции обновления:**

```jsx
// Функции не меняются -- компоненты, которым нужен только dispatch, не перерендерятся
const StateContext = createContext(null);
const DispatchContext = createContext(null);

function AppProvider({ children }) {
  const [state, setState] = useState({ theme: 'light', count: 0 });

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={setState}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
```

**3. Мемоизация value с useMemo:**

```jsx
import { useMemo } from 'react';

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  // Объект пересоздается только при изменении theme
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Частые заблуждения

- "Context -- это Redux" -- нет. Context -- транспорт данных, Redux -- полноценная система управления состоянием с девтулзами, мидлварами и паттернами.
- "Context медленный" -- Context не медленный сам по себе. Проблема в ненужных перерендерах, и это решается разделением контекстов.

### Мини-проверка

1. Что произойдет со всеми потребителями контекста при изменении value?
2. Как снизить количество ненужных перерендеров при использовании Context?

---

## Итог

- **Prop drilling** -- проброс props через компоненты, которые их не используют. Context решает эту проблему
- **Три шага:** `createContext()` -> `<Context.Provider value={...}>` -> `useContext(Context)`
- **Передавай функции** через Context для изменения данных. Выноси логику в отдельный Provider-компонент
- **Context -- не для всего.** Используй для глобальных данных (тема, язык, auth). Для локальных данных -- props
- **Разделяй контексты** по доменам и частоте обновления для оптимальной производительности
- **Кастомный хук** (`useTheme`, `useAuth`) -- лучший API для потребителей контекста

---

> [[react/06-forms|<-- Назад: Формы]] | [[react-fundamentals|<-- Назад к оглавлению React]] | [[react/08-use-ref|Далее: useRef -->]]
