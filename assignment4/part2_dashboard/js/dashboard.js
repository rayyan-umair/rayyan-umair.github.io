/*
    Name:        Rayyan Umair
    File:        js/dashboard.js
    Date:        19 March 2026
    Description: External JavaScript for dashboard.html.
                 Interactive Skills Dashboard.
                 All interactive and animated features:
                   1. Custom cursor with hover scaling
                   2. Header fade-in on load
                   3. Scroll reveal for cards and sections
                   4. Progress bar fill animation on scroll
                   5. Card flip on click (front / back)
                   6. Category filter buttons
                   7. Animated stat counter in summary bar
                   8. Animated background node network canvas
    Course:      INFT1206 – Assignment 4 Part 2
*/

"use strict";

/* ─────────────────────────────────────────────────────────────
   START
   Wait for the DOM to be ready before initialising anything.
───────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {
    initCursor();
    initCanvas();
    initHeader();
    initScrollReveal();
    initProgressBars();
    initCardFlips();
    initFilters();
    initStatCounters();
});

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE FEATURE 1 — CUSTOM CURSOR
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

    /* Snap the dot to the mouse immediately on every move */
    document.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + "px";
        cursor.style.top  = mouseY + "px";
    });

    /* Each frame, move the ring 12% of the way toward the mouse.
       This is linear interpolation (lerp) — it creates the lag. */
    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + "px";
        ring.style.top  = ringY + "px";
        requestAnimationFrame(animateRing);
    }
    animateRing();

    /* Expand cursor when the mouse enters an interactive element */
    document.addEventListener("mouseover", function (e) {
        if (e.target.closest(".skill-card, .filter-btn, a, button")) {
            document.body.classList.add("cursor-hover");
        }
    });

    /* Shrink cursor back when leaving an interactive element */
    document.addEventListener("mouseout", function (e) {
        if (e.target.closest(".skill-card, .filter-btn, a, button")) {
            document.body.classList.remove("cursor-hover");
        }
    });
}

/* ─────────────────────────────────────────────────────────────
   HEADER FADE-IN
   Adds the .visible class to the header on page load so it
   fades in and slides up via the CSS transition defined
   on #site-header in dashboard.css.
───────────────────────────────────────────────────────────── */
function initHeader() {
    var header = document.getElementById("site-header");
    if (!header) return;

    /* Small delay so the animation is visible after page paint */
    setTimeout(function () {
        header.classList.add("visible");
    }, 100);
}

/* ─────────────────────────────────────────────────────────────
   SCROLL REVEAL
   Every element with class .reveal starts at opacity 0
   and translateY(20px). When it enters the viewport,
   the .visible class is added to trigger the CSS transition.
   Source: MDN Intersection Observer API
   https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
───────────────────────────────────────────────────────────── */
function initScrollReveal() {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); /* stop watching once revealed */
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

    /* Observe every element that needs a reveal */
    document.querySelectorAll(".reveal").forEach(function (el) {
        observer.observe(el);
    });

    /* Also observe the summary bar */
    var summaryBar = document.getElementById("summary-bar");
    if (summaryBar) observer.observe(summaryBar);
}

/* ─────────────────────────────────────────────────────────────
   PROGRESS BAR ANIMATION ON SCROLL
   Each .card-bar starts at width 0%.
   An IntersectionObserver watches the skills grid.
   When the grid enters the viewport, every bar animates
   to its target width stored in the data-level attribute.
   Disconnects after firing once so bars only animate on
   first scroll-in.
───────────────────────────────────────────────────────────── */
function initProgressBars() {
    var grid = document.getElementById("skills-grid");
    if (!grid) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            /* Animate every bar to its data-level value */
            document.querySelectorAll(".card-bar").forEach(function (bar) {
                bar.style.width = bar.getAttribute("data-level") + "%";
            });

            observer.disconnect(); /* only animate once */
        });
    }, { threshold: 0.1 });

    observer.observe(grid);
}

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE FEATURE 2 — CARD FLIP ON CLICK
   Clicking a skill card toggles the .flipped class on it.
   CSS uses a 3D rotateY transform on .card-inner to show
   the back face. The back face has detailed context info.
   Uses event delegation on the grid container so one
   listener handles all cards.
───────────────────────────────────────────────────────────── */
function initCardFlips() {
    var grid = document.getElementById("skills-grid");
    if (!grid) return;

    /* Single click listener handles all cards via delegation */
    grid.addEventListener("click", function (e) {
        var card = e.target.closest(".skill-card");
        if (!card) return;

        /* Toggle the flipped state */
        card.classList.toggle("flipped");
    });

    /* Keyboard accessibility: Enter and Space also flip the card */
    grid.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        var card = e.target.closest(".skill-card");
        if (!card) return;
        e.preventDefault();
        card.classList.toggle("flipped");
    });
}

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE FEATURE 3 — CATEGORY FILTER BUTTONS
   Clicking a filter button shows only cards matching that
   category. Cards not matching get the .hidden class.
   The All button removes all .hidden classes.
   Active button state is managed via the .active class.
───────────────────────────────────────────────────────────── */
function initFilters() {
    var buttons = document.querySelectorAll(".filter-btn");
    var cards   = document.querySelectorAll(".skill-card");

    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {

            /* Update active state on buttons */
            buttons.forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");

            var filter = btn.getAttribute("data-filter");

            /* Show or hide each card based on category match */
            cards.forEach(function (card) {
                if (filter === "all") {
                    /* Show all cards */
                    card.classList.remove("hidden");
                } else if (card.getAttribute("data-category") === filter) {
                    /* Show matching cards */
                    card.classList.remove("hidden");
                } else {
                    /* Hide non-matching cards */
                    card.classList.add("hidden");
                    /* Unflip hidden cards so they reset */
                    card.classList.remove("flipped");
                }
            });
        });
    });
}

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE FEATURE 4 — ANIMATED STAT COUNTERS
   The summary bar shows aggregate stats (skills count,
   avg proficiency, etc.). When the bar scrolls into view,
   each stat value counts up from 0 to its target number.
   Uses IntersectionObserver + setInterval for the animation.
───────────────────────────────────────────────────────────── */
function initStatCounters() {
    var summaryBar = document.getElementById("summary-bar");
    if (!summaryBar) return;

    var counters = summaryBar.querySelectorAll(".stat-value");
    var animated = false; /* only run once */

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting || animated) return;
            animated = true;

            /* Animate each counter from 0 to its data-target */
            counters.forEach(function (counter) {
                var target   = parseInt(counter.getAttribute("data-target"), 10);
                var suffix   = counter.getAttribute("data-suffix") || "";
                var duration = 1200; /* ms */
                var steps    = 40;
                var interval = duration / steps;
                var current  = 0;
                var increment = target / steps;

                var timer = setInterval(function () {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current) + suffix;
                }, interval);
            });

            observer.disconnect();
        });
    }, { threshold: 0.4 });

    observer.observe(summaryBar);
}

/* ─────────────────────────────────────────────────────────────
   BACKGROUND CANVAS — ANIMATED NODE NETWORK
   Draws floating nodes connected by fading lines on a
   fixed <canvas> element behind all page content.

   Source: MDN Canvas API
   https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

   What it does:
     Creates nodes that drift slowly across the canvas.
     Draws faint lines between nodes that are close together.
     Line opacity decreases as distance between nodes increases.

   How it works:
     requestAnimationFrame drives a continuous loop.
     Each node has x, y position and vx, vy velocity.
     Nodes bounce off canvas edges when they reach them.
     Distance calculated using Pythagorean theorem.

   Why used:
     Provides a subtle animated background that reinforces
     the networking/security theme without distracting
     from the dashboard content.
───────────────────────────────────────────────────────────── */
function initCanvas() {
    var canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");

    var NODE_COUNT = 50;   /* number of floating nodes */
    var MAX_DIST   = 150;  /* max distance for a connection line */
    var SPEED      = 0.25; /* movement speed per frame */

    var W, H, nodes;

    /* Resize the canvas to fill the full viewport */
    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    /* Create one node with random position and velocity */
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

    /* Main animation loop — runs every frame */
    function draw() {
        ctx.clearRect(0, 0, W, H);

        /* Move nodes and bounce off viewport edges */
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].x += nodes[i].vx;
            nodes[i].y += nodes[i].vy;
            if (nodes[i].x < 0 || nodes[i].x > W) nodes[i].vx *= -1;
            if (nodes[i].y < 0 || nodes[i].y > H) nodes[i].vy *= -1;
        }

        /* Draw connecting lines between nearby nodes */
        for (var a = 0; a < nodes.length; a++) {
            for (var b = a + 1; b < nodes.length; b++) {
                var dx   = nodes[a].x - nodes[b].x;
                var dy   = nodes[a].y - nodes[b].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > MAX_DIST) continue;

                /* Line fades out as distance approaches MAX_DIST */
                var alpha = (1 - dist / MAX_DIST) * 0.25;
                ctx.strokeStyle = "rgba(79, 124, 255, " + alpha + ")";
                ctx.lineWidth   = 0.6;
                ctx.beginPath();
                ctx.moveTo(nodes[a].x, nodes[a].y);
                ctx.lineTo(nodes[b].x, nodes[b].y);
                ctx.stroke();
            }
        }

        /* Draw each node as a small circle */
        for (var i = 0; i < nodes.length; i++) {
            ctx.fillStyle = "rgba(79, 124, 255, 0.38)";
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
