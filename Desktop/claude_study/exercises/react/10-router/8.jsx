// ========== Задание React #8 — ProtectedLayout через Outlet ==========
// Уровень: 🟡
//
// Реализуй альтернативный паттерн защиты через layout-маршрут.
//
// Шаги:
// 1. Создай компонент ProtectedLayout (без props):
//    - Получи user из useAuth()
//    - Если !user → <Navigate to="/login" state={{ from: location }} replace />
//    - Если user → return <Outlet /> (не children, а Outlet!)
// 2. Используй как маршрут-обёртку БЕЗ path:
//    <Route element={<ProtectedLayout />}>
//      <Route path="/dashboard" element={<Dashboard />} />
//      <Route path="/profile" element={<Profile />} />
//      <Route path="/settings" element={<Settings />} />
//    </Route>
// 3. Сравни в комментарии два подхода:
//    - ProtectedRoute с children (задание 7) — оборачивает каждый element
//    - ProtectedLayout с Outlet (это задание) — одна обёртка для группы маршрутов
//    Какой удобнее для 10+ защищённых маршрутов?
//
// Подсказки:
// - Route без path — layout-маршрут, применяется ко всем дочерним
// - Outlet рендерит дочерний маршрут, как "дырка" в макете
// - Оба паттерна валидны, layout-подход масштабируется лучше
//
// 📖 Раздел учебника: "Альтернативный паттерн: через Route-обёртку" → notes/react/10-router.md
// ================================================

// Пиши код ниже:
