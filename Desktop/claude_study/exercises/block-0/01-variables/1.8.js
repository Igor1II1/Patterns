// ========== Задание 1.8 ==========
// Напиши функцию getType(value) которая возвращает правильный тип значения.
// Проблема: typeof null = "object" (баг), typeof [1,2,3] = "object" (не array).
// Правила:
//   - null -> вернуть "null" (не "object")
//   - массив -> вернуть "array" (проверить через Array.isArray(value))
//   - остальное -> вернуть typeof value
// Раздел учебника: "Оператор typeof"

function getType(value){
    if(value===null){
        return"null"
    }else if(Array.isArray(value)){
        return "array"
    }
return typeof(value)
}


console.log(getType(42))
console.log(getType("строка"))
console.log(getType(null))
console.log(getType([1,2,3]))
console.log(getType({}))
console.log(getType(true))
console.log(getType(undefined))

// ========== Разбор задания ==========
// Что делали:    написали функцию getType которая возвращает ТОЧНЫЙ тип значения.
// Почему так:    typeof врёт в двух случаях:
//                  null    → typeof даёт "object"  (историческая ошибка, null не объект)
//                  [1,2,3] → typeof даёт "object"  (массив технически объект, но это неточно)
//                Для точной проверки нужны ручные условия ДО typeof.
// Для чего:      в реальном коде часто нужно знать точный тип — чтобы обработать
//                null иначе чем объект, массив иначе чем {}.
// Главное понять: для надёжной проверки типа — порядок важен:
//                  1) null  → проверяй через === null
//                  2) массив → через Array.isArray()
//                  3) остальное → typeof
//                Этот паттерн используется в реальных проектах постоянно.