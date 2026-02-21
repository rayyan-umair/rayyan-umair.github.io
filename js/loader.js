function startLoader() {
  const progress = document.querySelector(".loader-progress");
  let width = 0;

  const interval = setInterval(() => {
    width += 5;
    progress.style.width = width + "%";

    if (width >= 100) {
      clearInterval(interval);
      showIdentity();
    }
  }, 40);
}
