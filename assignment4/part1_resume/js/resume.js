/*
    Name:        Rayyan Umair
    File:        js/resume.js
    Date:        2025
    Description: External JavaScript for resume.html.
                 No server or fetch() required — works by
                 opening resume.html directly in any browser.
                 All interactive and animated elements:
                   1. Custom cursor with hover scaling
                   2. Animated loading screen / boot sequence
                   3. Accordion expand/collapse for experience
                   4. Hover lift on cards (CSS-driven)
                   5. Scroll-triggered skill bar animation
                   6. Scroll reveal fade-in for sections
                   7. Active nav link tracking on scroll
                   8. Animated background node network canvas
    Course:      Web Development – Assignment 4 Part 1
*/

"use strict";

/* ─────────────────────────────────────────────────────────────
   START
   Wait for the DOM to finish loading before doing anything.
───────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {
    initLoader();
    initCursor();
    initCanvas();
    initAccordions();
    initScrollReveal();
    initSkillBars();
    initNavHighlight();
});

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE ELEMENT 1 — CUSTOM CURSOR
   Replaces the default browser cursor with two elements:
     - A solid dot that snaps to the mouse position instantly.
     - A ring that smoothly lags behind using lerp interpolation.
   Both elements scale up when hovering over interactive elements.
   Source: MDN MouseEvent documentation
   https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
───────────────────────────────────────────────────────────── */
function initCursor() {
    var cursor = document.getElementById("cursor");
    var ring   = document.getElementById("cursor-ring");

    /* Current true mouse position */
    var mouseX = -100;
    var mouseY = -100;

    /* Ring's smoothly interpolated position */
    var ringX = -100;
    var ringY = -100;

    /* Update dot position instantly whenever the mouse moves */
    document.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + "px";
        cursor.style.top  = mouseY + "px";
    });

    /* Each frame, move the ring 12% of the way toward the mouse.
       This creates the smooth lagging effect. */
    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + "px";
        ring.style.top  = ringY + "px";
        requestAnimationFrame(animateRing);
    }
    animateRing();

    /* Expand cursor when hovering over interactive elements */
    document.addEventListener("mouseover", function (e) {
        if (e.target.closest("a, .exp-header, .cert-card, .proj-card, .edu-card, .contact-card, .nav-link, .badge")) {
            document.body.classList.add("cursor-hover");
        }
    });

    /* Shrink cursor back when leaving interactive elements */
    document.addEventListener("mouseout", function (e) {
        if (e.target.closest("a, .exp-header, .cert-card, .proj-card, .edu-card, .contact-card, .nav-link, .badge")) {
            document.body.classList.remove("cursor-hover");
        }
    });
}

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE ELEMENT 2 — LOADING ANIMATION
   Shows a boot sequence on page load with a progress bar
   and status messages that update in steps.
   When all steps are complete, the loader fades out and the
   main page content fades in and slides up into position.
───────────────────────────────────────────────────────────── */
function initLoader() {
    var loader   = document.getElementById("loader");
    var bar      = document.getElementById("loader-bar");
    var statusEl = document.getElementById("loader-status");
    var pageWrap = document.getElementById("page-wrap");

    /* Each step has a progress bar percentage and a status message */
    var steps = [
        { pct: 20,  msg: "INITIALISING PROFILE..."  },
        { pct: 45,  msg: "LOADING CREDENTIALS..."   },
        { pct: 68,  msg: "MAPPING EXPERIENCE..."    },
        { pct: 88,  msg: "COMPILING PROJECTS..."    },
        { pct: 100, msg: "ACCESS GRANTED"           }
    ];

    var i = 0;

    /* Advance one step at a time, with a delay between each */
    function runStep() {
        if (i >= steps.length) {
            /* All steps done — fade out loader, reveal page */
            setTimeout(function () {
                loader.classList.add("fade-out");
                pageWrap.classList.add("visible");
                /* Remove loader from layout after the CSS transition ends */
                setTimeout(function () {
                    loader.style.display = "none";
                }, 700);
            }, 400);
            return;
        }

        /* Update progress bar and status text for this step */
        bar.style.width      = steps[i].pct + "%";
        statusEl.textContent = steps[i].msg;
        i++;

        /* Wait 380ms before the next step */
        setTimeout(runStep, 380);
    }

    runStep();
}

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE ELEMENT 3 — EXPERIENCE ACCORDIONS
   Each experience card can be expanded or collapsed by
   clicking its header row.
   Only one card can be open at a time.
   Keyboard accessible: Enter and Space also toggle the card.
   Uses event delegation so one listener covers all cards.
───────────────────────────────────────────────────────────── */
function initAccordions() {
    var list = document.getElementById("experience-list");
    if (!list) return;

    /* Single click listener on the container handles all cards */
    list.addEventListener("click", function (e) {
        var header = e.target.closest(".exp-header");
        if (header) {
            toggleCard(header.closest(".exp-card"));
        }
    });

    /* Keyboard support — Enter or Space activates the header */
    list.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        var header = e.target.closest(".exp-header");
        if (header) {
            e.preventDefault();
            toggleCard(header.closest(".exp-card"));
        }
    });
}

/**
 * Opens or closes a single accordion card.
 * Closes any currently open card first.
 * @param {HTMLElement} card - the .exp-card element to toggle
 */
function toggleCard(card) {
    var isOpen = card.classList.contains("open");

    /* Close every open card */
    document.querySelectorAll(".exp-card.open").forEach(function (c) {
        c.classList.remove("open");
        c.querySelector(".exp-header").setAttribute("aria-expanded", "false");
    });

    /* Open this card only if it was not already open */
    if (!isOpen) {
        card.classList.add("open");
        card.querySelector(".exp-header").setAttribute("aria-expanded", "true");
    }
}

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE ELEMENT 4 — HOVER LIFT ON CARDS
   Handled entirely by CSS transitions on .edu-card,
   .cert-card and .proj-card using transform: translateY
   and box-shadow. No JavaScript is needed here — CSS is
   the correct tool for pure visual state changes on hover.
───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE ELEMENT 5 — SKILL BAR ANIMATION ON SCROLL
   Each skill bar starts at width 0%.
   An IntersectionObserver watches the skills section.
   When the section enters the viewport, every bar animates
   to its target width (stored in data-level attribute).
   The observer disconnects after firing once so bars only
   animate on first scroll-in, not every time.
   Source: MDN IntersectionObserver API
   https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
───────────────────────────────────────────────────────────── */
function initSkillBars() {
    var section = document.getElementById("skills");
    if (!section) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            /* Animate every bar to its target level */
            document.querySelectorAll(".skill-bar").forEach(function (bar) {
                bar.style.width = bar.getAttribute("data-level") + "%";
            });

            /* Only run once */
            observer.disconnect();
        });
    }, { threshold: 0.2 });

    observer.observe(section);
}

/* ─────────────────────────────────────────────────────────────
   SCROLL REVEAL
   Every element with class .reveal starts at opacity 0
   and translateY(20px). When it scrolls into view,
   the .visible class is added, triggering the CSS transition.
───────────────────────────────────────────────────────────── */
function initScrollReveal() {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); /* stop watching once revealed */
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal").forEach(function (el) {
        observer.observe(el);
    });
}

/* ─────────────────────────────────────────────────────────────
   NAV HIGHLIGHT ON SCROLL
   Watches each <section> with an id attribute.
   When a section enters the viewport, the matching nav link
   gets the .active class. All other nav links lose it.
───────────────────────────────────────────────────────────── */
function initNavHighlight() {
    var navLinks = document.querySelectorAll(".nav-link");

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            navLinks.forEach(function (link) {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + entry.target.id
                );
            });
        });
    }, { threshold: 0.35 });

    document.querySelectorAll("section[id]").forEach(function (s) {
        observer.observe(s);
    });
}

/* ─────────────────────────────────────────────────────────────
   BACKGROUND CANVAS — ANIMATED NODE NETWORK
   Draws a subtle animated network of floating nodes and
   fading connection lines on a fixed <canvas> element
   that sits behind all page content.

   Source: MDN Canvas API
   https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

   What it does:
     Creates nodes that drift slowly across the canvas.
     Draws faint lines between nodes that are close together.
     Line opacity decreases as distance increases.

   How it works:
     requestAnimationFrame drives a continuous animation loop.
     Each node has an x, y position and vx, vy velocity.
     Nodes bounce off the canvas edges.
     Distance between each node pair is calculated using
     the Pythagorean theorem to determine connection strength.

   Why used:
     Provides a subtle animated background that connects the
     visual identity to the cybersecurity / networking field
     without distracting from the readable resume content.
───────────────────────────────────────────────────────────── */
function initCanvas() {
    var canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");

    var NODE_COUNT = 55;   /* total number of floating nodes */
    var MAX_DIST   = 155;  /* maximum distance for a connection line */
    var SPEED      = 0.28; /* base movement speed per frame */

    var W, H, nodes;

    /* Resize canvas to match the current viewport size */
    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    /* Create a single node with a random position and velocity */
    function makeNode() {
        return {
            x:  Math.random() * W,
            y:  Math.random() * H,
            vx: (Math.random() - 0.5) * SPEED,
            vy: (Math.random() - 0.5) * SPEED,
            r:  Math.random() * 1.5 + 0.5
        };
    }

    /* Create all nodes */
    function buildNodes() {
        nodes = [];
        for (var i = 0; i < NODE_COUNT; i++) {
            nodes.push(makeNode());
        }
    }

    /* Main draw loop — runs every animation frame */
    function draw() {
        ctx.clearRect(0, 0, W, H);

        /* Move every node and bounce it off the edges */
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].x += nodes[i].vx;
            nodes[i].y += nodes[i].vy;
            if (nodes[i].x < 0 || nodes[i].x > W) nodes[i].vx *= -1;
            if (nodes[i].y < 0 || nodes[i].y > H) nodes[i].vy *= -1;
        }

        /* Draw connection lines between nodes that are close enough */
        for (var a = 0; a < nodes.length; a++) {
            for (var b = a + 1; b < nodes.length; b++) {
                var dx   = nodes[a].x - nodes[b].x;
                var dy   = nodes[a].y - nodes[b].y;
                var dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > MAX_DIST) continue;

                /* Opacity fades as distance approaches MAX_DIST */
                var alpha = (1 - dist / MAX_DIST) * 0.28;
                ctx.strokeStyle = "rgba(79, 124, 255, " + alpha + ")";
                ctx.lineWidth   = 0.6;
                ctx.beginPath();
                ctx.moveTo(nodes[a].x, nodes[a].y);
                ctx.lineTo(nodes[b].x, nodes[b].y);
                ctx.stroke();
            }
        }

        /* Draw each node as a small filled circle */
        for (var i = 0; i < nodes.length; i++) {
            ctx.fillStyle = "rgba(79, 124, 255, 0.4)";
            ctx.beginPath();
            ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    /* Rebuild canvas on window resize */
    window.addEventListener("resize", function () {
        resize();
        buildNodes();
    });

    resize();
    buildNodes();
    draw();
}
