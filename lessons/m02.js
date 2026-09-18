window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m02", order: 2, title: "Безпека: режими дозволів", subtitle: "Shift+Tab, plan, /permissions, /sandbox, --dangerously-skip-permissions", icon: "shield",
  goal: "Після модуля ти обираєш режим дозволів під задачу, вмикаєш планування перед змінами, задаєш правила allow/ask/deny і розумієш, чому --dangerously-skip-permissions допустимий лише в ізольованому середовищі.",
  lessons: [
    {
      id: "m02-l01", title: "Хто натискає «так»: режими дозволів", minutes: 12,
      steps: [
        { type: "story", title: "Агент питає — ти відповідаєш",
          body: "<p>Коли агент хоче змінити файл чи запустити команду, Claude Code може спитати тебе, а може виконати одразу. Це визначає <strong>режим дозволів</strong> (permission mode).</p><p>Правильний режим — це баланс: занадто багато запитів втомлює, занадто мало — і ти не помітиш, як агент зробив щось зайве.</p>" },
        { type: "concept", title: "Шість режимів",
          body: "<table><thead><tr><th>Режим</th><th>Без запиту</th></tr></thead><tbody><tr><td><code>default</code> (Manual)</td><td>лише читання</td></tr><tr><td><code>acceptEdits</code></td><td>читання, правки файлів, <code>mkdir</code>, <code>mv</code>, <code>cp</code></td></tr><tr><td><code>plan</code></td><td>дослідження; зміни — після схвалення плану</td></tr><tr><td><code>auto</code></td><td>усе, але кожну дію перевіряє модель-класифікатор</td></tr><tr><td><code>dontAsk</code></td><td>лише заздалегідь дозволене, решта — відмова</td></tr><tr><td><code>bypassPermissions</code></td><td>усе, без перевірок</td></tr></tbody></table>",
          analogy: "Режими — як ключі від квартири для майстра. `default`: відчиняєш йому кожні двері сам. `acceptEdits`: даєш ключ від кухні. `plan`: спершу він показує кошторис. `bypassPermissions`: віддаєш усю в'язку і йдеш з дому." },
        { type: "cli", title: "Як перемикати",
          intro: "<p>Під час сесії <span class=\"kbd\">Shift</span>+<span class=\"kbd\">Tab</span> по колу перемикає режими: <code>default</code> → <code>acceptEdits</code> → <code>plan</code> → … Поточний режим видно в рядку стану. Який режим стартовий, залежить від версії й плану — дивись рядок стану.</p>",
          commands: [
            { cmd: "claude --permission-mode plan", explain: "Почати сесію одразу в режимі планування.", risk: "low" },
            { cmd: "claude --permission-mode default", explain: "Почати в режимі Manual: агент питає перед кожною зміною (<code>manual</code> — аліас у новіших версіях).", risk: "medium" },
            { cmd: "claude --permission-mode acceptEdits", explain: "Правки файлів без запитів — зручно, коли ти одразу переглядаєш <code>/diff</code>.", risk: "medium" },
            { cmd: "/plan fix the auth bug", explain: "Увійти в режим планування просто з рядка вводу й одразу дати завдання.", risk: "low" }
          ] },
        { type: "terminal", title: "Спробуй: план перед змінами",
          prompt: "Stas@MacBook-Pro demo %",
          task: "Ти відкриваєш незнайомий проєкт і хочеш, щоб агент спершу лише дослідив його і запропонував план. Запусти Claude Code одразу в режимі планування.",
          expected: ["claude --permission-mode plan", "claude --permission-mode=plan"],
          output: "⏸ plan mode on (shift+tab to cycle)",
          hint: "Прапорець `--permission-mode` зі значенням режиму планування.",
          explain: "У режимі `plan` Claude досліджує код і пропонує план; правки почнуться лише після твого схвалення." },
        { type: "check", title: "Режим під задачу",
          question: "Ти хочеш, щоб агент сам правив файли, а ти переглядав зміни після кожного кроку. Команди оболонки хай усе ж питає. Який режим?",
          options: ["`bypassPermissions`", "`acceptEdits`", "`dontAsk`"],
          correct: 1, feedback: "`acceptEdits` пропускає правки файлів без запиту, а інші команди оболонки — з запитом. `dontAsk` відмовляє у всьому, що не дозволено заздалегідь." },
        { type: "terminal", title: "Спробуй: /plan з завданням",
          task: "Ти вже в сесії. Увійди в режим планування і одразу дай завдання `add rate limiting to the login endpoint`.",
          expected: ["/plan add rate limiting to the login endpoint"],
          output: "⏸ plan mode on\nExploring src/auth/… (read-only)",
          hint: "Назва команди, пробіл, опис завдання.",
          explain: "Команда вмикає планування і передає опис як аргумент. Коли план готовий, ти його схвалюєш або правиш." },
        { type: "check", title: "Що означає auto",
          question: "Чим режим `auto` відрізняється від `bypassPermissions`?",
          options: ["Нічим, це синоніми", "`auto` працює лише в хмарі", "В `auto` кожну дію перевіряє окрема модель-класифікатор і може заблокувати; `bypassPermissions` не перевіряє нічого"],
          correct: 2, feedback: "`auto` зменшує кількість запитів, але лишає фонову перевірку безпеки. Він доступний не на всіх планах і моделях." },
        { type: "summary", title: "Підсумок",
          points: ["Режим дозволів визначає, що агент робить без твого «так».", "`Shift+Tab` перемикає режими в сесії; `--permission-mode` задає стартовий.", "`plan` — дослідити й запропонувати план до змін; `/plan <завдання>` — те саме з рядка вводу.", "`auto` перевіряє дії класифікатором; `bypassPermissions` не перевіряє нічого."] }
      ],
      glossary: [
        { term: "Permission mode", def: "Режим, що визначає, які дії агент виконує без запиту." },
        { term: "Manual (`default`)", def: "Базовий режим: без запиту лише читання, решта — з підтвердженням." },
        { term: "Plan mode", def: "Агент досліджує і пропонує план, зміни — після схвалення." },
        { term: "Класифікатор", def: "Окрема модель, яка в режимі `auto` перевіряє дії агента замість тебе." }
      ],
      quiz: [
        { question: "Ти натиснув `Shift+Tab` двічі з режиму `default`. Де ти, найімовірніше, опинився?", options: ["У режимі `plan`", "У `bypassPermissions`", "Сесія закрилась"], correct: 0, feedback: "Цикл: `default` → `acceptEdits` → `plan`. `bypassPermissions` у циклі лише якщо ввімкнений при запуску." },
        { question: "CI-скрипт має запускати лише `npm test` і читати файли, а все інше — відхиляти без запитів. Який режим?", options: ["`acceptEdits`", "`dontAsk` зі списком дозволених інструментів", "`plan`"], correct: 1, feedback: "`dontAsk` дозволяє лише заздалегідь схвалене, решту тихо відхиляє — те, що треба для скриптів." },
        { question: "Що агент може робити без запиту в режимі `default`?", options: ["Редагувати файли", "Запускати будь-які команди", "Лише читати"], correct: 2, feedback: "Manual — найобережніший інтерактивний режим." },
        { question: "Навіщо режим `plan` на незнайомому проєкті?", options: ["Щоб агент спершу розібрався і показав план, а ти вирішив, чи його виконувати", "Щоб агент працював без інтернету", "Щоб зекономити місце на диску"], correct: 0, feedback: "План — дешевий спосіб помітити хибне розуміння задачі до того, як змінено файли." },
        { question: "Режим `acceptEdits` увімкнено. Агент хоче виконати `git push`. Що станеться?", options: ["Виконає без запиту", "Спитає дозволу: `acceptEdits` пропускає лише правки файлів і прості файлові команди", "Сесія завершиться"], correct: 1, feedback: "Мережеві й інші команди оболонки в `acceptEdits` досі потребують підтвердження." },
        { question: "Як почати сесію одразу в режимі планування?", options: ["`claude --plan-only`", "`claude -p plan`", "`claude --permission-mode plan`"], correct: 2, feedback: "Прапорця `--plan-only` не існує; `-p` — неінтерактивний запуск з промптом." }
      ]
    },
    {
      id: "m02-l02", title: "Правила, пісочниця і небезпечний прапорець", minutes: 13,
      steps: [
        { type: "concept", title: "Правила поверх режиму",
          body: "<p>Режим задає базу, а <strong>правила</strong> уточнюють: <code>allow</code> — виконувати без запиту, <code>ask</code> — завжди питати, <code>deny</code> — заборонити. Наприклад, дозволити <code>Bash(npm test)</code> і заборонити <code>Read(./.env)</code>.</p><p>Правила <code>deny</code> діють у кожному режимі, навіть у <code>bypassPermissions</code>. <strong>Пісочниця</strong> (<code>/sandbox</code>) — інший шар: обмежує, до чого дістане команда оболонки, коли вже запущена.</p>",
          analogy: "Режим — це загальна домовленість з майстром, правила — список на дверях: «у ванну — без питань», «до сейфа — ніколи». Пісочниця — плівка на меблях: навіть якщо щось пішло не так, забрудниться лише вона." },
        { type: "cli", title: "Керування дозволами",
          commands: [
            { cmd: "/permissions", explain: "Діалог правил allow / ask / deny за рівнями (проєкт, користувач), робочі папки (аліас <code>/allowed-tools</code>).", risk: "medium" },
            { cmd: "/sandbox", explain: "Увімкнути або налаштувати пісочницю для команд оболонки (macOS, Linux, WSL2).", risk: "medium" },
            { cmd: "/fewer-permission-prompts", explain: "Аналізує часті read-only команди з історії і пропонує allowlist у <code>.claude/settings.json</code>. Перечитай список, перш ніж погодитись.", risk: "medium" },
            { cmd: "claude --dangerously-skip-permissions", explain: "Те саме, що <code>--permission-mode bypassPermissions</code>: жодних запитів і перевірок. Лише в контейнері чи VM.", risk: "high" }
          ] },
        { type: "terminal", title: "Спробуй: заборони читати .env",
          task: "Ти хочеш додати правило, що забороняє агенту читати файл `.env`. Відкрий діалог правил дозволів.",
          expected: ["/permissions", "/allowed-tools"],
          output: "Permissions\n  Allow  Ask  Deny  Workspace\n  › Add a new rule…",
          hint: "Англійське слово «дозволи».",
          explain: "На вкладці Deny додаєш `Read(./.env)`. Правило збережеться в налаштуваннях і діятиме в усіх режимах." },
        { type: "callout", variant: "danger", title: "--dangerously-skip-permissions: лише в ізоляції",
          body: "<p>З цим прапорцем агент виконує все одразу: <code>rm -rf</code>, <code>git push --force</code>, зміну конфігів, записи в захищені шляхи. Одна хибна дія — і дані зникли без запиту; зміни, зроблені командами оболонки, <code>/rewind</code> не відкотить.</p><p><strong>Безпечна альтернатива:</strong> <code>acceptEdits</code> або <code>auto</code> для щоденної роботи, <code>dontAsk</code> зі списком дозволеного для скриптів. Повна автономія — тільки в контейнері, VM чи dev container без доступу до твоїх ключів і даних.</p>" },
        { type: "check", title: "Коли прапорець доречний",
          question: "Де допустимо запускати `claude --dangerously-skip-permissions`?",
          options: ["В одноразовому контейнері без доступу до твоїх ключів і важливих даних", "На своєму ноутбуці в домашній папці, щоб не натискати «так»", "На продакшн-сервері через SSH"],
          correct: 0, feedback: "Документація прямо обмежує цей режим ізольованими середовищами: контейнер, VM, dev container." },
        { type: "terminal", title: "Спробуй: увімкни пісочницю",
          task: "Ти хочеш менше запитів на команди оболонки, але так, щоб вони не могли дістатися за межі проєкту. Відкрий налаштування пісочниці.",
          expected: ["/sandbox"],
          output: "Sandbox\n  Mode: › auto-allow   regular permissions",
          hint: "Англійське слово «пісочниця».",
          explain: "У режимі auto-allow команди в пісочниці виконуються без запитів, бо їхній доступ до файлів і мережі обмежено. Правила `deny` і `ask` діють і далі." },
        { type: "check", title: "Що переможе",
          question: "У налаштуваннях є правило `deny: Read(./.env)`, а сесію запущено з `--dangerously-skip-permissions`. Чи прочитає агент `.env`?",
          options: ["Так, bypass вимикає всі правила", "Ні, правила `deny` блокують і в `bypassPermissions`", "Лише якщо спитає"],
          correct: 1, feedback: "Правила `deny` діють у кожному режимі. Але це не привід вмикати bypass поза ізоляцією: заборонити все наперед неможливо." },
        { type: "check", title: "root і bypass",
          question: "Ти запускаєш `sudo claude --dangerously-skip-permissions` на Linux. Що станеться?",
          options: ["Агент отримає повні права — так і задумано", "Сесія запуститься в режимі `plan`", "Claude Code відмовиться стартувати: цей режим заборонено під root/sudo"],
          correct: 2, feedback: "Поза розпізнаною пісочницею Claude Code відмовляється від bypass під root: «cannot be used with root/sudo privileges»." },
        { type: "summary", title: "Підсумок",
          points: ["`/permissions` — правила allow / ask / deny; `deny` діє в усіх режимах.", "`/sandbox` обмежує доступ команд оболонки до файлів і мережі.", "`--dangerously-skip-permissions` = `bypassPermissions`: високий ризик, лише контейнер чи VM.", "Для щоденної роботи — `acceptEdits` чи `auto`, для скриптів — `dontAsk` з allowlist."] }
      ],
      glossary: [
        { term: "Правило allow / ask / deny", def: "Уточнення режиму: виконувати без запиту, завжди питати або заборонити конкретний інструмент чи команду." },
        { term: "bypassPermissions", def: "Режим без запитів і перевірок; вмикається `--dangerously-skip-permissions`." },
        { term: "Пісочниця (sandbox)", def: "Обмеження, що не дає командам оболонки дістатися за межі дозволених файлів і мереж." },
        { term: "Ізольоване середовище", def: "Контейнер або VM, де агент не має доступу до твоїх ключів і важливих даних." }
      ],
      quiz: [
        { question: "Агент постійно питає дозволу на `npm test`. Як прибрати саме цей запит, не послаблюючи решту?", options: ["Запустити з `--dangerously-skip-permissions`", "Додати правило allow `Bash(npm test)` через `/permissions`", "Вимкнути пісочницю"], correct: 1, feedback: "Точкове правило краще за зміну всього режиму." },
        { question: "Що таке `--dangerously-skip-permissions`?", options: ["Прапорець, що вмикає `bypassPermissions`: агент діє без запитів і перевірок", "Режим лише для читання", "Прапорець, що вимикає інтернет"], correct: 0, feedback: "Він еквівалентний `--permission-mode bypassPermissions`." },
        { question: "Агент у bypass-режимі виконав `rm -rf src/legacy`. Чи поверне це `/rewind`?", options: ["Так, `/rewind` відкочує все", "Так, але лише протягом 5 хвилин", "Ні: зміни, зроблені командами оболонки, чекпоінти не відстежують"], correct: 2, feedback: "`/rewind` відкочує правки, зроблені інструментами редагування файлів. Від `rm` рятує лише Git або бекап." },
        { question: "Навіщо `/fewer-permission-prompts` пропонує список правил, а не вмикає їх мовчки?", options: ["Щоб ти перевірив, що в allowlist потрапляють лише справді безпечні read-only команди", "Бо так швидше", "Щоб показати рекламу"], correct: 0, feedback: "Кожне правило allow — це дія без запиту. Перечитай список." },
        { question: "Пісочниця і режим `auto` — це…", options: ["одне й те саме", "різні шари: пісочниця обмежує доступ команди, `auto` вирішує, чи питати тебе", "взаємовиключні налаштування"], correct: 1, feedback: "Їх можна поєднувати: класифікатор вирішує, а пісочниця обмежує наслідки." },
        { question: "Колега пропонує додати `\"defaultMode\": \"bypassPermissions\"` у `.claude/settings.json` репозиторію. Що відповісти?", options: ["Чудово, менше запитів для всіх", "Це прискорить CI", "Погана ідея: це послаблює захист для всіх; до того ж з проєктних налаштувань bypass не вмикається, сесія стартує в Manual"], correct: 2, feedback: "Документація ігнорує bypass з проєктних файлів налаштувань саме щоб чужий репозиторій не вимкнув тобі захист." }
      ]
    }
  ]
});
