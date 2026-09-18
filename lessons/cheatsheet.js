window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.cheatsheet = {
  sections: [
    { title: "Запуск (термінал)", rows: [
      { cmd: "claude", desc: "Інтерактивна сесія в поточній папці — запускай з папки проєкту", risk: "medium" },
      { cmd: "claude -c", desc: "Продовжити останню розмову в цій папці (`--continue`)", risk: "low" },
      { cmd: "claude -r \"auth-refactor\"", desc: "Відновити сесію за назвою чи ID (`--resume`)", risk: "low" },
      { cmd: "claude -p \"explain this project\"", desc: "Неінтерактивний запуск: відповідь і вихід", risk: "medium" },
      { cmd: "claude --model opus", desc: "Сесія з моделлю за аліасом (`sonnet`, `opus`, `haiku`, `fable`)", risk: "low" },
      { cmd: "claude agents", desc: "Фонові сесії: перегляд і керування", risk: "low" },
      { cmd: "claude mcp list", desc: "MCP-сервери без запуску сесії", risk: "low" },
      { cmd: "claude mcp add --transport http <name> <url>", desc: "Додати MCP-сервер — лише довірений", risk: "medium" }
    ] },
    { title: "Режими дозволів і безпека", rows: [
      { cmd: "Shift+Tab", desc: "Перемкнути режим у сесії: `default` → `acceptEdits` → `plan` → …", risk: "low" },
      { cmd: "claude --permission-mode plan", desc: "Старт у режимі планування: правки після схвалення плану", risk: "low" },
      { cmd: "claude --permission-mode default", desc: "Manual: питати перед кожною зміною (`manual` — аліас)", risk: "medium" },
      { cmd: "claude --permission-mode acceptEdits", desc: "Правки файлів без запиту, інші команди — з запитом", risk: "medium" },
      { cmd: "claude --permission-mode dontAsk", desc: "Лише заздалегідь дозволене, решта — відмова (CI, скрипти)", risk: "medium" },
      { cmd: "/plan <завдання>", desc: "Увійти в режим планування з рядка вводу", risk: "low" },
      { cmd: "/permissions", desc: "Правила allow / ask / deny (аліас `/allowed-tools`)", risk: "medium" },
      { cmd: "/sandbox", desc: "Пісочниця для команд оболонки (macOS, Linux, WSL2)", risk: "medium" },
      { cmd: "/fewer-permission-prompts", desc: "Запропонувати allowlist частих read-only команд — перечитай перед згодою", risk: "medium" },
      { cmd: "claude --dangerously-skip-permissions", desc: "`bypassPermissions`: без запитів і перевірок. Лише в контейнері чи VM", risk: "high" }
    ] },
    { title: "Старт і довідка", rows: [
      { cmd: "/", desc: "Меню команд з фільтром за літерами", risk: "low" },
      { cmd: "/help", desc: "Довідка і доступні команди твоєї версії", risk: "low" },
      { cmd: "!<команда>", desc: "Виконати команду оболонки напряму, вивід — у розмову", risk: "medium" },
      { cmd: "/init", desc: "Створити чернетку `CLAUDE.md` для проєкту", risk: "medium" },
      { cmd: "/memory", desc: "Редагувати `CLAUDE.md`, керувати auto memory", risk: "medium" },
      { cmd: "/status", desc: "Версія, модель, акаунт, з'єднання", risk: "low" },
      { cmd: "/doctor", desc: "Діагностика встановлення й налаштувань", risk: "low" },
      { cmd: "/exit", desc: "Вихід (аліас `/quit`, або `Ctrl+D`)", risk: "low" }
    ] },
    { title: "Контекст і сесії", rows: [
      { cmd: "/context", desc: "Що займає вікно контексту", risk: "low" },
      { cmd: "/compact [що зберегти]", desc: "Стиснути розмову в підсумок", risk: "medium" },
      { cmd: "/clear", desc: "Нова розмова (аліаси `/reset`, `/new`)", risk: "medium" },
      { cmd: "/btw <питання>", desc: "Побічне питання без запису в розмову", risk: "low" },
      { cmd: "/resume", desc: "Повернутися до сесії (аліас `/continue`)", risk: "low" },
      { cmd: "/rename <назва>", desc: "Назвати сесію", risk: "low" },
      { cmd: "/branch", desc: "Відгалуження розмови для альтернативного підходу", risk: "low" },
      { cmd: "/rewind", desc: "Відкат коду й/або розмови до чекпоінту; `Esc Esc` (аліаси `/checkpoint`, `/undo`). Не бачить змін від команд оболонки", risk: "medium" },
      { cmd: "/export [файл]", desc: "Експорт розмови як тексту", risk: "low" },
      { cmd: "/copy", desc: "Скопіювати останню відповідь", risk: "low" }
    ] },
    { title: "Код і review", rows: [
      { cmd: "/diff", desc: "Перегляд змін у робочій копії", risk: "low" },
      { cmd: "/code-review [рівень]", desc: "Review на баги (аліас `/review`); `ultra` — у хмарі", risk: "low" },
      { cmd: "/code-review --fix", desc: "Review з автоматичним застосуванням виправлень", risk: "medium" },
      { cmd: "/security-review", desc: "Вразливості в змінах гілки (потрібен `origin`)", risk: "low" },
      { cmd: "/simplify", desc: "Повтори й зайва складність — і виправлення", risk: "medium" },
      { cmd: "/verify", desc: "Зібрати, запустити застосунок і перевірити зміну", risk: "medium" },
      { cmd: "/run", desc: "Запустити і «поводити» застосунок", risk: "medium" }
    ] },
    { title: "Модель і налаштування", rows: [
      { cmd: "/model [аліас]", desc: "Змінити модель: `sonnet`, `opus`, `haiku`, `fable`", risk: "low" },
      { cmd: "/effort <рівень>", desc: "Рівень зусиль: `low` … `xhigh`, `max`, `auto`", risk: "low" },
      { cmd: "/fast", desc: "Швидкий режим (якщо доступний)", risk: "low" },
      { cmd: "/usage", desc: "Витрати й ліміти (аліаси `/cost`, `/stats`)", risk: "low" },
      { cmd: "/config", desc: "Налаштування (аліас `/settings`); Editor mode замість видаленого `/vim`", risk: "medium" },
      { cmd: "/theme", desc: "Колірна тема", risk: "low" },
      { cmd: "/statusline", desc: "Рядок стану", risk: "medium" },
      { cmd: "/terminal-setup", desc: "Клавіші для нового рядка у вводі", risk: "medium" },
      { cmd: "/keybindings", desc: "Файл клавіатурних скорочень", risk: "low" },
      { cmd: "/release-notes", desc: "Що змінилося у версіях", risk: "low" }
    ] },
    { title: "Розширення", rows: [
      { cmd: "/mcp", desc: "Стан MCP-серверів; `reconnect`, `enable`, `disable`", risk: "low" },
      { cmd: "/mcp__<сервер>__<промпт>", desc: "Команди, які експортує MCP-сервер", risk: "low" },
      { cmd: "/skills", desc: "Доступні skills", risk: "low" },
      { cmd: "/reload-skills", desc: "Підхопити нові skills без перезапуску", risk: "low" },
      { cmd: ".claude/skills/<назва>/SKILL.md", desc: "Власна команда `/<назва>` для проєкту", risk: "medium" },
      { cmd: "/agents", desc: "Субагенти (`.claude/agents/`)", risk: "low" },
      { cmd: "/hooks", desc: "Налаштовані hooks — автоматичні команди на події", risk: "low" },
      { cmd: "/plugin", desc: "Plugins: встановлення, увімкнення — лише довірені", risk: "medium" }
    ] },
    { title: "Фон і хмара", rows: [
      { cmd: "/background", desc: "Сесію у фон (аліас `/bg`)", risk: "medium" },
      { cmd: "/fork <завдання>", desc: "Фонова копія розмови, ти лишаєшся тут", risk: "medium" },
      { cmd: "/tasks", desc: "Фонова робота сесії (аліас `/bashes`)", risk: "low" },
      { cmd: "/stop", desc: "Зупинити фонову сесію (історія й worktree лишаються)", risk: "medium" },
      { cmd: "/loop [інтервал] <промпт>", desc: "Повторювати промпт, поки сесія відкрита", risk: "medium" },
      { cmd: "/batch <інструкція>", desc: "Велика зміна паралельними агентами у worktree", risk: "medium" },
      { cmd: "/schedule", desc: "Хмарні routines за розкладом (аліас `/routines`)", risk: "medium" },
      { cmd: "/teleport", desc: "Хмарну сесію — в термінал (аліас `/tp`)", risk: "low" },
      { cmd: "/remote-control", desc: "Керувати локальною сесією з claude.ai (аліас `/rc`)", risk: "medium" },
      { cmd: "/autofix-pr", desc: "Хмарна сесія, що пушить виправлення в PR", risk: "medium" }
    ] }
  ]
};
