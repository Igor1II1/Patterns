# CI/CD: GitHub Actions и автоматизация

> [[devops/07-nginx|<-- Предыдущая: Nginx]] | [[devops/09-monitoring|Следующая: Мониторинг -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]

---

## Зачем эта тема существует?

Без CI/CD каждый деплой — ручная работа: проверь тесты, собери билд, загрузи на сервер, проверь что работает. Это медленно и рискованно (забыл запустить тесты — баг на продакшне). CI/CD автоматизирует этот процесс: при каждом push GitHub сам запускает тесты, проверяет код и деплоит. Это стандарт в любой команде разработки.

---

## CI и CD — что это

### Что это такое?

- **CI (Continuous Integration)** — автоматическая проверка кода при каждом push. Тесты, линтер, билд запускаются автоматически.
- **CD (Continuous Deployment)** — автоматический деплой после успешной проверки. Push в main -> через 5 минут на продакшне.

### Как работает?

```
Разработчик push в GitHub
        |
        v
┌─ CI Pipeline ──────────────────┐
│  1. Установка зависимостей     │
│  2. Линтер (ESLint)            │
│  3. Проверка типов (TypeScript)│
│  4. Unit-тесты (Jest)          │
│  5. Сборка (next build)        │
└────────────────────────────────┘
        |
    Все прошло?
    /        \
  Да          Нет
   |            |
   v            v
┌─ CD ─┐   Уведомление
│Deploy │   об ошибке
└───────┘
```

### Частые заблуждения

- "CI/CD — только для больших команд" — нет, даже один разработчик получает пользу: автоматическая проверка при каждом push ловит ошибки до продакшна.
- "CI/CD заменяет ручное тестирование" — нет, CI/CD запускает автоматические тесты. Ручное тестирование все равно нужно для UX и визуальных проверок.

### Мини-проверка

1. Чем CI отличается от CD?
2. Что происходит если тесты в CI не проходят?
3. Зачем запускать линтер в CI если он есть в редакторе?

---

## GitHub Actions — основы

### Что это такое?

GitHub Actions — встроенная CI/CD платформа GitHub. Бесплатна для публичных репозиториев и 2000 минут/месяц для приватных.

### Как работает?

Workflows хранятся в `.github/workflows/` как YAML-файлы.

```yaml
# .github/workflows/ci.yml
name: CI  # Имя workflow

# Когда запускать
on:
  push:
    branches: [main, develop]  # При push в main или develop
  pull_request:
    branches: [main]           # При PR в main

# Задачи
jobs:
  # Задача: проверка кода
  lint-and-test:
    runs-on: ubuntu-latest     # На какой ОС запускать

    steps:
      # Шаг 1: Скачать код репозитория
      - name: Checkout
        uses: actions/checkout@v4

      # Шаг 2: Установить Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'         # Кешировать node_modules

      # Шаг 3: Установить зависимости
      - name: Install dependencies
        run: npm ci

      # Шаг 4: Линтер
      - name: Lint
        run: npm run lint

      # Шаг 5: Проверка типов
      - name: Type check
        run: npx tsc --noEmit

      # Шаг 6: Тесты
      - name: Tests
        run: npm test

      # Шаг 7: Сборка
      - name: Build
        run: npm run build
```

### Структура workflow

```yaml
name: Имя workflow        # Отображается в GitHub UI

on:                        # Триггер (когда запускать)
  push:                    # При push
  pull_request:            # При создании/обновлении PR
  schedule:                # По расписанию
    - cron: '0 0 * * 1'   # Каждый понедельник в 00:00

jobs:                      # Набор задач
  job-name:                # Уникальное имя задачи
    runs-on: ubuntu-latest # Окружение
    steps:                 # Шаги задачи
      - name: Описание
        uses: action@v4    # Готовый action
      - name: Описание
        run: команда       # Bash-команда
```

### Переменные и секреты

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: echo "Deploying..."
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          # secrets настраиваются в GitHub:
          # Settings -> Secrets and Variables -> Actions
```

### Частые заблуждения

- "GitHub Actions бесплатен без ограничений" — для приватных репозиториев 2000 минут в месяц. Для публичных — бесплатно.
- "Каждый шаг — отдельная виртуальная машина" — нет, все шаги одной job выполняются на одной VM. Разные jobs — на разных.

---

## Практические workflow

### CI для Next.js проекта

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest

    services:
      # PostgreSQL для тестов
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://test:test@localhost:5432/testdb

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate

      - name: Run migrations
        run: npx prisma migrate deploy

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Tests
        run: npm test -- --coverage

      - name: Build
        run: npm run build
```

### Автодеплой на Vercel

```yaml
# Vercel деплоит автоматически при push в main
# Но можно добавить проверку ПЕРЕД деплоем:

name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test  # Деплой только после успешных тестов
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Проверка PR

```yaml
# .github/workflows/pr-check.yml
name: PR Check

on:
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test

      # Комментарий к PR с результатами
      - name: Comment PR
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: 'CI проверка не пройдена. Проверь логи.'
            })
```

### Мини-проверка

1. Что делает `needs: test` в job deploy?
2. Где хранятся секреты для GitHub Actions?
3. Зачем нужен services.postgres в workflow?

---

## Кеширование и оптимизация

### Что это такое?

Кеширование ускоряет CI — не нужно скачивать зависимости каждый раз.

### Как работает?

```yaml
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'  # Автоматическое кеширование npm

  # Или ручное кеширование
  - name: Cache node_modules
    uses: actions/cache@v4
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-

  # Кеширование Next.js build
  - name: Cache Next.js
    uses: actions/cache@v4
    with:
      path: .next/cache
      key: nextjs-${{ hashFiles('package-lock.json') }}
```

### Параллельные jobs

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm test

  build:
    needs: [lint, test]  # Только после успеха обоих
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run build
```

---

## Итог

| Компонент | Роль |
|-----------|------|
| Workflow (.yml) | Описание пайплайна |
| Trigger (on) | Когда запускать |
| Job | Набор шагов |
| Step | Одно действие (action или команда) |
| Secrets | Хранение паролей и ключей |
| Cache | Ускорение повторных запусков |

Минимальный CI для любого проекта:
1. Установить зависимости
2. Линтер
3. Проверка типов
4. Тесты
5. Сборка

---

> [[devops/07-nginx|<-- Предыдущая: Nginx]] | [[devops/09-monitoring|Следующая: Мониторинг -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]
