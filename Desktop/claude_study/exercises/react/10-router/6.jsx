// ========== Задание React #6 — Вложенные маршруты и Outlet ==========
// Уровень: 🟡
//
// Создай дашборд с боковой навигацией и вложенными маршрутами.
//
// Шаги:
// 1. Создай компонент DashboardLayout:
//    - Боковое меню (aside) с NavLink: Обзор (/dashboard), Профиль (/dashboard/profile),
//      Настройки (/dashboard/settings)
//    - Основная область (main) с <Outlet />
// 2. Создай 3 компонента-страницы: DashboardHome, Profile, Settings
//    (каждый — просто <h2> с названием и описанием)
// 3. Определи маршруты:
//    <Route path="/dashboard" element={<DashboardLayout />}>
//      <Route index element={<DashboardHome />} />
//      <Route path="profile" element={<Profile />} />
//      <Route path="settings" element={<Settings />} />
//    </Route>
// 4. Обрати внимание: вложенные path — относительные (без / в начале)
//
// Подсказки:
// - <Outlet /> — "дырка" в макете, куда рендерится дочерний маршрут
// - index — маршрут по умолчанию (когда URL точно = родительскому)
// - Вложенные маршруты наследуют путь родителя: path="profile" = /dashboard/profile
//
// 📖 Раздел учебника: "Вложенные маршруты" → notes/react/10-router.md
// ================================================

// Пиши код ниже:
