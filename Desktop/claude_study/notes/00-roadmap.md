# Roadmap: Junior Fullstack Developer
### Март — Сентябрь 2026 (6 месяцев)

---

## Главный принцип
> Теория всегда идёт через практику. Каждая тема закрепляется в реальном коде.
> Не переходи к следующему месяцу пока не сделал проект текущего.

---

## Перед началом — Инструменты (Март 2026, первые дни)

### Git и GitHub

| # | Тема | Статус | Глава |
|---|------|--------|-------|
| G.1 | Git: основы, init, add, commit, log, .gitignore | ⬜ | [[git/01-basics]] |
| G.2 | Ветки: branch, merge, конфликты | ⬜ | [[git/02-branches]] |
| G.3 | Remote: GitHub, push, pull, clone, SSH | ⬜ | [[git/03-remote]] |
| G.4 | GitHub Workflow: README, PR, Issues | ⬜ | [[git/04-github-workflow]] |
| G.5 | Отмена изменений: reset, revert, stash | ⬜ | [[git/05-undo]] |

> Git изучается параллельно с JavaScript — команды отрабатываются прямо на учебном репозитории.

---

## Месяц 1 — Фундамент JavaScript (Март 2026)
**Цель:** уверенно писать JS код, понимать как работает язык изнутри.

### Блок 0 — Основы JS (закрываем пробелы)

| # | Тема | Статус | Глава |
|---|------|--------|-------|
| 0.1 | Переменные: var/let/const. Типы данных. Операторы | ✅ | [[js/01-variables]] |
| 0.2 | Условия: if/else, тернарный оператор, switch | ✅ | [[js/02-conditions]] |
| 0.3 | Циклы: for, while, for...of, for...in, break/continue | ✅ | [[js/03-loops]] |
| 0.4 | Функции: обычные, стрелочные, коллбэки, rest/spread, рекурсия | ⬜ | [[js/04-functions]] |
| 0.5 | Строки: методы, шаблонные литералы | ⬜ | [[js/05-strings]] |
| 0.6 | Массивы: map, filter, reduce, find, forEach, sort | ⬜ | [[js/06-arrays]] |
| 0.7 | Объекты: создание, деструктуризация, spread, ?. | ⬜ | [[js/07-objects]] |
| 0.8 | this — контекст, ловушки, call/apply/bind | ⬜ | [[js/08-this]] |
| 0.9 | Обработка ошибок: try/catch/finally, throw | ⬜ | [[js/09-errors]] |
| 0.10 | Модули: import/export, именованный и дефолтный | ⬜ | [[js/10-modules]] |

### Блок 1 — ООП и продвинутый JS

| # | Тема | Статус | Глава |
|---|------|--------|-------|
| 1.1 | ООП: 4 принципа, классы, наследование | 🟡 55% (нужно повторение) | [[js-advanced/01-oop-basics]] |
| 1.2 | Замыкания и область видимости | ⬜ | [[js-advanced/02-closures]] |
| 1.3 | Прототипы и прототипное наследование | ⬜ | [[js-advanced/03-prototypes]] |
| 1.4 | Продвинутые классы: static, геттеры/сеттеры | ⬜ | [[js-advanced/04-classes-advanced]] |
| 1.5 | JSON: parse/stringify, работа с данными | ⬜ | [[js-advanced/05-json]] |
| 1.6 | Map, Set, WeakMap, WeakSet | ⬜ | [[js-advanced/06-map-set]] |
| 1.7 | Регулярные выражения (RegExp) | ⬜ | [[js-advanced/07-regexp]] |
| 1.8 | Date, Math и Number | ⬜ | [[js-advanced/08-date-math]] |
| 1.9 | Итераторы и генераторы | ⬜ | [[js-advanced/09-iterators]] |
| 1.10 | Продвинутые функции: каррирование, мемоизация, setTimeout/setInterval | ⬜ | [[js-advanced/10-advanced-functions]] |
| 1.11 | instanceof, проверка типов, Proxy (обзор) | ⬜ | [[js-advanced/11-type-checking]] |

**Проект месяца:** Библиотека книг — список с поиском, добавлением и хранением в localStorage
**Техническое задание:** [[projects/month-1-library]]

---

## Месяц 2 — Асинхронность + DOM + HTML/CSS (Апрель 2026)
**Цель:** понимать асинхронный JS, управлять страницей, верстать интерфейсы.

### Блок 2 — Асинхронный JavaScript

| # | Тема | Статус |
|---|------|--------|
| 2.1 | Event Loop — как JS выполняет код | ⬜ |
| 2.2 | Callback и проблема Callback Hell | ⬜ |
| 2.3 | Promise: создание, .then/.catch/.finally | ⬜ |
| 2.4 | async/await — синтаксический сахар над Promise | ⬜ |
| 2.5 | Promise.all, Promise.race, Promise.allSettled | ⬜ |
| 2.6 | Fetch API: GET/POST запросы, работа с JSON | ⬜ |

### Блок 3 — DOM и события

| # | Тема | Статус |
|---|------|--------|
| 3.1 | DOM: структура документа, поиск элементов | ⬜ |
| 3.2 | Изменение DOM: создание, добавление, удаление | ⬜ |
| 3.3 | События: addEventListener, event object, делегирование | ⬜ |
| 3.4 | Формы: считывание данных, валидация | ⬜ |
| 3.5 | LocalStorage и SessionStorage | ⬜ |

### Блок 4 — HTML и CSS

| # | Тема | Статус | Глава |
|---|------|--------|-------|
| 4.1 | HTML5: семантика, формы, структура | ⬜ | [[html-css/01-html5]] |
| 4.2 | CSS: основы, селекторы, блочная модель | ⬜ | [[html-css/02-css-basics]] |
| 4.3 | Flexbox: строки и колонки | ⬜ | [[html-css/03-flexbox]] |
| 4.4 | Grid: двумерные сетки | ⬜ | [[html-css/04-grid]] |
| 4.5 | Адаптивный дизайн: медиазапросы | ⬜ | [[html-css/05-responsive]] |
| 4.6 | БЭМ: методология именования | ⬜ | [[html-css/06-bem]] |
| 4.7 | Tailwind CSS: утилитарный подход | ⬜ | [[html-css/07-tailwind]] |

**Проект месяца:** Приложение погоды (Fetch API + DOM + HTML/CSS + LocalStorage)
**Техническое задание:** [[projects/month-2-weather]]

---

## Месяц 3 — React (Май 2026)
**Цель:** понимать React, уметь строить интерфейсы на компонентах.

| # | Тема | Статус |
|---|------|--------|
| 5.1 | React: что такое и зачем. JSX. Компоненты | ⬜ |
| 5.2 | Props: передача данных между компонентами | ⬜ |
| 5.3 | useState: локальное состояние | ⬜ |
| 5.4 | useEffect: побочные эффекты, запросы | ⬜ |
| 5.5 | Списки и ключи (key), условный рендеринг | ⬜ |
| 5.6 | Формы в React: controlled components | ⬜ |
| 5.7 | useContext: глобальное состояние | ⬜ |
| 5.8 | useRef: работа с DOM и мемоизация | ⬜ |
| 5.9 | Кастомные хуки (Custom Hooks) | ⬜ |
| 5.10 | React Router: навигация между страницами | ⬜ |

**Проект месяца:** Трекер фильмов — SPA с роутингом и TMDB API
**Техническое задание:** [[projects/month-3-spa]]

---

## Месяц 4 — TypeScript + Next.js (Июнь 2026)
**Цель:** перейти на TypeScript, понять Next.js как основной фреймворк.

### TypeScript

| # | Тема | Статус |
|---|------|--------|
| 6.1 | TypeScript: зачем, установка, базовые типы | ⬜ |
| 6.2 | Интерфейсы и type aliases | ⬜ |
| 6.3 | Generics — обобщённые типы | ⬜ |
| 6.4 | TypeScript в React: типизация props, хуков | ⬜ |

### Next.js

| # | Тема | Статус |
|---|------|--------|
| 6.5 | Next.js: App Router, файловая маршрутизация | ⬜ |
| 6.6 | Server vs Client Components | ⬜ |
| 6.7 | SSR, SSG, ISR — когда что использовать | ⬜ |
| 6.8 | API Routes: бэкенд внутри Next.js | ⬜ |
| 6.9 | Metadata, Image, Link — встроенные компоненты | ⬜ |
| 6.10 | Shadcn/ui: готовые UI-компоненты | ⬜ |

**Проект месяца:** Блог-платформа на Next.js + TypeScript + Shadcn
**Техническое задание:** [[projects/month-4-nextjs]]

---

## Месяц 5 — База данных + Аутентификация (Июль 2026)
**Цель:** подключить базу данных, реализовать авторизацию, сделать полноценный бэкенд.

| # | Тема | Статус |
|---|------|--------|
| 7.1 | SQL основы: SELECT, INSERT, UPDATE, DELETE | ⬜ |
| 7.2 | SQL: JOIN, GROUP BY, вложенные запросы | ⬜ |
| 7.3 | PostgreSQL: установка, psql, pgAdmin | ⬜ |
| 7.4 | Prisma ORM: схема, модели, миграции | ⬜ |
| 7.5 | Prisma: CRUD запросы, связи между таблицами | ⬜ |
| 7.6 | Next.js API + Prisma: полноценный REST бэкенд | ⬜ |
| 7.7 | NextAuth.js: OAuth (GitHub/Google), сессии | ⬜ |
| 7.8 | Защита роутов, middleware | ⬜ |
| 7.9 | Загрузка файлов (Cloudinary / S3) | ⬜ |
| 7.10 | Деплой: Vercel (фронт) + Railway (БД) | ⬜ |

**Проект месяца:** Добавить PostgreSQL + Prisma + NextAuth к блог-платформе
**Техническое задание:** [[projects/month-5-db-auth]]

---

## Месяц 6 — Fullstack проект + DevOps (Август—Сентябрь 2026)
**Цель:** собрать всё в один реальный проект, довести до портфолио.

### Fullstack проект

| # | Тема | Статус |
|---|------|--------|
| 8.1 | Планирование архитектуры: схема БД, API, UI | ⬜ |
| 8.2 | Разработка фронтенда (Next.js + Tailwind + Shadcn) | ⬜ |
| 8.3 | Разработка бэкенда (API Routes + Prisma + PostgreSQL) | ⬜ |
| 8.4 | Авторизация и роли пользователей | ⬜ |
| 8.5 | Тестирование: Jest, React Testing Library | ⬜ |

### DevOps основы

| # | Тема | Статус |
|---|------|--------|
| 8.6 | Docker: контейнеры, Dockerfile, docker-compose | ⬜ |
| 8.7 | Nginx: reverse proxy, HTTPS | ⬜ |
| 8.8 | CI/CD: автодеплой через GitHub Actions | ⬜ |
| 8.9 | Мониторинг: логи, Sentry | ⬜ |
| 8.10 | Подготовка портфолио и резюме | ⬜ |

**Итог:** живой fullstack проект + портфолио + резюме = готовность к первому собеседованию
**Техническое задание:** [[projects/month-6-portfolio]]

---

## Что НЕ входит в 6 месяцев (изучишь позже)
- Алгоритмы и структуры данных (LeetCode)
- Nest.js (отдельный серверный фреймворк)
- GraphQL
- WebSockets и real-time
- GSAP, Swiper (анимации)
- SASS/SCSS
- Redis, очереди задач

> Это не значит что они не нужны. Просто сначала — фундамент и первый проект.

---

## Стек итого
```
Frontend:  HTML · CSS · Tailwind · React · Next.js · TypeScript · Shadcn
Backend:   Next.js API Routes · PostgreSQL · Prisma · NextAuth
DevOps:    Vercel · Railway · Docker · Nginx · GitHub Actions
```
