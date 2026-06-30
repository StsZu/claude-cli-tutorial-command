# Claude Code Slash Commands — Тренажер

Інтерактивний HTML-тренажер slash-команд Claude Code українською.

**Без API** — один статичний `index.html`, працює локально в браузері або на GitHub Pages.

## Швидкий старт

```bash
open index.html          # macOS
# або подвійний клік на index.html
```

Перегенерація після змін у `claude_code_slash_commands_uk.md`:

```bash
python3 scripts/build_index.py
```

## Розділи навчання

| Розділ | Зміст |
|--------|--------|
| **Щоденний мінімум** | 80/20: `/init`, `/plan`, `/diff`, `/verify`… |
| **Проєкт і налаштування** | memory, permissions, MCP, інтеграції |
| **Сесія і контекст** | clear, compact, resume, rewind |
| **Код і review** | code-review, security-review, simplify |
| **Агенти і фон** | background, fork, batch, teleport |
| **Модель і UI** | model, effort, theme, usage |
| **Додаткові** | решта команд з довідника |

## Можливості

- Емуляція slash-команд з українськими підказками
- Прогрес по кожному розділу
- **Режим тестування** — вгадай команду за описом
- `↑`/`↓` історія, `Tab` автодоповнення
- Підтримка аліасів (`/bg` → `/background`, `/new` → `/clear`…)

## Джерела

- `claude_code_slash_commands_uk.md` — локальний довідник
- https://code.claude.com/docs/en/commands
- https://code.claude.com/docs/en/agent-sdk/slash-commands

## GitHub Pages

Settings → Pages → Deploy from branch → `main` → `/ (root)`.