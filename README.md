# Claude Code: slash-команди — курс і тренажер

Курс українською про Claude Code CLI: slash-команди, режими дозволів, контекст і сесії, review коду, моделі, MCP/skills і фонові агенти. Статичні сторінки без API — працюють локально (`file://`) або на GitHub Pages.

**Головна мета — не вивчити всі команди, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії.**

## Швидкий старт

```bash
open index.html          # macOS
```

## Що всередині

| Файл | Опис |
|------|------|
| [index.html](index.html) | Курс: 7 модулів, 12 уроків, quiz, фінальний іспит, шпаргалка, словник. Генерується з `course-config.js` і `lessons/*.js` командою `node scripts/render-index.mjs courses/claude-code` у hub — не редагуй вручну |
| [trainer.html](trainer.html) | Тренажер-емулятор slash-команд: 8 розділів, строгий матчинг з офіційними аліасами, тест-режим, прогрес у `localStorage` |
| `course-config.js`, `lessons/` | Дані курсу (модулі, уроки, іспит, шпаргалка) |
| `engine/` | Копія спільного рушія hub (`scripts/sync-engine.sh claude-code`), вручну не редагується |
| [claude_code_slash_commands_uk.md](claude_code_slash_commands_uk.md) | Архів: довідник команд (стан 2026-06-30) |

## Модулі

1. Перші кроки — `claude`, `/`, `/help`, `/init`, `CLAUDE.md`
2. Безпека: режими дозволів — `Shift+Tab`, `--permission-mode`, `/permissions`, `/sandbox`, ризик `--dangerously-skip-permissions`
3. Контекст і сесії — `/context`, `/compact`, `/clear`, `/resume`, `/rewind`
4. Код і review — `/diff`, `/code-review`, `/security-review`, `/simplify`, `/verify`
5. Модель, зусилля і налаштування — `/model`, `/effort`, `/usage`, `/config`
6. Розширення — `/mcp`, skills, `/agents`, `/hooks`, `/plugin`
7. Фонові агенти і хмара — `/background`, `/fork`, `/tasks`, `/batch`, `/schedule`, `/teleport`

## Legacy

`scripts/build_index.py` — старий генератор тренажера з `claude_code_slash_commands_uk.md`. Він **записує `index.html`** і перезапише оболонку курсу, тому не запускай його. Тренажер тепер підтримується вручну в `trainer.html`; довідник і скрипт лишаються як архів.

## Джерела

- https://code.claude.com/docs/en/commands
- https://code.claude.com/docs/en/permission-modes
- https://code.claude.com/docs/en/checkpointing
- https://code.claude.com/docs/en/cli-reference

Набір команд залежить від версії, плану й платформи — звіряйся з `/help` своєї версії.
