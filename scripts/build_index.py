#!/usr/bin/env python3
"""ARCHIVE: колись генерував index.html (старий тренажер) з claude_code_slash_commands_uk.md.

Тренажер тепер — courses/claude-code/trainer.html (window.TRAINER) і редагується напряму; index.html —
оболонка курсу, яку генерує scripts/render-index.mjs у hub. Запуск цього скрипта перезаписав би оболонку
застарілим тренажером, тому він нічого не пише.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MD = ROOT / "claude_code_slash_commands_uk.md"
OUT = ROOT / "index.html"

ESSENTIALS = [
    "/init", "/memory", "/plan", "/model", "/effort", "/context", "/compact", "/clear",
    "/diff", "/code-review", "/simplify", "/security-review", "/permissions", "/mcp",
    "/agents", "/skills", "/reload-skills", "/doctor", "/status", "/usage", "/resume",
    "/rewind", "/verify",
]

ALIASES = {
    "/bg": "/background", "/reset": "/clear", "/new": "/clear", "/settings": "/config",
    "/cost": "/usage", "/stats": "/usage", "/quit": "/exit", "/app": "/desktop",
    "/bug": "/feedback", "/share": "/feedback", "/proactive": "/loop",
    "/routines": "/schedule", "/continue": "/resume", "/checkpoint": "/rewind",
    "/undo": "/rewind", "/allowed-tools": "/permissions", "/bashes": "/tasks",
    "/rc": "/remote-control", "/tp": "/teleport", "/ios": "/mobile", "/android": "/mobile",
}

MODULE_RULES = {
    "project": {
        "/init", "/memory", "/permissions", "/allowed-tools", "/mcp", "/agents",
        "/add-dir", "/cd", "/doctor", "/login", "/logout", "/config", "/settings",
        "/ide", "/install-github-app", "/install-slack-app", "/web-setup",
        "/team-onboarding", "/claude-api", "/chrome", "/design-login", "/design-sync",
        "/fewer-permission-prompts", "/hooks", "/plugin", "/powerup", "/passes",
        "/privacy-settings", "/upgrade", "/usage-credits", "/setup-bedrock", "/setup-vertex",
        "/remote-env", "/sandbox", "/vim",
    },
    "context": {
        "/clear", "/reset", "/new", "/compact", "/context", "/resume", "/continue",
        "/branch", "/rewind", "/checkpoint", "/undo", "/export", "/rename", "/recap",
        "/copy", "/btw", "/focus", "/reload-skills", "/reload-plugins", "/help",
        "/exit", "/quit", "/insights", "/release-notes", "/workflows",
    },
    "code": {
        "/diff", "/code-review", "/review", "/simplify", "/security-review", "/verify",
        "/run", "/run-skill-generator", "/autofix-pr", "/ultrareview",
    },
    "agents": {
        "/background", "/bg", "/fork", "/batch", "/goal", "/loop", "/proactive",
        "/schedule", "/routines", "/stop", "/tasks", "/bashes", "/teleport", "/tp",
        "/desktop", "/app", "/remote-control", "/rc", "/ultraplan", "/advisor",
        "/autofix-pr", "/deep-research",
    },
    "settings": {
        "/model", "/effort", "/fast", "/plan", "/color", "/theme", "/tui",
        "/statusline", "/status", "/usage", "/cost", "/stats", "/debug",
        "/terminal-setup", "/scroll-speed", "/voice", "/radio", "/stickers",
        "/mobile", "/ios", "/android",
    },
}

MODULE_META = {
    "essentials": ("Щоденний мінімум", "80/20 набір для реальної роботи з кодом.", "claude — demo-project"),
    "project": ("Проєкт і налаштування", "init, memory, permissions, MCP, інтеграції.", "claude — ~/Projects/demo"),
    "context": ("Сесія і контекст", "clear, compact, resume, rewind, export.", "claude — session"),
    "code": ("Код і review", "diff, code-review, security-review, verify.", "claude — feature/auth"),
    "agents": ("Агенти і фон", "background, fork, batch, teleport, ultraplan.", "claude — bg-agent"),
    "settings": ("Модель і UI", "model, effort, theme, status, usage.", "claude — settings"),
    "extra": ("Додаткові команди", "Решта slash-команд з довідника.", "claude — extra"),
}


def parse_commands() -> list[dict]:
    text = MD.read_text(encoding="utf-8")
    seen: dict[str, dict] = {}
    for line in text.splitlines():
        if not line.startswith("| `/"):
            continue
        parts = [p.strip() for p in line.split("|")]
        if len(parts) < 5:
            continue
        m = re.match(r"`(/[^`]+)`", parts[1])
        if not m:
            continue
        raw = m.group(1)
        cmd = raw.split()[0]
        if cmd in seen:
            continue
        seen[cmd] = {"cmd": cmd, "desc": parts[2], "when": parts[3], "raw": raw}
    return list(seen.values())


def assign_module(cmd: str) -> str:
    if cmd in ESSENTIALS:
        return "essentials"
    for mod, cmds in MODULE_RULES.items():
        if cmd in cmds:
            return mod
    return "extra"


def build_modules(all_cmds: list[dict]) -> dict:
    by_cmd = {c["cmd"]: c for c in all_cmds}
    modules: dict[str, dict] = {}
    for mod_id, (title, intro, term) in MODULE_META.items():
        modules[mod_id] = {
            "id": mod_id,
            "title": title,
            "intro": intro,
            "termTitle": term,
            "commands": [],
        }

    order = ["essentials"] + [k for k in MODULE_META if k != "essentials"]
    assigned = set()
    for mod_id in order:
        if mod_id == "essentials":
            for cmd in ESSENTIALS:
                if cmd in by_cmd:
                    modules[mod_id]["commands"].append(cmd)
                    assigned.add(cmd)
        elif mod_id in MODULE_RULES:
            for cmd in sorted(MODULE_RULES[mod_id]):
                if cmd in by_cmd and cmd not in assigned:
                    modules[mod_id]["commands"].append(cmd)
                    assigned.add(cmd)

    for c in all_cmds:
        if c["cmd"] not in assigned:
            modules["extra"]["commands"].append(c["cmd"])
            assigned.add(c["cmd"])

    # drop empty extra if none
    if not modules["extra"]["commands"]:
        del modules["extra"]

    return modules


def main():
    all_cmds = parse_commands()
    modules = build_modules(all_cmds)
    hints = {c["cmd"]: c["desc"] for c in all_cmds}
    hints.update({
        "welcome": "Тренажер Claude Code slash-команд — емуляція без API.",
        "prompt": "Текст після /команди — аргументи. Натисни / для списку.",
        "unknown": "Немає в емуляторі. Клікни команду зліва або введи /.",
        "module-switch": "Новий розділ — список команд зліва оновився.",
        "module-wrong": "Команда з іншого розділу. Перейди туди зліва.",
        "ctrl-c": "Ctrl+C перериває (у тренажері сесія лишається активною).",
    })
    meta = {c["cmd"]: c["when"] for c in all_cmds}

    data = {
        "modules": modules,
        "hints": hints,
        "meta": meta,
        "aliases": ALIASES,
        "allCommands": [c["cmd"] for c in all_cmds],
    }

    data_json = json.dumps(data, ensure_ascii=False)

    html = HTML_TEMPLATE.replace("__DATA_JSON__", data_json)
    OUT.write_text(html, encoding="utf-8")
    total = sum(len(m["commands"]) for m in modules.values())
    print(f"Wrote {OUT} — {len(modules)} modules, {total} checklist items, {len(all_cmds)} commands")


HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Claude Code Slash Commands — Тренажер</title>
  <style>
    :root {
      --bg: #0f0e0d; --panel: #1a1816; --border: #3d3835; --text: #ece7e1;
      --muted: #9a928a; --green: #6fcf97; --cyan: #7ec8e3; --yellow: #e6c87a;
      --accent: #d97757; --blue: #6eb5ff; --purple: #c4a7e7; --red: #f07178;
      --prompt: #d97757;
      --font: "SF Mono", Menlo, Consolas, monospace;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh;
      background: radial-gradient(1200px 600px at 15% -10%, #3d2a22 0%, var(--bg) 55%);
      color: var(--text); font-family: Inter, system-ui, sans-serif;
    }
    .wrap { max-width: 1100px; margin: 0 auto; padding: 20px; }
    header { margin-bottom: 16px; }
    header h1 { font-size: 1.25rem; margin: 0 0 6px; font-weight: 600; }
    header p { margin: 0; color: var(--muted); font-size: 0.9rem; line-height: 1.5; }
    .layout { display: grid; grid-template-columns: 280px 1fr; gap: 14px; }
    @media (max-width: 860px) { .layout { grid-template-columns: 1fr; } .sidebar { order: 2; } }
    .sidebar, .terminal-wrap {
      background: var(--panel); border: 1px solid var(--border); border-radius: 12px; overflow: hidden;
    }
    .sidebar { padding: 14px; font-size: 0.82rem; }
    .sidebar h2 {
      font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--muted); margin: 0 0 10px;
    }
    .cmd-list { list-style: none; padding: 0; margin: 0 0 16px; max-height: 280px; overflow-y: auto; }
    .cmd-list li {
      padding: 5px 8px; border-radius: 6px; cursor: pointer;
      font-family: var(--font); font-size: 0.76rem;
    }
    .cmd-list li:hover { background: #252220; }
    .cmd-list li.done { color: var(--green); }
    .cmd-list li.done::after { content: " ✓"; }
    .cmd-list code { color: var(--cyan); }
    .progress { height: 6px; background: #252220; border-radius: 99px; overflow: hidden; margin-bottom: 6px; }
    .progress > div {
      height: 100%; background: linear-gradient(90deg, var(--accent), var(--yellow));
      width: 0%; transition: width 0.3s;
    }
    .stats { color: var(--muted); font-size: 0.78rem; }
    .hint-box {
      background: #252220; border-radius: 8px; padding: 10px;
      color: var(--muted); line-height: 1.45; font-size: 0.78rem;
    }
    .module-badge {
      display: inline-block; background: #252220; border: 1px solid var(--border);
      border-radius: 6px; padding: 4px 8px; font-size: 0.78rem;
      color: var(--accent); margin-bottom: 10px; font-family: var(--font);
    }
    .module-nav { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
    .module-nav button { text-align: left; font-family: var(--font); font-size: 0.7rem; }
    .module-nav button.active { border-color: var(--accent); color: var(--accent); }
    .terminal-wrap { display: flex; flex-direction: column; height: 540px; }
    .term-bar {
      display: flex; align-items: center; gap: 8px; padding: 10px 14px;
      border-bottom: 1px solid var(--border); font-size: 0.78rem; color: var(--muted);
    }
    .dots { display: flex; gap: 6px; }
    .dots span { width: 10px; height: 10px; border-radius: 50%; }
    .dots span:nth-child(1) { background: #ff5f57; }
    .dots span:nth-child(2) { background: #febc2e; }
    .dots span:nth-child(3) { background: #28c840; }
    .term-title { flex: 1; text-align: center; font-family: var(--font); }
    .output {
      flex: 1; display: flex; flex-direction: column; padding: 16px;
      min-height: 0; overflow: hidden; font-family: var(--font); font-size: 0.84rem; line-height: 1.55;
    }
    .output-status {
      flex-shrink: 0; color: var(--muted); font-size: 0.75rem;
      padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid var(--border);
    }
    .live-panel { flex: 1; min-height: 0; overflow-y: auto; word-break: break-word; }
    .line-user { color: var(--prompt); }
    .line-muted { color: var(--muted); }
    .line-ok { color: var(--green); }
    .line-warn { color: var(--yellow); }
    .line-err { color: var(--red); }
    .line-cmd { color: var(--cyan); }
    .line-hl { color: var(--blue); }
    .line-uk-hint {
      color: #e6c87a; font-size: 0.82rem; margin-top: 10px; padding-top: 8px;
      border-top: 1px solid rgba(230, 200, 122, 0.25); line-height: 1.5;
    }
    .line-uk-hint.compact { margin-top: 2px; margin-bottom: 8px; padding-top: 0; border-top: none; padding-left: 14px; }
    .result-box {
      margin: 8px 0 12px; padding: 12px 14px; border-radius: 8px;
      border: 1px solid #a85a3a; background: rgba(217, 119, 87, 0.1); border-left: 4px solid var(--accent);
    }
    .result-box.warn { border-color: var(--yellow); background: rgba(230, 200, 122, 0.08); border-left-color: var(--yellow); }
    .result-box.purple { border-color: var(--purple); background: rgba(196, 167, 231, 0.1); border-left-color: var(--purple); }
    .result-title { color: var(--accent); font-weight: 600; margin-bottom: 8px; font-size: 0.82rem; }
    .result-box.warn .result-title { color: var(--yellow); }
    .result-box.purple .result-title { color: var(--purple); }
    .input-row {
      display: flex; align-items: center; gap: 8px; padding: 12px 14px;
      border-top: 1px solid var(--border); background: #0f0e0d;
    }
    .prompt-label { color: var(--prompt); font-family: var(--font); font-size: 0.9rem; white-space: nowrap; }
    #cmdInput {
      flex: 1; background: transparent; border: none; outline: none;
      color: var(--text); font-family: var(--font); font-size: 0.9rem;
    }
    .btn {
      background: #252220; border: 1px solid var(--border); color: var(--text);
      border-radius: 8px; padding: 8px 12px; cursor: pointer; font-size: 0.78rem;
    }
    .btn:hover { background: #302c28; }
    .btn-primary { background: #8b4518; border-color: var(--accent); }
    .btn-primary:hover { background: var(--accent); color: #0f0e0d; }
    .btn-test { background: rgba(230, 200, 122, 0.12); border-color: var(--yellow); color: #e6c87a; }
    .btn-test.active { background: var(--yellow); color: #0f0e0d; }
    .actions { display: flex; flex-direction: column; gap: 8px; }
    .test-question { color: #e6c87a; line-height: 1.6; margin-bottom: 10px; }
    kbd {
      background: #252220; border: 1px solid var(--border); border-radius: 4px;
      padding: 1px 5px; font-family: var(--font); font-size: 0.78rem;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>Claude Code — Slash Commands Trainer</h1>
      <p>
        Інтерактивний тренажер на основі
        <code>claude_code_slash_commands_uk.md</code>.
        Вводь <kbd>/</kbd>-команди, проходь розділи, потім — <strong>режим тестування</strong>.
        <kbd>↑</kbd>/<kbd>↓</kbd> історія · <kbd>Tab</kbd> автодоповнення.
      </p>
    </header>
    <div class="layout">
      <aside class="sidebar">
        <div class="module-badge" id="moduleBadge">Щоденний мінімум</div>
        <h2>Прогрес розділу</h2>
        <div class="progress"><div id="progressBar"></div></div>
        <div class="stats" id="progressText">0 / 0</div>
        <h2>Розділи</h2>
        <div class="module-nav" id="moduleNav"></div>
        <h2>Команди розділу</h2>
        <ul class="cmd-list" id="cmdChecklist"></ul>
        <div class="hint-box">
          <strong>Завдання:</strong> виконай усі команди розділу.<br><br>
          <strong>Підказка:</strong> <code>/</code> — список · аргументи після команди<br>
          <strong>Тест:</strong> «Режим тестування» — вгадай команду за описом
        </div>
        <div class="actions" style="margin-top:14px;">
          <button class="btn btn-test" id="btnTest" type="button">Режим тестування</button>
          <button class="btn btn-primary" id="btnStart">Нова сесія</button>
          <button class="btn" id="btnClear">Очистити</button>
        </div>
      </aside>
      <section class="terminal-wrap">
        <div class="term-bar">
          <div class="dots"><span></span><span></span><span></span></div>
          <div class="term-title" id="termTitle">claude — demo-project</div>
        </div>
        <div class="output" aria-live="polite">
          <div class="output-status" id="outputStatus">claude&gt; · slash commands</div>
          <div class="live-panel" id="livePanel"></div>
        </div>
        <form class="input-row" id="cmdForm" autocomplete="off">
          <span class="prompt-label" id="promptLabel">claude&gt;</span>
          <input id="cmdInput" type="text" spellcheck="false" placeholder="/init, /plan, /status …" autofocus />
        </form>
      </section>
    </div>
  </div>
  <script>
    const DATA = __DATA_JSON__;
    const MODULES = DATA.modules;
    const UK_HINTS = DATA.hints;
    const CMD_META = DATA.meta;
    const ALIASES = DATA.aliases;

    const state = {
      currentModule: "essentials",
      claudeMd: false,
      compacted: false,
      model: "claude-sonnet-4",
      effort: "high",
      history: [], histIdx: -1,
      triedByModule: Object.fromEntries(Object.keys(MODULES).map(k => [k, new Set()])),
      testMode: { active: false, queue: [], index: 0, correct: 0, wrong: 0 }
    };

    const livePanel = document.getElementById("livePanel");
    const outputStatus = document.getElementById("outputStatus");
    const cmdInput = document.getElementById("cmdInput");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const cmdChecklist = document.getElementById("cmdChecklist");
    const moduleBadge = document.getElementById("moduleBadge");
    const moduleNav = document.getElementById("moduleNav");
    const termTitle = document.getElementById("termTitle");
    let viewChunks = [];

    function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
    function getModule() { return MODULES[state.currentModule] || MODULES.essentials; }
    function getCurrentCommands() { return getModule().commands; }
    function getTried() { return state.triedByModule[state.currentModule]; }

    function resolveCmd(cmd) {
      const c = cmd.trim();
      const lower = c.toLowerCase();
      const base = lower.split(/\s+/)[0];
      return ALIASES[base] ? c.replace(/^\S+/, ALIASES[base]) : c;
    }

    function commandBase(cmd) {
      const r = resolveCmd(cmd).trim().toLowerCase();
      return r.split(/\s+/)[0];
    }

    function matchesListed(cmd, listed) {
      const lower = resolveCmd(cmd).trim().toLowerCase();
      const l = listed.toLowerCase();
      if (lower === l) return true;
      const base = commandBase(cmd);
      if (base === l) return true;
      if (lower.startsWith(l + " ")) return true;
      return false;
    }

    function findListed(cmd, list) {
      return list.find(x => matchesListed(cmd, x)) || null;
    }

    function normalizeCmd(raw) {
      const cur = findListed(raw, getCurrentCommands());
      if (cur) return cur;
      for (const mod of Object.values(MODULES)) {
        const ex = findListed(raw, mod.commands);
        if (ex) return ex;
      }
      return commandBase(raw);
    }

    function isInCurrentModule(cmd) { return !!findListed(cmd, getCurrentCommands()); }

    function findModuleForCommand(cmd) {
      for (const [id, mod] of Object.entries(MODULES)) {
        if (findListed(cmd, mod.commands)) return id;
      }
      return null;
    }

    function beginView(cmd) {
      viewChunks = [];
      if (cmd != null) viewChunks.push(`<div class="line-user">claude&gt; ${esc(cmd)}</div>`);
    }
    function print(html, cls = "line-sys") { viewChunks.push(`<div class="${cls}">${html}</div>`); }
    function ukHint(text, compact = false) {
      const c = compact ? "line-uk-hint compact" : "line-uk-hint";
      return `<div class="${c}">${esc(text)}</div>`;
    }
    function printResult(title, body, type = "ok", hint = null) {
      const cls = type === "warn" ? "result-box warn" : type === "purple" ? "result-box purple" : "result-box";
      viewChunks.push(`<div class="${cls}"><div class="result-title">${esc(title)}</div>${body}${hint ? ukHint(hint) : ""}</div>`);
    }
    function flushView(status) {
      livePanel.innerHTML = viewChunks.join("");
      livePanel.scrollTop = 0;
      if (status) outputStatus.textContent = status;
    }

    function markTried(cmd) {
      const norm = findListed(cmd, getCurrentCommands());
      if (norm) { getTried().add(norm); updateProgress(); updateModuleNav(); }
    }

    function updateProgress() {
      const cmds = getCurrentCommands();
      const n = getTried().size;
      moduleBadge.textContent = getModule().title;
      termTitle.textContent = getModule().termTitle;
      progressBar.style.width = cmds.length ? `${(n / cmds.length) * 100}%` : "0%";
      progressText.textContent = `${n} / ${cmds.length} команд`;
      cmdChecklist.querySelectorAll("li").forEach(li => {
        li.classList.toggle("done", getTried().has(li.dataset.cmd));
      });
    }

    function updateModuleNav() {
      moduleNav.innerHTML = Object.values(MODULES).map(mod => {
        const t = state.triedByModule[mod.id];
        const pct = mod.commands.length ? Math.round((t.size / mod.commands.length) * 100) : 0;
        const act = mod.id === state.currentModule ? " active" : "";
        return `<button type="button" class="btn${act}" data-module="${mod.id}">${esc(mod.title)} · ${t.size}/${mod.commands.length} (${pct}%)</button>`;
      }).join("");
      moduleNav.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => switchModule(btn.dataset.module));
      });
    }

    function buildChecklist() {
      cmdChecklist.innerHTML = getCurrentCommands().map(c =>
        `<li data-cmd="${esc(c)}" title="Клік — виконати"><code>${esc(c)}</code></li>`
      ).join("");
      cmdChecklist.querySelectorAll("li").forEach(li => {
        li.addEventListener("click", () => { execute(li.dataset.cmd); cmdInput.value = ""; cmdInput.focus(); });
      });
      updateProgress();
      updateModuleNav();
    }

    function switchModule(id) {
      if (!MODULES[id]) return;
      state.currentModule = id;
      buildChecklist();
      beginView(null);
      const m = getModule();
      printResult(`Розділ: ${m.title}`, `
        <span class="line-muted">${esc(m.intro)}</span><br>
        <span class="line-hl">Команд:</span> ${m.commands.length}
      `, "purple", UK_HINTS["module-switch"]);
      flushView(`claude&gt; · ${m.title}`);
    }

    function welcome() {
      beginView(null);
      print(`<span class="line-muted">Claude Code Slash Commands Trainer (емуляція)</span>`);
      printResult("Почни з щоденного мінімуму", `
        <span class="line-cmd">/init</span> · <span class="line-cmd">/plan</span> · <span class="line-cmd">/permissions</span><br>
        <span class="line-cmd">/diff</span> · <span class="line-cmd">/code-review</span> · <span class="line-cmd">/verify</span>
      `, "ok", UK_HINTS.welcome);
      flushView("claude&gt; · введи /команду");
    }

    function listSlashCommands() {
      print(`<span class="line-hl">Slash commands (${esc(getModule().title)}):</span>`);
      getCurrentCommands().forEach(c => {
        print(`  <span class="line-cmd">${esc(c.padEnd(22))}</span> <span class="line-muted">${esc((CMD_META[c] || "").slice(0, 60))}</span>`);
        if (UK_HINTS[c]) print(ukHint(UK_HINTS[c], true));
      });
    }

    function emulateSlash(cmd) {
      const resolved = resolveCmd(cmd);
      const base = commandBase(cmd);
      const arg = resolved.slice(base.length).trim();
      const listed = normalizeCmd(cmd);
      const hint = UK_HINTS[listed] || UK_HINTS[base];
      const when = CMD_META[listed] || CMD_META[base] || "";

      const outputs = {
        "/init": () => {
          state.claudeMd = true;
          return `<span class="line-ok">✓ CLAUDE.md scaffold created</span><br><span class="line-muted">Project guide ready — edit and commit.</span>`;
        },
        "/memory": () => `<span class="line-ok">✓ Memory editor opened</span> · CLAUDE.md, auto-memory, entries`,
        "/plan": () => `<span class="line-ok">● Plan mode active</span>${arg ? `<br><span class="line-muted">Task: ${esc(arg)}</span>` : ""}<br><span class="line-muted">Claude explores before editing code.</span>`,
        "/compact": () => { state.compacted = true; return `<span class="line-ok">✓ Conversation summarized</span>${arg ? ` · keep: ${esc(arg)}` : ""}`; },
        "/clear": () => { state.compacted = false; return `<span class="line-ok">✓ New conversation — context cleared</span><br><span class="line-muted">Previous session saved → /resume</span>`; },
        "/status": () => `<span class="line-hl">Version</span> 2.1.x (emulator)<br><span class="line-hl">Model</span> ${state.model}<br><span class="line-hl">CLAUDE.md</span> ${state.claudeMd ? "present" : "missing — /init"}`,
        "/permissions": () => `<span class="line-ok">● Permissions browser</span> · allow / ask / deny rules for tools`,
        "/mcp": () => `<span class="line-ok">● MCP servers</span> · filesystem, github (demo)`,
        "/diff": () => `<span class="line-ok">● Interactive diff viewer</span> · uncommitted + per-turn changes`,
        "/code-review": () => `<span class="line-ok">✓ Code review started</span>${arg ? ` · level: ${esc(arg)}` : ""}`,
        "/verify": () => `<span class="line-ok">✓ Verify skill</span> · build, run app, observe result`,
        "/resume": () => `<span class="line-ok">● Session picker</span> · restore previous conversation`,
        "/rewind": () => `<span class="line-ok">✓ Rewind to checkpoint</span> · conversation and/or code`,
        "/background": () => `<span class="line-ok">✓ Detached as background agent</span>${arg ? `<br>${esc(arg)}` : ""}`,
        "/doctor": () => `<span class="line-ok">✓ Installation diagnostics</span> · auth, permissions, runtime`,
        "/model": () => `<span class="line-ok">● ${state.model}</span> ← active<br><span class="line-muted">○ claude-opus-4 · ○ claude-haiku-4</span>`,
        "/usage": () => `<span class="line-ok">Session cost & plan limits</span> · skills/MCP breakdown on paid plans`,
      };

      const fn = outputs[base];
      const body = fn ? fn() : `<span class="line-ok">✓ ${esc(when || UK_HINTS[base] || "Command executed")}</span><br><span class="line-muted">Emulated per Claude Code docs.</span>`;
      const title = arg ? `${base} ${arg}` : base;
      printResult(title, body, "ok", hint);
      return true;
    }

    function handleSlash(cmd) {
      if (!cmd.startsWith("/")) return false;

      if (!isInCurrentModule(cmd)) {
        const owner = findModuleForCommand(cmd);
        if (owner && owner !== state.currentModule) {
          print(`<span class="line-warn">⚠ «${esc(cmd)}» — розділ «${esc(MODULES[owner].title)}» (прогрес не зарахується)</span>`);
        }
      }

      if (cmd === "/" || cmd === "/help") {
        listSlashCommands();
        return "/";
      }

      const base = commandBase(cmd);
      if (UK_HINTS[base] || ALIASES[base] || findListed(cmd, DATA.allCommands)) {
        emulateSlash(cmd);
        return normalizeCmd(cmd);
      }

      printResult("Невідома команда", `<span class="line-muted">«${esc(cmd)}» — ${UK_HINTS.unknown}</span>`, "warn");
      return false;
    }

    function execute(raw) {
      const cmd = raw.trim();
      if (!cmd) return;
      if (state.testMode.active) { handleTestAnswer(cmd); return; }

      state.history.push(cmd);
      state.histIdx = state.history.length;
      beginView(cmd);

      if (cmd.startsWith("/")) {
        const result = handleSlash(cmd);
        flushView(`claude&gt; · ${getModule().title} · ${cmd}`);
        if (result !== false) markTried(typeof result === "string" ? result : cmd);
        return;
      }

      printResult("Промпт", `
        <span class="line-ok">✓ «${esc(cmd)}»</span><br>
        <span class="line-muted">AI-відповідь не емулюється — тренуй slash-команди.</span>
      `, "ok", UK_HINTS.prompt);
      flushView(`claude&gt; · prompt`);
    }

    function shuffleArray(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function buildTestQueue() {
      const seen = new Set(), items = [];
      for (const mod of Object.values(MODULES)) {
        for (const c of mod.commands) {
          if (!seen.has(c) && UK_HINTS[c] && !c.includes("pr-comments") && c !== "/vim") {
            seen.add(c);
            items.push({ cmd: c, hint: UK_HINTS[c] });
          }
        }
      }
      return shuffleArray(items);
    }

    function updateTestButton() {
      const btn = document.getElementById("btnTest");
      btn.textContent = state.testMode.active ? "Зупинити тест" : "Режим тестування";
      btn.classList.toggle("active", state.testMode.active);
    }

    function showTestQuestion() {
      const tm = state.testMode;
      const q = tm.queue[tm.index];
      if (!q) { finishTestMode(); return; }
      beginView(null);
      printResult(`Питання ${tm.index + 1} / ${tm.queue.length}`, `
        <div class="test-question">${esc(q.hint)}</div>
        <span class="line-hl">Яка slash-команда?</span><br>
        <span class="line-muted">Введи, напр. <span class="line-cmd">/init</span></span>
      `, "purple");
      flushView(`test&gt; · ${tm.index + 1}/${tm.queue.length}`);
      cmdInput.placeholder = "Введи /команду…";
      cmdInput.focus();
    }

    function startTestMode() {
      state.testMode = { active: true, queue: buildTestQueue(), index: 0, correct: 0, wrong: 0 };
      updateTestButton();
      showTestQuestion();
    }

    function stopTestMode() {
      if (!state.testMode.active) return;
      state.testMode.active = false;
      updateTestButton();
      cmdInput.placeholder = "/init, /plan, /status …";
      beginView(null);
      printResult("Тест зупинено", `<span class="line-ok">✓ ${state.testMode.correct}</span> · <span class="line-err">✗ ${state.testMode.wrong}</span>`, "warn");
      flushView("claude&gt; · тест зупинено");
    }

    function finishTestMode() {
      const tm = state.testMode;
      const total = tm.queue.length;
      const pct = total ? Math.round((tm.correct / total) * 100) : 0;
      tm.active = false;
      updateTestButton();
      cmdInput.placeholder = "/init, /plan, /status …";
      beginView(null);
      printResult("Тест завершено!", `
        <span class="line-ok">✓ ${tm.correct} / ${total}</span> · <span class="line-err">✗ ${tm.wrong}</span><br>
        <span class="line-hl">Результат: ${pct}%</span>
      `, pct >= 70 ? "ok" : "warn");
      flushView(`claude&gt; · тест ${pct}%`);
    }

    function handleTestAnswer(raw) {
      const cmd = raw.trim();
      if (!cmd) return;
      const tm = state.testMode;
      const q = tm.queue[tm.index];
      beginView(cmd);
      const expected = q.cmd.toLowerCase();
      const got = normalizeCmd(cmd).toLowerCase();
      const aliasOk = ALIASES[cmd.split(/\s+/)[0].toLowerCase()] === q.cmd;
      if (got === expected || cmd.toLowerCase() === expected || aliasOk) {
        tm.correct++;
        printResult("Правильно!", `<span class="line-ok">✓ ${esc(q.cmd)}</span>`, "ok");
        tm.index++;
        setTimeout(showTestQuestion, 400);
      } else {
        tm.wrong++;
        printResult("Неправильно", `
          <span class="line-err">✗ ${esc(cmd)}</span><br>
          <span class="line-ok">Правильно: ${esc(q.cmd)}</span>
        `, "warn");
      }
      flushView(`test&gt; · ${tm.correct}/${tm.queue.length}`);
    }

    function getCompletions() {
      const vals = [];
      for (const mod of Object.values(MODULES)) vals.push(...mod.commands);
      return [...new Set([...vals, "/", "/help"])];
    }

    document.getElementById("cmdForm").addEventListener("submit", e => {
      e.preventDefault();
      execute(cmdInput.value);
      cmdInput.value = "";
    });

    cmdInput.addEventListener("keydown", e => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (state.history.length) {
          state.histIdx = Math.max(0, state.histIdx - 1);
          cmdInput.value = state.history[state.histIdx] || "";
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (state.histIdx < state.history.length - 1) {
          state.histIdx++;
          cmdInput.value = state.history[state.histIdx] || "";
        } else { state.histIdx = state.history.length; cmdInput.value = ""; }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const val = cmdInput.value;
        const match = getCompletions().find(c => c.startsWith(val) && c !== val);
        if (match) cmdInput.value = match;
      } else if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        beginView(null);
        print(`<span class="line-muted">^C — interrupted</span>`);
        print(ukHint(UK_HINTS["ctrl-c"]));
        flushView("claude&gt; · interrupted");
      }
    });

    document.getElementById("btnTest").addEventListener("click", () => {
      state.testMode.active ? stopTestMode() : startTestMode();
    });
    document.getElementById("btnStart").addEventListener("click", () => {
      if (state.testMode.active) stopTestMode();
      Object.keys(state.triedByModule).forEach(k => state.triedByModule[k].clear());
      state.currentModule = "essentials";
      state.claudeMd = false;
      state.compacted = false;
      welcome();
      buildChecklist();
      cmdInput.focus();
    });
    document.getElementById("btnClear").addEventListener("click", () => { welcome(); buildChecklist(); });

    welcome();
    buildChecklist();
  </script>
</body>
</html>
"""


if __name__ == "__main__":
    raise SystemExit("build_index.py — архів: тренажер тепер у trainer.html, index.html генерує scripts/render-index.mjs (див. docstring).")