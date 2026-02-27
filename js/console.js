/* ═══════════════════════════════════════════════════════════════
   console.js — Hidden terminal easter egg
   Trigger: backtick key  OR  window.RayyanNet.console()
   Also seeds DevTools console message on load
═══════════════════════════════════════════════════════════════ */

const RayyanConsole = (() => {

  const _overlay  = document.getElementById('console-overlay');
  const _output   = document.getElementById('console-output');
  const _input    = document.getElementById('console-input');
  const _closeBtn = document.getElementById('console-close');

  let _open       = false;
  let _history    = [];
  let _histIdx    = -1;

  /* ── Command definitions ──────────────────────────────── */
  const _commands = {

    help: () => [
      { t: 'cyan',  v: 'AVAILABLE COMMANDS:' },
      { t: '',      v: '  whoami          — operator identity' },
      { t: '',      v: '  ls              — list available modules' },
      { t: '',      v: '  ls skills/      — technical skill stack' },
      { t: '',      v: '  cat about.txt   — full profile' },
      { t: '',      v: '  cat experience  — work history' },
      { t: '',      v: '  ping rayyan     — connection test' },
      { t: '',      v: '  ssh rayyan@career — attempt connection' },
      { t: '',      v: '  uptime          — system status' },
      { t: '',      v: '  ifconfig        — network interfaces' },
      { t: '',      v: '  clear           — clear terminal' },
      { t: '',      v: '  exit            — close console' },
      { t: 'blank', v: '' },
    ],

    whoami: () => [
      { t: 'blank', v: '' },
      { t: 'cyan',  v: 'OPERATOR: RAYYAN UMAIR' },
      { t: '',      v: 'ROLE:     IT Support Technician | Cybersecurity Analyst' },
      { t: '',      v: 'NODE:     Oshawa, ON, Canada' },
      { t: '',      v: 'SCHOOL:   Ontario Tech University — B.IT (Information Security)' },
      { t: '',      v: 'PREV:     Oulton College — Diploma, Systems Management & Cybersecurity' },
      { t: '',      v: 'GPA:      3.9 · Graduated with Honors' },
      { t: '',      v: 'SHELL:    /bin/ambition' },
      { t: 'blank', v: '' },
    ],

    'ls': () => [
      { t: 'blank', v: '' },
      { t: 'cyan',  v: 'drwxr-xr-x  profile/' },
      { t: 'cyan',  v: 'drwxr-xr-x  experience/' },
      { t: 'cyan',  v: 'drwxr-xr-x  projects/' },
      { t: 'cyan',  v: 'drwxr-xr-x  certifications/' },
      { t: 'cyan',  v: 'drwxr-xr-x  contact/' },
      { t: '',      v: '-rw-r--r--  Rayyan_Umair_Resume.pdf' },
      { t: '',      v: '-rw-r--r--  about.txt' },
      { t: 'blank', v: '' },
    ],

    'ls skills/': () => [
      { t: 'blank', v: '' },
      { t: 'cyan',  v: '// SUPPORT & OPERATIONS' },
      { t: 'green', v: '  ● Tier 1 & Tier 2 IT Support          [████████████░░░] 92%' },
      { t: 'green', v: '  ● Ticketing Systems & Documentation    [███████████░░░░] 90%' },
      { t: 'green', v: '  ● Incident Management & Escalation     [███████████░░░░] 88%' },
      { t: 'green', v: '  ● Hardware & Software Installation     [██████████░░░░░] 85%' },
      { t: 'blank', v: '' },
      { t: 'cyan',  v: '// SECURITY' },
      { t: 'green', v: '  ● Endpoint Hardening                   [██████████░░░░░] 80%' },
      { t: 'green', v: '  ● Vulnerability Scanning               [█████████░░░░░░] 78%' },
      { t: 'green', v: '  ● SIEM Monitoring                      [█████████░░░░░░] 75%' },
      { t: 'green', v: '  ● Penetration Testing (Assisted)       [████████░░░░░░░] 70%' },
      { t: 'blank', v: '' },
      { t: 'cyan',  v: '// TOOLS' },
      { t: '',      v: '  Wireshark · Nmap · Kali Linux · Splunk · Active Directory' },
      { t: '',      v: '  VirtualBox · VMware · Windows Server · Linux CLI' },
      { t: '',      v: '  Python · Bash · PowerShell' },
      { t: 'blank', v: '' },
    ],

    'cat about.txt': () => [
      { t: 'blank', v: '' },
      { t: '',      v: 'I work in IT support and cybersecurity.' },
      { t: '',      v: '' },
      { t: '',      v: 'I fix what breaks, manage access, and keep systems stable.' },
      { t: '',      v: 'I stay unusually calm when others cannot, speak plainly' },
      { t: '',      v: 'when things are unclear, and follow problems until they' },
      { t: '',      v: 'are truly resolved.' },
      { t: '',      v: '' },
      { t: '',      v: 'I do not see my field as a boundary. I want to grow beyond' },
      { t: '',      v: 'technical roles into areas where technology, strategy, and' },
      { t: '',      v: 'decision making meet.' },
      { t: '',      v: '' },
      { t: 'cyan',  v: '"Technology evolves quickly. Responsibility does not."' },
      { t: 'blank', v: '' },
    ],

    'cat experience': () => [
      { t: 'blank', v: '' },
      { t: 'cyan',  v: '[JAN 2024 — JUN 2025]  SecureLogix · IT Support & Cybersecurity Analyst' },
      { t: '',      v: '  Tier 1/2 support · SIEM monitoring · Vulnerability scans' },
      { t: '',      v: '  Access management · Endpoint hardening · Incident documentation' },
      { t: 'blank', v: '' },
      { t: 'cyan',  v: '[MAY 2024 — JUN 2025]  Tool-Go Inc. · Cybersecurity Intern' },
      { t: '',      v: '  Supervised pen testing · DoS scenario analysis' },
      { t: '',      v: '  IOC identification · Technical report writing' },
      { t: 'blank', v: '' },
      { t: 'cyan',  v: '[FEB 2023 — PRESENT]   Freelance · IT Support Technician' },
      { t: '',      v: '  End-to-end hardware, software & network support' },
      { t: 'blank', v: '' },
    ],

    'ping rayyan': () => {
      const lines = [
        { t: 'blank', v: '' },
        { t: '',      v: 'PING rayyan-umair (reach.rayyan1@gmail.com)' },
        { t: '',      v: '' },
      ];
      for (let i = 1; i <= 4; i++) {
        const ms = (Math.random() * 0.3 + 0.001).toFixed(3);
        lines.push({ t: 'green', v: `64 bytes from rayyan: seq=${i} ttl=64 time=${ms}ms` });
      }
      lines.push(
        { t: 'blank', v: '' },
        { t: 'cyan',  v: '--- RAYYAN-UMAIR PING STATISTICS ---' },
        { t: '',      v: '4 packets transmitted, 4 received, 0% packet loss.' },
        { t: 'cyan',  v: 'RESPONSE: CONSISTENT. RELIABLE. ALWAYS ON.' },
        { t: 'blank', v: '' },
      );
      return lines;
    },

    'ssh rayyan@career': () => [
      { t: 'blank', v: '' },
      { t: '',      v: 'ssh rayyan@career...' },
      { t: '',      v: 'Connecting to opportunity.rayyan-net...' },
      { t: 'green', v: 'Connection established.' },
      { t: 'blank', v: '' },
      { t: 'cyan',  v: 'Welcome. You have reached the right system.' },
      { t: '',      v: 'Operator is available for full-time roles.' },
      { t: '',      v: '' },
      { t: '',      v: 'Next step: reach.rayyan1@gmail.com' },
      { t: '',      v: '          linkedin.com/in/rayyanumair' },
      { t: 'blank', v: '' },
    ],

    uptime: () => {
      const days  = Math.floor((Date.now() - new Date('2023-02-01').getTime()) / 86400000);
      return [
        { t: 'blank', v: '' },
        { t: 'cyan',  v: `RAYYAN-NET uptime: ${days} days` },
        { t: '',      v: 'Load avg: focused · methodical · reliable' },
        { t: '',      v: 'Processes: IT support · security study · cert prep · portfolio dev' },
        { t: 'blank', v: '' },
      ];
    },

    ifconfig: () => [
      { t: 'blank', v: '' },
      { t: 'cyan',  v: 'eth0: PROFESSIONAL NETWORK' },
      { t: '',      v: '  inet linkedin.com/in/rayyanumair' },
      { t: '',      v: '  TX packets: consistent · RX packets: always open' },
      { t: 'blank', v: '' },
      { t: 'cyan',  v: 'eth1: EMAIL INTERFACE' },
      { t: '',      v: '  inet reach.rayyan1@gmail.com' },
      { t: '',      v: '  STATUS: UP · RUNNING · RESPONSE < 24HRS' },
      { t: 'blank', v: '' },
      { t: 'cyan',  v: 'lo0: INTERNAL DRIVE' },
      { t: '',      v: '  Motivation: HIGH · Focus: LOCKED · Curiosity: ACTIVE' },
      { t: 'blank', v: '' },
    ],

    clear: () => 'CLEAR',

    exit: () => 'EXIT',
  };

  /* ── Render output lines ──────────────────────────────── */
  function _print(lines) {
    lines.forEach(l => {
      const div = document.createElement('div');
      if (l.t === 'blank') {
        div.className = 'co-line blank';
      } else {
        div.className = `co-line${l.t ? ' ' + l.t : ''}`;
        div.textContent = l.v;
      }
      _output.appendChild(div);
    });
    _output.scrollTop = _output.scrollHeight;
  }

  function _printCmd(cmd) {
    const div = document.createElement('div');
    div.className = 'co-line cmd';
    div.textContent = `rayyan@net:~$ ${cmd}`;
    _output.appendChild(div);
  }

  /* ── Handle input ─────────────────────────────────────── */
  function _handleInput(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    _history.unshift(cmd);
    _histIdx = -1;
    _printCmd(cmd);

    if (_commands[cmd]) {
      const result = _commands[cmd]();
      if (result === 'CLEAR') {
        _output.innerHTML = '';
        return;
      }
      if (result === 'EXIT') {
        hide();
        return;
      }
      _print(result);
    } else {
      _print([
        { t: 'err', v: `command not found: ${cmd}` },
        { t: '',    v: `Type 'help' to see available commands.` },
        { t: 'blank', v: '' },
      ]);
    }
  }

  /* ── Show / hide ──────────────────────────────────────── */
  function show() {
    if (_open) return;
    _open = true;
    _overlay.classList.remove('hidden');
    _input.focus();

    if (_output.children.length === 0) {
      _print(CONFIG.console.greeting.map(v => ({ t: v.startsWith('─') ? 'dim' : '', v })));
    }
  }

  function hide() {
    _open = false;
    _overlay.classList.add('hidden');
  }

  /* ── Events ───────────────────────────────────────────── */
  _closeBtn.addEventListener('click', hide);

  _input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = _input.value;
      _input.value = '';
      _handleInput(val);
    }
    // History navigation
    if (e.key === 'ArrowUp') {
      _histIdx = Math.min(_histIdx + 1, _history.length - 1);
      _input.value = _history[_histIdx] || '';
      e.preventDefault();
    }
    if (e.key === 'ArrowDown') {
      _histIdx = Math.max(_histIdx - 1, -1);
      _input.value = _histIdx >= 0 ? _history[_histIdx] : '';
      e.preventDefault();
    }
    if (e.key === 'Escape') hide();
  });

  /* ── Global key trigger ───────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === CONFIG.console.triggerKey) {
      const tag = document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      _open ? hide() : show();
    }
  });

  /* ── DevTools seed ────────────────────────────────────── */
  function _seedDevTools() {
    console.log('%c RAYYAN-NET · DEBUG LAYER ', 'background:#080500;color:#e8a020;font-family:monospace;font-size:14px;padding:6px 12px;border:1px solid #7a5010;');
    console.log('%c Unauthorized access detected.', 'color:#e8a020;font-family:monospace;');
    console.log('%c Just kidding. You found the debug layer.', 'color:#7a5010;font-family:monospace;');
    console.log('%c Press ` (backtick) on the page to open the interactive terminal.', 'color:#00d4ff;font-family:monospace;');
    console.log('%c Or call: RayyanNet.openConsole()', 'color:#00d4ff;font-family:monospace;');
  }

  return { show, hide, seedDevTools: _seedDevTools };

})();
