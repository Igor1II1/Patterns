# Docker: контейнеры и окружения

> [[devops/05-testing|<-- Предыдущая: Тестирование]] | [[devops/07-nginx|Следующая: Nginx -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]

---

## Зачем эта тема существует?

"У меня на компьютере работает!" — классическая фраза разработчика, когда код не работает на сервере. Причина: разные версии Node.js, разные настройки ОС, отсутствующие зависимости. Docker решает эту проблему: ты упаковываешь приложение вместе со всеми зависимостями в контейнер, который одинаково работает везде — на твоем компьютере, на сервере коллеги, на продакшне.

---

## Контейнеры vs Виртуальные машины

### Что это такое?

Контейнер — это изолированная среда для запуска приложения. Он содержит код, зависимости и настройки, но разделяет ядро ОС с хостом.

### Как работает?

```
Виртуальная машина (VM):
┌─────────────────────────────────┐
│         Приложение              │
│         Библиотеки              │
│         Гостевая ОС (Ubuntu)    │  ← Целая ОС (гигабайты!)
│         Гипервизор              │
│         Хост ОС (Windows)       │
│         Железо                  │
└─────────────────────────────────┘

Контейнер (Docker):
┌─────────────────────────────────┐
│         Приложение              │
│         Библиотеки              │
│         Docker Engine           │  ← Без гостевой ОС (мегабайты)
│         Хост ОС                 │
│         Железо                  │
└─────────────────────────────────┘
```

| Свойство | VM | Контейнер |
|----------|-----|-----------|
| Размер | Гигабайты | Мегабайты |
| Запуск | Минуты | Секунды |
| Изоляция | Полная | На уровне процесса |
| ОС | Своя | Общая с хостом |
| Производительность | Хуже | Почти нативная |

### Частые заблуждения

- "Docker — это виртуальная машина" — нет, Docker использует контейнеризацию, а не виртуализацию. Контейнеры делят ядро ОС с хостом.
- "Docker работает только на Linux" — нет, Docker Desktop работает на Windows и macOS (через легковесную VM с Linux внутри).

### Мини-проверка

1. Чем контейнер отличается от виртуальной машины?
2. Почему контейнеры запускаются быстрее VM?
3. Что означает "разделяет ядро ОС"?

---

## Установка Docker

### Как работает?

```bash
# Windows / macOS: скачай Docker Desktop
# https://www.docker.com/products/docker-desktop/

# Проверка установки
docker --version
# Docker version 25.0.3

docker compose version
# Docker Compose version v2.24.5

# Запуск тестового контейнера
docker run hello-world
```

### Основные команды Docker

```bash
# Контейнеры
docker ps                    # Запущенные контейнеры
docker ps -a                 # Все контейнеры (включая остановленные)
docker stop <id>             # Остановить контейнер
docker start <id>            # Запустить остановленный
docker rm <id>               # Удалить контейнер
docker logs <id>             # Посмотреть логи
docker exec -it <id> bash    # Войти внутрь контейнера

# Образы
docker images                # Список образов
docker pull nginx            # Скачать образ
docker rmi <image>           # Удалить образ
docker build -t myapp .      # Собрать образ из Dockerfile

# Очистка
docker system prune          # Удалить неиспользуемые данные
docker system prune -a       # Удалить все неиспользуемое (осторожно!)
```

---

## Dockerfile

### Что это такое?

Dockerfile — инструкция для сборки образа (image). Образ — это шаблон, из которого создаются контейнеры.

### Как работает?

```dockerfile
# Dockerfile для Node.js приложения

# Базовый образ (Alpine — минимальный Linux)
FROM node:20-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем файлы зависимостей (отдельно для кеширования)
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальной код
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Собираем приложение
RUN npm run build

# Порт, на котором работает приложение
EXPOSE 3000

# Команда запуска
CMD ["npm", "start"]
```

### Разбор каждой инструкции

```dockerfile
FROM node:20-alpine
# Начинаем с готового образа Node.js 20 на Alpine Linux
# Alpine — минимальный Linux (~5 МБ вместо ~900 МБ у Ubuntu)

WORKDIR /app
# Все следующие команды выполняются в /app внутри контейнера
# Если директория не существует — создастся

COPY package.json package-lock.json ./
# Копируем ТОЛЬКО файлы зависимостей
# Почему отдельно? Docker кеширует каждый слой (RUN, COPY)
# Если package.json не изменился — npm ci не будет выполняться заново

RUN npm ci
# npm ci — чистая установка (точно по lock-файлу)
# Быстрее и надежнее чем npm install

COPY . .
# Теперь копируем весь остальной код

EXPOSE 3000
# Документация: контейнер слушает порт 3000
# (не открывает порт, только помечает)

CMD ["npm", "start"]
# Команда запуска при старте контейнера
```

### .dockerignore

```
# .dockerignore — что НЕ копировать в образ
node_modules
.git
.env
.next
npm-debug.log
README.md
```

### Сборка и запуск

```bash
# Собрать образ (. = текущая директория с Dockerfile)
docker build -t my-app .

# Запустить контейнер
docker run -p 3000:3000 my-app
# -p 3000:3000 — связать порт хоста 3000 с портом контейнера 3000

# Запустить в фоне
docker run -d -p 3000:3000 --name my-app-container my-app

# Передать переменные окружения
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="secret" \
  my-app
```

### Частые заблуждения

- "node_modules нужно копировать в контейнер" — нет, npm ci установит их заново. Копирование node_modules увеличит образ и может вызвать проблемы с платформой.
- "EXPOSE открывает порт" — нет, EXPOSE — только документация. Реально порт открывает флаг -p при docker run.

### Мини-проверка

1. Зачем копировать package.json отдельно от остального кода?
2. Чем npm ci отличается от npm install?
3. Что делает флаг -d при docker run?

---

## Multi-stage Builds

### Что это такое?

Multi-stage build — техника создания маленьких production-образов. Используем один этап для сборки, другой — для запуска. В финальный образ попадает только результат сборки.

### Как работает?

```dockerfile
# Этап 1: сборка
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Этап 2: запуск (только нужные файлы)
FROM node:20-alpine AS runner
WORKDIR /app

# Не запускать от root (безопасность)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем только результат сборки
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

```javascript
// next.config.js — включить standalone output
const nextConfig = {
  output: 'standalone',
}
module.exports = nextConfig
```

Результат:
- Образ со всеми зависимостями: ~1 ГБ
- Multi-stage образ: ~100-200 МБ

### Частые заблуждения

- "Multi-stage сложнее и не нужен" — для учебных проектов можно без него. Но на продакшне разница в 800 МБ — это быстрее деплой и меньше расходов.

---

## Docker Compose

### Что это такое?

Docker Compose позволяет описать и запустить несколько контейнеров одной командой. Типичный пример: приложение + база данных + Redis.

### Как работает?

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Приложение Next.js
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/mydb
      - NEXTAUTH_SECRET=my-secret
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  # База данных PostgreSQL
  db:
    image: postgres:16-alpine
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Данные сохраняются между перезапусками
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:  # Именованный том для хранения данных БД
```

### Команды Docker Compose

```bash
# Запустить все сервисы
docker compose up

# Запустить в фоне
docker compose up -d

# Остановить все
docker compose down

# Остановить и удалить данные (volumes)
docker compose down -v

# Пересобрать образы
docker compose up --build

# Логи
docker compose logs         # Все сервисы
docker compose logs app     # Только app
docker compose logs -f app  # В реальном времени

# Выполнить команду в контейнере
docker compose exec app npx prisma migrate dev
docker compose exec db psql -U postgres
```

### Compose для разработки

```yaml
# docker-compose.dev.yml — для локальной разработки
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb_dev
    volumes:
      - dev_postgres:/var/lib/postgresql/data

volumes:
  dev_postgres:
```

```bash
# Запустить только БД для разработки
docker compose -f docker-compose.dev.yml up -d

# Теперь в .env:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb_dev"

# Приложение запускаем обычным npm run dev (без Docker)
```

### Частые заблуждения

- "Docker Compose — для продакшна" — его можно использовать на продакшне для простых случаев, но обычно он для разработки и тестирования. На продакшне чаще Kubernetes.
- "Данные в контейнере сохраняются" — нет! Без volumes данные теряются при удалении контейнера.

### Мини-проверка

1. Зачем нужен volumes для базы данных?
2. Что делает depends_on?
3. Как подключиться к БД внутри Docker Compose?

---

## Итог

| Концепция | Что делает |
|-----------|-----------|
| Image (образ) | Шаблон для создания контейнеров |
| Container | Запущенный экземпляр образа |
| Dockerfile | Инструкция для сборки образа |
| Multi-stage | Маленькие production-образы |
| Docker Compose | Управление несколькими контейнерами |
| Volume | Постоянное хранилище данных |

Типичный workflow:
1. `docker-compose.dev.yml` — запускаем БД для разработки
2. `Dockerfile` — собираем образ для продакшна
3. `docker-compose.yml` — запускаем все вместе для тестирования

---

> [[devops/05-testing|<-- Предыдущая: Тестирование]] | [[devops/07-nginx|Следующая: Nginx -->]]
> [[devops-fundamentals|<-- Назад к оглавлению DevOps]]
