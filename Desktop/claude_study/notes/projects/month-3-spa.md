# Проект 3: SPA — Трекер фильмов

**Месяц:** Май 2026
**Папка:** `projects/month-3-movies/`
**Стек:** React + React Router + публичный API

---

## Описание

Одностраничное приложение (SPA) для поиска и отслеживания фильмов. Пользователь ищет фильмы через TMDB API, добавляет в списки (хочу посмотреть / посмотрел), ставит оценки.

---

## Функциональность

### Обязательно
- [ ] Поиск фильмов через TMDB API
- [ ] Карточка фильма: постер, название, год, рейтинг, жанр, описание
- [ ] Роутинг: `/` (главная), `/search`, `/movie/:id`, `/watchlist`, `/watched`
- [ ] Добавить фильм в "Хочу посмотреть" или "Посмотрел"
- [ ] Страница со списками (Watchlist и Watched)
- [ ] Оценка фильма (1-10) после просмотра
- [ ] Хранение списков в localStorage

### Дополнительно
- [ ] Популярные фильмы на главной
- [ ] Фильтр по жанру
- [ ] Пагинация результатов поиска
- [ ] Skeleton loader (заглушки пока грузится)
- [ ] Кастомный хук useMovies

---

## API

```
TMDB (The Movie Database) — бесплатный
Регистрация: https://www.themoviedb.org/settings/api

Endpoints:
- Поиск: /search/movie?query={query}&api_key={key}
- Детали: /movie/{id}?api_key={key}
- Популярные: /movie/popular?api_key={key}
```

---

## Структура проекта

```
month-3-movies/
├── public/
├── src/
│   ├── components/
│   │   ├── MovieCard/
│   │   │   ├── MovieCard.jsx
│   │   │   └── MovieCard.css
│   │   ├── SearchBar/
│   │   ├── MovieList/
│   │   └── Navbar/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── SearchPage.jsx
│   │   ├── MoviePage.jsx    ← детали фильма
│   │   └── WatchlistPage.jsx
│   ├── hooks/
│   │   ├── useMovies.js     ← кастомный хук
│   │   └── useLocalStorage.js
│   ├── api/
│   │   └── tmdb.js
│   ├── context/
│   │   └── WatchlistContext.jsx
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## Ключевые компоненты

### WatchlistContext
Глобальное состояние для списков просмотра — доступно во всех компонентах.

```javascript
const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useLocalStorage('watchlist', []);
  const [watched, setWatched] = useLocalStorage('watched', []);

  const addToWatchlist = (movie) => { ... }
  const markAsWatched = (movie, rating) => { ... }
  const removeFromList = (id) => { ... }

  return (
    <WatchlistContext.Provider value={{ watchlist, watched, addToWatchlist, ... }}>
      {children}
    </WatchlistContext.Provider>
  );
}
```

### Кастомный хук useMovies
```javascript
function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;
    // fetch + setState
  }, [query]);

  return { movies, loading, error };
}
```

---

## Поэтапная разработка

### Этап 1: Настройка + API (день 1-2)
1. `npm create vite@latest` с React
2. Установить React Router: `npm install react-router-dom`
3. Написать `api/tmdb.js` — функции запросов
4. Базовый роутинг

### Этап 2: Главная + Поиск (день 3-4)
1. Компонент `MovieCard`
2. Страница поиска + хук `useMovies`
3. Компонент `SearchBar`

### Этап 3: Список + Context (день 5-6)
1. `WatchlistContext` — глобальное состояние
2. Кнопки добавления на карточке
3. Страница `WatchlistPage`

### Этап 4: Детали + Оценка (день 7)
1. Страница детального просмотра фильма
2. Форма оценки

### Этап 5: Стили + полировка (дни 8-9)
1. Оформление карточек
2. Loading состояния
3. Пустые состояния

---

## Что проверяется из пройденных тем

| Тема | Как используется |
|------|-----------------|
| React компоненты | Вся структура UI |
| useState | Локальное состояние каждого компонента |
| useEffect | Запросы к API |
| useContext | WatchlistContext |
| useRef | Фокус в SearchBar |
| Кастомные хуки | useMovies, useLocalStorage |
| React Router | Навигация между страницами |
| async/await | Запросы к TMDB |
| localStorage | Хранение списков |
