/* ═══════════════════════════════════════════════════════════════
   overlays.js — Overlay management + all content renderers
   Owns: open/close, JSON fetch+cache, render pipeline
═══════════════════════════════════════════════════════════════ */

const Overlays = (() => {

  /* ── DOM refs ─────────────────────────────────────────── */
  const _overlay  = document.getElementById('overlay');
  const _bg       = document.getElementById('overlay-bg');
  const _title    = document.getElementById('ov-title');
  const _content  = document.getElementById('ov-content');
  const _closeBtn = document.getElementById('ov-close');

  const _cache    = {};

  /* ── Fetch + cache JSON ───────────────────────────────── */
  async function _fetch(id) {
    if (_cache[id]) return _cache[id];
    try {
      const res  = await fetch(`data/${id}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      _cache[id] = data;
      return data;
    } catch (err) {
      console.error(`[Overlays] Failed to load data/${id}.json`, err);
      return null;
    }
  }

  /* ── Open ─────────────────────────────────────────────── */
  async function open(id) {
    const nodeCfg = CONFIG.nodes.find(n => n.id === id);
    _title.textContent = nodeCfg ? nodeCfg.label : id.toUpperCase();

    _content.innerHTML = `<div style="color:var(--amber-dim);font-size:18px;letter-spacing:2px;padding:20px 0;">LOADING MODULE...</div>`;
    _overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const data = await _fetch(id);

    if (!data) {
      _content.innerHTML = `<div style="color:#ff6060;font-size:16px;">ERROR: MODULE DATA UNAVAILABLE</div>`;
      return;
    }

    const renderers = {
      profile:        _renderProfile,
      experience:     _renderExperience,
      projects:       _renderProjects,
      certifications: _renderCertifications,
      contact:        _renderContact,
    };

    const renderer = renderers[id];
    _content.innerHTML = renderer ? renderer(data) : `<pre style="font-size:13px;color:var(--text-primary)">${JSON.stringify(data, null, 2)}</pre>`;
  }

  /* ── Close ────────────────────────────────────────────── */
  function close() {
    _overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  /* ── Event listeners ──────────────────────────────────── */
  _closeBtn.addEventListener('click', close);
  _bg.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !_overlay.classList.contains('hidden')) close();
  });

  /* ══════════════════════════════════════════════════════
     RENDERERS
  ══════════════════════════════════════════════════════ */

  /* ── Profile ──────────────────────────────────────────── */
  function _renderProfile(d) {
    const edu = (d.education || []).map(e => `
      <div class="ov-edu">
        <div class="ov-edu-degree">${e.degree}</div>
        <div class="ov-edu-inst">${e.institution}</div>
        <div class="ov-edu-period">${e.period}</div>
        <div class="ov-edu-note">${e.note}</div>
      </div>`).join('');

    const infoGrid = `
      <div class="ov-info-grid">
        <div class="ov-info-cell">
          <div class="ov-info-label">LOCATION</div>
          <div class="ov-info-value">${d.location}</div>
        </div>
        <div class="ov-info-cell">
          <div class="ov-info-label">STATUS</div>
          <div class="ov-info-value">${d.status}</div>
        </div>
        <div class="ov-info-cell">
          <div class="ov-info-label">LANGUAGES</div>
          <div class="ov-info-value">${(d.languages || []).join(' · ')}</div>
        </div>
        <div class="ov-info-cell">
          <div class="ov-info-label">FOCUS</div>
          <div class="ov-info-value">IT Support · Cybersecurity</div>
        </div>
      </div>`;

    const skillGroups = (d.skills || []).map(group => {
      const bars = group.items.map(s => `
        <div class="ov-skill-row">
          <div class="ov-skill-head">
            <span class="ov-skill-name">${s.name}</span>
            <span class="ov-skill-pct">${s.level}%</span>
          </div>
          <div class="ov-skill-ctx">${s.context}</div>
          <div class="ov-bar-track">
            <div class="ov-bar-fill ${group.color}" style="width:${s.level}%"></div>
          </div>
        </div>`).join('');
      return `
        <div class="ov-skill-group">
          <div class="ov-skill-group-label">// ${group.category}</div>
          ${bars}
        </div>`;
    }).join('');

    const badges = (d.toolBadges || []).map(b =>
      `<span class="ov-badge ${b.cat}">${b.name}</span>`
    ).join('');

    return `
      <div class="ov-section">// IDENTITY</div>
      <p class="ov-summary">${d.summary}</p>
      <div class="ov-thesis">${d.thesis}</div>

      <div class="ov-section">// SYSTEM INFO</div>
      ${infoGrid}

      <div class="ov-section">// EDUCATION</div>
      ${edu}

      <div class="ov-section">// CORE COMPETENCIES</div>
      ${skillGroups}

      <div class="ov-section">// TOOL STACK</div>
      <div class="ov-badges">${badges}</div>
    `;
  }

  /* ── Experience ───────────────────────────────────────── */
  function _renderExperience(d) {
    const items = (d.experience || []).map(e => {
      const tasks = e.tasks.map(t => `<li>${t}</li>`).join('');
      const tools = (e.tools || []).map(t => `<span class="ov-tool-tag">${t}</span>`).join('');
      return `
        <div class="ov-exp">
          <div class="ov-exp-role">${e.role}</div>
          <div class="ov-exp-company">${e.company}</div>
          <div class="ov-exp-meta">
            <span class="ov-exp-period">${e.period}</span>
            <span class="ov-exp-type">${e.type}</span>
          </div>
          <ul class="ov-exp-tasks">${tasks}</ul>
          <div class="ov-exp-tools">${tools}</div>
        </div>`;
    }).join('');

    return `
      <div class="ov-section">// WORK HISTORY</div>
      ${items}
    `;
  }

  /* ── Projects ─────────────────────────────────────────── */
  function _renderProjects(d) {
    const items = (d.projects || []).map(p => {
      const techTags = (p.tech || []).map(t => `<span class="ov-tech-tag">${t}</span>`).join('');
      const statusClass = {
        'COMPLETE':    'complete',
        'IN PROGRESS': 'progress',
        'PLANNED':     'planned',
      }[p.status] || 'planned';
      const linkHtml = p.link
        ? `<a href="${p.link}" target="_blank" rel="noopener" style="font-family:var(--font-term);font-size:13px;color:var(--cyan);letter-spacing:1px;text-decoration:none;">[ VIEW → ]</a>`
        : '';
      return `
        <div class="ov-project">
          <div class="ov-project-header">
            <span class="ov-project-name">${p.name}</span>
            <span class="ov-project-status ${statusClass}">${p.status}</span>
          </div>
          <div class="ov-project-tech">${techTags}</div>
          <div class="ov-project-desc">${p.description}</div>
          <div class="ov-project-highlight">${p.highlight}</div>
          ${linkHtml ? `<div style="margin-top:10px">${linkHtml}</div>` : ''}
        </div>`;
    }).join('');

    return `
      <div class="ov-section">// ACTIVE PROJECTS</div>
      ${items}
    `;
  }

  /* ── Certifications ───────────────────────────────────── */
  function _renderCertifications(d) {
    const certs = (d.certifications || []).map(c => `
      <div class="ov-cert">
        <div class="ov-cert-badge ${c.color}">${c.badge}</div>
        <div>
          <div class="ov-cert-name">${c.name}</div>
          <div class="ov-cert-issuer">${c.issuer}</div>
          <div class="ov-cert-status">ACTIVE</div>
          <div class="ov-cert-desc">${c.desc}</div>
        </div>
      </div>`).join('');

    // Roadmap
    const rmItems = (d.roadmap || []).map((r, i, arr) => {
      const connector = i < arr.length - 1
        ? `<div class="rm-connector ${r.status === 'done' ? 'done' : ''}"></div>`
        : '';
      return `
        <div class="rm-node">
          <div class="rm-dot ${r.status}">${r.name}</div>
          <div class="rm-label">${r.status.toUpperCase()}</div>
        </div>
        ${connector}`;
    }).join('');

    return `
      <div class="ov-section">// CREDENTIALS</div>
      <div class="ov-cert-grid">${certs}</div>

      <div class="ov-section">// CERTIFICATION ROADMAP</div>
      <div class="ov-roadmap">${rmItems}</div>
    `;
  }

  /* ── Contact ──────────────────────────────────────────── */
  function _renderContact(d) {
    const links = (d.links || []).map(l => {
      const tag    = l.download ? 'a' : 'a';
      const target = l.download ? '' : 'target="_blank" rel="noopener"';
      const dl     = l.download ? 'download="Rayyan_Umair_Resume.pdf"' : '';
      return `
        <${tag} class="ov-contact-link" href="${l.url}" ${target} ${dl}>
          <div class="ov-contact-icon">${l.icon}</div>
          <div>
            <div class="ov-contact-label">${l.label}</div>
            <div class="ov-contact-value">${l.value}</div>
          </div>
          <div class="ov-contact-status">
            <span class="dot">●</span>${l.response}
          </div>
        </${tag}>`;
    }).join('');

    return `
      <div class="ov-section">// COMMUNICATIONS</div>
      ${links}
      <div class="ov-contact-avail">
        LOCATION: ${d.location} &nbsp;·&nbsp; ${d.availability}
      </div>
    `;
  }

  /* ── Public API ───────────────────────────────────────── */
  return { open, close };

})();
