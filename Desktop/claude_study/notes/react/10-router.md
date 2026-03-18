# Глава 10. React Router -- маршрутизация

> [[react/09-custom-hooks|<-- Назад: Кастомные хуки]] | [[react-fundamentals|<-- Назад к оглавлению React]]

---

## Зачем эта тема существует?

React-приложение по умолчанию -- это одна страница (SPA, Single Page Application). Но пользователь ожидает привычного поведения: разные URL для разных страниц, кнопка "назад" в браузере, возможность поделиться ссылкой на конкретную страницу. React Router решает эту задачу: он связывает URL с компонентами, создавая иллюзию многостраничного сайта в рамках SPA.

---

## 1. Установка и базовая настройка

### Что это такое?

React Router -- это сторонняя библиотека (не входит в React). Она перехватывает изменения URL и рендерит нужный компонент без перезагрузки страницы.

### Как работает?

Установка:

```bash
npm install react-router-dom
```

Базовая настройка:

```jsx
// main.jsx (точка входа)
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

`BrowserRouter` оборачивает все приложение и использует History API браузера для управления URL. Без него ни один компонент React Router не будет работать.

### Определение маршрутов

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div>
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
```

- `<Routes>` -- контейнер для маршрутов. Рендерит **первый** подходящий маршрут
- `<Route>` -- один маршрут. `path` -- URL, `element` -- что рендерить
- `path="*"` -- "все остальное", используется для страницы 404

### Плохой пример -- Хороший пример

```jsx
// Плохо: условный рендеринг вместо роутера
function App() {
  const [page, setPage] = useState('home');

  return (
    <div>
      <button onClick={() => setPage('home')}>Главная</button>
      <button onClick={() => setPage('about')}>О нас</button>

      {page === 'home' && <Home />}
      {page === 'about' && <About />}
    </div>
  );
  // Проблемы: URL не меняется, кнопка "назад" не работает,
  // нельзя поделиться ссылкой, нет истории
}

// Хорошо: React Router
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
  // URL меняется, история работает, можно поделиться ссылкой
}
```

### Мини-проверка

1. Зачем нужен `BrowserRouter`?
2. Что означает `path="*"` в Route?

---

## 2. Link и NavLink -- навигация без перезагрузки

### Что это такое?

`Link` заменяет тег `<a>` для внутренней навигации. Обычный `<a href="/about">` перезагрузит страницу. `Link` меняет URL без перезагрузки, сохраняя состояние приложения.

### Как работает?

```jsx
import { Link, NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      {/* Link -- простая ссылка без перезагрузки */}
      <Link to="/">Главная</Link>
      <Link to="/about">О нас</Link>
      <Link to="/contact">Контакты</Link>
    </nav>
  );
}
```

**NavLink -- Link с активным состоянием:**

```jsx
function Navigation() {
  return (
    <nav>
      {/* NavLink автоматически получает класс "active" для текущего маршрута */}
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Главная
      </NavLink>

      <NavLink
        to="/about"
        style={({ isActive }) => ({
          fontWeight: isActive ? 'bold' : 'normal',
          color: isActive ? 'red' : 'black'
        })}
      >
        О нас
      </NavLink>
    </nav>
  );
}
```

### Плохой пример -- Хороший пример

```jsx
// Плохо: обычный <a> -- перезагружает страницу
<a href="/about">О нас</a>
// Потеря state всего приложения, мерцание, лишний запрос к серверу

// Хорошо: Link -- мгновенный переход
<Link to="/about">О нас</Link>
// State сохраняется, переход мгновенный, без перезагрузки
```

### Частые заблуждения

- "Link -- это то же самое что `<a>`" -- внешне да, но Link перехватывает клик и меняет URL через History API, не перезагружая страницу.
- "NavLink нужен для всех ссылок" -- нет, NavLink нужен только в навигационных меню, где важно показать активный пункт. Для обычных ссылок достаточно Link.

### Мини-проверка

1. Чем Link отличается от обычного тега `<a>`?
2. Когда NavLink предпочтительнее Link?

---

## 3. useNavigate -- программная навигация

### Что это такое?

Иногда нужно перейти на другую страницу программно: после отправки формы, по таймеру, при ошибке авторизации. `useNavigate` возвращает функцию для навигации из JavaScript-кода.

### Как работает?

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await login(email, password);

    if (success) {
      navigate('/dashboard');       // перейти на дашборд
    } else {
      navigate('/login?error=1');   // остаться на логине с параметром
    }
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
```

Дополнительные возможности:

```jsx
const navigate = useNavigate();

// Переход вперед
navigate('/users');

// Переход с заменой записи в истории (кнопка "назад" не вернет на текущую)
navigate('/login', { replace: true });

// Передача данных через state (не видно в URL)
navigate('/profile', { state: { from: 'login' } });

// Навигация по истории
navigate(-1);  // назад (как кнопка "назад" в браузере)
navigate(-2);  // назад на 2 шага
navigate(1);   // вперед
```

### Плохой пример -- Хороший пример

```jsx
// Плохо: window.location для навигации в SPA
function LogoutButton() {
  function handleLogout() {
    logout();
    window.location.href = '/';  // Полная перезагрузка!
  }
  return <button onClick={handleLogout}>Выйти</button>;
}

// Хорошо: useNavigate
function LogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/', { replace: true });  // Без перезагрузки
  }
  return <button onClick={handleLogout}>Выйти</button>;
}
```

### Мини-проверка

1. Когда нужен useNavigate вместо Link?
2. Что делает опция `replace: true`?

---

## 4. useParams -- динамические параметры маршрута

### Что это такое?

Динамические маршруты содержат переменные части в URL. Например, `/users/42` -- где `42` -- это ID пользователя. `useParams` позволяет получить эти параметры внутри компонента.

### Как работает?

```jsx
// Определение маршрута с параметром
<Route path="/users/:userId" element={<UserProfile />} />
//                  ^^^^^^^^
//            :userId -- динамический параметр

// Компонент получает параметр через useParams
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { userId } = useParams();
  // URL: /users/42  ->  userId = "42" (всегда строка!)

  const { data: user, loading } = useFetch(`/api/users/${userId}`);

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>ID: {userId}</p>
    </div>
  );
}
```

Несколько параметров:

```jsx
<Route path="/blog/:year/:month/:slug" element={<BlogPost />} />

function BlogPost() {
  const { year, month, slug } = useParams();
  // URL: /blog/2026/03/react-intro
  // year = "2026", month = "03", slug = "react-intro"

  return <h1>Статья: {slug} ({month}.{year})</h1>;
}
```

### Частые заблуждения

- "useParams возвращает числа" -- нет, всегда строки. Если нужно число: `Number(userId)` или `parseInt(userId, 10)`.

### Мини-проверка

1. Как обозначить динамический параметр в path?
2. Какой тип данных возвращает useParams?

---

## 5. Вложенные маршруты (Nested Routes)

### Что это такое?

Вложенные маршруты позволяют создавать макеты (layouts), где часть страницы постоянна (навигация, боковая панель), а часть меняется в зависимости от URL. Это как рамка картины: рамка одна, а картины внутри меняются.

### Как работает?

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      {/* Маршрут-макет */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* Вложенные маршруты */}
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="orders" element={<Orders />} />
      </Route>

      <Route path="/" element={<Home />} />
    </Routes>
  );
}
```

```jsx
// DashboardLayout.jsx
import { Outlet, NavLink } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          <NavLink to="/dashboard">Главная</NavLink>
          <NavLink to="/dashboard/profile">Профиль</NavLink>
          <NavLink to="/dashboard/settings">Настройки</NavLink>
          <NavLink to="/dashboard/orders">Заказы</NavLink>
        </nav>
      </aside>

      <main className="content">
        {/* Outlet -- место, куда рендерится дочерний маршрут */}
        <Outlet />
      </main>
    </div>
  );
}
```

URL и что рендерится:

| URL | Layout | Outlet |
|---|---|---|
| `/dashboard` | DashboardLayout | DashboardHome (index) |
| `/dashboard/profile` | DashboardLayout | Profile |
| `/dashboard/settings` | DashboardLayout | Settings |

`<Outlet />` -- это "дырка" в макете, куда подставляется дочерний маршрут. Боковая панель и навигация остаются на месте, меняется только содержимое.

**`index`** -- маршрут по умолчанию для родительского пути. Когда URL точно совпадает с родительским (`/dashboard`), рендерится index-маршрут.

### Мини-проверка

1. Что делает компонент `<Outlet />`?
2. Что такое `index` маршрут?

---

## 6. Защищенные маршруты (Protected Routes)

### Что это такое?

Некоторые страницы доступны только авторизованным пользователям (дашборд, профиль, настройки). Защищенный маршрут проверяет авторизацию и перенаправляет на логин, если пользователь не вошел.

### Как работает?

```jsx
// ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user } = useAuth();  // кастомный хук авторизации
  const location = useLocation();

  if (!user) {
    // Перенаправляем на логин, сохраняя откуда пришли
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
```

Использование:

```jsx
function App() {
  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />

      {/* Защищенные маршруты */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
```

Редирект обратно после логина:

```jsx
function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Откуда пользователь пришел
  const from = location.state?.from?.pathname || '/dashboard';

  async function handleLogin(credentials) {
    await login(credentials);
    navigate(from, { replace: true }); // Возвращаем туда, откуда перенаправили
  }

  return (
    <form onSubmit={handleLogin}>
      <p>Войдите, чтобы продолжить</p>
      {/* ...поля формы... */}
    </form>
  );
}
```

### Альтернативный паттерн: через Route-обертку

```jsx
// Защита через layout-маршрут
function ProtectedLayout() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Все дочерние маршруты защищены */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
```

### Плохой пример -- Хороший пример

```jsx
// Плохо: проверка авторизации в каждом компоненте
function Dashboard() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  // Дублирование в каждом защищенном компоненте

  return <div>Дашборд</div>;
}

function Profile() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  // Та же проверка -- дублирование

  return <div>Профиль</div>;
}

// Хорошо: одна обертка для всех защищенных маршрутов
<Route element={<ProtectedLayout />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
</Route>
// Проверка в одном месте, компоненты чистые
```

### Частые заблуждения

- "`<Navigate>` -- это редирект" -- да, это декларативный редирект. Он выполняется при рендере, как `useNavigate`, но используется в JSX.
- "Защита на фронтенде достаточна" -- нет! Защищенные маршруты -- это UX, а не безопасность. API должен проверять авторизацию независимо. Пользователь может обойти фронтенд-проверки.

### Мини-проверка

1. Что делает компонент `<Navigate>`?
2. Почему защита маршрутов на фронтенде не заменяет проверку на сервере?
3. Зачем сохранять `location.state.from` при перенаправлении на логин?

---

## Итог

- **React Router** связывает URL с компонентами в SPA. Устанавливается отдельно: `react-router-dom`
- **BrowserRouter** оборачивает все приложение. `Routes` + `Route` определяют маршруты
- **Link** / **NavLink** -- навигация без перезагрузки. NavLink добавляет активное состояние
- **useNavigate** -- программная навигация (после формы, по условию). `navigate(-1)` -- назад
- **useParams** -- получение динамических параметров из URL. Значения всегда строки
- **Вложенные маршруты** -- `<Outlet />` рендерит дочерний маршрут внутри макета. `index` -- маршрут по умолчанию
- **Защищенные маршруты** -- проверка авторизации через компонент-обертку. `<Navigate>` для декларативного редиректа. Это UX, не безопасность

---

> [[react/09-custom-hooks|<-- Назад: Кастомные хуки]] | [[react-fundamentals|<-- Назад к оглавлению React]]
