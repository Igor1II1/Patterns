# Git: Ветки — branch, merge, конфликты

← [[git/01-basics]] | Следующая: [[git/03-remote]] →

---

## Что такое ветка

**Ветка** — это указатель на конкретный коммит. Когда делаешь новый коммит, указатель сдвигается вперёд.

```
main:    A → B → C
                  ↑
                 HEAD (текущая позиция)
```

После создания ветки `feature`:
```
main:    A → B → C
                  ↓
feature:          C → D → E
                           ↑
                          HEAD
```

`main` остался на C, а `feature` двигается вперёд независимо.

---

## Зачем нужны ветки

- **Изоляция** — новая функция разрабатывается отдельно, не ломает `main`
- **Параллельная работа** — несколько задач одновременно
- **Эксперименты** — попробовал, не понравилось — удалил ветку
- **Code review** — коллеги смотрят твою ветку через Pull Request

**Правило:** `main` — всегда рабочий код. Всё новое — в отдельной ветке.

---

## Работа с ветками

```bash
# Список всех веток (* = текущая)
git branch

# Список включая удалённые
git branch -a

# Создать ветку (не переключаться)
git branch feature-search

# Переключиться на ветку
git switch feature-search
# или устаревший способ:
git checkout feature-search

# Создать и сразу переключиться (самое частое)
git switch -c feature-search
# или:
git checkout -b feature-search

# Удалить ветку (после merge)
git branch -d feature-search

# Удалить принудительно (без merge)
git branch -D feature-search
```

---

## Соглашения по именованию веток

```bash
feature/add-search      # новая функция
fix/login-bug           # исправление бага
refactor/auth-module    # рефакторинг
docs/update-readme      # документация
chore/update-deps       # технические задачи
```

Стиль: строчные буквы, слова через дефис, кратко и понятно.

---

## Слияние веток — git merge

После того как работа в ветке закончена, её сливают (merge) в `main`.

```bash
# 1. Переключись на ветку-получатель
git switch main

# 2. Слить feature в main
git merge feature-search

# 3. Удалить слитую ветку
git branch -d feature-search
```

### Типы merge

**Fast-forward** (простой случай) — `main` не двигался пока ты работал:
```
До:      main: A → B
               feature:  B → C → D

После:   main: A → B → C → D
```
Git просто сдвигает указатель. Нет отдельного "merge commit".

**Recursive merge** (main тоже двигался) — создаётся merge commit:
```
До:      main:    A → B → E
               feature:  B → C → D

После:   main:    A → B → E → M  (M = merge commit)
                       ↗
                  C → D
```

---

## Конфликты — когда merge не удаётся

Конфликт возникает когда **оба** изменяли одно и то же место в одном файле.

```bash
git merge feature-search
# CONFLICT (content): Merge conflict in src/library.js
# Automatic merge failed; fix conflicts and then commit
```

Git помечает конфликтное место в файле:
```javascript
<<<<<<< HEAD
function search(books, query) {
  return books.filter(b => b.title.includes(query));
}
=======
function search(books, query) {
  return books.filter(b => b.title.toLowerCase().includes(query.toLowerCase()));
}
>>>>>>> feature-search
```

Расшифровка:
- `<<<<<<< HEAD` — твоя версия (main)
- `=======` — разделитель
- `>>>>>>> feature-search` — версия из ветки

**Как решить:**
1. Открой файл в VS Code — там будет красивый интерфейс с кнопками
2. Выбери "Accept Current", "Accept Incoming", или "Accept Both"
3. Или вручную отредактируй — оставь нужный код, удали маркеры `<<<`, `===`, `>>>`
4. Сохрани файл
5. Добавь в staging и закоммить:

```bash
git add src/library.js
git commit -m "merge: объединить feature-search с main"
```

### Отменить merge в процессе

```bash
git merge --abort
```

---

## HEAD — текущая позиция

`HEAD` — указатель на текущий коммит. Обычно HEAD = последний коммит текущей ветки.

```bash
# Посмотреть куда смотрит HEAD
cat .git/HEAD

# HEAD в логе
git log --oneline
# a3f2c1d (HEAD -> main) последний коммит
```

---

## Просмотр веток визуально

```bash
git log --oneline --graph --all
```

Пример:
```
* e4f1a2b (HEAD -> main) feat: финальная версия поиска
*   d2c3b1a merge: объединить feature-search с main
|\
| * c1b2a3d feat: case-insensitive поиск
| * b3a2c1d feat: поиск по автору
* | a2b3c1d fix: исправить форму добавления
|/
* 9b4e2a0 feat: начальная структура
```

---

## Типичный workflow с ветками

```bash
# 1. Начинаешь новую задачу
git switch -c feature/add-delete-book

# 2. Работаешь...
git add .
git commit -m "feat: добавить кнопку удаления"
git commit -m "feat: подтверждение удаления через диалог"

# 3. Обновляешь main из remote (кто-то мог запушить)
git switch main
git pull

# 4. Сливаешь свою ветку
git merge feature/add-delete-book

# 5. Удаляешь ветку
git branch -d feature/add-delete-book

# 6. Пушишь в GitHub
git push
```

---

## Навигация

← [[git/01-basics]] | Следующая: [[git/03-remote]] →
