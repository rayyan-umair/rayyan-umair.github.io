document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("boot-screen").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
  }
});

