window.CLI_COURSE_CONFIG = {
  id: "claude-code",
  title: "Claude Code: slash-команди",
  subtitle: "AI-агент у терміналі без хаосу: slash-команди, режими дозволів, контекст, review коду, моделі, MCP і фонові агенти.",
  overline: "Курс для новачків · Claude Code CLI · стан на 2026-09",
  brandSub: "курс slash-команд Claude Code",
  storageKey: "cli-claude-code-v1",
  caseInsensitive: false,
  prompt: ">",
  termTitle: "claude — ~/Projects/demo",
  sandbox: "trainer.html",
  quizBank: null,
  factsCheckedAt: "2026-09-18",
  skills: [
    ["terminal", "Запускати `claude` у папці проєкту, користуватися меню `/`, `/help` і `CLAUDE.md`."],
    ["shield", "Обирати режим дозволів (`Shift+Tab`, `--permission-mode`) і розуміти ризик `--dangerously-skip-permissions`."],
    ["memory", "Керувати контекстом і сесіями: `/context`, `/compact`, `/clear`, `/resume`, `/rewind`."],
    ["code", "Перевіряти зміни агента: `/diff`, `/code-review`, `/security-review`, `/verify`."],
    ["settings", "Обирати модель і рівень зусиль (`/model`, `/effort`), стежити за витратами (`/usage`)."],
    ["hub", "Підключати MCP, skills і фонові агенти: `/mcp`, `/skills`, `/background`, `/tasks`."]
  ],
  audience: "<p>Для тих, хто вже запускав <code>claude</code> у терміналі (або збирається) і хоче працювати з агентом свідомо: знати потрібні slash-команди, контролювати, що агент може робити без дозволу, і вміти перевірити та відкотити його зміни.</p><p>Головна мета — не вивчити всі команди, а навчитися швидко знаходити потрібну команду, розуміти її ризик і застосовувати її в реальному сценарії.</p>",
  safety: "<p>Кроки «Спробуй сам» і тренажер — імітація: вони нічого не запускають і не звертаються до API. У справжньому Claude Code агент змінює файли і виконує команди на твоєму комп'ютері: працюй у папці проєкту з чистим <code>git status</code>. Зверни увагу на стартовий режим дозволів: у новіших версіях на планах Pro, Max і Team сесія починається в <code>auto</code> (дії перевіряє класифікатор, а не ти), тож якщо хочеш підтверджувати кожну зміну — запускай <code>claude --permission-mode default</code>. Не вмикай <code>--dangerously-skip-permissions</code> поза контейнером чи VM. Набір команд залежить від версії, плану й платформи — звіряйся з <code>/help</code> своєї версії.</p>",
  sources: [
    { href: "https://code.claude.com/docs/en/commands", label: "Claude Code — Commands (довідник slash-команд)" },
    { href: "https://code.claude.com/docs/en/permission-modes", label: "Claude Code — Permission modes" },
    { href: "https://code.claude.com/docs/en/checkpointing", label: "Claude Code — Checkpointing (/rewind)" },
    { href: "https://code.claude.com/docs/en/cli-reference", label: "Claude Code — CLI reference" },
    { href: "https://code.claude.com/docs/en/model-config", label: "Claude Code — Model configuration" },
    { href: "https://code.claude.com/docs/en/mcp", label: "Claude Code — MCP" }
  ]
};
