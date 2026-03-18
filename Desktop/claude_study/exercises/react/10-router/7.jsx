// ========== Задание React #7 — Защищённые маршруты ==========
// Уровень: 🟡
//
// Создай систему защищённых маршрутов с перенаправлением на логин.
//
// Шаги:
// 1. Создай контекст AuthContext с состоянием user (null или {name: '...'})
// 2. Создай компонент ProtectedRoute({ children }):
//    - Получи user из useAuth()
//    - Получи location через useLocation()
//    - Если !user → return <Navigate to="/login" state={{ from: location }} replace />
//    - Если user есть → return children
// 3. Оберни защищённые маршруты:
//    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
// 4. В Login: получи from из location.state?.from?.pathname || '/dashboard'
//    После "входа" сделай navigate(from, { replace: true })
// 5. Добавь кнопку "Войти" (имитация: setUser({ name: 'Игорь' }))
//    и "Выйти" (setUser(null) + navigate('/'))
//
// Подсказки:
// - <Navigate> — декларативный редирект (рендерится в JSX)
// - state={{ from: location }} — сохраняем откуда пришли
// - replace — чтобы кнопка "назад" не зациклилась
// - Защита на фронте — это UX, НЕ безопасность (API должен проверять отдельно)
//
// 📖 Раздел учебника: "Защищённые маршруты" → notes/react/10-router.md
// ================================================

// Пиши код ниже:
