// ========== Задание React #7 — useOnClickOutside ==========
// Уровень: 🟡
//
// Создай хук для закрытия элемента при клике вне него.
//
// Шаги:
// 1. function useOnClickOutside(ref, handler)
// 2. useEffect: addEventListener('mousedown', handleClick)
// 3. handleClick: if (ref.current && !ref.current.contains(event.target)) handler()
// 4. Очистка: removeEventListener
// 5. Используй для дропдауна:
//    - const dropdownRef = useRef(null)
//    - useOnClickOutside(dropdownRef, () => setIsOpen(false))
//    - <div ref={dropdownRef}>...</div>
//
// 📖 Раздел учебника: "useOnClickOutside" → notes/react/09-custom-hooks.md
// ================================================

// Пиши код ниже:
