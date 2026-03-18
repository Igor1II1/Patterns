// ==================================================
// Задание 6: Intersection Types (&)
// Уровень: 🟡 Средний
// Тема: Пересечение типов, комбинирование
// Ссылка: notes/typescript/02-interfaces.md — "Intersection Types"
// ==================================================
//
// 1. Создай тип HasName = { name: string }
//    Создай тип HasAge = { age: number }
//    Создай тип HasEmail = { email: string }
//
// 2. Создай тип Person = HasName & HasAge
//    Создай объект person: Person (должен иметь и name, и age).
//
// 3. Создай тип ContactPerson = HasName & HasAge & HasEmail
//    Создай объект contact: ContactPerson.
//
// 4. Напиши функцию introduce(person: HasName & HasAge): string
//    Возвращает "Меня зовут {name}, мне {age} лет"
//
// 5. Вызови introduce с объектом contact — должно работать
//    (ContactPerson расширяет HasName & HasAge).
//
// 6. Напиши в комментарии: чем & отличается от extends?
//    Когда лучше использовать &, а когда extends?
//
// Пиши код ниже:
// ==================================================
