// ==================================================
// Задание 3: Комплексная задача — полный деплой проекта
// Уровень: 🔴 Сложный
// Тема: Весь процесс деплоя от А до Я
// Ссылка: notes/backend/07-deploy.md — вся глава
// ==================================================
//
// Опиши полный процесс деплоя fullstack Next.js приложения:
//
// 1. Подготовка кода:
//    - Все env variables в .env.example (без значений)
//    - Нет hardcoded localhost
//    - prisma generate в postinstall script
//    - Build проходит без ошибок: npm run build
//
// 2. Настройка БД (Supabase):
//    - Создать проект
//    - Получить DATABASE_URL
//    - Применить миграции: npx prisma migrate deploy
//    - Запустить seed: npx prisma db seed
//
// 3. Настройка Vercel:
//    - Импорт из GitHub
//    - Env variables:
//      DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET,
//      GITHUB_ID, GITHUB_SECRET, NEXT_PUBLIC_API_URL
//    - Build settings (обычно автоматические)
//
// 4. Настройка OAuth (GitHub):
//    - Обновить callback URL на реальный домен
//    - Homepage URL = домен приложения
//
// 5. Проверка после деплоя:
//    - Главная страница загружается
//    - Авторизация работает
//    - CRUD операции работают
//    - Данные сохраняются в БД
//
// 6. Мониторинг:
//    - Vercel Analytics
//    - Vercel Logs
//    - Sentry (если подключен)
//
// Напиши пошаговый checklist (в комментариях):
// ==================================================
