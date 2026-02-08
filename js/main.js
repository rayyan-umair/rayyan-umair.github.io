console.log("main.js loaded");

document.addEventListener("keydown", (e) => {
  console.log("Key pressed:", e.key);

  if (e.key === "Enter") {
    const boot = document.getElementById("boot-screen");
    const app = document.getElementById("app");

    if (boot && app) {
      boot.style.display = "none";
      app.classList.remove("hidden");
    } else {
      console.error("Boot or App element not found");
    }
  }
});
