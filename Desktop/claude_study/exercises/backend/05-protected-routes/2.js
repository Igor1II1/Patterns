// ==================================================
// Задание 2: Система ролей и разрешений
// Уровень: 🟡 Средний
// Тема: Role-based access control (RBAC)
// Ссылка: Глава отсутствует — основано на теме "Protected Routes"
// ==================================================
//
// 1. Создай enum Role и helper функции:
//    type Role = "USER" | "ADMIN" | "MODERATOR"
//
//    function requireRole(session: Session, role: Role): boolean
//    function canEditPost(session: Session, post: Post): boolean
//    function canDeleteComment(session: Session, comment: Comment): boolean
//
// 2. Middleware для проверки роли:
//    async function requireAdmin(request: NextRequest) {
//      const session = await getServerSession(authOptions)
//      if (!session || session.user.role !== "ADMIN") {
//        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
//      }
//    }
//
// 3. Защита на уровне компонента:
//    {session?.user.role === "ADMIN" && <AdminPanel />}
//
// 4. Комплексная проверка — кто может удалить пост:
//    - Автор поста
//    - Администратор
//    - Модератор
//
// 5. Напиши в комментарии: что такое RBAC?
//    Какие ещё подходы к авторизации существуют?
//
// Пиши код ниже:
// ==================================================
