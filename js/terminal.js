export function printLine(text) {
  const output = document.getElementById("terminal-output");
  const line = document.createElement("div");
  line.textContent = text;
  output.appendChild(line);
}

export function typeLine(text, speed = 30) {
  return new Promise((resolve) => {
    const output = document.getElementById("terminal-output");
    const line = document.createElement("div");
    output.appendChild(line);

    let i = 0;

    function type() {
      if (i < text.length) {
        line.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }

    type();
  });
}
