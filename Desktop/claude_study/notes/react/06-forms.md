# Глава 6. Формы в React

> [[react/05-lists-keys|<-- Назад: Списки и ключи]] | [[react-fundamentals|<-- Назад к оглавлению React]] | [[react/07-use-context|Далее: useContext -->]]

---

## Зачем эта тема существует?

Формы -- это основной способ получить данные от пользователя: логин, поиск, создание поста, настройки профиля. В обычном HTML браузер сам управляет значениями полей. В React есть другой подход: **контролируемые компоненты**, где React полностью управляет состоянием формы. Это дает больше контроля: валидация на лету, условная логика, форматирование ввода.

---

## 1. Контролируемые компоненты

### Что это такое?

Контролируемый компонент -- это элемент формы (`input`, `select`, `textarea`), чье значение хранится в state React. React становится "единственным источником правды" (single source of truth) для значения поля.

### Как работает?

```jsx
import { useState } from 'react';

function SimpleForm() {
  const [name, setName] = useState('');

  function handleChange(e) {
    setName(e.target.value);   // обновляем state
  }

  return (
    <input
      type="text"
      value={name}              // значение из state
      onChange={handleChange}    // при каждом нажатии клавиши
    />
  );
}
```

Цикл работы:

1. Пользователь нажимает клавишу
2. Браузер вызывает `onChange`
3. Обработчик вызывает `setName(e.target.value)`
4. React перерисовывает компонент с новым `value`
5. Input отображает новое значение

### Плохой пример -- Хороший пример

```jsx
// Плохо: неконтролируемый input -- React не знает о значении
function BadForm() {
  function handleSubmit() {
    // Как получить значение? Через ref или DOM-запрос -- неудобно
    const value = document.getElementById('name').value;
  }

  return <input id="name" type="text" />;
}

// Хорошо: контролируемый input -- значение всегда в state
function GoodForm() {
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Имя:', name); // значение всегда доступно
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button type="submit">Отправить</button>
    </form>
  );
}
```

### Частые заблуждения

- "Контролируемый компонент медленнее" -- разница незаметна. React оптимизирует перерисовки.
- "Можно обойтись без onChange" -- если задать `value` без `onChange`, поле станет read-only. React предупредит об этом в консоли.

### Мини-проверка

1. Что делает компонент "контролируемым"?
2. Почему `value` без `onChange` делает поле нередактируемым?

---

## 2. Работа с разными типами полей

### input type="text"

```jsx
function TextInput() {
  const [value, setValue] = useState('');

  return (
    <input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="Введите текст"
    />
  );
}
```

### textarea

В HTML у `<textarea>` содержимое между тегами. В React -- через `value`, как у `input`:

```jsx
function TextArea() {
  const [text, setText] = useState('');

  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
      rows={5}
      placeholder="Напишите сообщение..."
    />
  );
}
```

### select

В HTML выбранный элемент отмечается атрибутом `selected` у `<option>`. В React -- через `value` у `<select>`:

```jsx
function CitySelect() {
  const [city, setCity] = useState('moscow');

  return (
    <select value={city} onChange={e => setCity(e.target.value)}>
      <option value="">Выберите город</option>
      <option value="moscow">Москва</option>
      <option value="spb">Санкт-Петербург</option>
      <option value="kazan">Казань</option>
    </select>
  );
}
```

### checkbox

Чекбокс использует `checked` (boolean) вместо `value`:

```jsx
function Agreement() {
  const [agreed, setAgreed] = useState(false);

  return (
    <label>
      <input
        type="checkbox"
        checked={agreed}
        onChange={e => setAgreed(e.target.checked)}
      />
      Я согласен с правилами
    </label>
  );
}
```

### radio

Группа радиокнопок -- одно значение в state:

```jsx
function GenderSelect() {
  const [gender, setGender] = useState('');

  return (
    <div>
      <label>
        <input
          type="radio"
          value="male"
          checked={gender === 'male'}
          onChange={e => setGender(e.target.value)}
        />
        Мужской
      </label>
      <label>
        <input
          type="radio"
          value="female"
          checked={gender === 'female'}
          onChange={e => setGender(e.target.value)}
        />
        Женский
      </label>
    </div>
  );
}
```

### Мини-проверка

1. Чем отличается работа с `checkbox` от `text input` в React?
2. Как React управляет выбранным значением `select`?

---

## 3. Несколько полей ввода

### Что это такое?

Реальные формы содержат много полей. Вместо отдельного `useState` для каждого поля можно хранить все данные в одном объекте и использовать один обработчик.

### Как работает?

```jsx
function RegistrationForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
  });

  // Один обработчик для всех полей
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,   // computed property: ключ берется из атрибута name
    }));
  }

  return (
    <form>
      <input
        name="name"          {/* name совпадает с ключом в state */}
        value={form.name}
        onChange={handleChange}
        placeholder="Имя"
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Пароль"
      />
      <input
        name="age"
        type="number"
        value={form.age}
        onChange={handleChange}
        placeholder="Возраст"
      />
    </form>
  );
}
```

**Ключевой трюк:** атрибут `name` каждого input совпадает с ключом в объекте state. `[e.target.name]` -- это computed property, который динамически выбирает нужный ключ.

### Обработка разных типов полей в одном обработчике

```jsx
function handleChange(e) {
  const { name, value, type, checked } = e.target;
  setForm(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }));
}
```

### Мини-проверка

1. Зачем атрибут `name` у input должен совпадать с ключом в state?
2. Что такое computed property `[name]`?

---

## 4. Отправка формы

### Что это такое?

Отправка формы -- действие по нажатию кнопки "Отправить". В React это обрабатывается через событие `onSubmit` у `<form>`.

### Как работает?

```jsx
function ContactForm() {
  const [form, setForm] = useState({ name: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();  // ОБЯЗАТЕЛЬНО: предотвращаем перезагрузку страницы

    // Отправка данных
    console.log('Отправляем:', form);

    // Или fetch:
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(form),
    // });

    setSubmitted(true);
    setForm({ name: '', message: '' }); // очистка формы
  }

  if (submitted) {
    return <p>Спасибо! Ваше сообщение отправлено.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Ваше имя"
      />
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Сообщение"
      />
      <button type="submit">Отправить</button>
    </form>
  );
}
```

**Почему `e.preventDefault()`?** Без него браузер отправит форму классическим способом -- перезагрузит страницу. В SPA (одностраничном приложении) это нежелательно.

### Плохой пример -- Хороший пример

```jsx
// Плохо: обработчик на кнопке, а не на форме
function BadForm() {
  return (
    <form>
      <input name="email" />
      <button onClick={handleSubmit}>Отправить</button>
      {/* Не работает при нажатии Enter в input */}
    </form>
  );
}

// Хорошо: onSubmit на форме
function GoodForm() {
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" />
      <button type="submit">Отправить</button>
      {/* Enter в любом поле тоже отправит форму */}
    </form>
  );
}
```

### Мини-проверка

1. Зачем нужен `e.preventDefault()` при отправке формы?
2. Почему `onSubmit` на `<form>` лучше, чем `onClick` на кнопке?

---

## 5. Паттерны валидации

### Что это такое?

Валидация -- проверка корректности введенных данных. Можно проверять при вводе (на каждое нажатие), при потере фокуса (onBlur), или при отправке формы.

### Как работает?

```jsx
function SignupForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function validate(form) {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!form.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (form.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    return newErrors;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);

    // Валидация при вводе (только для полей, которые уже были "тронуты")
    if (touched[name]) {
      setErrors(validate(newForm));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate(form));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Отмечаем все поля как тронутые
    setTouched({ email: true, password: true });

    const validationErrors = validate(form);
    setErrors(validationErrors);

    // Если есть ошибки -- не отправляем
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Форма валидна -- отправляем
    console.log('Отправка:', form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>

      <div>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Пароль"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>

      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}
```

### Стратегии валидации

| Когда проверять | Плюсы | Минусы |
|---|---|---|
| При вводе (onChange) | Мгновенная обратная связь | Раздражает, если ошибка до завершения ввода |
| При потере фокуса (onBlur) | Баланс: не мешает вводу | Не видно ошибку во время печати |
| При отправке (onSubmit) | Не мешает пользователю | Все ошибки сразу -- может быть много |
| Комбинированный | Лучший UX | Больше кода |

**Рекомендация:** показывай ошибки после `onBlur` (пользователь закончил вводить) и при `onSubmit`. Это комбинированный подход из примера выше.

### Мини-проверка

1. Зачем нужен `touched` при валидации?
2. Когда лучше показывать ошибки валидации?

---

## 6. Блокировка кнопки отправки

### Как работает?

Распространенный паттерн -- блокировать кнопку "Отправить" пока форма невалидна или идет отправка:

```jsx
function SubmitForm() {
  const [form, setForm] = useState({ email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = form.email.includes('@') && form.message.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ email: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ...поля... */}
      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  );
}
```

### Мини-проверка

1. Зачем блокировать кнопку во время отправки?
2. Как рассчитать `isValid` для формы?

---

## Итог

- **Контролируемый компонент** -- элемент формы, чье значение хранится в state React. `value` + `onChange` -- обязательная пара
- **Разные типы полей:** text/textarea используют `value`, checkbox -- `checked`, select -- `value` на теге `<select>`
- **Один обработчик** для нескольких полей через атрибут `name` и computed property `[name]`
- **onSubmit на form** -- правильный способ обработки отправки. Всегда вызывай `e.preventDefault()`
- **Валидация** -- проверяй при onBlur и onSubmit. Храни ошибки в отдельном state, показывай только для "тронутых" полей
- **Блокировка кнопки** -- отключай кнопку при невалидной форме и во время отправки

---

> [[react/05-lists-keys|<-- Назад: Списки и ключи]] | [[react-fundamentals|<-- Назад к оглавлению React]] | [[react/07-use-context|Далее: useContext -->]]
