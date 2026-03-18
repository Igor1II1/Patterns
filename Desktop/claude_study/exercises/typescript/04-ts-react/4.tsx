// ==================================================
// Задание 4: useState и useRef с TypeScript
// Уровень: 🟡 Средний
// Тема: Типизация хуков useState, useRef
// Ссылка: notes/typescript/04-ts-react.md — "useState", "useRef"
// ==================================================
//
// 1. Создай состояние count с начальным значением 0.
//    TypeScript сам выведет тип number.
//    const [count, setCount] = useState(0)
//
// 2. Создай состояние user с типом User | null:
//    interface User { name: string; email: string }
//    const [user, setUser] = useState<User | null>(null)
//    Напиши функцию login() — устанавливает user.
//    Напиши функцию logout() — устанавливает null.
//
// 3. Создай состояние items с типом string[]:
//    const [items, setItems] = useState<string[]>([])
//    Напиши функцию addItem(item: string) — добавляет в массив.
//
// 4. Создай ref для input:
//    const inputRef = useRef<HTMLInputElement>(null)
//    Напиши функцию focusInput() — вызывает inputRef.current?.focus()
//
// 5. Создай ref для хранения значения (не DOM):
//    const renderCount = useRef<number>(0)
//    Увеличивай при каждом рендере.
//
// 6. Собери всё в компонент UserPanel с формой входа.
//
// Пиши код ниже:
// ==================================================
