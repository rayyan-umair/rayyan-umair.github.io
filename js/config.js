/* ═══════════════════════════════════════════════════════════════
   config.js — Single source of truth for RAYYAN-NET v3.0
═══════════════════════════════════════════════════════════════ */

const CONFIG = Object.freeze({

  detectionLine: 'EXTERNAL CONNECTION DETECTED. VERIFYING...',

  bootMessages: [
    { type: 'divider', text: '────────────────────────────────────────────────────────────' },
    { type: 'era',     text: '[1969]  ARPANET NODE 1 · SRI · FIRST PACKET TRANSMITTED'      },
    { type: 'era',     text: '[1971]  FIRST EMAIL · RAY TOMLINSON · @ SYMBOL CHOSEN'        },
    { type: 'era',     text: '[1983]  TCP/IP ADOPTED · THE INTERNET BEGINS'                 },
    { type: 'era',     text: '[1989]  WORLD WIDE WEB · TIM BERNERS-LEE · CERN'             },
    { type: 'era',     text: '[1997]  DEEP BLUE DEFEATS KASPAROV · MACHINES START WINNING' },
    { type: 'era',     text: '[2006]  NEURAL NETWORKS BEGIN TO SEE'                         },
    { type: 'era',     text: '[2012]  IMAGENET · THE DEEP LEARNING SHIFT BEGINS'           },
    { type: 'era',     text: '[2017]  ATTENTION IS ALL YOU NEED · TRANSFORMERS ARRIVE'     },
    { type: 'era',     text: '[2024]  THE BOUNDARY BETWEEN TOOL AND MIND DISSOLVES'        },
    { type: 'divider', text: '────────────────────────────────────────────────────────────' },
    { type: 'sys',     text: 'CROSS-REFERENCING OPERATOR CREDENTIALS...'                    },
    { type: 'sys',     text: 'VALIDATING IDENTITY MATRIX...'                                },
    { type: 'sys',     text: 'LOADING OPERATOR PROFILE...'                                  },
    { type: 'ok',      text: 'IDENTITY CONFIRMED.'                                          },
  ],

  loader: { duration: 1800, blockCount: 40 },

  identity: { awaitDelay: 400, buttonDelay: 900 },

  /* ── All nodes ──────────────────────────────────────────── */
  nodes: [
    { id: 'profile',        label: 'PROFILE',        x: 50,  y: 45,  delay: 0   },
    { id: 'experience',     label: 'EXPERIENCE',     x: 22,  y: 34,  delay: 100 },
    { id: 'projects',       label: 'PROJECTS',       x: 76,  y: 30,  delay: 200 },
    { id: 'certifications', label: 'CERTIFICATIONS', x: 74,  y: 62,  delay: 300 },
    { id: 'contact',        label: 'CONTACT',        x: 26,  y: 62,  delay: 400 },
    { id: 'tools',          label: 'TOOLS',          x: 38,  y: 26,  delay: 500 },
    { id: 'games',          label: 'GAMES',          x: 62,  y: 26,  delay: 600 },
    { id: 'socials',        label: 'SOCIALS',        x: 15,  y: 52,  delay: 700 },
    { id: 'location',       label: 'LOCATION',       x: 85,  y: 48,  delay: 800 },
    { id: 'writeups',       label: 'WRITEUPS',       x: 50,  y: 72,  delay: 900 },
  ],

  tickerMessages: [
    'study: information-security.bsc · ontario-tech-university',
    'status: open to full-time office-based and hybrid roles',
    'location: ontario, canada · coordinates: 43.9°n 78.8°w',
    'languages: english · urdu/hindi · punjabi',
    'principle: protect what matters. keep systems reliable. earn trust through consistency.',
    'certs: comptia-a+ · network+ · security+ · ccst · google · itil',
    'stack: windows-server · active-directory · kali-linux · wireshark · nmap · splunk',
    'thesis: technology evolves quickly. responsibility does not.',
    'uptime: system has been running · waiting · watching',
    'session: visitor detected · profile loaded · standing by',
  ],

  network: {
    nodeCount:      72,
    maxDistance:    155,
    speed:          0.26,
    nodeRadius:     1.6,
    amber:          '#e8a020',
    amberDim:       '#7a5010',
    amberBright:    '#ffbe3c',
    cyan:           '#00d4ff',
    cyanDim:        '#005566',
    red:            '#8b1a1a',
    layers:         [0.12, 0.35, 0.58, 0.82],
    // Ambient data stream characters
    streamChars:    'ABCDEF0123456789/\\|[]{}·:=><',
    streamCount:    3,
    streamSpeed:    0.4,
  },

  /* ── Ghost events ───────────────────────────────────────── */
  ghost: {
    interval:   55000,   // ms between ghost events
    messages: [
      'MONITORING ACTIVE',
      'ALL NODES NOMINAL',
      'OPERATOR PROFILE LOADED',
      'NETWORK SCAN COMPLETE',
      'NO THREATS DETECTED',
      'SYSTEM INTEGRITY: VERIFIED',
      'STANDING BY',
      'PACKET ANALYSIS RUNNING',
      'UPTIME NOMINAL',
      'PERIMETER SECURE',
    ],
  },

  /* ── HUD instruments ────────────────────────────────────── */
  hud: {
    threatLevels:   ['NOMINAL', 'NOMINAL', 'NOMINAL', 'ELEVATED', 'NOMINAL'],
    idleThreshold:  180000,  // 3 minutes idle before threat elevates
    uptimeStart:    '2023-02-01T00:00:00Z',
  },

  console: {
    triggerKey: '`',
    greeting: [
      'RAYYAN-NET · DEBUG INTERFACE · RESTRICTED ACCESS',
      '──────────────────────────────────────────────────',
      'Unauthorized access will be logged and reported.',
      '',
      'Just kidding. You found the debug layer.',
      'Type  help  to see available commands.',
      '',
    ],
  },

});
