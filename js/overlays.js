/* ═══════════════════════════════════════════════════════════════
   overlays.js — All panel renderers v3.0
   profile · experience · projects · certifications · contact
   tools · games · socials · location · writeups
═══════════════════════════════════════════════════════════════ */

const Overlays = (() => {

  const _overlay  = document.getElementById('overlay');
  const _bg       = document.getElementById('overlay-bg');
  const _title    = document.getElementById('ov-title');
  const _content  = document.getElementById('ov-content');
  const _closeBtn = document.getElementById('ov-close');
  const _cache    = {};

  async function _fetch(id) {
    if (_cache[id]) return _cache[id];
    try {
      const res  = await fetch(`data/${id}.json`);
      if (!res.ok) throw new Error(res.status);
      _cache[id] = await res.json();
      return _cache[id];
    } catch (e) {
      console.error('[Overlays]', e);
      return null;
    }
  }

  async function open(id) {
    const n = CONFIG.nodes.find(n => n.id === id);
    _title.textContent = n ? n.label : id.toUpperCase();
    _content.innerHTML = '<div class="ov-loading">LOADING MODULE<span class="cursor-blink">_</span></div>';
    _overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    const data = await _fetch(id);
    if (!data) { _content.innerHTML = '<div class="ov-error">ERROR: MODULE DATA UNAVAILABLE</div>'; return; }
    const R = { profile:_rProfile, experience:_rExperience, projects:_rProjects,
                certifications:_rCerts, contact:_rContact, tools:_rTools,
                games:_rGames, socials:_rSocials, location:_rLocation, writeups:_rWriteups };
    _content.innerHTML = R[id] ? R[id](data) : `<pre style="font-size:12px;color:var(--text-primary)">${JSON.stringify(data,null,2)}</pre>`;
    // Wire interactive tools after render
    if (id === 'tools') _wireTools();
    if (id === 'games')  _wireGames();
  }

  function close() {
    _overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  _closeBtn.addEventListener('click', close);
  _bg.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !_overlay.classList.contains('hidden')) close();
  });

  /* ── Shared helpers ─────────────────────────────────────── */
  const sec = (t) => `<div class="ov-section">// ${t}</div>`;
  const dim = (t) => `<span style="color:var(--amber-dim)">${t}</span>`;

  /* ════════════════════════════════════════════════════════
     PROFILE
  ════════════════════════════════════════════════════════ */
  function _rProfile(d) {
    const edu = (d.education||[]).map(e=>`
      <div class="ov-edu">
        <div class="ov-edu-degree">${e.degree}</div>
        <div class="ov-edu-inst">${e.institution}</div>
        <div class="ov-edu-period">${e.period}</div>
        <div class="ov-edu-note">${e.note}</div>
      </div>`).join('');

    const info = `
      <div class="ov-info-grid">
        <div class="ov-info-cell"><div class="ov-info-label">LOCATION</div><div class="ov-info-value">${d.location}</div></div>
        <div class="ov-info-cell"><div class="ov-info-label">STATUS</div><div class="ov-info-value">${d.status}</div></div>
        <div class="ov-info-cell"><div class="ov-info-label">LANGUAGES</div><div class="ov-info-value">${(d.languages||[]).join(' · ')}</div></div>
        <div class="ov-info-cell"><div class="ov-info-label">FOCUS</div><div class="ov-info-value">IT Support · Cybersecurity</div></div>
      </div>`;

    const skillGroups = (d.skills||[]).map(g=>`
      <div class="ov-skill-group">
        <div class="ov-skill-group-label">// ${g.category}</div>
        ${g.items.map(s=>`
          <div class="ov-skill-row">
            <div class="ov-skill-head">
              <span class="ov-skill-name">${s.name}</span>
              <span class="ov-skill-pct">${s.level}%</span>
            </div>
            <div class="ov-skill-ctx">${s.context}</div>
            <div class="ov-bar-track"><div class="ov-bar-fill ${g.color}" style="width:${s.level}%"></div></div>
          </div>`).join('')}
      </div>`).join('');

    const badges = (d.toolBadges||[]).map(b=>`<span class="ov-badge ${b.cat}">${b.name}</span>`).join('');

    return `
      ${sec('IDENTITY')}
      <p class="ov-summary">${d.summary}</p>
      <div class="ov-thesis">${d.thesis}</div>
      ${sec('SYSTEM INFO')}${info}
      ${sec('EDUCATION')}${edu}
      ${sec('CORE COMPETENCIES')}${skillGroups}
      ${sec('TOOL STACK')}<div class="ov-badges">${badges}</div>`;
  }

  /* ════════════════════════════════════════════════════════
     EXPERIENCE
  ════════════════════════════════════════════════════════ */
  function _rExperience(d) {
    return sec('WORK HISTORY') + (d.experience||[]).map(e=>`
      <div class="ov-exp">
        <div class="ov-exp-role">${e.role}</div>
        <div class="ov-exp-company">${e.company}</div>
        <div class="ov-exp-meta">
          <span class="ov-exp-period">${e.period}</span>
          <span class="ov-exp-type">${e.type}</span>
        </div>
        <ul class="ov-exp-tasks">${e.tasks.map(t=>`<li>${t}</li>`).join('')}</ul>
        <div class="ov-exp-tools">${(e.tools||[]).map(t=>`<span class="ov-tool-tag">${t}</span>`).join('')}</div>
      </div>`).join('');
  }

  /* ════════════════════════════════════════════════════════
     PROJECTS
  ════════════════════════════════════════════════════════ */
  function _rProjects(d) {
    return sec('ACTIVE PROJECTS') + (d.projects||[]).map(p=>{
      const sc = {COMPLETE:'complete','IN PROGRESS':'progress',PLANNED:'planned'}[p.status]||'planned';
      return `
        <div class="ov-project">
          <div class="ov-project-header">
            <span class="ov-project-name">${p.name}</span>
            <span class="ov-project-status ${sc}">${p.status}</span>
          </div>
          <div class="ov-project-tech">${(p.tech||[]).map(t=>`<span class="ov-tech-tag">${t}</span>`).join('')}</div>
          <div class="ov-project-desc">${p.description}</div>
          <div class="ov-project-highlight">${p.highlight}</div>
          ${p.link?`<div style="margin-top:10px"><a href="${p.link}" target="_blank" rel="noopener" class="ov-ext-link">[ VIEW ON GITHUB → ]</a></div>`:''}
        </div>`;
    }).join('');
  }

  /* ════════════════════════════════════════════════════════
     CERTIFICATIONS
  ════════════════════════════════════════════════════════ */
  function _rCerts(d) {
    const cards = (d.certifications||[]).map(c=>`
      <div class="ov-cert">
        <div class="ov-cert-badge ${c.color}">${c.badge}</div>
        <div>
          <div class="ov-cert-name">${c.name}</div>
          <div class="ov-cert-issuer">${c.issuer}</div>
          <div class="ov-cert-status">ACTIVE</div>
          <div class="ov-cert-desc">${c.desc}</div>
        </div>
      </div>`).join('');

    const rm = (d.roadmap||[]).map((r,i,arr)=>
      `<div class="rm-node"><div class="rm-dot ${r.status}">${r.name}</div><div class="rm-label">${r.status.toUpperCase()}</div></div>
       ${i<arr.length-1?`<div class="rm-connector ${r.status==='done'?'done':''}"></div>`:''}`
    ).join('');

    return `
      ${sec('CREDENTIALS')}<div class="ov-cert-grid">${cards}</div>
      ${sec('CERTIFICATION ROADMAP')}<div class="ov-roadmap">${rm}</div>`;
  }

  /* ════════════════════════════════════════════════════════
     CONTACT
  ════════════════════════════════════════════════════════ */
  function _rContact(d) {
    const links = (d.links||[]).map(l=>`
      <a class="ov-contact-link" href="${l.url}" ${l.download?`download="Rayyan_Umair_Resume.pdf"`:'target="_blank" rel="noopener"'}>
        <div class="ov-contact-icon">${l.icon}</div>
        <div>
          <div class="ov-contact-label">${l.label}</div>
          <div class="ov-contact-value">${l.value}</div>
        </div>
        <div class="ov-contact-status"><span class="dot">●</span>${l.response}</div>
      </a>`).join('');
    return `
      ${sec('COMMUNICATIONS')}${links}
      <div class="ov-contact-avail">LOCATION: ${d.location} &nbsp;·&nbsp; ${d.availability}</div>`;
  }

  /* ════════════════════════════════════════════════════════
     SOCIALS — nmap port scan aesthetic
  ════════════════════════════════════════════════════════ */
  function _rSocials(d) {
    const scan = `
      <div class="ov-nmap-header">
        <div>Starting RAYYAN-NET scan... (${(d.links||[]).length} services)</div>
        <div style="color:var(--amber-dim);font-size:13px;margin-top:4px">
          Scan report for rayyan-umair (43.9461° N, 78.8965° W)
        </div>
      </div>`;

    const ports = (d.links||[]).map(l=>`
      <a class="ov-port-row" href="${l.url}" target="_blank" rel="noopener">
        <span class="port-num">${l.port}/tcp</span>
        <span class="port-state open">open</span>
        <span class="port-service">${l.service}</span>
        <span class="port-label">${l.label}</span>
        <span class="port-handle">${l.handle}</span>
      </a>`).join('');

    return `
      ${sec('NETWORK REACHABILITY SCAN')}
      ${scan}
      <div class="ov-nmap-table">
        <div class="ov-nmap-thead">
          <span>PORT</span><span>STATE</span><span>SERVICE</span><span>PLATFORM</span><span>HANDLE</span>
        </div>
        ${ports}
      </div>
      <div class="ov-nmap-footer">
        ${(d.links||[]).length} open ports · 0 closed · scan complete<br>
        <span style="color:var(--amber-dim)">All channels monitored. Response time: consistent.</span>
      </div>`;
  }

  /* ════════════════════════════════════════════════════════
     LOCATION — live system status panel
  ════════════════════════════════════════════════════════ */
  function _rLocation(d) {
    const now = new Date();
    const est = new Date(now.toLocaleString('en-US',{timeZone:'America/Toronto'}));
    const hh  = String(est.getHours()).padStart(2,'0');
    const mm  = String(est.getMinutes()).padStart(2,'0');
    const ss  = String(est.getSeconds()).padStart(2,'0');

    const hubs = (d.hubs||[]).map(h=>`
      <div class="ov-hub-row">
        <span class="hub-city">${h.city}</span>
        <span class="hub-dist">${h.distance}</span>
        <span class="hub-dir" style="color:var(--amber-dim)">${h.direction}</span>
      </div>`).join('');

    return `
      ${sec('NODE LOCATION')}
      <div class="ov-loc-grid">
        <div class="ov-loc-cell">
          <div class="ov-info-label">CITY</div>
          <div class="ov-info-value" style="font-size:20px;color:var(--amber-bright)">${d.city}</div>
        </div>
        <div class="ov-loc-cell">
          <div class="ov-info-label">PROVINCE</div>
          <div class="ov-info-value">${d.province}, ${d.country}</div>
        </div>
        <div class="ov-loc-cell">
          <div class="ov-info-label">COORDINATES</div>
          <div class="ov-info-value">${d.lat}° N &nbsp; ${d.lng}° W</div>
        </div>
        <div class="ov-loc-cell">
          <div class="ov-info-label">LOCAL TIME</div>
          <div class="ov-info-value" id="loc-clock" style="color:var(--cyan)">${hh}:${mm}:${ss}</div>
        </div>
        <div class="ov-loc-cell">
          <div class="ov-info-label">TIMEZONE</div>
          <div class="ov-info-value">${d.timezone}</div>
        </div>
        <div class="ov-loc-cell">
          <div class="ov-info-label">STATUS</div>
          <div class="ov-info-value" style="color:var(--green)">● ONLINE</div>
        </div>
      </div>
      ${sec('PROXIMITY TO TECH HUBS')}
      <div class="ov-hub-table">${hubs}</div>
      ${sec('AVAILABILITY')}
      <div class="ov-thesis">${d.availability}</div>`;
  }

  /* ════════════════════════════════════════════════════════
     WRITEUPS
  ════════════════════════════════════════════════════════ */
  function _rWriteups(d) {
    const items = (d.writeups||[]).map(w=>`
      <div class="ov-writeup">
        <div class="ov-writeup-header">
          <span class="ov-writeup-name">${w.name}</span>
          <span class="ov-project-status ${w.difficulty==='EASY'?'complete':w.difficulty==='MEDIUM'?'progress':'planned'}">${w.difficulty}</span>
        </div>
        <div class="ov-writeup-meta">
          <span class="ov-exp-type">${w.platform}</span>
          <span class="ov-exp-type" style="border-color:var(--amber-dim);color:var(--amber-dim)">${w.category}</span>
        </div>
        <div class="ov-project-desc">${w.summary}</div>
        <div class="ov-project-tech">${(w.tools||[]).map(t=>`<span class="ov-tech-tag">${t}</span>`).join('')}</div>
        <div class="ov-project-highlight">${w.lesson}</div>
        ${w.link?`<div style="margin-top:8px"><a href="${w.link}" target="_blank" rel="noopener" class="ov-ext-link">[ READ WRITEUP → ]</a></div>`:''}
      </div>`).join('');

    return `
      ${sec('CTF WRITEUPS & LAB NOTES')}
      <div class="ov-thesis">Documentation is as important as the solution. These writeups capture methodology, dead ends, and lessons — not just answers.</div>
      ${items}
      <div class="ov-contact-avail" style="margin-top:16px">
        More writeups published to GitHub as labs are completed.<br>
        <a href="https://github.com/rayyan-umair" target="_blank" rel="noopener" class="ov-ext-link" style="font-size:14px">github.com/rayyan-umair →</a>
      </div>`;
  }

  /* ════════════════════════════════════════════════════════
     TOOLS — interactive cybersecurity tools
  ════════════════════════════════════════════════════════ */
  function _rTools(d) {
    const tabs = (d.tools||[]).map((t,i)=>
      `<button class="tool-tab ${i===0?'active':''}" data-tool="${i}">${t.name}</button>`
    ).join('');

    const panels = (d.tools||[]).map((t,i)=>`
      <div class="tool-panel ${i===0?'active':''}" data-panel="${i}">
        <div class="tool-desc">${t.description}</div>
        <div class="tool-python-hint">
          <span style="color:var(--amber-dim);font-size:12px;letter-spacing:2px">// PYTHON EQUIVALENT AVAILABLE:</span>
          <code class="tool-py-snippet">${t.python}</code>
        </div>
        <div class="tool-interface" id="tool-ui-${i}"></div>
      </div>`
    ).join('');

    return `
      ${sec('CYBERSECURITY TOOLS')}
      <div class="ov-thesis">All tools run in-browser. Python equivalents available on GitHub. Real logic — not demos.</div>
      <div class="tool-tabs">${tabs}</div>
      <div class="tool-panels">${panels}</div>`;
  }

  /* ── Tool logic wiring ──────────────────────────────────── */
  function _wireTools() {
    // Tab switching
    document.querySelectorAll('.tool-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tool-tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(`.tool-panel[data-panel="${btn.dataset.tool}"]`).classList.add('active');
      });
    });

    // Render each tool UI
    _buildHashTool(document.getElementById('tool-ui-0'));
    _buildPasswordTool(document.getElementById('tool-ui-1'));
    _buildUrlTool(document.getElementById('tool-ui-2'));
    _buildCipherTool(document.getElementById('tool-ui-3'));
    _buildLogTool(document.getElementById('tool-ui-4'));
  }

  /* ── TOOL 0: Hash Analyzer ──────────────────────────────── */
  function _buildHashTool(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="tool-input-row">
        <input class="tool-input" id="hash-input" type="text" placeholder="PASTE HASH HERE..." spellcheck="false" autocomplete="off"/>
        <button class="tool-run-btn" id="hash-run">[ ANALYZE ]</button>
      </div>
      <div class="tool-output" id="hash-output"></div>`;

    const run = () => {
      const val = document.getElementById('hash-input').value.trim();
      const out = document.getElementById('hash-output');
      if (!val) { out.innerHTML = '<div class="to-err">NO INPUT DETECTED.</div>'; return; }
      const result = _analyzeHash(val);
      out.innerHTML = result;
    };

    document.getElementById('hash-run').addEventListener('click', run);
    document.getElementById('hash-input').addEventListener('keydown', e => { if(e.key==='Enter') run(); });
  }

  function _analyzeHash(h) {
    const hex = /^[0-9a-fA-F]+$/.test(h);
    const b64 = /^[A-Za-z0-9+/=]+$/.test(h);
    let algo = 'UNKNOWN', mode = '?', desc = '', weak = false;

    if (hex) {
      if      (h.length === 32)  { algo='MD5';    mode='0';    desc='Fast hash, cryptographically broken.'; weak=true; }
      else if (h.length === 40)  { algo='SHA-1';  mode='100';  desc='Deprecated. Collision attacks demonstrated (2017).'; weak=true; }
      else if (h.length === 56)  { algo='SHA-224';mode='1300'; desc='SHA-2 family, 224-bit digest.'; }
      else if (h.length === 64)  { algo='SHA-256';mode='1400'; desc='Industry standard. Widely used in TLS, SSH, certificates.'; }
      else if (h.length === 96)  { algo='SHA-384';mode='10800';desc='SHA-2 family, 384-bit digest.'; }
      else if (h.length === 128) { algo='SHA-512';mode='1700'; desc='SHA-2 family, 512-bit digest. Very strong.'; }
    }
    if (h.startsWith('$2') && h.length===60) { algo='bcrypt'; mode='3200'; desc='Adaptive hash with salt. Designed to be slow. GPU-resistant.'; }
    if (h.startsWith('$6$')) { algo='SHA-512crypt'; mode='1800'; desc='Linux shadow password format. Salt included.'; }
    if (h.startsWith('$apr1$')) { algo='md5crypt'; mode='1600'; desc='Apache MD5 format. Salted but weak.'; weak=true; }

    const color = weak ? '#ff7070' : algo==='UNKNOWN' ? 'var(--amber-dim)' : 'var(--green)';
    return `
      <div class="to-row"><span class="to-label">INPUT</span><span class="to-val" style="word-break:break-all;font-size:11px">${h}</span></div>
      <div class="to-row"><span class="to-label">LENGTH</span><span class="to-val">${h.length} chars</span></div>
      <div class="to-row"><span class="to-label">CHARSET</span><span class="to-val">${hex?'Hexadecimal':b64?'Base64':'Mixed/Binary'}</span></div>
      <div class="to-row"><span class="to-label">ALGORITHM</span><span class="to-val" style="color:${color};font-size:18px">${algo}</span></div>
      <div class="to-row"><span class="to-label">HASHCAT MODE</span><span class="to-val" style="color:var(--cyan)">-m ${mode}</span></div>
      <div class="to-row"><span class="to-label">ASSESSMENT</span><span class="to-val">${desc||'Unable to identify algorithm.'}</span></div>
      ${weak?`<div class="to-warn">⚠ WEAK ALGORITHM — susceptible to brute-force and rainbow table attacks</div>`:''}`;
  }

  /* ── TOOL 1: Password Entropy Analyzer ─────────────────── */
  function _buildPasswordTool(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="tool-input-row">
        <input class="tool-input" id="pw-input" type="text" placeholder="TYPE PASSWORD TO ANALYZE..." spellcheck="false" autocomplete="off"/>
      </div>
      <div class="tool-output" id="pw-output"></div>`;

    document.getElementById('pw-input').addEventListener('input', () => {
      const val = document.getElementById('pw-input').value;
      document.getElementById('pw-output').innerHTML = val ? _analyzePassword(val) : '';
    });
  }

  function _analyzePassword(p) {
    let pool = 0;
    if (/[a-z]/.test(p)) pool += 26;
    if (/[A-Z]/.test(p)) pool += 26;
    if (/[0-9]/.test(p)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(p)) pool += 32;
    const entropy = Math.round(Math.log2(Math.pow(pool, p.length)));

    const common = ['password','123456','qwerty','abc123','letmein','admin','welcome','monkey','1234567890'];
    const isCommon = common.some(c => p.toLowerCase().includes(c));
    const hasWalk  = /qwerty|asdf|zxcv|1234|abcd/i.test(p);

    // Crack time estimates (10B guesses/sec GPU)
    const combos = Math.pow(pool, p.length);
    const gpuSec = combos / 1e10;
    const formatTime = (s) => {
      if (s < 1)       return 'INSTANT';
      if (s < 60)      return `${Math.round(s)} seconds`;
      if (s < 3600)    return `${Math.round(s/60)} minutes`;
      if (s < 86400)   return `${Math.round(s/3600)} hours`;
      if (s < 31536000)return `${Math.round(s/86400)} days`;
      if (s < 3.15e9)  return `${Math.round(s/31536000)} years`;
      return `${(s/3.15e9).toExponential(1)} millennia`;
    };

    const score = Math.min(100, Math.round(entropy * 1.4));
    const scoreColor = score < 30 ? '#ff7070' : score < 60 ? 'var(--amber)' : 'var(--green)';
    const label = score < 30 ? 'CRITICAL' : score < 50 ? 'WEAK' : score < 70 ? 'MODERATE' : score < 90 ? 'STRONG' : 'EXCELLENT';

    return `
      <div class="to-row"><span class="to-label">LENGTH</span><span class="to-val">${p.length} characters</span></div>
      <div class="to-row"><span class="to-label">POOL SIZE</span><span class="to-val">${pool} possible characters</span></div>
      <div class="to-row"><span class="to-label">ENTROPY</span><span class="to-val" style="color:var(--cyan)">${entropy} bits &nbsp; <span style="font-size:11px;color:var(--amber-dim)">log2(${pool}^${p.length})</span></span></div>
      <div class="to-row">
        <span class="to-label">STRENGTH</span>
        <span class="to-val" style="color:${scoreColor};font-size:18px">${label}</span>
      </div>
      <div class="pw-bar-track"><div class="pw-bar-fill" style="width:${score}%;background:${scoreColor}"></div></div>
      <div class="to-row"><span class="to-label">CRACK TIME</span><span class="to-val" style="color:var(--amber)">${formatTime(gpuSec)} ${dim('@ 10B guesses/sec GPU')}</span></div>
      ${isCommon?`<div class="to-warn">⚠ CONTAINS COMMON PASSWORD PATTERN</div>`:''}
      ${hasWalk?`<div class="to-warn">⚠ KEYBOARD WALK PATTERN DETECTED</div>`:''}`;
  }

  /* ── TOOL 2: URL Decomposer ────────────────────────────── */
  function _buildUrlTool(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="tool-input-row">
        <input class="tool-input" id="url-input" type="text" placeholder="PASTE URL HERE..." spellcheck="false"/>
        <button class="tool-run-btn" id="url-run">[ ANALYZE ]</button>
      </div>
      <div class="tool-output" id="url-output"></div>`;

    const run = () => {
      const val = document.getElementById('url-input').value.trim();
      const out = document.getElementById('url-output');
      if (!val) { out.innerHTML = '<div class="to-err">NO URL DETECTED.</div>'; return; }
      out.innerHTML = _analyzeUrl(val);
    };
    document.getElementById('url-run').addEventListener('click', run);
    document.getElementById('url-input').addEventListener('keydown', e => { if(e.key==='Enter') run(); });
  }

  function _analyzeUrl(raw) {
    let url;
    try { url = new URL(raw.startsWith('http') ? raw : 'https://'+raw); }
    catch(e) { return '<div class="to-err">MALFORMED URL — CANNOT PARSE.</div>'; }

    const suspiciousTLDs = ['.xyz','.tk','.ml','.ga','.cf','.gq','.top','.click','.download'];
    const suspiciousWords = ['login','secure','verify','account','update','confirm','banking','paypal','amazon','microsoft'];
    const flags = [];

    if (suspiciousTLDs.some(t => url.hostname.endsWith(t))) flags.push('SUSPICIOUS TLD — commonly abused in phishing');
    if (suspiciousWords.some(w => url.hostname.toLowerCase().includes(w))) flags.push('SUSPICIOUS KEYWORD IN DOMAIN — possible brand impersonation');
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url.hostname)) flags.push('IP ADDRESS AS HOST — legitimate sites use domain names');
    if ((url.hostname.match(/\./g)||[]).length > 3) flags.push('EXCESSIVE SUBDOMAINS — potential subdomain spoofing');
    if (url.hostname.length > 40) flags.push('UNUSUALLY LONG DOMAIN — potential typosquat');
    const params = [...url.searchParams.entries()];
    if (params.some(([,v]) => v.includes('<') || v.includes('script'))) flags.push('POSSIBLE XSS IN PARAMETERS');
    if (params.some(([,v]) => v.includes('../') || v.includes('..%2F'))) flags.push('PATH TRAVERSAL ATTEMPT IN PARAMETERS');

    return `
      <div class="to-row"><span class="to-label">PROTOCOL</span><span class="to-val" style="color:${url.protocol==='https:'?'var(--green)':'#ff7070'}">${url.protocol} ${url.protocol!=='https:'?'⚠ UNENCRYPTED':''}</span></div>
      <div class="to-row"><span class="to-label">HOST</span><span class="to-val">${url.hostname}</span></div>
      <div class="to-row"><span class="to-label">PORT</span><span class="to-val">${url.port||'(default)'}</span></div>
      <div class="to-row"><span class="to-label">PATH</span><span class="to-val">${url.pathname||'/'}</span></div>
      ${params.length?`<div class="to-row"><span class="to-label">PARAMS</span><span class="to-val">${params.map(([k,v])=>`${k}=${v}`).join(' · ')}</span></div>`:''}
      <div class="to-row"><span class="to-label">RISK FLAGS</span><span class="to-val">${flags.length?flags.length+' detected':'NONE DETECTED'}</span></div>
      ${flags.map(f=>`<div class="to-warn">⚠ ${f}</div>`).join('')}
      ${flags.length===0?`<div class="to-ok">✓ NO OBVIOUS INDICATORS OF COMPROMISE DETECTED</div>`:''}`;
  }

  /* ── TOOL 3: Caesar Cipher Workbench ────────────────────── */
  function _buildCipherTool(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="tool-input-row">
        <input class="tool-input" id="cipher-input" type="text" placeholder="ENTER CIPHERTEXT..." spellcheck="false"/>
        <button class="tool-run-btn" id="cipher-auto">[ AUTO-CRACK ]</button>
      </div>
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px">
        <span style="font-family:var(--font-crt);font-size:14px;color:var(--amber-dim)">SHIFT:</span>
        <input id="cipher-shift" type="range" min="0" max="25" value="0" style="flex:1;accent-color:var(--amber)"/>
        <span id="cipher-shift-val" style="font-family:var(--font-crt);font-size:16px;color:var(--amber);min-width:24px">0</span>
      </div>
      <div class="tool-output" id="cipher-output"></div>`;

    const applyShift = () => {
      const text  = document.getElementById('cipher-input').value;
      const shift = parseInt(document.getElementById('cipher-shift').value);
      document.getElementById('cipher-shift-val').textContent = shift;
      if (!text) return;
      document.getElementById('cipher-output').innerHTML = _caesarResult(text, shift);
    };

    document.getElementById('cipher-input').addEventListener('input', applyShift);
    document.getElementById('cipher-shift').addEventListener('input', applyShift);
    document.getElementById('cipher-auto').addEventListener('click', () => {
      const text = document.getElementById('cipher-input').value;
      if (!text) return;
      const best = _caesarAutoCrack(text);
      document.getElementById('cipher-shift').value = best;
      document.getElementById('cipher-shift-val').textContent = best;
      document.getElementById('cipher-output').innerHTML = _caesarResult(text, best) +
        `<div class="to-ok">✓ AUTO-DETECTED SHIFT: ${best}</div>`;
    });
  }

  function _caesarResult(text, shift) {
    const decoded = text.split('').map(c => {
      if (/[a-z]/.test(c)) return String.fromCharCode((c.charCodeAt(0)-97+shift)%26+97);
      if (/[A-Z]/.test(c)) return String.fromCharCode((c.charCodeAt(0)-65+shift)%26+65);
      return c;
    }).join('');
    return `
      <div class="to-row"><span class="to-label">SHIFT</span><span class="to-val" style="color:var(--cyan)">ROT-${shift}</span></div>
      <div class="to-row"><span class="to-label">RESULT</span><span class="to-val" style="color:var(--amber-bright);font-size:16px;word-break:break-all">${decoded}</span></div>`;
  }

  function _caesarAutoCrack(text) {
    const freq = 'etaoinshrdlcumwfgypbvkjxqz';
    let best = 0, bestScore = -Infinity;
    for (let s = 0; s < 26; s++) {
      const decoded = text.split('').map(c => {
        if (/[a-z]/.test(c)) return String.fromCharCode((c.charCodeAt(0)-97+s)%26+97);
        return c.toLowerCase();
      }).join('');
      const score = decoded.split('').reduce((acc,c) => {
        const i = freq.indexOf(c);
        return acc + (i >= 0 ? 26-i : 0);
      }, 0);
      if (score > bestScore) { bestScore = score; best = s; }
    }
    return best;
  }

  /* ── TOOL 4: Log Pattern Scanner ────────────────────────── */
  function _buildLogTool(container) {
    if (!container) return;
    container.innerHTML = `
      <div style="margin-bottom:8px">
        <textarea class="tool-input tool-textarea" id="log-input" placeholder="PASTE LOG DATA HERE (Apache, Windows Event Log, syslog...)"></textarea>
      </div>
      <button class="tool-run-btn" id="log-run" style="width:100%">[ SCAN FOR THREATS ]</button>
      <div class="tool-output" id="log-output"></div>`;

    document.getElementById('log-run').addEventListener('click', () => {
      const val = document.getElementById('log-input').value;
      const out = document.getElementById('log-output');
      if (!val.trim()) { out.innerHTML = '<div class="to-err">NO LOG DATA DETECTED.</div>'; return; }
      out.innerHTML = _scanLogs(val);
    });
  }

  function _scanLogs(text) {
    const lines = text.split('\n');
    const findings = [];

    const patterns = [
      { re: /failed (password|login|auth)/i,    sev:'HIGH',   desc:'Failed authentication attempt' },
      { re: /invalid user/i,                     sev:'HIGH',   desc:'Login attempt with invalid username' },
      { re: /permission denied/i,                sev:'MEDIUM', desc:'Permission denial — potential privilege escalation attempt' },
      { re: /union.+select/i,                    sev:'CRITICAL',desc:'SQL INJECTION pattern detected' },
      { re: /<script[\s>]/i,                     sev:'CRITICAL',desc:'XSS payload detected' },
      { re: /\.\.\//,                            sev:'HIGH',   desc:'Path traversal attempt' },
      { re: /cmd\.exe|powershell|\/bin\/sh/i,    sev:'CRITICAL',desc:'Command execution attempt' },
      { re: /sudo|su root|passwd/i,              sev:'HIGH',   desc:'Privilege escalation command' },
      { re: /wget|curl.+http/i,                  sev:'MEDIUM', desc:'Outbound download from shell' },
      { re: /404.*admin|\.php.*404/i,            sev:'LOW',    desc:'Scanning for admin endpoints' },
    ];

    lines.forEach((line, i) => {
      patterns.forEach(p => {
        if (p.re.test(line)) {
          findings.push({ line:i+1, sev:p.sev, desc:p.desc, snippet:line.slice(0,80) });
        }
      });
    });

    if (!findings.length) return `
      <div class="to-ok">✓ NO THREAT PATTERNS DETECTED IN ${lines.length} LOG LINES</div>`;

    const sevColor = { CRITICAL:'#ff4040', HIGH:'#ff7070', MEDIUM:'var(--amber)', LOW:'var(--amber-dim)' };
    const counts   = findings.reduce((a,f) => { a[f.sev]=(a[f.sev]||0)+1; return a; }, {});

    return `
      <div class="to-row">
        <span class="to-label">LINES SCANNED</span><span class="to-val">${lines.length}</span>
      </div>
      <div class="to-row">
        <span class="to-label">FINDINGS</span>
        <span class="to-val">
          ${Object.entries(counts).map(([s,c])=>`<span style="color:${sevColor[s]}">${c} ${s}</span>`).join(' · ')}
        </span>
      </div>
      <div style="margin-top:12px">
        ${findings.map(f=>`
          <div class="log-finding" style="border-left-color:${sevColor[f.sev]}">
            <div style="display:flex;gap:10px;align-items:center;margin-bottom:4px">
              <span style="font-family:var(--font-crt);font-size:13px;color:${sevColor[f.sev]};letter-spacing:2px">${f.sev}</span>
              <span style="font-family:var(--font-mono);font-size:10px;color:var(--amber-dim)">LINE ${f.line}</span>
            </div>
            <div style="font-family:var(--font-crt);font-size:16px;color:var(--text-primary);margin-bottom:4px">${f.desc}</div>
            <div style="font-family:var(--font-mono);font-size:9px;color:var(--amber-dim);word-break:break-all">${f.snippet}</div>
          </div>`).join('')}
      </div>`;
  }

  /* ════════════════════════════════════════════════════════
     GAMES
  ════════════════════════════════════════════════════════ */
  function _rGames(d) {
    const cards = (d.games||[]).map((g,i)=>`
      <div class="ov-game-card" data-game="${i}">
        <div class="ov-game-icon">${g.icon}</div>
        <div class="ov-game-name">${g.name}</div>
        <div class="ov-game-desc">${g.tagline}</div>
        <div class="ov-game-skill">${g.skill}</div>
        <button class="tool-run-btn" style="margin-top:12px;width:100%" data-launch="${i}">[ LAUNCH → ]</button>
      </div>`).join('');

    return `
      ${sec('CYBER GAMES')}
      <div class="ov-thesis">Each game is a skill demonstration. Not just entertainment — interactive proof of knowledge.</div>
      <div class="ov-games-grid" id="games-menu">${cards}</div>
      <div id="game-container" class="hidden"></div>`;
  }

  function _wireGames() {
    document.querySelectorAll('[data-launch]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.launch);
        const menu = document.getElementById('games-menu');
        const cont = document.getElementById('game-container');
        menu.classList.add('hidden');
        cont.classList.remove('hidden');
        const games = [_gameThreat, _gamePhishing, _gameCipher, _gameTerminal];
        if (games[idx]) games[idx](cont);
      });
    });
  }

  /* ── GAME 0: Threat Classifier ──────────────────────────── */
  function _gameThreat(container) {
    const packets = [
      { src:'192.168.1.45',  dst:'10.0.0.1',    port:22,   payload:'SSH-2.0-OpenSSH_8.2',         threat:false, reason:'Normal SSH connection' },
      { src:'185.220.101.1', dst:'10.0.0.5',    port:3389, payload:'RDP connection attempt x847', threat:true,  reason:'Brute force RDP — 847 attempts from TOR exit node' },
      { src:'10.0.0.12',     dst:'8.8.8.8',     port:53,   payload:'DNS query: google.com',        threat:false, reason:'Normal DNS resolution' },
      { src:'203.0.113.99',  dst:'10.0.0.1',    port:80,   payload:"GET /admin?q=' UNION SELECT", threat:true,  reason:'SQL injection attempt in URL parameter' },
      { src:'10.0.0.8',      dst:'10.0.0.50',   port:445,  payload:'SMB NEGOTIATE Request',        threat:false, reason:'Normal SMB traffic' },
      { src:'198.51.100.7',  dst:'10.0.0.1',    port:8080, payload:'<script>document.cookie',      threat:true,  reason:'XSS payload in HTTP request' },
      { src:'10.0.0.4',      dst:'172.16.0.1',  port:443,  payload:'TLS 1.3 ClientHello',          threat:false, reason:'Normal HTTPS traffic' },
      { src:'45.33.32.156',  dst:'10.0.0.3',    port:21,   payload:'PASS aaaaaaaaaaaaaaaaaaaaaa',  threat:true,  reason:'FTP brute force — repeating character pattern' },
    ];

    let score=0, total=0, idx=0;

    const render = () => {
      if (idx >= packets.length) {
        container.innerHTML = `
          <div style="text-align:center;padding:30px">
            <div style="font-family:var(--font-crt);font-size:40px;color:var(--amber-bright)">SCAN COMPLETE</div>
            <div style="font-family:var(--font-mono);font-size:13px;color:var(--amber-dim);margin:12px 0">
              ${score} / ${total} THREATS CORRECTLY IDENTIFIED
            </div>
            <div style="font-family:var(--font-crt);font-size:20px;color:${score===total?'var(--green)':'var(--cyan)'}">
              ${score===total?'PERFECT SCORE · ANALYST CLEARED':'KEEP TRAINING · THREATS WERE MISSED'}
            </div>
            <button class="tool-run-btn" style="margin-top:20px" onclick="this.closest('#game-container').innerHTML='';document.getElementById('games-menu').classList.remove('hidden');document.getElementById('game-container').classList.add('hidden');">[ BACK TO GAMES ]</button>
          </div>`;
        return;
      }
      const p = packets[idx];
      container.innerHTML = `
        <div class="game-header">
          <span style="font-family:var(--font-crt);font-size:14px;color:var(--amber-dim)">THREAT CLASSIFIER · PACKET ${idx+1}/${packets.length}</span>
          <span style="font-family:var(--font-crt);font-size:14px;color:var(--cyan)">SCORE: ${score}</span>
        </div>
        <div class="game-packet">
          <div class="to-row"><span class="to-label">SRC IP</span><span class="to-val">${p.src}</span></div>
          <div class="to-row"><span class="to-label">DST IP</span><span class="to-val">${p.dst}</span></div>
          <div class="to-row"><span class="to-label">PORT</span><span class="to-val">${p.port}</span></div>
          <div class="to-row"><span class="to-label">PAYLOAD</span><span class="to-val" style="word-break:break-all">${p.payload}</span></div>
        </div>
        <div style="display:flex;gap:12px;margin-top:16px">
          <button class="tool-run-btn" style="flex:1;background:rgba(57,255,110,0.08);border-color:var(--green);color:var(--green)" id="g-allow">[ ✓ ALLOW ]</button>
          <button class="tool-run-btn" style="flex:1;background:rgba(255,70,70,0.08);border-color:#ff4040;color:#ff4040" id="g-block">[ ✕ BLOCK ]</button>
        </div>
        <div id="g-feedback" style="margin-top:12px;min-height:40px"></div>`;

      const respond = (block) => {
        total++;
        const correct = block === p.threat;
        if (correct) score++;
        document.getElementById('g-feedback').innerHTML = `
          <div style="font-family:var(--font-crt);font-size:18px;color:${correct?'var(--green)':'#ff4040'}">
            ${correct ? '✓ CORRECT' : '✕ INCORRECT'}
          </div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--amber-dim);margin-top:4px">${p.reason}</div>`;
        document.getElementById('g-allow').disabled = true;
        document.getElementById('g-block').disabled = true;
        setTimeout(() => { idx++; render(); }, 1800);
      };

      document.getElementById('g-allow').addEventListener('click', () => respond(false));
      document.getElementById('g-block').addEventListener('click', () => respond(true));
    };

    render();
  }

  /* ── GAME 1: Phishing Spotter ───────────────────────────── */
  function _gamePhishing(container) {
    const emails = [
      {
        from:'support@paypa1.com', subject:'Urgent: Verify Your Account',
        body:'Dear Valued Customer, Your PayPal account has been limited. Click here to restore access: http://paypal-secure-verify.tk/login',
        flags:['Misspelled domain (paypa1 not paypal)','Suspicious TLD (.tk)','Urgency manipulation','Generic greeting (not your name)','Suspicious link domain'],
      },
      {
        from:'it-support@company.internal', subject:'Password Reset Required',
        body:'Hi Team, Due to a security audit all employees must reset passwords by EOD. Use our portal: https://it-support.company.internal/reset',
        flags:[],
        safe:true,
      },
      {
        from:'noreply@amaz0n-orders.com', subject:'Your order has shipped',
        body:'Click to track your package: http://45.33.22.11/track?id=123. Enter your Amazon credentials to continue.',
        flags:['IP address as link destination','Misspelled domain (amaz0n)','Credential harvesting request','Suspicious link domain'],
      },
    ];

    let eIdx = 0;
    const render = () => {
      if (eIdx >= emails.length) {
        container.innerHTML = `<div style="text-align:center;padding:30px">
          <div style="font-family:var(--font-crt);font-size:36px;color:var(--amber-bright)">ANALYSIS COMPLETE</div>
          <div style="font-family:var(--font-mono);font-size:12px;color:var(--amber-dim);margin-top:12px">You have reviewed all emails. Security awareness training completed.</div>
          <button class="tool-run-btn" style="margin-top:20px" onclick="this.closest('#game-container').innerHTML='';document.getElementById('games-menu').classList.remove('hidden');document.getElementById('game-container').classList.add('hidden');">[ BACK TO GAMES ]</button>
        </div>`;
        return;
      }
      const e = emails[eIdx];
      container.innerHTML = `
        <div class="game-header"><span style="font-family:var(--font-crt);font-size:14px;color:var(--amber-dim)">PHISHING SPOTTER · EMAIL ${eIdx+1}/${emails.length}</span></div>
        <div class="game-email">
          <div class="email-field"><span class="ef-label">FROM:</span><span class="ef-val">${e.from}</span></div>
          <div class="email-field"><span class="ef-label">SUBJECT:</span><span class="ef-val">${e.subject}</span></div>
          <div class="email-body">${e.body}</div>
        </div>
        <div style="display:flex;gap:12px;margin-top:14px">
          <button class="tool-run-btn" style="flex:1;border-color:var(--green);color:var(--green)" id="pe-safe">[ ✓ LEGITIMATE ]</button>
          <button class="tool-run-btn" style="flex:1;border-color:#ff4040;color:#ff4040" id="pe-phish">[ ✕ PHISHING ]</button>
        </div>
        <div id="pe-feedback" style="margin-top:12px;min-height:60px"></div>`;

      const respond = (calledPhish) => {
        const isPhish = !e.safe;
        const correct = calledPhish === isPhish;
        let fb = `<div style="font-family:var(--font-crt);font-size:18px;color:${correct?'var(--green)':'#ff4040'}">${correct?'✓ CORRECT':'✕ INCORRECT'}</div>`;
        if (isPhish && e.flags.length) {
          fb += `<div style="font-family:var(--font-mono);font-size:10px;color:var(--amber-dim);margin-top:6px">RED FLAGS: ${e.flags.join(' · ')}</div>`;
        } else if (!isPhish) {
          fb += `<div style="font-family:var(--font-mono);font-size:10px;color:var(--amber-dim);margin-top:6px">This email shows no obvious indicators of phishing.</div>`;
        }
        document.getElementById('pe-feedback').innerHTML = fb;
        document.getElementById('pe-safe').disabled = true;
        document.getElementById('pe-phish').disabled = true;
        setTimeout(() => { eIdx++; render(); }, 2200);
      };

      document.getElementById('pe-safe').addEventListener('click', () => respond(false));
      document.getElementById('pe-phish').addEventListener('click', () => respond(true));
    };
    render();
  }

  /* ── GAME 2: Cipher Challenge (placeholder) ─────────────── */
  function _gameCipher(container) {
    const challenges = [
      { cipher:'KHOOR ZRUOG', answer:'HELLO WORLD', hint:'Classic ROT cipher' },
      { cipher:'GRRQ PBZRF BAPV',  answer:'DOOM COMES ONCE', hint:'ROT-13' },
      { cipher:'WKUHDW OHYHO: HOHYDWHG', answer:'THREAT LEVEL: ELEVATED', hint:'Shift by 3' },
    ];
    let cIdx = 0, score = 0;

    const render = () => {
      if (cIdx >= challenges.length) {
        container.innerHTML = `<div style="text-align:center;padding:30px">
          <div style="font-family:var(--font-crt);font-size:36px;color:var(--amber-bright)">CIPHER CHALLENGE COMPLETE</div>
          <div style="font-family:var(--font-mono);font-size:12px;color:var(--amber-dim);margin:12px 0">SCORE: ${score}/${challenges.length}</div>
          <button class="tool-run-btn" style="margin-top:16px" onclick="this.closest('#game-container').innerHTML='';document.getElementById('games-menu').classList.remove('hidden');document.getElementById('game-container').classList.add('hidden');">[ BACK TO GAMES ]</button>
        </div>`;
        return;
      }
      const c = challenges[cIdx];
      container.innerHTML = `
        <div class="game-header"><span style="font-family:var(--font-crt);font-size:14px;color:var(--amber-dim)">CIPHER CHALLENGE · ${cIdx+1}/${challenges.length} · SCORE: ${score}</span></div>
        <div class="game-packet">
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--amber-dim);margin-bottom:6px">INTERCEPT MESSAGE</div>
          <div style="font-family:var(--font-crt);font-size:26px;color:var(--amber-bright);letter-spacing:4px">${c.cipher}</div>
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--amber-dim);margin-top:8px">HINT: ${c.hint}</div>
        </div>
        <div class="tool-input-row" style="margin-top:14px">
          <input class="tool-input" id="cc-answer" placeholder="ENTER DECODED MESSAGE..." spellcheck="false" autocomplete="off"/>
          <button class="tool-run-btn" id="cc-submit">[ SUBMIT ]</button>
        </div>
        <div id="cc-feedback" style="margin-top:10px;min-height:30px"></div>`;

      const submit = () => {
        const ans = document.getElementById('cc-answer').value.trim().toUpperCase();
        const correct = ans === c.answer;
        if (correct) score++;
        document.getElementById('cc-feedback').innerHTML = `
          <div style="font-family:var(--font-crt);font-size:18px;color:${correct?'var(--green)':'#ff4040'}">${correct?'✓ DECRYPTED':'✕ INCORRECT'}</div>
          ${!correct?`<div style="font-family:var(--font-mono);font-size:10px;color:var(--amber-dim)">ANSWER: ${c.answer}</div>`:''}`;
        document.getElementById('cc-submit').disabled = true;
        setTimeout(()=>{ cIdx++; render(); }, 1800);
      };

      document.getElementById('cc-submit').addEventListener('click', submit);
      document.getElementById('cc-answer').addEventListener('keydown', e => { if(e.key==='Enter') submit(); });
    };
    render();
  }

  /* ── GAME 3: Terminal Escape ─────────────────────────────── */
  function _gameTerminal(container) {
    let step = 0;
    const steps = [
      { prompt:'You are locked in as user `guest`. Find your privilege level.', cmd:'id', expected:'id', hint:'Run: id', response:'uid=1001(guest) gid=1001(guest) groups=1001(guest)', next:'whoami shows you\'re guest. Check what sudo rights you have.' },
      { prompt:'Check your sudo permissions.', cmd:'sudo -l', expected:'sudo', hint:'Run: sudo -l', response:'(root) NOPASSWD: /usr/bin/python3', next:'Python3 can run as root without a password. Use it to escape.' },
      { prompt:'Use python3 to spawn a root shell.', cmd:'sudo python3 -c "import pty; pty.spawn(\'/bin/bash\')"', expected:'python3', hint:'Hint: sudo python3 -c "import pty; ..."', response:'root@system:/# ', next:null },
    ];

    const render = () => {
      if (step >= steps.length) {
        container.innerHTML = `<div style="text-align:center;padding:30px">
          <div style="font-family:var(--font-crt);font-size:40px;color:var(--green)">ROOT OBTAINED</div>
          <div style="font-family:var(--font-mono);font-size:12px;color:var(--amber-dim);margin-top:12px">You escalated privileges using a misconfigured sudo rule — a real technique used in CTF and pentests.</div>
          <button class="tool-run-btn" style="margin-top:20px" onclick="this.closest('#game-container').innerHTML='';document.getElementById('games-menu').classList.remove('hidden');document.getElementById('game-container').classList.add('hidden');">[ BACK TO GAMES ]</button>
        </div>`;
        return;
      }
      const s = steps[step];
      container.innerHTML = `
        <div class="game-header"><span style="font-family:var(--font-crt);font-size:14px;color:var(--amber-dim)">TERMINAL ESCAPE · STEP ${step+1}/${steps.length}</span></div>
        <div class="game-terminal">
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--amber-dim);margin-bottom:8px">${s.prompt}</div>
          <div id="te-history" style="font-family:var(--font-mono);font-size:11px;color:var(--text-primary);margin-bottom:8px"></div>
        </div>
        <div class="tool-input-row" style="margin-top:8px">
          <span style="font-family:var(--font-crt);font-size:16px;color:var(--green);flex-shrink:0">guest@system:~$</span>
          <input class="tool-input" id="te-cmd" placeholder="enter command..." spellcheck="false" autocomplete="off" style="border-left:none"/>
          <button class="tool-run-btn" id="te-run">[ RUN ]</button>
        </div>
        <div id="te-feedback" style="margin-top:8px;min-height:30px"></div>`;

      const run = () => {
        const val = document.getElementById('te-cmd').value.trim();
        const hist = document.getElementById('te-history');
        hist.innerHTML += `<div style="color:var(--green)">guest@system:~$ ${val}</div>`;
        if (val.toLowerCase().includes(s.expected.toLowerCase())) {
          hist.innerHTML += `<div style="color:var(--text-primary);margin-left:8px">${s.response}</div>`;
          document.getElementById('te-feedback').innerHTML = `<div style="font-family:var(--font-crt);font-size:16px;color:var(--green)">✓ CORRECT${s.next?` — ${s.next}`:''}</div>`;
          document.getElementById('te-run').disabled = true;
          setTimeout(()=>{ step++; render(); }, 2000);
        } else {
          hist.innerHTML += `<div style="color:#ff4040">command not found: ${val}</div>`;
          document.getElementById('te-feedback').innerHTML = `<div style="font-family:var(--font-mono);font-size:11px;color:var(--amber-dim)">${s.hint}</div>`;
          document.getElementById('te-cmd').value = '';
        }
      };

      document.getElementById('te-run').addEventListener('click', run);
      document.getElementById('te-cmd').addEventListener('keydown', e => { if(e.key==='Enter') run(); });
    };
    render();
  }

  return { open, close };

})();
