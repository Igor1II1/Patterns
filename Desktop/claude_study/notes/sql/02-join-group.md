# JOIN и GROUP BY: объединение и группировка данных

> [[sql/01-select-insert|<-- Предыдущая: Основы SQL]] | [[sql/03-postgresql|Следующая: PostgreSQL -->]]
> [[sql-fundamentals|<-- Назад к оглавлению SQL]]

---

## Зачем эта тема существует?

Данные в реальных приложениях разбиты по нескольким таблицам. Пользователи — в одной, их заказы — в другой, товары — в третьей. JOIN позволяет соединять эти таблицы в один результат. GROUP BY позволяет считать статистику: сколько заказов у каждого пользователя, какая средняя цена товаров в категории. Без этих инструментов база данных бесполезна для аналитики.

---

## Подготовка: пример данных

Для всех примеров в этой главе используем три таблицы:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL
);

-- Данные
INSERT INTO users (name) VALUES ('Игорь'), ('Анна'), ('Дмитрий'), ('Мария');

INSERT INTO orders (user_id, total) VALUES
  (1, 1500.00), (1, 3200.00),  -- Игорь: 2 заказа
  (2, 800.00),                  -- Анна: 1 заказ
  (4, 5000.00), (4, 2100.00);  -- Мария: 2 заказа
  -- Дмитрий: 0 заказов
```

---

## INNER JOIN — пересечение таблиц

### Что это такое?

INNER JOIN возвращает только те строки, где есть совпадение в **обеих** таблицах. Если у пользователя нет заказов — он не попадет в результат.

### Как работает?

```sql
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;
```

Результат:

| name   | total   |
|--------|---------|
| Игорь  | 1500.00 |
| Игорь  | 3200.00 |
| Анна   | 800.00  |
| Мария  | 5000.00 |
| Мария  | 2100.00 |

Дмитрий не попал — у него нет заказов.

### Примеры кода

```sql
-- Можно использовать псевдонимы (alias) для краткости
SELECT u.name, o.total, o.created_at
FROM users u
INNER JOIN orders o ON u.id = o.user_id
ORDER BY o.total DESC;

-- INNER JOIN — это то же самое что просто JOIN
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id;
```

### Частые заблуждения

- "JOIN всегда возвращает все записи" — нет, INNER JOIN возвращает только совпадения. Записи без пары отбрасываются.
- "Порядок таблиц в JOIN не важен" — для INNER JOIN результат одинаковый, но для LEFT/RIGHT JOIN — критически важен.

### Мини-проверка

1. Что произойдет, если у пользователя нет заказов при INNER JOIN?
2. Чем `JOIN` отличается от `INNER JOIN`?

---

## LEFT JOIN — все из левой таблицы

### Что это такое?

LEFT JOIN возвращает **все** строки из левой таблицы (первой), даже если совпадения в правой нет. Недостающие значения заполняются NULL.

### Как работает?

```sql
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

Результат:

| name    | total   |
|---------|---------|
| Игорь   | 1500.00 |
| Игорь   | 3200.00 |
| Анна    | 800.00  |
| Дмитрий | NULL    |
| Мария   | 5000.00 |
| Мария   | 2100.00 |

Дмитрий теперь есть, но с NULL вместо суммы заказа.

### Примеры кода

```sql
-- Найти пользователей БЕЗ заказов
SELECT u.name
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;
-- Результат: Дмитрий

-- Это классический паттерн: LEFT JOIN + WHERE ... IS NULL
-- для поиска записей без связей
```

### Частые заблуждения

- "LEFT JOIN и LEFT OUTER JOIN — разные вещи" — нет, это одно и то же. Слово OUTER необязательное.

---

## RIGHT JOIN — все из правой таблицы

### Что это такое?

RIGHT JOIN — зеркало LEFT JOIN. Возвращает все строки из правой таблицы, даже без совпадений в левой.

### Как работает?

```sql
SELECT u.name, o.total
FROM orders o
RIGHT JOIN users u ON u.id = o.user_id;
```

