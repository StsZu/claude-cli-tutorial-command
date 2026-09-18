window.CLI_COURSE = window.CLI_COURSE || { modules: [], exam: null, cheatsheet: null };
window.CLI_COURSE.modules.push({
  id: "m04", order: 4, title: "Код і review", subtitle: "/diff, /code-review, /simplify, /security-review, /verify", icon: "code",
  goal: "Після модуля ти переглядаєш усі зміни агента перед комітом, запускаєш review на баги, безпеку й чистоту коду і перевіряєш, що зміна реально працює, а не лише проходить тести.",
  lessons: [
    {
      id: "m04-l01", title: "Перевір, перш ніж комітити", minutes: 12,
      steps: [
        { type: "story", title: "«Готово!» — ще не готово",
          body: "<p>Агент каже «виправлено», тести зелені — але чи зроблено саме те, що треба? Чи не зачепив він сусідній модуль? Чи не з'явилася SQL-ін'єкція?</p><p>Claude Code має вбудовані команди для перевірки: від перегляду змін до окремих review на баги й безпеку.</p>" },
        { type: "concept", title: "Три рівні перевірки",
          body: "<ol><li><strong>Подивитись</strong>: <code>/diff</code> — що саме змінилось.</li><li><strong>Проаналізувати</strong>: <code>/code-review</code> — баги; <code>/security-review</code> — вразливості; <code>/simplify</code> — чистота коду.</li><li><strong>Запустити</strong>: <code>/verify</code> — зібрати й запустити застосунок і переконатися, що зміна працює.</li></ol>",
          analogy: "Як приймання ремонту: спершу обходиш кімнати й дивишся (`/diff`), потім кличеш електрика перевірити проводку (`/security-review`), а наостанок вмикаєш світло в кожній кімнаті (`/verify`)." },
        { type: "cli", title: "Команди перевірки",
          commands: [
            { cmd: "/diff", explain: "Інтерактивний перегляд змін у робочій копії, зокрема правок Claude по кожному кроку.", risk: "low" },
            { cmd: "/code-review", explain: "Review поточних змін на помилки коректності. Рівень глибини — аргументом: <code>/code-review high</code> (аліас <code>/review</code>).", risk: "low" },
            { cmd: "/code-review --fix", explain: "Те саме, але одразу застосувати знайдені виправлення до файлів.", risk: "medium" },
            { cmd: "/security-review", explain: "Аналіз змін гілки на вразливості: ін'єкції, автентифікація, витік даних. Потрібен remote <code>origin</code>.", risk: "low" },
            { cmd: "/simplify", explain: "Пошук повторів, зайвої складності й неефективності та їх виправлення. Баги не шукає.", risk: "medium" },
            { cmd: "/verify", explain: "Зібрати, запустити застосунок і перевірити результат, а не лише тести.", risk: "medium" }
          ] },
        { type: "terminal", title: "Спробуй: що змінилось",
          task: "Агент закінчив правки. Перш ніж щось комітити, переглянь усі зміни в робочій копії.",
          expected: ["/diff"],
          output: " src/auth.js      | 12 ++++++----\n tests/auth.test  |  8 ++++++++\n 2 files changed",
          hint: "Та сама назва, що й у git-команди для різниці.",
          explain: "Два файли — очікувано. Якби тут був `.env` чи чужий модуль — це привід розібратися до коміту." },
        { type: "check", title: "Яка команда",
          question: "Ти додав форму логіну і хочеш перевірити саме безпеку: ін'єкції, обхід автентифікації. Яка команда?",
          options: ["`/simplify`", "`/diff`", "`/security-review`"],
          correct: 2, feedback: "`/simplify` дбає про чистоту коду, `/diff` лише показує зміни. Вразливості — робота `/security-review`." },
        { type: "terminal", title: "Спробуй: глибокий review",
          task: "Запусти review поточних змін на баги з рівнем глибини `high`.",
          expected: ["/code-review high", "/review high"],
          output: "Reviewing 2 changed files (high)…\n  ⚠ src/auth.js:42  token expiry compared as string\n  1 finding",
          hint: "Команда review, пробіл, рівень.",
          explain: "Review знайшов порівняння дат як рядків. Виправити можна вручну або повторити з `--fix`." },
        { type: "check", title: "Тести зелені",
          question: "Усі тести проходять, але ти сумніваєшся, що кнопка в застосунку справді працює. Що допоможе?",
          options: ["`/verify` — зібрати, запустити застосунок і перевірити поведінку", "`/compact`", "`/security-review`"],
          correct: 0, feedback: "`/verify` перевіряє реальну роботу застосунку, а не лише тести й типи." },
        { type: "callout", variant: "tip", title: "Хмарний review",
          body: "<p><code>/code-review ultra</code> (раніше <code>/ultrareview</code>) запускає глибокий багатоагентний review у хмарі. Кількість безкоштовних запусків обмежена, далі — з кредитами використання; умови залежать від плану.</p>" },
        { type: "check", title: "--fix",
          question: "Чим `/code-review --fix` відрізняється від `/code-review`?",
          options: ["Нічим", "Одразу застосовує виправлення до файлів — після нього знову переглянь `/diff`", "Надсилає код в Anthropic на ручну перевірку"],
          correct: 1, feedback: "`--fix` змінює файли, тому ризик вищий. Переглянь результат перед комітом." },
        { type: "summary", title: "Підсумок",
          points: ["`/diff` — завжди перед комітом.", "`/code-review [рівень]` — баги; `--fix` застосовує виправлення.", "`/security-review` — вразливості; `/simplify` — чистота коду, не баги.", "`/verify` — перевірка реальної роботи застосунку."] }
      ],
      glossary: [
        { term: "Code review", def: "Перевірка змін коду на помилки перед злиттям." },
        { term: "Diff", def: "Різниця між попереднім і поточним станом файлів." },
        { term: "Remote `origin`", def: "Основний віддалений репозиторій Git, з яким порівнює `/security-review`." },
        { term: "Bundled skill", def: "Вбудована в Claude Code навичка, що запускається як slash-команда, наприклад `/verify`." }
      ],
      quiz: [
        { question: "Що з цього варто зробити першим після того, як агент сказав «готово»?", options: ["`git push`", "`/diff` — подивитися, що змінилось", "`/clear`"], correct: 1, feedback: "Спершу подивись на зміни — далі review, перевірка, коміт." },
        { question: "`/simplify` не знайшов проблем. Чи означає це, що в коді немає багів?", options: ["Ні: `/simplify` шукає повтори й зайву складність, а баги — `/code-review`", "Так", "Так, якщо тести зелені"], correct: 0, feedback: "У кожної команди своя зона відповідальності." },
        { question: "`/security-review` завершується помилкою `ambiguous argument`. Найімовірніша причина?", options: ["Закінчились кредити", "Неправильна модель", "У репозиторії немає remote `origin` або його основної гілки"], correct: 2, feedback: "Команда порівнює гілку з основною гілкою `origin`." },
        { question: "Чому `/verify` має ризик «середній»?", options: ["Він видаляє тести", "Він публікує код", "Він збирає й запускає твій застосунок, а це реальні дії в системі"], correct: 2, feedback: "Запуск застосунку може писати файли, займати порти, звертатися до мережі." },
        { question: "`/review` у новіших версіях — це…", options: ["аліас `/code-review`", "видалена команда", "команда для ревізії рахунків"], correct: 0, feedback: "`/review` приймає ті самі рівні й прапорці, що `/code-review`." },
        { question: "Як запустити review з автоматичним застосуванням виправлень?", options: ["`/code-review --apply-all`", "`/code-review --fix`", "`/fix-all`"], correct: 1, feedback: "Прапорець називається `--fix`; решти варіантів не існує." }
      ]
    }
  ]
});
