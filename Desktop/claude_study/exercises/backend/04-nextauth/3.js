// ==================================================
// Задание 3: Комплексная задача — система авторизации
// Уровень: 🔴 Сложный
// Тема: Полная система аутентификации с ролями
// Ссылка: Глава отсутствует — основано на теме "NextAuth"
// ==================================================
//
// Создай полную систему авторизации:
//
// 1. Prisma schema:
//    - User: id, name, email, image, role (USER/ADMIN)
//    - Account, Session, VerificationToken (для NextAuth)
//
// 2. lib/auth.ts:
//    - GitHub Provider
//    - PrismaAdapter
//    - callbacks: jwt (добавить role), session (передать role)
//
// 3. Компоненты:
//    - LoginButton (signIn/signOut)
//    - UserMenu (аватар, имя, выпадающее меню)
//    - AuthGuard (обёртка, проверяет авторизацию)
//
// 4. Защищённые страницы:
//    - /dashboard — только авторизованные
//    - /admin — только role === "ADMIN"
//
// 5. Защищённые API:
//    - POST /api/posts — только авторизованные
//    - DELETE /api/posts/[id] — только автор или ADMIN
//
// 6. Helper:
//    async function requireAuth(): Promise<Session>
//    async function requireAdmin(): Promise<Session>
//    (бросают ошибку если не авторизован / не admin)
//
// Пиши код ниже:
// ==================================================
