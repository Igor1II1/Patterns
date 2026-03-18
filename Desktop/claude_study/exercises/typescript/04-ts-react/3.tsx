// ==================================================
// Задание 3: Типизация событий
// Уровень: 🟡 Средний
// Тема: ChangeEvent, FormEvent, MouseEvent
// Ссылка: notes/typescript/04-ts-react.md — "Типизация событий"
// ==================================================
//
// 1. Напиши функцию-обработчик handleInputChange:
//    (e: React.ChangeEvent<HTMLInputElement>) => void
//    Выводит в консоль e.target.value
//
// 2. Напиши функцию-обработчик handleSelectChange:
//    (e: React.ChangeEvent<HTMLSelectElement>) => void
//    Выводит выбранное значение.
//
// 3. Напиши функцию-обработчик handleSubmit:
//    (e: React.FormEvent<HTMLFormElement>) => void
//    Вызывает e.preventDefault() и выводит "Форма отправлена"
//
// 4. Напиши функцию-обработчик handleClick:
//    (e: React.MouseEvent<HTMLButtonElement>) => void
//    Выводит координаты клика: e.clientX, e.clientY
//
// 5. Создай компонент SearchForm с:
//    - input (текст) с onChange → handleInputChange
//    - select (опции) с onChange → handleSelectChange
//    - кнопка submit
//    - форма с onSubmit → handleSubmit
//
// Пиши код ниже:
// ==================================================
