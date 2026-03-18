// ============================================
// Задание 4.3 — Параметры по умолчанию
// Уровень: 🟢 Базовый
// ============================================
//
// 📖 Раздел учебника: "Параметры и аргументы", "Значения по умолчанию" (04-functions.md)
//
// --- Описание ---
// Параметры по умолчанию позволяют задать значение,
// которое используется если аргумент не передан или равен undefined.
//
// --- Что нужно сделать ---
//
// 1. Напиши функцию createUser(name, role = "user", active = true)
//    которая возвращает объект { name, role, active }.
//
// 2. Напиши функцию formatPrice(price, currency = "₽", decimals = 0)
//    которая форматирует цену: "1500 ₽", "99.99 $".
//    Используй price.toFixed(decimals) для округления.
//
// 3. Напиши функцию repeat(str, times = 1, separator = " ")
//    которая повторяет строку times раз через separator.
//
// --- Тесты ---
// createUser("Игорь")                     → { name: "Игорь", role: "user", active: true }
// createUser("Анна", "admin")             → { name: "Анна", role: "admin", active: true }
// createUser("Борис", "mod", false)       → { name: "Борис", role: "mod", active: false }
//
// formatPrice(1500)                       → "1500 ₽"
// formatPrice(99.99, "$", 2)              → "99.99 $"
// formatPrice(10.5, "€", 1)              → "10.5 €"
//
// repeat("ха", 3)                         → "ха ха ха"
// repeat("го", 2, "-")                    → "го-го"
// repeat("ой")                            → "ой"
//
// --- Ключевая концепция ---
// Дефолты срабатывают при undefined, НЕ при null, 0, "" или false.



function createUser(name, role = "user", active = true){
    return {name:`${name}`, role:`${role}`, active}
}


console.log(createUser("Игорь"));
console.log(createUser("Анна", "admin"));
console.log(createUser("Борис", "mod", false));

function formatPrice(price, currency = "₽", decimals = 0){
        
    return `${price.toFixed(decimals)} ${currency}`
}


console.log(formatPrice(15.00,'$'))
console.log(formatPrice(15.00))
console.log(formatPrice(89.99))
console.log(formatPrice(89.99,'$',2))



function repeat(str, times = 1, separator = " "){
    let result =""
    for(let i = 0; i<times; i++){
        if( i>0){
            result= result +separator
        }
         result=result+str;
    }
    return result
}

console.log(repeat("ха",4))
console.log(repeat("ха",4,"-"))


// ========== РАЗБОР ЗАДАНИЯ ==========
//
// --- Что делали ---
// Три функции с параметрами по умолчанию:
// createUser (объект), formatPrice (toFixed), repeat (аккумулятор строки).
//
// --- Пошаговый разбор ---
//
// createUser: return { name, role, active } — возвращает объект.
// Если role не передан → используется "user" (дефолт).
// Если active не передан → используется true (дефолт).
//
// formatPrice: price.toFixed(decimals) — округляет число до N знаков
// после запятой и возвращает строку. Результат подставляется в шаблон.
//
// repeat("ха", 3, " "):
// Шаг 1: result = ""
// Шаг 2: i=0, i>0? нет. result = "" + "ха" → "ха"
// Шаг 3: i=1, i>0? да.  result = "ха" + " " → "ха "
//                        result = "ха " + "ха" → "ха ха"
// Шаг 4: i=2, i>0? да.  result = "ха ха" + " " → "ха ха "
//                        result = "ха ха " + "ха" → "ха ха ха"
// Шаг 5: return "ха ха ха"
//
// --- Ошибки при решении ---
// Ошибка 1: createUser — return name, role, active (без фигурных скобок)
// Почему неправильно: оператор запятая возвращает только последнее значение
// Как правильно: return { name, role, active } — фигурные скобки = объект
//
// Ошибка 2: formatPrice — price.toFixed(decimals) на отдельной строке
// Почему неправильно: результат toFixed никуда не сохранялся
// Как правильно: подставить прямо в шаблон ${price.toFixed(decimals)}
//
// Ошибка 3: repeat — return result+str внутри цикла
// Почему неправильно: return выходит из ФУНКЦИИ на 1-й итерации
// Как правильно: result = result + str (присваивание) внутри, return после цикла
//
// Ошибка 4: repeat — забыл result = result + str в теле цикла
// Почему неправильно: добавлял только separator, но не само слово
// Как правильно: на каждой итерации добавлять и separator (если i>0) и str
//
// --- Что должен был усвоить ---
// 1. Параметры по умолчанию: role = "user" — срабатывает при undefined
// 2. toFixed(n) — округляет число до n знаков после запятой
// 3. Паттерн аккумулятора строки с разделителем: if (i>0) + separator, потом + str
// 4. return внутри цикла = выход из функции. Для накопления — присваивание
//
// --- Для чего в реальной разработке ---
// createUser — фабричная функция, создаёт объекты с дефолтами (в React, API)
// formatPrice — форматирование для UI (цены, валюты)
// repeat — join-паттерн (Array.join делает то же самое, изучим в гл. 6)