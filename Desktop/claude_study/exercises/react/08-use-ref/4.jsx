// ========== Задание React #4 — Предыдущее значение (usePrevious) ==========
// Уровень: 🟡
//
// Создай хук usePrevious для отслеживания предыдущего значения.
//
// Шаги:
// 1. function usePrevious(value):
//    - const ref = useRef()
//    - useEffect(() => { ref.current = value }, [value])
//    - return ref.current
// 2. Компонент PriceTracker({ price }):
//    - const prevPrice = usePrevious(price)
//    - Отобрази: "Цена: {price}", "Предыдущая: {prevPrice}"
//    - "Выросла" / "Упала" / "Без изменений"
//
// 📖 Раздел учебника: "Хранение предыдущего значения" → notes/react/08-use-ref.md
// ================================================

// Пиши код ниже:
