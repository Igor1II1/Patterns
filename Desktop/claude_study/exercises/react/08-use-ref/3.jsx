// ========== Задание React #3 — Секундомер с ref для intervalId ==========
// Уровень: 🟡
//
// Создай секундомер, храня ID интервала в ref.
//
// Шаги:
// 1. useState для seconds, isRunning
// 2. const intervalRef = useRef(null) — для ID интервала
// 3. start(): intervalRef.current = setInterval(...)
// 4. stop(): clearInterval(intervalRef.current)
// 5. reset(): stop() + setSeconds(0)
// 6. Объясни: почему intervalId хранится в ref, а не в state?
//
// 📖 Раздел учебника: "Хранение мутабельных значений" → notes/react/08-use-ref.md
// ================================================

// ref вместо state для intervalId потому что: ???

// Пиши код ниже:
