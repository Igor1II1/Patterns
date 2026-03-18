// ==================================================
// Задание 2: next/link и навигация
// Уровень: 🟢 Лёгкий
// Тема: Link компонент, prefetch, навигация
// Ссылка: notes/nextjs/05-built-in.md — "Link"
// ==================================================
//
// 1. Импортируй Link из "next/link" и создай навигацию:
//    <nav>
//      <Link href="/">Главная</Link>
//      <Link href="/about">О нас</Link>
//      <Link href="/blog">Блог</Link>
//      <Link href="/contact">Контакты</Link>
//    </nav>
//
// 2. Создай динамическую ссылку:
//    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
//
// 3. Создай ссылку с отключённым prefetch:
//    <Link href="/heavy-page" prefetch={false}>Тяжёлая страница</Link>
//
// 4. Создай компонент NavLink с активным состоянием:
//    - Используй usePathname() из "next/navigation"
//    - Если текущий путь совпадает с href — добавь className "active"
//    - Это Client Component ("use client")
//
// 5. Напиши в комментарии:
//    - Чем <Link> отличается от <a>? (SPA-навигация, prefetch)
//    - Что такое prefetch и зачем он?
//
// Пиши код ниже:
// ==================================================
