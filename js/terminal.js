export function typeLine(text, speed=30){
  return new Promise(resolve=>{
    const out=document.getElementById("terminal-output");
    const line=document.createElement("div");
    out.appendChild(line);
    let i=0;
    function type(){
      if(i<text.length){
        line.textContent+=text[i++];
        setTimeout(type,speed);
      } else resolve();
    }
    type();
  });
}