На практике RIGHT JOIN используется редко — обычно проще поменять таблицы местами и написать LEFT JOIN.

---

## FULL JOIN — все из обеих таблиц

### Что это такое?

FULL JOIN возвращает все строки из обеих таблиц. Где нет совпадения — ставит NULL.

### Как работает?

```sql
SELECT u.name, o.total
FROM users u
FULL JOIN orders o ON u.id = o.user_id;
```

Полезен когда нужно увидеть полную картину: и пользователей без заказов, и (теоретически) заказы без пользователей.

### Мини-проверка

1. Какой JOIN использовать, чтобы получить всех пользователей, даже без заказов?
2. Как найти пользователей, у которых нет заказов?
3. Чем LEFT JOIN отличается от FULL JOIN?

---

## Агрегатные функции

### Что это такое?

Агрегатные функции вычисляют одно значение из набора строк: количество, сумму, среднее.

### Как работает?

```sql
-- COUNT — количество строк
SELECT COUNT(*) FROM orders;           -- 5
SELECT COUNT(DISTINCT user_id) FROM orders;  -- 3 уникальных покупателя

-- SUM — сумма
SELECT SUM(total) FROM orders;         -- 12600.00

-- AVG — среднее
SELECT AVG(total) FROM orders;         -- 2520.00

-- MIN и MAX
SELECT MIN(total) FROM orders;         -- 800.00
SELECT MAX(total) FROM orders;         -- 5000.00

-- Несколько функций в одном запросе
SELECT
  COUNT(*) AS orders_count,
  SUM(total) AS total_sum,
  AVG(total) AS average_order,
  MIN(total) AS min_order,
  MAX(total) AS max_order
FROM orders;
```

### Частые заблуждения

- "COUNT(*) и COUNT(column) — одно и то же" — нет. COUNT(*) считает все строки, COUNT(column) пропускает NULL значения.
- "AVG учитывает NULL" — нет, NULL-значения игнорируются при расчете.

---

## GROUP BY — группировка

### Что это такое?

GROUP BY разбивает строки на группы и применяет агрегатную функцию к каждой группе отдельно.

### Как работает?

```sql
-- Сколько заказов у каждого пользователя?
SELECT user_id, COUNT(*) AS orders_count
FROM orders
GROUP BY user_id;
```

Результат:

| user_id | orders_count |
|---------|-------------|
| 1       | 2           |
| 2       | 1           |
| 4       | 2           |

```sql
-- С JOIN — чтобы видеть имена
SELECT u.name, COUNT(o.id) AS orders_count, SUM(o.total) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.name;
```

| name    | orders_count | total_spent |
|---------|-------------|-------------|
| Игорь   | 2           | 4700.00     |
| Анна    | 1           | 800.00      |
| Дмитрий | 0           | NULL        |
| Мария   | 2           | 7100.00     |

### Примеры кода

```sql
-- Количество товаров в каждой категории
SELECT category, COUNT(*) AS product_count
FROM products
GROUP BY category;

-- Средняя цена по категориям
SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category
ORDER BY avg_price DESC;
```

### Важное правило GROUP BY

Каждый столбец в SELECT, который **не** обернут в агрегатную функцию, **обязан** быть в GROUP BY:

```sql
-- Правильно: name в GROUP BY
SELECT u.name, COUNT(o.id)
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.name;

-- ОШИБКА: name нет в GROUP BY
SELECT u.name, COUNT(o.id)
FROM users u
JOIN orders o ON u.id = o.user_id;
-- PostgreSQL выдаст ошибку!
```

---

## HAVING — фильтрация групп

### Что это такое?

HAVING — это WHERE, но для групп. WHERE фильтрует строки до группировки, HAVING — после.

### Как работает?

```sql
-- Пользователи с более чем 1 заказом
SELECT u.name, COUNT(o.id) AS orders_count
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.name
HAVING COUNT(o.id) > 1;
```

| name  | orders_count |
|-------|-------------|
| Игорь | 2           |
| Мария | 2           |

