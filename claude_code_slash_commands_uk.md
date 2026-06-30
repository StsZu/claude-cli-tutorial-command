# Claude Code Slash Commands — опис українською

Дата підготовки: 2026-06-30  
Джерела:  
- https://code.claude.com/docs/en/commands  
- https://code.claude.com/docs/en/agent-sdk/slash-commands  

> Важливо: не всі команди можуть бути доступні у вашому Claude Code. Доступність залежить від версії Claude Code, платформи, плану підписки, середовища, підключених MCP-серверів, skills і plugins.  
> У Claude Agent SDK реальний список доступних slash-команд треба дивитися через `system/init` → `message.slash_commands`.

---

## Коротка логіка роботи slash commands

Slash commands — це команди, які вводяться на початку повідомлення в Claude Code, наприклад:

```text
/plan fix firewall rules
```

Текст після назви команди передається як аргументи.

У Claude Code можна натиснути `/`, щоб побачити доступні команди.  
У Claude Agent SDK доступні не всі CLI-команди, а тільки ті, які можуть працювати без інтерактивного terminal UI.

---

## Таблиця команд

| Команда | Опис українською | Коли використовувати |
|---|---|---|
| `/add-dir <path>` | Додає ще одну робочу директорію, до якої Claude матиме доступ у поточній сесії. | Коли треба дозволити Claude читати/редагувати файли не тільки з поточного каталогу. |
| `/advisor [model\|off]` | Увімкнути або вимкнути advisor tool — додаткову модель, яка консультує Claude у складних моментах. | Для складних задач, де корисна “друга думка” моделі. |
| `/agents` | Керування agent/subagent конфігураціями. | Коли хочеш налаштувати спеціалізованих агентів для окремих задач. |
| `/autofix-pr [prompt]` | Запускає Claude Code on the web для автоматичного виправлення проблем у pull request: CI failures, review comments тощо. | Коли є PR і треба автоматично лагодити коментарі або помилки CI. Потрібен `gh` CLI і доступ до Claude Code on the web. |
| `/background [prompt]` | Від’єднує поточну сесію і запускає її як background agent, звільняючи terminal. | Для довгих задач, які не треба тримати відкритими в активному терміналі. |
| `/bg` | Аліас для `/background`. | Те саме, що `/background`. |
| `/batch <instruction>` | Bundled skill/workflow для великих змін у кодовій базі. Розбиває задачу на незалежні частини, запускає subagents у git worktrees, може створювати PR. | Для великих міграцій або рефакторингів, які можна паралелити. |
| `/branch [name]` | Створює відгалуження поточної розмови, щоб спробувати інший напрямок без втрати основної сесії. | Коли хочеш протестувати альтернативне рішення або інший підхід. |
| `/btw <question>` | Дозволяє поставити коротке side-question без засмічення основного контексту. | Для швидких уточнень “між іншим”, які не мають ставати частиною основної задачі. |
| `/cd <path>` | Переміщує поточну сесію в іншу робочу директорію. | Коли треба продовжити цю ж сесію, але працювати з іншим каталогом. |
| `/chrome` | Налаштування Claude in Chrome. | Коли використовується інтеграція Claude з Chrome. |
| `/claude-api [migrate\|managed-agents-onboard]` | Завантажує довідкові матеріали по Claude API для потрібної мови/SDK; може допомогти мігрувати код або налаштувати Managed Agents. | Для проєктів, які використовують Anthropic/Claude API. |
| `/clear [name]` | Починає нову розмову з порожнім контекстом. Попередня сесія зберігається і може бути відновлена через `/resume`. | Коли контекст забруднений або треба почати нову задачу. |
| `/reset` | Аліас для `/clear`. | Те саме, що `/clear`. |
| `/new` | Аліас для `/clear`. | Те саме, що `/clear`. |
| `/code-review [low\|medium\|high\|xhigh\|max\|ultra] [--fix] [--comment] [target]` | Робить code review поточного diff або вказаної цілі. Шукає correctness bugs, спрощення, ефективність, повторне використання коду. Може застосувати fixes або залишити коментарі в PR. | Перед commit/PR або коли треба перевірити зміни. |
| `/color [color\|default]` | Змінює колір prompt bar у поточній сесії. | Для візуального розділення різних сесій або режимів роботи. |
| `/compact [instructions]` | Стискає історію розмови, створюючи summary, щоб звільнити context window. Можна передати інструкції, що саме зберегти у summary. | Коли сесія стала довгою, але не хочеш починати з нуля. |
| `/config [key=value ...]` | Відкриває або змінює налаштування Claude Code: theme, model, output style та інші параметри. | Для зміни конфігурації Claude Code. |
| `/settings` | Аліас для `/config`. | Те саме, що `/config`. |
| `/context [all]` | Показує використання context window: що займає місце, де є ризик переповнення, які є оптимізації. | Коли сесія довга або Claude починає “губити” контекст. |
| `/copy [N]` | Копіює останню або N-ту відповідь Claude у clipboard. Якщо є code blocks, можна вибрати конкретний блок. | Щоб швидко забрати відповідь, код або інструкцію з Claude. |
| `/cost` | Аліас для `/usage`. | Для перегляду вартості/usage. |
| `/debug [description]` | Вмикає debug logging для поточної сесії і допомагає аналізувати проблеми через debug log. | Коли Claude Code працює нестабільно або треба знайти технічну причину проблеми. |
| `/deep-research <question>` | Workflow для глибокого дослідження: запускає web searches, перевіряє джерела і формує звіт із посиланнями. | Для research-задач, де потрібні джерела і перевірка фактів. |
| `/design-login` | Авторизація доступу до design-system для `/design-sync`. | Перед використанням `/design-sync`. |
| `/design-sync [hint]` | Конвертує React design system із репозиторію і завантажує його в Claude Design, щоб Claude використовував реальні компоненти проєкту. | Для фронтенд-проєктів із власною дизайн-системою. |
| `/desktop` | Продовжити поточну сесію в Claude Code Desktop app. | Коли хочеш перенести роботу з terminal у desktop app. |
| `/app` | Аліас для `/desktop`. | Те саме, що `/desktop`. |
| `/diff` | Відкриває інтерактивний diff viewer для uncommitted changes і змін по turn-ах Claude. | Перед commit або review, щоб побачити, що саме змінив Claude. |
| `/doctor` | Діагностика встановлення і налаштувань Claude Code. Може запропонувати автоматичне виправлення. | Якщо щось не працює: permissions, install, auth, runtime. |
| `/effort [level\|auto]` | Змінює рівень reasoning/effort моделі: `low`, `medium`, `high`, `xhigh`, `max`, `ultracode`, `auto`. | Для балансу між швидкістю, якістю і вартістю. |
| `/exit` | Вихід із CLI. Якщо сесія background-attached, команда від’єднує термінал, але не зупиняє background session. | Коли треба закрити Claude Code. |
| `/quit` | Аліас для `/exit`. | Те саме, що `/exit`. |
| `/export [filename]` | Експортує поточну розмову як plain text. Може зберегти у файл або скопіювати в clipboard. | Для архіву, документації або передачі контексту іншому інструменту. |
| `/fast [on\|off]` | Вмикає або вимикає fast mode. | Коли важлива швидкість, а не максимальна глибина аналізу. |
| `/feedback [report]` | Надіслати feedback, bug report або поділитися розмовою. | Коли знайшов баг або хочеш відправити відгук Anthropic. |
| `/bug` | Аліас для `/feedback`. | Для bug report. |
| `/share` | Аліас для `/feedback`. | Для поширення/надсилання session context. |
| `/fewer-permission-prompts` | Skill, який аналізує часті read-only Bash/MCP calls і додає allowlist у `.claude/settings.json`, щоб зменшити кількість permission prompts. | Коли Claude надто часто питає дозволи на безпечні повторювані дії. |
| `/focus` | Вмикає focus view: показує останній prompt, короткий summary tool-calls і фінальну відповідь. | Для менш шумного інтерфейсу під час роботи. |
| `/fork <directive>` | Запускає forked background subagent, який успадковує повний контекст і виконує окрему директиву паралельно. | Коли треба віддати side-task агенту, не перериваючи основну роботу. |
| `/goal [condition\|clear]` | Встановлює goal: Claude продовжує працювати через turns, поки умова не виконана. | Для задач із чітким кінцевим станом, наприклад “поки тести не пройдуть”. |
| `/heapdump` | Створює JavaScript heap snapshot і memory breakdown для діагностики великого споживання пам’яті. | Якщо Claude Code або Node-процес споживає забагато RAM. |
| `/help` | Показує help і доступні команди. | Коли забув команду або хочеш побачити доступні опції. |
| `/hooks` | Показує конфігурації hooks для tool events. | Для контролю поведінки Claude перед/після tool calls. |
| `/ide` | Керує IDE integrations і показує їхній статус. | Для інтеграції з VS Code, Cursor або іншими IDE. |
| `/init` | Ініціалізує проєкт, створюючи `CLAUDE.md` guide. Новіші режими можуть провести через skills, hooks і memory files. | Перша команда в новому репозиторії. Дуже корисна. |
| `/insights` | Генерує звіт по ваших Claude Code sessions: області проєкту, патерни взаємодії, friction points. | Для аналізу, як ви використовуєте Claude Code і де є вузькі місця. |
| `/install-github-app` | Встановлює Claude GitHub App для репозиторію, може допомогти з GitHub Actions workflows/secrets. | Коли хочеш інтегрувати Claude з GitHub repo. |
| `/install-slack-app` | Встановлює Claude Slack app через OAuth. | Для інтеграції Claude зі Slack. |
| `/keybindings` | Відкриває файл keyboard shortcuts. | Коли треба налаштувати гарячі клавіші. |
| `/login` | Увійти в Anthropic account. | Для авторизації Claude Code. |
| `/logout` | Вийти з Anthropic account. | Для зміни акаунта або завершення доступу. |
| `/loop [interval] [prompt]` | Skill для повторного запуску prompt через інтервал або в автономному режимі. | Для перевірок “кожні 5 хвилин” або циклічної підтримки задачі. |
| `/proactive` | Аліас для `/loop`. | Те саме, що `/loop`. |
| `/mcp [reconnect <server>\|enable\|disable [<server>\|all]]` | Керує MCP server connections і OAuth. | Для підключення/перепідключення зовнішніх MCP tools. |
| `/memory` | Редагує `CLAUDE.md` memory files, auto-memory і memory entries. | Коли треба змінити довготривалі інструкції для проєкту або користувача. |
| `/mobile` | Показує QR code для завантаження Claude mobile app. | Якщо хочеш продовжувати роботу з мобільного. |
| `/ios` | Аліас для `/mobile`. | Те саме, що `/mobile`. |
| `/android` | Аліас для `/mobile`. | Те саме, що `/mobile`. |
| `/model [model]` | Перемикає AI model і може зберегти її як default для нових сесій. | Коли треба змінити модель під задачу: швидше, дешевше або розумніше. |
| `/passes` | Дозволяє поділитися free week of Claude Code з друзями, якщо акаунт eligible. | Якщо така опція доступна у вашому акаунті. |
| `/permissions` | Керує allow/ask/deny правилами для tools. | Критично важливо для безпечної роботи з файлами, Bash, MCP. |
| `/allowed-tools` | Аліас для `/permissions`. | Те саме, що `/permissions`. |
| `/plan [description]` | Входить у plan mode. Claude спочатку досліджує і пропонує план, не редагуючи код. | Перед великими змінами, міграціями, ризиковими операціями. |
| `/plugin [subcommand]` | Керує Claude Code plugins: list, install, enable, disable тощо. | Для розширення Claude Code через plugins. |
| `/powerup` | Інтерактивні уроки з функцій Claude Code. | Для навчання можливостям Claude Code. |
| `/pr-comments [PR]` | Видалена в новіших версіях. Раніше показувала GitHub PR comments через `gh` CLI. | На нових версіях краще просто попросити Claude переглянути PR comments. |
| `/privacy-settings` | Перегляд і зміна privacy settings. | Для Pro/Max users, якщо доступно. |
| `/radio` | Відкриває Claude FM lo-fi radio у браузері або показує stream URL. | Не робоча команда для коду, а “атмосфера”. Трохи дивно, але живемо з цим. |
| `/recap` | Генерує one-line summary поточної сесії. | Щоб швидко згадати, про що була сесія. |
| `/release-notes` | Відкриває changelog/release notes у version picker. | Коли треба подивитися, що змінилося в Claude Code. |
| `/reload-plugins [--force]` | Перезавантажує активні plugins без рестарту Claude Code. | Коли змінив plugin і треба підхопити зміни. |
| `/reload-skills` | Перескановує skills і command directories, щоб нові/змінені skills стали доступними без рестарту. | Після додавання або редагування `.claude/skills` чи `.claude/commands`. |
| `/remote-control` | Робить локальну сесію доступною для remote control з claude.ai. | Щоб продовжити локальну сесію з іншого пристрою або web. |
| `/rc` | Аліас для `/remote-control`. | Те саме, що `/remote-control`. |
| `/remote-env` | Вибір default environment для cloud agents. | Для налаштування середовища, де працюватимуть cloud agents. |
| `/rename [name]` | Перейменовує поточну сесію; без аргументів генерує назву автоматично. | Щоб легше знаходити сесії в `/resume`. |
| `/resume [session]` | Відновлює попередню розмову за ID/назвою або відкриває picker. | Коли треба повернутися до старої сесії. |
| `/continue` | Аліас для `/resume`. | Те саме, що `/resume`. |
| `/review [PR]` | Робить review GitHub pull request, використовуючи той самий review engine, що `/code-review`. | Для перевірки PR. |
| `/rewind` | Відкочує conversation і/або code до попереднього checkpoint або робить summary з вибраного повідомлення. | Коли Claude пішов не туди або треба повернутися до стабільного стану. |
| `/checkpoint` | Аліас для `/rewind`. | Те саме, що `/rewind`. |
| `/undo` | Аліас для `/rewind`. | Те саме, що `/rewind`. |
| `/run` | Skill, який запускає і перевіряє ваш app у реальному виконанні, а не тільки через tests/types. | Для practical verification: “чи справді воно працює”. |
| `/run-skill-generator` | Створює/навчає per-project skill для `/run` і `/verify`, щоб Claude знав, як build/run/test саме цей проєкт. | Один раз на проєкт, щоб автоматизувати перевірку запуску. |
| `/sandbox` | Вмикає/вимикає sandbox mode. | Для безпечнішого виконання команд у підтримуваних середовищах. |
| `/schedule [description]` | Створює, оновлює, показує або запускає routines на Anthropic-managed cloud infrastructure. | Для регулярних cloud-задач. |
| `/routines` | Аліас для `/schedule`. | Те саме, що `/schedule`. |
| `/scroll-speed` | Налаштовує швидкість прокрутки мишкою в fullscreen rendering. | Якщо scrolling у Claude Code незручний. |
| `/security-review` | Аналізує pending changes на security vulnerabilities: injection, auth issues, data exposure тощо. | Перед merge/deploy, особливо для backend, auth, API, infra. |
| `/setup-bedrock` | Інтерактивне налаштування Amazon Bedrock: auth, region, model pins. | Якщо Claude Code працює через Amazon Bedrock. |
| `/setup-vertex` | Інтерактивне налаштування Google Vertex AI: auth, project, region, model pins. | Якщо Claude Code працює через Google Vertex AI. |
| `/simplify [target]` | Review зміненого коду на cleanup opportunities і застосування fixes. Не фокусується на bugs у новіших версіях. | Після реалізації, щоб прибрати зайву складність. |
| `/skills` | Показує доступні skills, дозволяє сортувати за token count і ховати skills з меню. | Для керування skills у проєкті. |
| `/stats` | Аліас для `/usage`, відкриває Stats tab. | Для статистики використання. |
| `/status` | Відкриває Status tab: version, model, account, connectivity. | Для швидкої перевірки стану Claude Code. |
| `/statusline` | Налаштовує status line Claude Code. | Для кастомізації prompt/status UI. |
| `/stickers` | Замовлення Claude Code stickers. | Не технічна команда. Просто мерч. |
| `/stop` | Зупиняє поточну background session, якщо ви attached до неї. Transcript і worktree зберігаються. | Коли background-agent більше не потрібен. |
| `/tasks` | Показує і дозволяє керувати тим, що виконується у background. | Для моніторингу background tasks. |
| `/bashes` | Аліас для `/tasks`. | Те саме, що `/tasks`. |
| `/team-onboarding` | Генерує onboarding guide для команди на основі історії використання Claude Code за останні 30 днів. | Щоб швидко підготувати колег до роботи з вашим Claude Code workflow. |
| `/teleport` | Підтягує Claude Code on the web session у локальний terminal: обирає сесію, fetch branch і conversation. | Коли почав у web/cloud, а хочеш продовжити локально. |
| `/tp` | Аліас для `/teleport`. | Те саме, що `/teleport`. |
| `/terminal-setup` | Налаштовує terminal keybindings: Shift+Enter та інші shortcuts. | Якщо terminal/IDE неправильно обробляє гарячі клавіші. |
| `/theme` | Змінює color theme Claude Code. | Для візуальної кастомізації terminal UI. |
| `/tui [default\|fullscreen]` | Перемикає terminal UI renderer і перезапускає інтерфейс із тією самою розмовою. | Якщо хочеш fullscreen/flicker-free rendering або повернути default. |
| `/ultraplan <prompt>` | Створює план в ultraplan session, дозволяє переглянути його в браузері, виконати remotely або повернути в terminal. | Для дуже великих задач, де потрібне серйозне планування. |
| `/ultrareview [PR]` | Глибокий multi-agent code review у cloud sandbox. Зараз рекомендований варіант — `/code-review ultra`; `/ultrareview` лишається як alias. | Для критичних PR або великих змін. |
| `/upgrade` | Відкриває сторінку upgrade для переходу на вищий план. | Якщо поточний план не покриває потреби. |
| `/usage` | Показує session cost, plan usage limits і activity stats. На платних планах може показувати breakdown за skills/subagents/plugins/MCP. | Для контролю лімітів і витрат. |
| `/usage-credits` | Налаштовує usage credits, щоб продовжити роботу після досягнення ліміту. | Якщо часто впираєшся в usage limits. |
| `/verify` | Skill, який підтверджує, що code change реально працює: build, run app, observe result. | Після змін у коді. Краще, ніж “тести зелені, а UI помер”. |
| `/vim` | Видалена у v2.1.92. Для Vim/Normal editing mode треба використовувати `/config` → Editor mode. | Тільки для старих версій; у нових неактуальна. |
| `/voice [hold\|tap\|off]` | Вмикає/вимикає voice dictation або задає режим. | Для диктування голосом. Потрібен Claude.ai account. |
| `/web-setup` | Підключає GitHub account до Claude Code on the web через локальні `gh` credentials. | Для інтеграції local GitHub auth з cloud/web Claude Code. |
| `/workflows` | Відкриває workflow progress view: watch, pause, resume, save workflows. | Для керування workflow jobs. |

---

## MCP slash commands

MCP-сервери можуть додавати власні prompts, які з’являються як slash commands.

Формат:

```text
/mcp__<server>__<prompt>
```

Наприклад умовно:

```text
/mcp__github__review_issue
/mcp__linear__summarize_ticket
```

Ці команди не є фіксованими. Вони залежать від підключених MCP-серверів і того, які prompts ці сервери експортують.

---

## Custom slash commands

Власні slash commands можна робити через markdown-файли.

Legacy-формат:

```text
.claude/commands/<name>.md
~/.claude/commands/<name>.md
```

Рекомендований сучасний формат:

```text
.claude/skills/<name>/SKILL.md
~/.claude/skills/<name>/SKILL.md
```

Назва файлу або skill стає командою:

```text
.claude/commands/refactor.md  →  /refactor
.claude/skills/review/SKILL.md → /review
```

Після додавання або зміни skills/commands у відкритій сесії використовуйте:

```text
/reload-skills
```

---

## Slash commands у Claude Agent SDK

У SDK доступний список треба отримувати програмно через `system/init`.

TypeScript-приклад:

```ts
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Hello Claude",
  options: { maxTurns: 1 }
})) {
  if (message.type === "system" && message.subtype === "init") {
    console.log("Available slash commands:", message.slash_commands);
  }
}
```

Запуск команди через SDK:

```ts
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "/compact",
  options: { continue: true, maxTurns: 1 }
})) {
  console.log(message);
}
```

Важливо: `/compact` має сенс тільки якщо вже є історія розмови. У новій порожній сесії compact-ити просто нічого.

---

## Практичний мінімум для щоденної роботи

Якщо не хочеться вчити весь список, почни з цього набору:

```text
/init
/memory
/plan
/model
/effort
/context
/compact
/clear
/diff
/code-review
/simplify
/security-review
/permissions
/mcp
/agents
/skills
/reload-skills
/doctor
/status
/usage
/resume
/rewind
/verify
```

Це 80/20 набір: ним закривається більшість реальної роботи з кодом, agents, контекстом, permissions і перевіркою змін.

---

## Рекомендований workflow для проєкту

```text
/init
/memory
/permissions
/mcp
/agents
/plan <task>
/diff
/code-review
/security-review
/verify
/compact
```

Логіка проста:

1. Спочатку налаштувати проєкт.
2. Потім планувати зміни.
3. Потім дивитися diff.
4. Потім перевіряти якість і безпеку.
5. Потім підтверджувати, що воно реально працює.
6. Коли контекст роздувся — `/compact`.

---
