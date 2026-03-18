// ==================================================
// Задание 1: Защита маршрутов на сервере
// Уровень: 🟢 Лёгкий
// Тема: Проверка сессии, redirect, middleware
// Ссылка: Глава отсутствует — основано на теме "Protected Routes"
// ==================================================
//
// 1. Защити Server Component через getServerSession:
//    export default async function SettingsPage() {
//      const session = await getServerSession(authOptions)
//      if (!session) redirect("/login")
//      return <div>Настройки для {session.user?.name}</div>
//    }
//
// 2. Создай HOC (Higher Order Component) withAuth:
//    Оборачивает компонент, проверяет сессию, редиректит если нет.
//
// 3. Защити API route:
//    export async function POST(request: NextRequest) {
//      const session = await getServerSession(authOptions)
//      if (!session) {
//        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//      }
//      // ... логика
//    }
//
// 4. Проверка владельца ресурса:
//    const post = await prisma.post.findUnique({ where: { id } })
//    if (post.authorId !== session.user.id) {
//      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
//    }
//
// 5. Напиши в комментарии:
//    - Чем 401 отличается от 403?
//    - Где лучше проверять: middleware или в route handler?
//
// Пиши код ниже:
// ==================================================
