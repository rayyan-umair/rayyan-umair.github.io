/* =========================================================
   config.js — Node definitions and system configuration
   ========================================================= */

const CONFIG = Object.freeze({

  bootMessages: [
    { tag: '[BOOT]',  text: 'Initializing secure runtime environment...' },
    { tag: '[MEM]',   text: 'Allocating protected memory segments...' },
    { tag: '[NET]',   text: 'Verifying network integrity...' },
    { tag: '[CERT]',  text: 'Validating cryptographic certificates...' },
    { tag: '[AUTH]',  text: 'Validating system identity...' },
    { tag: '[DNS]',   text: 'Resolving secure nameservers...' },
    { tag: '[CORE]',  text: 'Loading operational modules...' },
    { tag: '[SYS]',   text: 'Mounting filesystem layers...' },
    { tag: '[OK]',    text: 'Environment stable. All systems nominal.', type: 'ok' },
  ],

  nodes: [
    { id: 'profile',        label: 'PROFILE',        x: 50,  y: 42, delay: 0    },
    { id: 'experience',     label: 'EXPERIENCE',     x: 22,  y: 35, delay: 100  },
    { id: 'projects',       label: 'PROJECTS',       x: 75,  y: 30, delay: 200  },
    { id: 'certifications', label: 'CERTIFICATIONS', x: 72,  y: 62, delay: 300  },
    { id: 'contact',        label: 'CONTACT',        x: 28,  y: 62, delay: 400  },
  ],

  network: {
    nodeCount:       70,
    maxDistance:     160,
    speed:           0.35,
    nodeRadius:      1.8,
    lineOpacity:     0.12,
    nodeOpacity:     0.55,
    emerald:         '#00e676',
    cyan:            '#00e5ff',
  },

});
