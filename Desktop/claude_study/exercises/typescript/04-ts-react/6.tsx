// ==================================================
// Задание 6: Комплексная задача — форма регистрации
// Уровень: 🔴 Сложный
// Тема: Все концепции 04-ts-react вместе
// Ссылка: notes/typescript/04-ts-react.md — вся глава
// ==================================================
//
// Создай полностью типизированную форму регистрации:
//
// 1. Интерфейс FormData:
//    - username: string
//    - email: string
//    - password: string
//    - role: "user" | "admin"
//    - agreeToTerms: boolean
//
// 2. Интерфейс FormErrors: Partial<Record<keyof FormData, string>>
//    (каждое поле может иметь строку ошибки или undefined)
//
// 3. Компонент Input с props:
//    - label: string
//    - name: string
//    - type: "text" | "email" | "password"
//    - value: string
//    - error?: string
//    - onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
//
// 4. Компонент RegistrationForm:
//    - useState<FormData> для данных формы
//    - useState<FormErrors> для ошибок
//    - useRef<HTMLInputElement> для автофокуса на первое поле
//    - handleChange — обновляет поле формы по name
//    - handleSubmit — валидирует и выводит данные
//    - validate(): FormErrors — проверяет обязательные поля
//
// 5. Функция validate(data: FormData): FormErrors
//    - username: минимум 3 символа
//    - email: содержит @
//    - password: минимум 6 символов
//    - agreeToTerms: должно быть true
//
// 6. Generic-компонент FormField<T> (бонус):
//    Принимает поле формы и рендерит input + ошибку.
//
// Пиши код ниже:
// ==================================================
