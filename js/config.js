/* ═══════════════════════════════════════════════════════════════
   config.js — Single source of truth for RAYYAN-NET
   Edit this file to reconfigure the entire interface.
═══════════════════════════════════════════════════════════════ */

const CONFIG = Object.freeze({

  /* ── Boot detection line ────────────────────────────────── */
  detectionLine: 'EXTERNAL CONNECTION DETECTED. VERIFYING...',

  /* ── Boot sequence messages ─────────────────────────────── */
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

  /* ── Loader ─────────────────────────────────────────────── */
  loader: {
    duration:   1800,   // ms total fill time
    blockCount: 40,     // number of blocks in block display
  },

  /* ── Identity screen ────────────────────────────────────── */
  identity: {
    awaitDelay:  400,   // ms before "AWAITING AUTHORIZATION" appears
    buttonDelay: 900,   // ms before enter button appears
  },

  /* ── Nodes ──────────────────────────────────────────────── */
  nodes: [
    { id: 'profile',        label: 'PROFILE',        x: 50, y: 44, delay: 0   },
    { id: 'experience',     label: 'EXPERIENCE',     x: 22, y: 34, delay: 120 },
    { id: 'projects',       label: 'PROJECTS',       x: 76, y: 30, delay: 240 },
    { id: 'certifications', label: 'CERTIFICATIONS', x: 74, y: 63, delay: 360 },
    { id: 'contact',        label: 'CONTACT',        x: 26, y: 63, delay: 480 },
  ],

  /* ── Status ticker messages (ambient HUD) ───────────────── */
  tickerMessages: [
    'study: information-security.bsc · ontario-tech-university',
    'status: open to full-time office-based and hybrid roles',
    'location: oshawa, on, canada',
    'languages: english · urdu/hindi · punjabi',
    'principle: protect what matters. keep systems reliable. earn trust through consistency.',
    'certs: comptia-a+ · network+ · security+ · ccst · google-cysa · itil',
    'stack: windows-server · active-directory · kali-linux · wireshark · nmap · splunk',
    'thesis: technology evolves quickly. responsibility does not.',
  ],

  /* ── Neural network canvas ──────────────────────────────── */
  network: {
    nodeCount:    65,
    maxDistance:  150,
    speed:        0.28,
    nodeRadius:   1.6,
    // Colors
    amber:        '#e8a020',
    amberDim:     '#7a5010',
    cyan:         '#00d4ff',
    cyanDim:      '#005566',
    // Neural layer x-positions (% of canvas width) — visual only
    layers: [0.15, 0.38, 0.62, 0.85],
  },

  /* ── Console easter egg ─────────────────────────────────── */
  console: {
    triggerKey: '`',   // backtick opens console
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
