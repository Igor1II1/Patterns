// ==================================================
// Задание 5: Комплексная задача — сервис управления блогом
// Уровень: 🔴 Сложный
// Тема: Все CRUD операции Prisma вместе
// Ссылка: notes/backend/02-prisma-crud.md — вся глава
// ==================================================
//
// Создай набор функций для работы с блогом:
//
// 1. createPost(data: { title, content, authorId, categoryId, tagIds? })
//    - Создаёт пост
//    - Если есть tagIds — подключает теги через connect
//    - Возвращает пост с автором и тегами (include)
//
// 2. getPosts(params: { page, limit, category?, search?, authorId? })
//    - Фильтрация по категории, поиску (в title и content), автору
//    - Пагинация: skip + take
//    - Сортировка по createdAt desc
//    - include: author (только name), category, _count: { comments }
//    - Возвращает { posts, total, page, totalPages }
//
// 3. getPostBySlug(slug: string)
//    - findUnique по slug
//    - include: author, category, tags, comments (с автором)
//    - Если не найден — вернуть null
//
// 4. updatePost(id: number, data: Partial<Post>)
//    - Обновляет только переданные поля
//    - Если переданы tagIds — обновить теги через set
//
// 5. deletePost(id: number)
//    - Удаляет пост (комментарии удалятся по CASCADE)
//    - Возвращает удалённый пост
//
// 6. togglePublish(id: number)
//    - Переключает isPublished
//    - Если публикуем — устанавливает publishedAt = new Date()
//
// Пиши код ниже:
// ==================================================
