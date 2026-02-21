import { typeLine } from "./terminal.js";
import { runLoader } from "./loader.js";
import { initGlobe } from "./visuals.js";
import { initNodes } from "./nodes.js";
import { initOverlay } from "./overlays.js";

let started=false;

document.addEventListener("keydown", async e=>{
  if(e.key==="Enter" && !started){
    started=true;
    await startBoot();
  }
});

async function startBoot(){
  await typeLine("[BOOT] Initializing secure runtime environment...");
  await typeLine("[NET] Verifying network integrity...");
  await typeLine("[AUTH] Validating system identity...");
  await typeLine("[CORE] Loading operational modules...");
  await typeLine("[OK] Environment stable.");

  await runLoader();

  const identity=document.getElementById("identity");
  identity.classList.remove("hidden");
  setTimeout(()=>identity.classList.add("show"),100);

  identity.onclick=()=>{
    identity.style.opacity=0;
    setTimeout(()=>{
      identity.remove();
      initGlobe();
      initNodes();
      initOverlay();
    },800);
  };
}
