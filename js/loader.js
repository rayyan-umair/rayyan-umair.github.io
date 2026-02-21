export function runLoader(){
  const loader=document.getElementById("loader");
  const bar=document.getElementById("loader-bar");
  loader.classList.remove("hidden");
  return new Promise(resolve=>{
    let p=0;
    const int=setInterval(()=>{
      p+=5;
      bar.style.width=p+"%";
      if(p>=100){
        clearInterval(int);
        setTimeout(()=>{
          loader.classList.add("hidden");
          resolve();
        },200);
      }
    },40);
  });
}
