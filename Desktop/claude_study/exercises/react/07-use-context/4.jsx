// ========== Задание React #4 — Кастомный Provider и хук ==========
// Уровень: 🟡
//
// Вынеси логику темы в отдельный ThemeProvider и хук useTheme.
//
// Шаги:
// 1. ThemeProvider({ children }) — содержит useState и toggleTheme
// 2. Внутри: <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
// 3. Кастомный хук useTheme():
//    - const context = useContext(ThemeContext)
//    - if (!context) throw new Error('useTheme должен быть внутри ThemeProvider')
//    - return context
// 4. В App: <ThemeProvider><Layout /></ThemeProvider>
// 5. В любом компоненте: const { theme, toggleTheme } = useTheme()
//
// 📖 Раздел учебника: "Паттерн: Provider-компонент" → notes/react/07-use-context.md
// ================================================

// Пиши код ниже:
