// ==================================================
// Задание 2: База данных в облаке
// Уровень: 🟡 Средний
// Тема: Supabase, Railway, миграции на продакшне
// Ссылка: notes/backend/07-deploy.md — "Supabase", "Railway"
// ==================================================
//
// 1. Настройка Supabase:
//    a) supabase.com → New Project
//    b) Скопировать DATABASE_URL из Settings → Database
//    c) Применить миграции: npx prisma migrate deploy
//
// 2. Настройка Railway:
//    a) railway.app → New Project → PostgreSQL
//    b) Скопировать DATABASE_URL из Variables
//    c) Применить миграции
//
// 3. Подключение Prisma к облачной БД:
//    DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
//    Обрати внимание: ?sslmode=require для облачных БД!
//
// 4. Миграции на продакшне:
//    npx prisma migrate deploy (не dev!)
//    Почему не dev? (dev интерактивный, может удалить данные)
//
// 5. Seed данных (начальные данные):
//    Напиши prisma/seed.ts:
//    - Создай начальные категории
//    - Создай admin пользователя
//    npx prisma db seed
//
// 6. Напиши в комментарии:
//    - Чем Supabase отличается от Railway?
//    - Почему нельзя использовать localhost БД для Vercel?
//    - Что такое connection pooling и зачем он нужен?
//
// Пиши код ниже:
// ==================================================
