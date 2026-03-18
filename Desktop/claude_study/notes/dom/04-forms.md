# Глава 4. Работа с формами

> [[js-fundamentals|<- Назад к оглавлению JS]]

---

## Зачем эта тема существует?

Формы -- главный способ получить данные от пользователя: логин и пароль, поисковый запрос, комментарий, заказ в магазине. Без умения читать данные из форм, валидировать их и отправлять через JavaScript невозможно построить ни одно реальное веб-приложение.

---

## 1. Доступ к формам и полям

### Что это такое?

Браузер предоставляет удобные способы доступа к формам и их элементам через DOM, без необходимости искать каждый элемент через `querySelector`.

**Аналогия:** форма -- это анкета. У анкеты есть поля (имя, email, телефон), и ты можешь обратиться к любому полю по его подписи (атрибуту `name`).

### Как работает?

```html
<form id="login" name="login">
  <input name="username" type="text" value="Igor">
  <input name="password" type="password">
  <button type="submit">Войти</button>
</form>
```

```js
// Доступ к форме
const form = document.forms.login;     // по атрибуту name
const form2 = document.getElementById('login'); // по id

// Доступ к полям формы
const username = form.elements.username;  // по name
const password = form.elements.password;

// Чтение значений
console.log(username.value); // "Igor"
console.log(password.value); // "" (пустое)

// Установка значений
username.value = 'Новое имя';
```

---

## 2. Типы полей и чтение данных

### Что это такое?

Разные типы `<input>` хранят данные по-разному. Важно знать, как читать значение каждого типа.

### Как работает?

#### Текстовые поля

```html
<input type="text" id="name" value="Игорь">
<textarea id="bio">Текст биографии</textarea>
```

```js
document.getElementById('name').value;  // "Игорь"
document.getElementById('bio').value;   // "Текст биографии"
```

#### Чекбоксы (checkbox)

```html
<input type="checkbox" id="agree" checked>
```

```js
const checkbox = document.getElementById('agree');
console.log(checkbox.checked); // true (отмечен) или false
console.log(checkbox.value);   // "on" (бесполезно -- используй .checked)
```

#### Радиокнопки (radio)

```html
<form id="survey">
  <input type="radio" name="color" value="red"> Красный
  <input type="radio" name="color" value="blue" checked> Синий
  <input type="radio" name="color" value="green"> Зелёный
</form>
```

```js
const form = document.getElementById('survey');

// Найти выбранную радиокнопку
const selected = form.querySelector('input[name="color"]:checked');
console.log(selected.value); // "blue"

// Или перебрать все
const radios = form.elements.color; // коллекция радиокнопок с name="color"
for (const radio of radios) {
  if (radio.checked) {
    console.log(radio.value); // "blue"
  }
}
```

#### Выпадающий список (select)

```html
<select id="city">
  <option value="msk">Москва</option>
  <option value="spb" selected>Санкт-Петербург</option>
  <option value="nsk">Новосибирск</option>
</select>
```

```js
const select = document.getElementById('city');
console.log(select.value);         // "spb"
console.log(select.selectedIndex); // 1

// Для multiple select
// <select id="skills" multiple>
const skills = document.getElementById('skills');
const selected = [...skills.selectedOptions].map(opt => opt.value);
console.log(selected); // ["js", "html"] -- массив выбранных
```

> **Частое заблуждение:** "У чекбокса значение `true`/`false` в `.value`." Нет! `.value` у чекбокса возвращает строку (обычно `"on"`). Для проверки состояния используй `.checked` -- вот оно boolean.

> **Мини-проверка:** Как получить текст выбранного `<option>`, а не его `value`? Ответ: `select.options[select.selectedIndex].textContent`.

---

## 3. Обработка отправки формы

### Что это такое?

Когда пользователь нажимает кнопку submit (или Enter в текстовом поле), форма генерирует событие `submit`. По умолчанию страница перезагружается -- нам нужно это перехватить.

### Как работает?

```html
<form id="loginForm">
  <input name="email" type="email" required>
  <input name="password" type="password" required>
  <button type="submit">Войти</button>
</form>
```

```js
const form = document.getElementById('loginForm');

form.addEventListener('submit', function (event) {
  // 1. Предотвращаем перезагрузку страницы
  event.preventDefault();

  // 2. Читаем данные
  const email = form.elements.email.value;
  const password = form.elements.password.value;

  // 3. Делаем что-то с данными
  console.log('Email:', email);
  console.log('Password:', password);

  // 4. Можно отправить на сервер через fetch (позже изучим)
});
```

### Плохой пример -> Хороший пример

```js
// Плохо: обработчик на кнопке, а не на форме
const button = document.querySelector('button[type="submit"]');
button.addEventListener('click', function () {
  // Не перехватывает отправку по Enter!
  // Не отменяет перезагрузку!
  console.log('Клик');
});

// Хорошо: обработчик на форме через событие submit
form.addEventListener('submit', function (event) {
  event.preventDefault(); // отменяет перезагрузку
  // Работает и по клику, и по Enter
});
```

> **Частое заблуждение:** "Для перехвата формы нужно вешать click на кнопку." Нет! Вешай `submit` на `<form>`. Это перехватывает и клик по кнопке, и нажатие Enter в поле ввода.

---

## 4. Валидация

### Что это такое?

Валидация -- проверка, что пользователь ввёл данные правильно, прежде чем их обрабатывать. Есть два уровня: встроенная HTML-валидация и пользовательская на JavaScript.

**Аналогия:** валидация -- это охранник на входе: проверяет, что у тебя есть билет (поле заполнено), что билет настоящий (формат верный), и пропускает только если всё в порядке.

### Как работает?

#### Встроенная HTML-валидация

HTML5 предоставляет атрибуты для автоматической проверки:

```html
<form id="regForm">
  <!-- Обязательное поле -->
  <input name="name" required placeholder="Имя">

  <!-- Email с проверкой формата -->
  <input name="email" type="email" required placeholder="Email">

  <!-- Минимальная длина -->
  <input name="password" type="password" minlength="6" required placeholder="Пароль">

  <!-- Числовое поле с диапазоном -->
  <input name="age" type="number" min="18" max="120" placeholder="Возраст">

  <!-- Проверка по регулярному выражению -->
  <input name="phone" type="tel" pattern="\+7\d{10}" placeholder="+7XXXXXXXXXX">

  <button type="submit">Зарегистрироваться</button>
</form>
```

Браузер сам покажет сообщения об ошибках и не отправит форму, пока все поля не пройдут проверку.

#### Проверка через JavaScript (Constraint Validation API)

```js
const form = document.getElementById('regForm');
const emailInput = form.elements.email;

// Проверить одно поле
console.log(emailInput.validity.valid);       // true/false
console.log(emailInput.validity.valueMissing); // true если пустое и required
console.log(emailInput.validity.typeMismatch); // true если не email
console.log(emailInput.validity.tooShort);     // true если короче minlength

// Проверить всю форму
console.log(form.checkValidity()); // true если все поля валидны

// Установить своё сообщение об ошибке
emailInput.setCustomValidity('Введите корпоративный email');
// Сбросить (иначе поле всегда будет невалидным!):
emailInput.setCustomValidity('');
```

#### Пользовательская валидация

```js
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;
  const errors = [];

  // Свои правила проверки
  if (name.length < 2) {
    errors.push('Имя должно быть не короче 2 символов');
  }

  if (!email.includes('@')) {
    errors.push('Введите корректный email');
  }

  if (password.length < 6) {
    errors.push('Пароль должен быть не короче 6 символов');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну заглавную букву');
  }

  if (errors.length > 0) {
    // Показываем ошибки
    const errorDiv = document.getElementById('errors');
    errorDiv.innerHTML = errors.map(e => `<p class="error">${e}</p>`).join('');
    return; // не отправляем
  }

  console.log('Форма валидна, отправляем!');
});
```

#### Валидация в реальном времени

```js
const passwordInput = form.elements.password;
const hint = document.getElementById('password-hint');

passwordInput.addEventListener('input', function () {
  const value = this.value;

  if (value.length === 0) {
    hint.textContent = '';
  } else if (value.length < 6) {
    hint.textContent = 'Слишком короткий';
    hint.style.color = 'red';
  } else if (!/[A-Z]/.test(value)) {
    hint.textContent = 'Добавьте заглавную букву';
    hint.style.color = 'orange';
  } else {
    hint.textContent = 'Отличный пароль!';
    hint.style.color = 'green';
  }
});
```

### Плохой пример -> Хороший пример

```js
// Плохо: показать одну ошибку и остановиться
form.addEventListener('submit', function (event) {
  event.preventDefault();
  if (!form.elements.name.value) {
    alert('Введите имя'); // пользователь не видит других ошибок
    return;
  }
  if (!form.elements.email.value) {
    alert('Введите email');
    return;
  }
});

// Хорошо: собрать все ошибки и показать сразу
form.addEventListener('submit', function (event) {
  event.preventDefault();
  const errors = [];
  if (!form.elements.name.value) errors.push('Введите имя');
  if (!form.elements.email.value) errors.push('Введите email');

  if (errors.length > 0) {
    showErrors(errors); // показать все ошибки разом
    return;
  }
});
```

> **Мини-проверка:** Что произойдёт, если вызвать `setCustomValidity('ошибка')` и не сбросить его потом? Ответ: поле будет считаться невалидным навсегда, даже если пользователь введёт правильные данные.

---

## 5. FormData API

### Что это такое?

`FormData` -- это встроенный объект, который автоматически собирает все данные из формы. Особенно удобен, когда в форме много полей или нужно отправить файлы.

### Как работает?

```html
<form id="profileForm">
  <input name="name" value="Игорь">
  <input name="email" value="igor@example.com">
  <input name="age" type="number" value="25">
  <select name="city">
    <option value="msk" selected>Москва</option>
  </select>
  <input name="avatar" type="file">
  <button type="submit">Сохранить</button>
</form>
```

```js
const form = document.getElementById('profileForm');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  // Создаём FormData из формы -- автоматически берёт все поля
  const formData = new FormData(form);

  // Чтение данных
  console.log(formData.get('name'));  // "Игорь"
  console.log(formData.get('email')); // "igor@example.com"
  console.log(formData.get('age'));   // "25" (строка!)

  // Перебор всех полей
  for (const [key, value] of formData) {
    console.log(`${key}: ${value}`);
  }

  // Добавить поле вручную
  formData.append('timestamp', Date.now());

  // Преобразовать в обычный объект
  const data = Object.fromEntries(formData);
  console.log(data);
  // { name: "Игорь", email: "igor@example.com", age: "25", city: "msk" }
});
```

### Плохой пример -> Хороший пример

```js
// Плохо: собирать 10 полей вручную
const name = form.elements.name.value;
const email = form.elements.email.value;
const age = form.elements.age.value;
const city = form.elements.city.value;
// ... и так для каждого поля

// Хорошо: FormData соберёт всё за один вызов
const formData = new FormData(form);
const data = Object.fromEntries(formData);
// Готово! Все поля в объекте
```

#### Важные нюансы FormData

```js
// FormData учитывает только поля с атрибутом name
// <input id="noname" type="text"> -- НЕ попадёт в FormData!
// <input name="field" type="text"> -- попадёт

// Чекбоксы: если не отмечен -- поля НЕТ в FormData
// Если отмечен -- значение будет "on" (или value, если указан)

// Для файлов: formData.get('avatar') вернёт объект File
```

> **Частое заблуждение:** "`FormData` возвращает числа для `type="number"`." Нет! Все значения в `FormData` -- строки. Если нужно число, преобразуй: `Number(formData.get('age'))`.

---

## 6. Сброс формы

### Что это такое?

Метод `reset()` возвращает все поля к начальным значениям (тем, что указаны в HTML).

### Как работает?

```js
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const data = new FormData(form);
  console.log('Отправлено:', Object.fromEntries(data));

  // Очистить форму после успешной отправки
  form.reset();
});

// Также можно слушать событие reset
form.addEventListener('reset', function () {
  console.log('Форма сброшена');
});
```

---

## Итог

- Доступ к полям формы: `form.elements.имяПоля.value`.
- У чекбоксов и радиокнопок используй `.checked`, а не `.value`.
- Событие `submit` вешай на `<form>`, а не на кнопку. Не забывай `event.preventDefault()`.
- HTML-валидация (`required`, `type`, `minlength`, `pattern`) -- первая линия защиты.
- Пользовательская валидация на JS -- для сложных правил. Показывай все ошибки сразу.
- `FormData` автоматически собирает все поля формы. `Object.fromEntries(formData)` превращает их в объект.
- Все значения из `FormData` -- строки. Преобразуй в числа вручную, если нужно.

---

> [[dom/03-events|<- События]] | [[dom/05-storage|Далее: Хранилище ->]]
>
> [[js-fundamentals|<- Назад к оглавлению JS]]
