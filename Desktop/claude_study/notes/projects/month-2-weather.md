# Проект 2: Приложение погоды

**Месяц:** Апрель 2026
**Папка:** `projects/month-2-weather/`
**API:** OpenWeatherMap (бесплатный тариф)

---

## Описание

Веб-приложение для просмотра погоды. Пользователь вводит название города — получает текущую погоду и прогноз на 5 дней. История поиска хранится в localStorage.

---

## Функциональность

### Обязательно
- [ ] Поиск погоды по названию города
- [ ] Текущая погода: температура, ощущаемая, влажность, скорость ветра, описание
- [ ] Иконка погоды (OpenWeatherMap предоставляет)
- [ ] Прогноз на 5 дней (по одному показателю в день)
- [ ] История последних 5 поисков (кнопки — кликнул, сразу загружается)
- [ ] Обработка ошибок: город не найден, нет интернета
- [ ] Загрузочный спиннер во время запроса

### Дополнительно
- [ ] Переключение °C / °F
- [ ] Геолокация (кнопка "Моё местоположение")
- [ ] Адаптивный дизайн (мобильная + десктоп)
- [ ] Фоновое изображение в зависимости от погоды

---

## API

```
Регистрация: https://openweathermap.org/api
Бесплатный план: 60 запросов/минуту, достаточно для учёбы

Endpoints:
- Текущая погода: api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric&lang=ru
- Прогноз 5 дней: api.openweathermap.org/data/2.5/forecast?q={city}&appid={key}&units=metric&lang=ru
```

---

## Структура проекта

```
month-2-weather/
├── index.html
├── style.css
└── src/
    ├── main.js          ← точка входа, инициализация
    ├── api.js           ← все запросы к OpenWeatherMap
    ├── ui.js            ← функции отрисовки DOM
    ├── storage.js       ← история поиска в localStorage
    └── utils.js         ← вспомогательные функции
```

---

## Архитектура

### api.js
```javascript
const API_KEY = 'твой_ключ';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getCurrentWeather(city) {
  const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`);
  if (!response.ok) throw new Error(`Город не найден: ${city}`);
  return response.json();
}

export async function getForecast(city) { ... }
```

### ui.js
```javascript
export function renderCurrentWeather(data) { ... }
export function renderForecast(data) { ... }
export function renderHistory(history) { ... }
export function showError(message) { ... }
export function showLoading(isLoading) { ... }
```

---

## Поэтапная разработка

### Этап 1: API (день 1)
1. Зарегистрироваться на OpenWeatherMap, получить API ключ
2. Написать `api.js` с функциями запросов
3. Проверить в консоли что данные приходят правильно

### Этап 2: Базовый UI (день 2)
1. HTML-структура: форма поиска + блок результата
2. Функция `renderCurrentWeather` — показать текущую погоду
3. Обработчик формы + `async/await`

### Этап 3: Прогноз и история (день 3)
1. Прогноз на 5 дней
2. История поиска в localStorage
3. Клик по истории загружает погоду

### Этап 4: Ошибки и UX (день 4)
1. Обработка ошибок (`try/catch`)
2. Спиннер загрузки
3. Сообщение "город не найден"

### Этап 5: Стили (дни 5-6)
1. Красивое оформление
2. Адаптивный дизайн

---

## Что проверяется из пройденных тем

| Тема | Как используется |
|------|-----------------|
| Fetch API | Запросы к OpenWeatherMap |
| async/await | Все асинхронные функции |
| try/catch | Обработка ошибок сети |
| DOM | Отрисовка данных |
| События | Форма поиска, клик по истории |
| localStorage | История поиска |
| JSON | Парсинг ответа API |
| Модули | Разделение кода |
| HTML5 семантика | Разметка |
| CSS Flexbox/Grid | Раскладка карточек |
