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
  await typeLine("Initializing secure interface...");
  await typeLine("Establishing network topology...");
  await typeLine("Loading core modules...");
  await typeLine("System ready.");
  await runLoader();

  await typeLine("");
  await typeLine(SYSTEM.name);
  await typeLine(SYSTEM.role);
}
