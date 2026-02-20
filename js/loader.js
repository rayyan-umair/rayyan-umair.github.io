export function runLoader() {
  const loader = document.getElementById("loader");
  const bar = document.getElementById("loader-bar");

  loader.classList.remove("hidden");

  return new Promise((resolve) => {
    let progress = 0;

    const interval = setInterval(() => {
      progress += 5;
      bar.style.width = progress + "%";

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add("hidden");
          resolve();
        }, 300);
      }
    }, 40);
  });
}
