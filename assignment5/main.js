// ============================================================
//  Accessibility Assessment — main.js
//  Author : Rayyan Umair
//  Date   : 08 April 2026
//  Course : INFT1206 – Assignment 5 Part 1
//
//  Sections:
//  1. Show / Hide comments  (accessibility fix: button + aria)
//  2. Comment form submit
//  3. Theme switcher        (dark / light / high contrast)
//  4. Reading progress bar
// ============================================================


// ── 1. Show / Hide Comments ───────────────────────────────────
//  show-hide is now a <button> so it is keyboard accessible
//  by default (tab to focus, enter/space to activate).
//  aria-expanded is updated to reflect visibility state.

const showHideBtn     = document.querySelector('.show-hide');
const commentWrapper  = document.querySelector('.comment-wrapper');

commentWrapper.style.display = 'none';

showHideBtn.addEventListener('click', function () {
    const isVisible = commentWrapper.style.display === 'block';

    if (isVisible) {
        commentWrapper.style.display = 'none';
        showHideBtn.textContent      = 'Show comments';
        showHideBtn.setAttribute('aria-expanded', 'false');
    } else {
        commentWrapper.style.display = 'block';
        showHideBtn.textContent      = 'Hide comments';
        showHideBtn.setAttribute('aria-expanded', 'true');
    }
});


// ── 2. Comment Form Submit ────────────────────────────────────

const form         = document.querySelector('.comment-form');
const nameField    = document.querySelector('#name');
const commentField = document.querySelector('#comment');
const list         = document.querySelector('.comment-container');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    submitComment();
});

function submitComment() {
    const listItem    = document.createElement('li');
    const namePara    = document.createElement('p');
    const commentPara = document.createElement('p');

    namePara.textContent    = nameField.value;
    commentPara.textContent = commentField.value;

    list.appendChild(listItem);
    listItem.appendChild(namePara);
    listItem.appendChild(commentPara);

    nameField.value    = '';
    commentField.value = '';
}


// ── 3. Theme Switcher ─────────────────────────────────────────
//  Three buttons: Dark | Light | High Contrast.
//  Sets data-theme on <body> which triggers CSS custom properties.
//  aria-pressed updated on each button to reflect active state.

const themeButtons = document.querySelectorAll('.theme-btn');

themeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {

        // Determine which theme was selected
        let selectedTheme = 'light';
        if (btn.id === 'theme-dark')     selectedTheme = 'dark';
        if (btn.id === 'theme-contrast') selectedTheme = 'high-contrast';

        // Apply theme to body
        document.body.setAttribute('data-theme', selectedTheme);

        // Update active class and aria-pressed on all buttons
        themeButtons.forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
    });
});


// ── 4. Reading Progress Bar ───────────────────────────────────
//  Calculates how far the user has scrolled through the page
//  and updates the width of #progress-bar accordingly.

const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', function () {
    const scrollTop    = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress     = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    progressBar.style.width = progress + '%';
});