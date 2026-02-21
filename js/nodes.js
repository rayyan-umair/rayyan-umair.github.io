/* =========================================================
   nodes.js — Node creation, positioning, and click events
   ========================================================= */

const Nodes = (() => {

  const _container = document.getElementById('nodes-container');
  let _onNodeClick = null;

  function _createNode(nodeCfg) {
    const el = document.createElement('div');
    el.className = 'node';
    el.style.left = `${nodeCfg.x}%`;
    el.style.top  = `${nodeCfg.y}%`;
    el.dataset.id = nodeCfg.id;

    // Staggered reveal
    el.style.opacity    = '0';
    el.style.transform  = 'translate(-50%, -50%) scale(0.6)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

    el.innerHTML = `
      <div class="node-ring">
        <div class="node-pulse"></div>
        <div class="node-dot"></div>
      </div>
      <span class="node-label">${nodeCfg.label}</span>
    `;

    el.addEventListener('click', () => {
      if (_onNodeClick) _onNodeClick(nodeCfg.id);
    });

    _container.appendChild(el);

    // Stagger the reveal
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 200 + nodeCfg.delay);
  }

  function init(onNodeClick) {
    _onNodeClick = onNodeClick;
    _container.innerHTML = '';
    CONFIG.nodes.forEach(_createNode);
  }

  return { init };

})();
