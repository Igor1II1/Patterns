// ========== Задание React #7 — forwardRef ==========
// Уровень: 🔴
//
// Создай кастомный Input с forwardRef.
//
// Шаги:
// 1. const MyInput = forwardRef(function MyInput(props, ref) { ... })
// 2. Внутри: <input ref={ref} {...props} className="custom-input" />
// 3. В App: const inputRef = useRef(null)
// 4. <MyInput ref={inputRef} placeholder="Кастомный input" />
// 5. Кнопка "Фокус" → inputRef.current.focus()
// 6. Объясни: почему без forwardRef ref не работает?
//
// 📖 Раздел учебника: "forwardRef" → notes/react/08-use-ref.md
// ================================================

// Без forwardRef ref не работает потому что: ???

// Пиши код ниже:
