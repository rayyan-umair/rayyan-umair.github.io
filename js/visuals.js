export function initGlobe(){
  const canvas=document.getElementById("globe");
  const ctx=canvas.getContext("2d");

  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;

  const points=[];
  for(let i=0;i<120;i++){
    points.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height
    });
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#00ff88";
    points.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,1.5,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  draw();
}
