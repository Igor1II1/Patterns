// ==================================================
// Задание 2: Специальные файлы (layout, loading, error)
// Уровень: 🟢 Лёгкий
// Тема: layout.tsx, loading.tsx, error.tsx, not-found.tsx
// Ссылка: notes/nextjs/01-app-router.md — "Специальные файлы"
// ==================================================
//
// 1. Напиши app/layout.tsx (корневой layout):
//    - Принимает { children }: { children: React.ReactNode }
//    - Возвращает <html><body><header>Шапка</header>{children}<footer>Подвал</footer></body></html>
//
// 2. Напиши app/blog/layout.tsx (вложенный layout для блога):
//    - Добавляет боковую панель (<aside>Категории</aside>)
//    - Оборачивает children
//
// 3. Напиши app/blog/loading.tsx:
//    - Возвращает <div>Загрузка постов...</div>
//
// 4. Напиши app/blog/error.tsx:
//    - Помни: это Client Component ("use client")
//    - Принимает { error, reset }: { error: Error; reset: () => void }
//    - Показывает сообщение об ошибке и кнопку "Попробовать снова"
//
// 5. Напиши app/not-found.tsx:
//    - Возвращает <h1>404 — Страница не найдена</h1>
//
// Пиши код ниже:
// ==================================================