```sql
-- Категории со средней ценой выше 1000
SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 1000;
```

### Частые заблуждения

- "Можно использовать WHERE вместо HAVING" — нет, WHERE не работает с агрегатными функциями. `WHERE COUNT(*) > 1` — ошибка.
- "HAVING без GROUP BY бессмысленно" — на практике да, HAVING всегда идет после GROUP BY.

### Мини-проверка

1. Чем WHERE отличается от HAVING?
2. Какое правило связывает SELECT и GROUP BY?
3. Как посчитать среднюю сумму заказа по каждому пользователю?

---

## Подзапросы (Subqueries)

### Что это такое?

Подзапрос — это SELECT внутри другого запроса. Результат внутреннего запроса используется внешним.

### Как работает?

```sql
-- Пользователи, чьи заказы выше среднего
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total > (SELECT AVG(total) FROM orders);
-- AVG = 2520, значит вернутся заказы на 3200 и 5000

-- Пользователи, у которых есть хотя бы один заказ
SELECT name FROM users
WHERE id IN (SELECT DISTINCT user_id FROM orders);

-- Подзапрос в SELECT (скалярный подзапрос)
SELECT
  name,
  (SELECT COUNT(*) FROM orders WHERE user_id = users.id) AS orders_count
FROM users;
```

### Примеры кода

```sql
-- Товар с максимальной ценой
SELECT * FROM products
WHERE price = (SELECT MAX(price) FROM products);

-- Пользователи, потратившие больше 3000 суммарно
SELECT name FROM users
WHERE id IN (
  SELECT user_id
  FROM orders
  GROUP BY user_id
  HAVING SUM(total) > 3000
);

-- EXISTS — проверка существования
SELECT u.name
FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```

### Частые заблуждения

- "Подзапросы всегда медленнее JOIN" — не всегда, но в целом JOIN обычно производительнее. Оптимизатор SQL может преобразовать подзапрос в JOIN автоматически.
- "IN и EXISTS — одно и то же" — результат похож, но EXISTS эффективнее при больших объемах данных.

### Мини-проверка

1. Когда подзапрос лучше JOIN?
2. Что вернет подзапрос `(SELECT AVG(total) FROM orders)` — таблицу или одно число?
3. Чем IN отличается от EXISTS?

---

## Порядок выполнения SQL-запроса

Запрос выполняется не в том порядке, в котором написан:

```
1. FROM / JOIN     — откуда берем данные
2. WHERE           — фильтруем строки
3. GROUP BY        — группируем
4. HAVING          — фильтруем группы
5. SELECT          — выбираем столбцы
6. DISTINCT        — убираем дубли
7. ORDER BY        — сортируем
8. LIMIT / OFFSET  — ограничиваем результат
```

Поэтому нельзя использовать псевдоним из SELECT в WHERE — WHERE выполняется раньше:

```sql
-- ОШИБКА: alias orders_count еще не существует на этапе WHERE
SELECT COUNT(*) AS orders_count FROM orders
WHERE orders_count > 1;

-- ПРАВИЛЬНО: используй HAVING
SELECT user_id, COUNT(*) AS orders_count FROM orders
GROUP BY user_id
HAVING COUNT(*) > 1;
```

---

## Итог

| Концепция | Что делает |
|-----------|-----------|
| INNER JOIN | Только совпадающие строки из обеих таблиц |
| LEFT JOIN | Все из левой + совпадения из правой |
| RIGHT JOIN | Все из правой + совпадения из левой |
| FULL JOIN | Все из обеих таблиц |
| GROUP BY | Группирует строки для агрегации |
| HAVING | Фильтрует группы (после GROUP BY) |
| COUNT/SUM/AVG | Считают статистику по группам |
| Подзапросы | SELECT внутри другого SELECT |

Запомни порядок: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.

---

> [[sql/01-select-insert|<-- Предыдущая: Основы SQL]] | [[sql/03-postgresql|Следующая: PostgreSQL -->]]
> [[sql-fundamentals|<-- Назад к оглавлению SQL]]
