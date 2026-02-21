import { MODULES } from "./config.js";

export function initNodes(){
  const layer=document.getElementById("node-layer");
  MODULES.forEach(m=>{
    const btn=document.createElement("button");
    btn.className="node";
    btn.textContent=m.label;
    btn.style.left=m.x+"%";
    btn.style.top=m.y+"%";
    btn.onclick=()=>document.dispatchEvent(
      new CustomEvent("node:selected",{detail:m.id})
    );
    layer.appendChild(btn);
  });
}
