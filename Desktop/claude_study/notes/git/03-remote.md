# Git: Remote — GitHub, push, pull, clone

← [[git/02-branches]] | Следующая: [[git/04-github-workflow]] →

---

## Что такое remote

**Remote** (удалённый репозиторий) — копия твоего репозитория на сервере (GitHub, GitLab и т.д.).

Локальный репозиторий и remote — два независимых репозитория, которые синхронизируются вручную командами `push` и `pull`.

```
Твой компьютер          GitHub
┌─────────────┐         ┌─────────────┐
│   .git/     │  push → │  origin/    │
│  (local)    │ ← pull  │  (remote)   │
└─────────────┘         └─────────────┘
```

---

## Подключить existing репозиторий к GitHub

```bash
# 1. Создай репозиторий на GitHub (через браузер)
# 2. Скопируй URL: https://github.com/username/repo-name.git

# 3. В локальной папке добавь remote
git remote add origin https://github.com/username/repo-name.git

# Проверить
git remote -v
# origin  https://github.com/username/repo-name.git (fetch)
# origin  https://github.com/username/repo-name.git (push)

# 4. Первый push (с флагом -u устанавливает связь)
git push -u origin main
```

`origin` — стандартное имя для основного remote. Можно назвать иначе, но не нужно.

---

## git push — отправить на GitHub

```bash
# Отправить текущую ветку (после первого -u)
git push

# Первый push ветки (установить upstream)
git push -u origin feature-search

# Отправить конкретную ветку
git push origin main

# Удалить ветку на remote
git push origin --delete feature-search
```

**Когда пушить:**
- После завершения логически завершённой задачи
- В конце рабочей сессии (даже незаконченная работа)
- Перед тем как показать код другому человеку

---

## git pull — получить с GitHub

```bash
# Получить и применить изменения из remote
git pull

# Развёрнутый вариант: fetch + merge
git pull origin main
```

`git pull` = `git fetch` + `git merge`

**Когда пуллить:**
- В начале рабочего дня
- Перед merge своей ветки в main
- Когда знаешь что кто-то запушил изменения

---

## git fetch — скачать без применения

```bash
# Скачать все изменения из remote (не применяя)
git fetch origin

# Посмотреть что изменилось
git log HEAD..origin/main --oneline

# Потом решить сам: делать merge или нет
git merge origin/main
```

`fetch` безопаснее `pull` — сначала смотришь, потом применяешь.

---

## git clone — клонировать репозиторий

```bash
# Клонировать в папку с именем репозитория
git clone https://github.com/username/repo-name.git

# Клонировать в конкретную папку
git clone https://github.com/username/repo-name.git my-project

# После клонирования remote уже настроен автоматически
cd repo-name
git remote -v
```

---

## SSH vs HTTPS

**HTTPS** — проще настроить, спрашивает логин/пароль (или Personal Access Token).

**SSH** — удобнее в работе, не нужно каждый раз вводить пароль. Рекомендую настроить.

```bash
# Генерация SSH ключа
ssh-keygen -t ed25519 -C "your@email.com"

# Добавить публичный ключ на GitHub:
# Settings → SSH and GPG keys → New SSH key
cat ~/.ssh/id_ed25519.pub

# Проверить соединение
ssh -T git@github.com
# Hi username! You've successfully authenticated.

# Сменить remote с HTTPS на SSH
git remote set-url origin git@github.com:username/repo-name.git
```

---

## Работа с remote ветками

```bash
# Список remote веток
git branch -r

# Все ветки (local + remote)
git branch -a

# Переключиться на remote ветку (создаёт локальную копию)
git switch feature-search
# (если такой ветки нет локально, Git сам найдёт в remote)

# Обновить список remote веток
git fetch --prune
# --prune удаляет ссылки на уже удалённые ветки
```

---

## Конфликт при push — rejected

```bash
git push
# error: failed to push some refs
# hint: Updates were rejected because the remote contains work that you do not have locally
```

Это значит: кто-то (или ты сам с другого места) запушил в remote, и твои коммиты "позади".

**Решение:**
```bash
# 1. Получить изменения
git pull

# 2. Разрешить конфликты если есть

# 3. Запушить снова
git push
```

**Никогда** не делай `git push --force` на `main` — это перезаписывает историю и ломает работу других.

---

## Типичный ежедневный workflow

```bash
# Утро: начинаешь работу
git pull                          # получить последние изменения
git switch -c feature/new-task   # новая ветка для задачи

# Работа...
git add .
git commit -m "feat: описание"

# Вечер: заканчиваешь
git push -u origin feature/new-task  # отправить ветку на GitHub
```

---

## Навигация

← [[git/02-branches]] | Следующая: [[git/04-github-workflow]] →
