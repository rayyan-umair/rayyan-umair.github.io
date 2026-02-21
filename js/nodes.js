const nodeContainer = document.getElementById("node-container");

function showIdentity() {
  document.getElementById("loader-screen").classList.add("hidden");
  document.getElementById("identity-screen").classList.remove("hidden");
}

document.getElementById("enter-interface").addEventListener("click", () => {
  document.getElementById("identity-screen").classList.add("hidden");
  nodeContainer.classList.remove("hidden");
  createNodes();
});

function createNodes() {
  NODES.forEach(n => {
    const node = document.createElement("div");
    node.className = "node";
    node.style.left = n.x + "%";
    node.style.top = n.y + "%";

    node.addEventListener("click", () => openOverlay(n.content));
    nodeContainer.appendChild(node);
  });
}
