// ==================================================
// Задание 5: Комплексная задача — дашборд с Server и Client
// Уровень: 🔴 Сложный
// Тема: Все концепции Server/Client вместе
// Ссылка: notes/nextjs/02-server-client.md — вся глава
// ==================================================
//
// Создай дашборд аналитики:
//
// 1. Server Component: DashboardPage (page.tsx)
//    - async, загружает статистику из "БД":
//      { totalUsers: 1250, totalOrders: 340, revenue: 450000, recentOrders: [...] }
//    - Рендерит StatCards (Server) и OrdersTable (Client)
//
// 2. Server Component: StatCards
//    - Принимает stats: { totalUsers, totalOrders, revenue }
//    - Отображает 3 карточки статистики (без интерактивности)
//
// 3. Client Component: OrdersTable ("use client")
//    - Принимает orders: Order[]
//    - Состояние: sortField, sortDirection, searchQuery
//    - Таблица с сортировкой по клику на заголовок
//    - Поиск по имени клиента
//
// 4. Client Component: DateRangePicker ("use client")
//    - useState для startDate и endDate
//    - Два input type="date"
//
// 5. Напиши интерфейсы: Order, Stats, DashboardData
//
// 6. Объясни в комментарии: какие части — Server, какие — Client, и почему.
//
// Пиши код ниже:
// ==================================================
