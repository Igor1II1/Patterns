// ========== Задание React #4 — useLocalStorage ==========
// Уровень: 🟡
//
// Создай кастомный хук useLocalStorage.
//
// Шаги:
// 1. function useLocalStorage(key, initialValue)
// 2. Ленивая инициализация: useState(() => { try ... localStorage.getItem(key) })
// 3. useEffect: localStorage.setItem(key, JSON.stringify(value))
// 4. return [value, setValue] — как обычный useState
// 5. Используй: const [theme, setTheme] = useLocalStorage('theme', 'light')
// 6. Перезагрузи страницу — значение сохраняется!
//
// 📖 Раздел учебника: "useLocalStorage" → notes/react/09-custom-hooks.md
// ================================================

// Пиши код ниже:
