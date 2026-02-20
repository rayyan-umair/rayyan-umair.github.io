import { SYSTEM } from "./config.js";
import { typeLine } from "./terminal.js";
import { runLoader } from "./loader.js";

let booted = false;

document.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" && !booted) {
    booted = true;
    await startBoot();
  }
});

async function startBoot() {
  await typeLine("[BOOT] Initializing secure runtime environment...");
  await typeLine("[NET] Verifying network integrity...");
  await typeLine("[AUTH] Validating system identity...");
  await typeLine("[CORE] Loading operational modules...");
  await typeLine("[OK] Environment stable.");

  await runLoader();

  // Fade terminal slightly
  const terminal = document.getElementById("terminal");
  terminal.style.transition = "opacity 0.8s ease";
  terminal.style.opacity = "0.2";

  // Reveal identity section
  const identity = document.getElementById("identity");
  identity.classList.remove("hidden");

  setTimeout(() => {
    identity.classList.add("show");
  }, 100);
}
