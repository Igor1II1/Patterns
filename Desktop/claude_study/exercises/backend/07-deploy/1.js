// ==================================================
// Задание 1: Деплой на Vercel
// Уровень: 🟢 Лёгкий
// Тема: Vercel, env variables, домены
// Ссылка: notes/backend/07-deploy.md — "Vercel"
// ==================================================
//
// 1. Напиши шаги деплоя на Vercel (в комментариях):
//    a) Пушим проект на GitHub
//    b) Заходим на vercel.com → Import Project
//    c) Выбираем репозиторий
//    d) Настраиваем env variables
//    e) Deploy!
//
// 2. Какие env variables нужно настроить:
//    - DATABASE_URL (от Supabase/Railway)
//    - NEXTAUTH_URL (домен на Vercel)
//    - NEXTAUTH_SECRET (сгенерировать)
//    - GITHUB_ID, GITHUB_SECRET (если есть OAuth)
//
// 3. Настройка домена:
//    - Vercel даёт бесплатный домен: project.vercel.app
//    - Можно подключить свой домен
//
// 4. Что Vercel делает автоматически:
//    - npm install
//    - npx prisma generate
//    - npm run build
//    - Deploy
//    - Preview deploys для PR
//
// 5. Напиши checklist деплоя (в комментарии):
//    [ ] Все env variables настроены
//    [ ] prisma generate в build script
//    [ ] БД доступна из интернета
//    [ ] NEXTAUTH_URL = реальный домен
//    [ ] Нет hardcoded localhost в коде
//
// Пиши ответы ниже (в комментариях):
// ==================================================
