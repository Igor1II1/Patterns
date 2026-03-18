// ==================================================
// Задание 5: Комплексная задача — SEO-оптимизированная страница
// Уровень: 🔴 Сложный
// Тема: Все встроенные компоненты вместе
// Ссылка: notes/nextjs/05-built-in.md — вся глава
// ==================================================
//
// Создай SEO-оптимизированную страницу блог-поста:
//
// 1. Layout (layout.tsx):
//    - Google Font (Inter)
//    - metadata с шаблоном title
//    - Навигация через Link
//
// 2. Страница /blog/[slug] (page.tsx):
//    - generateMetadata — динамический title, description, Open Graph
//    - generateStaticParams — 5 постов
//    - Image для обложки поста (fill + sizes)
//    - Image для аватара автора (width/height)
//
// 3. Навигация:
//    - Link на главную, блог, категории
//    - "Предыдущий пост" / "Следующий пост" через Link
//
// 4. Env переменные:
//    - NEXT_PUBLIC_SITE_URL для canonical URL
//    - Используй в generateMetadata: metadataBase
//
// 5. Интерфейсы: Post, Author
//    Функция getPost(slug: string): Promise<Post>
//
// Пиши код ниже:
// ==================================================
