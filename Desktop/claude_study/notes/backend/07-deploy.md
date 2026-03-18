# Деплой: Vercel, Railway, Supabase

> [[backend/06-file-upload|<-- Предыдущая: Загрузка файлов]]
> [[backend-fundamentals|<-- Назад к оглавлению Backend]]

---

## Зачем эта тема существует?

Приложение на localhost видишь только ты. Чтобы его увидел мир — нужен деплой. Это процесс размещения приложения на сервере с публичным доменом. Для Junior-разработчика умение задеплоить проект — обязательный навык. Работодатель хочет видеть живой проект, а не скриншот терминала.

---

## Vercel — деплой фронтенда и API

### Что это такое?

Vercel — платформа от создателей Next.js. Лучший вариант для деплоя Next.js приложений. Бесплатный план покрывает учебные и небольшие проекты.

### Как работает?

```
1. Пуш кода в GitHub
2. Vercel подключается к репозиторию
3. При каждом пуше — автоматический деплой
4. Получаешь URL: https://my-app.vercel.app
```

### Шаги деплоя

```bash
# 1. Убедись что проект работает локально
npm run build   # Проверяем что билд проходит без ошибок

# 2. Пуш в GitHub
git add .
git commit -m "Ready for deploy"
git push origin main
```

3. Зайди на vercel.com, войди через GitHub
4. "New Project" -> выбери репозиторий
5. Vercel автоматически определит Next.js
6. Нажми "Deploy"

### Переменные окружения на Vercel

```
Vercel Dashboard -> Project -> Settings -> Environment Variables

Добавь все переменные из .env:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL = https://my-app.vercel.app
- GITHUB_ID
- GITHUB_SECRET
- CLOUDINARY_CLOUD_NAME
- ...
```

### Vercel CLI (необязательно)

```bash
# Установка
npm install -g vercel

# Деплой из терминала
vercel

# Деплой в продакшн
vercel --prod

# Посмотреть переменные окружения
vercel env ls
```

### Частые заблуждения

- "Vercel — это только для фронтенда" — нет, API Routes и Server Components тоже работают на Vercel (как serverless functions).
- "Бесплатный план подходит для продакшна" — для учебных и небольших проектов — да. Для серьезного продакшна нужен Pro-план (лимиты на bandwidth, время выполнения функций).

### Мини-проверка

1. Как Vercel узнает что нужно деплоить?
2. Где настроить переменные окружения на Vercel?
3. Что произойдет при push в main?

---

## Railway — база данных и бэкенд-сервисы

### Что это такое?

Railway — платформа для деплоя бэкенд-сервисов и баз данных. Проще чем AWS, есть бесплатный кредит ($5/месяц для старта). Идеально подходит для размещения PostgreSQL.

### Как работает?

```
1. Зайди на railway.app
2. "New Project" -> "Provision PostgreSQL"
3. Получишь connection string:
   postgresql://postgres:password@host.railway.internal:5432/railway
```

### Настройка PostgreSQL на Railway

```
Railway Dashboard -> PostgreSQL сервис -> Variables

Скопируй DATABASE_URL, например:
postgresql://postgres:abc123@containers-us-west-1.railway.app:7890/railway
```

Вставь этот URL в Vercel Environment Variables как `DATABASE_URL`.

### Применение миграций

```bash
# Установи DATABASE_URL для продакшн-базы
# (временно, для миграции)
export DATABASE_URL="postgresql://postgres:abc123@containers-us-west-1.railway.app:7890/railway"

# Примени миграции
npx prisma migrate deploy

# Или через Railway CLI
railway run npx prisma migrate deploy
```

### Частые заблуждения

- "Railway полностью бесплатен" — нет, бесплатный trial дает $5 кредита. Для учебных проектов хватит, но за продакшн нужно платить.
- "Можно использовать локальную БД на продакшне" — нет, Vercel не имеет доступа к твоему localhost.

---

## Supabase — альтернатива Railway

### Что это такое?

Supabase — open-source альтернатива Firebase с PostgreSQL. Предоставляет базу данных, авторизацию, хранилище файлов и real-time подписки. Бесплатный план щедрее Railway (500 МБ БД, 1 ГБ хранилища).

### Как работает?

```
1. Зайди на supabase.com
2. "New Project" -> выбери название и пароль БД
3. Settings -> Database -> Connection string
4. Скопируй URI для Prisma
```

```env
# .env для Supabase
DATABASE_URL="postgresql://postgres:your_password@db.abcdefgh.supabase.co:5432/postgres"

# Для Prisma нужен pooling connection (через pgBouncer)
# Supabase Settings -> Database -> Connection Pooling
DATABASE_URL="postgresql://postgres.abcdefgh:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Для миграций — прямое подключение
DIRECT_URL="postgresql://postgres:password@db.abcdefgh.supabase.co:5432/postgres"
```

```prisma
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // Для миграций
}
```

### Сравнение Railway vs Supabase

| Свойство | Railway | Supabase |
|----------|---------|----------|
| Бесплатный план | $5 кредит | 500 МБ БД, 2 проекта |
| PostgreSQL | Да | Да |
| Хранилище файлов | Нет | Да (1 ГБ бесплатно) |
| Авторизация | Нет | Да (встроенная) |
| Простота | Проще | Больше фич |
| Идеально для | Простой деплой БД | Полноценный BaaS |

---

## Переменные окружения

### Что это такое?

Переменные окружения хранят секреты (пароли, ключи API) отдельно от кода. Никогда не коммить .env в git.

### Как работает?

```bash
# .gitignore — обязательно!
.env
.env.local
.env.production
```

```env
# .env.local — для локальной разработки
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-secret-key"
```

```env
# На продакшне (Vercel) — другие значения:
DATABASE_URL="postgresql://postgres:xxx@railway.app:5432/railway"
NEXTAUTH_URL="https://my-app.vercel.app"
NEXTAUTH_SECRET="production-super-secret-key-generated-randomly"
```

### Доступ в коде

```typescript
// Серверный код (API Routes, Server Components)
const dbUrl = process.env.DATABASE_URL  // Работает

// Клиентский код (браузер)
const apiKey = process.env.NEXT_PUBLIC_API_KEY  // Работает (с NEXT_PUBLIC_)
const secret = process.env.SECRET              // undefined! Не доступно на клиенте

// ВАЖНО: только переменные с NEXT_PUBLIC_ доступны в браузере
// Никогда не добавляй NEXT_PUBLIC_ к секретам!
```

### Частые заблуждения

- "Можно закоммитить .env если проект приватный" — нет! Привычка коммитить секреты — плохая. Репозиторий может стать публичным, или кто-то получит доступ.
- "NEXT_PUBLIC_ можно использовать для любых переменных" — нет! Переменные с NEXT_PUBLIC_ попадают в бандл и видны всем в браузере. Секреты (пароли, API-ключи) должны быть БЕЗ этого префикса.

### Мини-проверка

1. Почему нельзя коммитить .env?
2. Чем NEXT_PUBLIC_ переменные отличаются от обычных?
3. Где на Vercel настраиваются переменные окружения?

---

## Настройка домена

### Что это такое?

По умолчанию Vercel дает URL вида `my-app.vercel.app`. Для профессионального проекта нужен свой домен.

### Как работает?

```
1. Купи домен (Namecheap, Google Domains, reg.ru)
2. Vercel Dashboard -> Project -> Settings -> Domains
3. Добавь домен: myapp.com
4. Vercel покажет DNS-записи, которые нужно добавить:
   - A Record: 76.76.21.21
   - CNAME: cname.vercel-dns.com
5. Добавь эти записи у регистратора домена
6. Подожди 5-30 минут
7. Vercel автоматически настроит HTTPS
```

```
// Обнови переменные окружения
NEXTAUTH_URL=https://myapp.com
```

### Частые заблуждения

- "HTTPS нужно настраивать отдельно" — нет, Vercel автоматически выпускает SSL-сертификат через Let's Encrypt.

---

## Чеклист перед деплоем

### Код

```bash
# 1. Билд проходит без ошибок
npm run build

# 2. Нет console.log в продакшн коде (или используй logger)

# 3. Нет захардкоженных URL
# Плохо:
fetch('http://localhost:3000/api/users')
# Хорошо:
fetch('/api/users')

# 4. Обработка ошибок есть во всех API routes
```

### Безопасность

```
- [ ] .env добавлен в .gitignore
- [ ] NEXTAUTH_SECRET — длинная случайная строка
- [ ] Нет секретов с NEXT_PUBLIC_ префиксом
- [ ] API routes проверяют авторизацию
- [ ] Валидация входных данных (Zod)
- [ ] CORS настроен правильно (не * на продакшне)
```

### База данных

```
- [ ] Миграции применены на продакшн-базе
- [ ] Индексы созданы для часто используемых запросов
- [ ] Connection pooling настроен (для Supabase)
- [ ] Бэкап настроен (Railway/Supabase делают автоматически)
```

### OAuth

```
- [ ] Callback URL обновлен на продакшн домен
  GitHub: https://myapp.com/api/auth/callback/github
  Google: https://myapp.com/api/auth/callback/google
- [ ] NEXTAUTH_URL = https://myapp.com
```

---

## Итог

| Сервис | Роль | Бесплатный план |
|--------|------|----------------|
| Vercel | Фронтенд + API | Щедрый для хобби |
| Railway | PostgreSQL | $5 кредит |
| Supabase | PostgreSQL + Auth + Storage | 500 МБ БД |
| Cloudinary | Изображения | 25 credits/мес |

Порядок деплоя:
1. Создай БД на Railway/Supabase
2. Примени миграции (`prisma migrate deploy`)
3. Задеплой на Vercel (подключи GitHub-репо)
4. Настрой переменные окружения
5. Обнови OAuth callback URLs
6. Проверь что все работает

---

> [[backend/06-file-upload|<-- Предыдущая: Загрузка файлов]]
> [[backend-fundamentals|<-- Назад к оглавлению Backend]]
