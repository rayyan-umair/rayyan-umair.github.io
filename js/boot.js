const bootScreen = document.getElementById("boot-screen");
const terminalOutput = document.getElementById("terminal-output");
const loaderScreen = document.getElementById("loader-screen");

const bootText = `
[BOOT] Initializing secure runtime...
[NET] Verifying network integrity...
[AUTH] Identity confirmed.
[CORE] Modules loaded.
`;

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startBoot();
}, { once: true });

function startBoot() {
  terminalOutput.textContent = bootText;
  setTimeout(() => {
    bootScreen.classList.add("hidden");
    loaderScreen.classList.remove("hidden");
    startLoader();
  }, 1500);
}
