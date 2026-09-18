window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m07", order: 7, title: "Фонові агенти і хмара", subtitle: "/background, /fork, /tasks, /batch, /loop, /schedule, /teleport", icon: "cloud",
  goal: "Після модуля ти відправляєш довгу задачу у фон, стежиш за фоновою роботою, розумієш різницю між /fork, /branch і субагентом і знаєш, які команди запускають роботу в хмарі.",
  lessons: [
    {
      id: "m07-l01", title: "Робота у фоні й паралельно", minutes: 12,
      steps: [
        { type: "story", title: "Термінал зайнятий на годину",
          body: "<p>Міграція тестів займе годину, а тобі тим часом треба поправити дрібний баг. Чекати не обов'язково: сесію можна відправити у фон, скопіювати в паралельну або доручити роботу хмарі.</p><p>Чим більше агентів працює одночасно, тим важливіше знати, де хто і що змінює.</p>" },
        { type: "concept", title: "Фон, копія, хмара",
          body: "<ul><li><code>/background</code> — від'єднати поточну сесію у фон і звільнити термінал.</li><li><code>/fork</code> — скопіювати розмову в нову фонову сесію, а самому працювати далі тут.</li><li><code>/tasks</code> — фонова робота поточної сесії; <code>claude agents</code> — усі фонові сесії.</li><li><code>/schedule</code>, <code>/autofix-pr</code>, <code>/teleport</code> — робота в хмарних сесіях.</li></ul>",
          analogy: "`/background` — як поставити пральку і піти готувати: вона працює сама, а ти періодично заглядаєш. `/fork` — як дати копію рецепта сусіду: він готує свою версію, ти — свою." },
        { type: "cli", title: "Команди фону",
          commands: [
            { cmd: "/background", explain: "Від'єднати сесію як фоновий агент (аліас <code>/bg</code>). Стежити — <code>claude agents</code>.", risk: "medium" },
            { cmd: "/fork migrate tests to vitest", explain: "Копія розмови у фоні одразу береться за вказане завдання; правки зазвичай робить у власному worktree.", risk: "medium" },
            { cmd: "/tasks", explain: "Фонова робота поточної сесії, зокрема завершені субагенти (аліас <code>/bashes</code>).", risk: "low" },
            { cmd: "/stop", explain: "Зупинити фонову сесію, до якої ти підключений; історія й worktree лишаються.", risk: "medium" },
            { cmd: "/loop 5m check if the deploy finished", explain: "Повторювати промпт з інтервалом, поки сесія відкрита.", risk: "medium" },
            { cmd: "/batch migrate all API calls to the new client", explain: "Розбити велику зміну на незалежні частини й виконати паралельно фоновими агентами в окремих worktree; спершу показує план.", risk: "medium" }
          ] },
        { type: "terminal", title: "Спробуй: звільни термінал",
          task: "Агент почав довгу міграцію. Від'єднай поточну сесію у фон, щоб звільнити термінал.",
          expected: ["/background", "/bg"],
          output: "✓ Session detached — running in background\n  Monitor: claude agents",
          hint: "Англійське «фон» або його коротка форма з двох літер.",
          explain: "Сесія працює далі без терміналу. Повернутися до неї — через `claude agents`." },
        { type: "check", title: "Копія чи фон",
          question: "Ти хочеш, щоб одна копія агента писала тести у фоні, а ти в цій самій розмові продовжив рефакторинг. Яка команда?",
          options: ["`/fork` з описом завдання для копії", "`/background`", "`/clear`"],
          correct: 0, feedback: "`/background` від'єднує саму поточну сесію. `/fork` залишає тебе тут і створює фонову копію." },
        { type: "terminal", title: "Спробуй: що працює у фоні",
          task: "Перевір, яка фонова робота зараз виконується в цій сесії.",
          expected: ["/tasks", "/bashes"],
          output: "Background tasks\n  ● npm run test:watch      running  4m\n  ✓ subagent: audit deps   done",
          hint: "Англійське «задачі».",
          explain: "Видно запущені процеси й завершених субагентів. Зайве можна зупинити з цього ж меню." },
        { type: "callout", variant: "warning", title: "Багато агентів — багато змін",
          body: "<p>Кожен фоновий агент змінює файли і може запускати команди, поки ти не дивишся. <code>/batch</code> і <code>/autofix-pr</code> можуть створювати гілки, комітити й пушити в PR.</p><p>Перед запуском переконайся, що режим дозволів і правила <code>deny</code> налаштовані, а після — переглядай зміни кожного агента (<code>/diff</code>, <code>git diff</code>) перед злиттям.</p>" },
        { type: "check", title: "Хмара",
          question: "Яка команда створює задачу за розкладом, що виконується в хмарі навіть коли твій ноутбук вимкнено?",
          options: ["`/loop`", "`/tasks`", "`/schedule`"],
          correct: 2, feedback: "`/loop` повторює промпт, лише поки відкрита локальна сесія. `/schedule` (аліас `/routines`) керує хмарними routines." },
        { type: "check", title: "Хмарну сесію — сюди",
          question: "Ти почав задачу в Claude Code on the web і хочеш продовжити її у своєму терміналі. Яка команда?",
          options: ["`/remote-control`", "`/teleport`", "`/desktop`"],
          correct: 1, feedback: "`/teleport` (аліас `/tp`) підтягує хмарну сесію з гілкою й розмовою. `/remote-control` — навпаки, відкриває локальну сесію для керування з claude.ai." },
        { type: "summary", title: "Підсумок",
          points: ["`/background` — сесію у фон; `/fork` — фонова копія, ти лишаєшся тут.", "`/tasks` — фонова робота сесії; `claude agents` — усі фонові сесії; `/stop` — зупинити.", "`/loop` — повтор локально; `/schedule` — хмарні routines; `/teleport` — хмарну сесію в термінал.", "Кожен фоновий агент змінює файли — переглядай його зміни перед злиттям."] }
      ],
      glossary: [
        { term: "Фонова сесія", def: "Сесія Claude Code, що працює без приєднаного терміналу." },
        { term: "Worktree", def: "Додаткова робоча копія репозиторію Git в окремій папці, де агент працює, не заважаючи тобі." },
        { term: "Routine", def: "Хмарна задача Claude Code за розкладом, що створюється через `/schedule`." },
        { term: "Agent view", def: "Екран `claude agents` для перегляду і керування фоновими сесіями." }
      ],
      quiz: [
        { question: "Що робить `/bg`?", options: ["Змінює колір фону", "Від'єднує поточну сесію у фон — це аліас `/background`", "Показує фонові задачі"], correct: 1, feedback: "Фонові задачі — `/tasks`, колір рядка — `/color`." },
        { question: "Як побачити всі фонові сесії з терміналу?", options: ["`claude agents`", "`claude --bg`", "`ps claude`"], correct: 0, feedback: "Agent view показує фонові сесії і дає до них підключитися." },
        { question: "Чим `/loop` відрізняється від `/schedule`?", options: ["Нічим", "`/loop` працює в хмарі", "`/loop` повторює промпт у відкритій локальній сесії, `/schedule` створює хмарні routines"], correct: 2, feedback: "Закрив термінал — `/loop` зупинився; routine в хмарі працює далі." },
        { question: "Що важливо зробити після роботи кількох фонових агентів?", options: ["Переглянути зміни кожного перед злиттям", "Одразу `git push --force`", "`/clear` у всіх сесіях"], correct: 0, feedback: "Фонові агенти працюють без твого нагляду — перевірка обов'язкова." },
        { question: "Навіщо `/batch` запускає агентів в окремих worktree?", options: ["Так дешевше", "Щоб паралельні зміни не заважали одна одній і твоїй робочій копії", "Бо так вимагає GitHub"], correct: 1, feedback: "Кожен агент працює у своїй копії репозиторію." },
        { question: "`/stop` у фоновій сесії…", options: ["видаляє worktree і всю історію", "перезавантажує комп'ютер", "зупиняє сесію, але зберігає історію і worktree"], correct: 2, feedback: "Щоб від'єднатися без зупинки, використовують `/exit`." }
      ]
    }
  ]
});
