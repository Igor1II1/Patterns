// ========== Задание React #8 — useMediaQuery ==========
// Уровень: 🟡
//
// Создай хук для работы с медиа-запросами в JS.
//
// Шаги:
// 1. function useMediaQuery(query)
// 2. useState(() => window.matchMedia(query).matches)
// 3. useEffect: matchMedia(query).addEventListener('change', handler)
// 4. handler: setMatches(e.matches)
// 5. Очистка: removeEventListener
// 6. Используй:
//    const isMobile = useMediaQuery('(max-width: 768px)')
//    {isMobile ? <MobileMenu /> : <DesktopMenu />}
//
// 📖 Раздел учебника: "useMediaQuery" → notes/react/09-custom-hooks.md
// ================================================

// Пиши код ниже:
