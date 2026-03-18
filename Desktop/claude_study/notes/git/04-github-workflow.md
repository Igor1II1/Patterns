# GitHub: Workflow, README, PR, Issues

← [[git/03-remote]] | Следующая: [[git/05-undo]] →

---

## Красивый репозиторий на GitHub

Хороший репозиторий виден с первого взгляда: понятное название, описание, аккуратная структура, README с примерами.

### Настройки репозитория на GitHub
- **Description** — одна строка что делает проект
- **Topics** — теги (javascript, learning, fullstack)
- **Website** — ссылка на деплой (если есть)

---

## README.md — лицо проекта

README — первое что видят на странице репозитория. Для учебного репозитория:

```markdown
# 📚 JavaScript Learning Journey

Мой путь от нуля до Fullstack Junior разработчика (Март — Сентябрь 2026).

## 🗺️ Программа обучения

| Месяц | Тема | Статус |
|-------|------|--------|
| Март | JavaScript основы + ООП | 🔄 В процессе |
| Апрель | Асинхронность + DOM + HTML/CSS | ⬜ Не начат |
| Май | React | ⬜ Не начат |
| Июнь | TypeScript + Next.js | ⬜ Не начат |
| Июль | PostgreSQL + Prisma + Auth | ⬜ Не начат |
| Авг-Сент | Fullstack проект + Portfolio | ⬜ Не начат |

## 📂 Структура

\`\`\`
notes/          — теоретические конспекты
exercises/      — практические задания
projects/       — проекты каждого месяца
\`\`\`

## 🛠️ Стек

JavaScript · TypeScript · React · Next.js · PostgreSQL · Prisma · Tailwind

## 📈 Прогресс

- [x] ООП: классы, наследование, инкапсуляция, полиморфизм
- [ ] Замыкания и область видимости
- [ ] Прототипы
- [ ] Async/Await
- [ ] React
```

### Структура хорошего README для проекта

```markdown
# Название проекта

Краткое описание (1-2 предложения).

## 🚀 Демо

[Ссылка на деплой](https://your-app.vercel.app)

## 📸 Скриншоты

![Скриншот](screenshot.png)

## ⚙️ Технологии

- Next.js 14
- TypeScript
- PostgreSQL + Prisma
- Tailwind CSS

## 🏃 Запуск

\`\`\`bash
git clone https://github.com/username/project
cd project
npm install
npm run dev
\`\`\`

## 📋 Функциональность

- [ ] Авторизация (Google OAuth)
- [ ] CRUD операции
- [ ] Адаптивный дизайн
```

---

## .gitignore для Node.js проекта

```gitignore
# Зависимости
node_modules/

# Переменные окружения
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Сборка
dist/
build/
.next/
out/

# Кэш
.cache/
.parcel-cache/

# Логи
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log

# Системное
.DS_Store
Thumbs.db
desktop.ini

# IDE
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
```

Шаблон можно выбрать при создании репозитория на GitHub — там есть готовый `.gitignore` для Node.

---

## Pull Request (PR) — код на проверку

PR — предложение слить ветку в `main`. Используется для:
- Code review (коллеги смотрят твой код)
- Обсуждения изменений
- Истории — видно что и почему менялось

### Создать PR
1. Запушь ветку: `git push -u origin feature/search`
2. На GitHub появится кнопка "Compare & pull request"
3. Заполни:
   - **Title**: `feat: добавить поиск по книгам`
   - **Description**: что сделал, как тестировал, скриншоты если нужно
4. Нажми "Create pull request"

### Описание PR — шаблон

```markdown
## Что сделано
- Добавил поиск по названию книги
- Поиск регистронезависимый
- Фильтрация работает в реальном времени

## Как проверить
1. Открыть приложение
2. Ввести что-то в поле поиска
3. Список обновляется сразу

## Скриншот
(добавь скриншот если есть)
```

### Merge PR
- **Create a merge commit** — сохраняет всю историю ветки (стандартный вариант)
- **Squash and merge** — все коммиты ветки сжимаются в один (чистая история)
- **Rebase and merge** — применяет коммиты поверх main (продвинуто)

Для учебного проекта — используй "Squash and merge".

---

## Issues — задачи и баги

Issues — список задач, багов, идей для проекта.

### Создать Issue
На GitHub: вкладка "Issues" → "New issue"

**Типы:**
- 🐛 Bug — что-то не работает
- ✨ Feature — новая функция
- 📚 Docs — документация
- ❓ Question — вопрос

**Пример хорошего Bug Issue:**
```markdown
## Описание
При поиске пустой строки список книг исчезает вместо показа всех.

## Шаги воспроизведения
1. Открыть приложение
2. Начать печатать в поиске
3. Удалить всё
4. Список пустой

## Ожидаемое поведение
При пустом запросе — показывать все книги

## Фактическое поведение
Список пустой

## Версия браузера
Chrome 121
```

---

## Структура учебного репозитория

```
junior-path/
├── README.md                    ← описание всего проекта
├── .gitignore
├── notes/                       ← конспекты (Obsidian)
│   ├── js/
│   ├── git/
│   ├── html-css/
│   └── projects/
├── exercises/                   ← упражнения
│   ├── block-0/
│   ├── block-1/
│   └── git/
└── projects/                    ← реальные проекты
    ├── month-1-library/
    ├── month-2-weather/
    └── ...
```

---

## Commit message conventions — итог

```bash
# Хорошие сообщения:
feat: добавить фильтрацию по жанру
fix: исправить краш при пустом поиске
docs: добавить раздел API в README
refactor: упростить функцию saveBook
test: добавить тест для поиска
chore: обновить пакет lodash до 4.17.21
style: убрать лишние пробелы

# Плохие сообщения:
wip
fix
update
changes
asdfgh
```

**Правило**: читая список коммитов, должно быть понятно что делалось, без открытия каждого.

---

## Навигация

← [[git/03-remote]] | Следующая: [[git/05-undo]] →
