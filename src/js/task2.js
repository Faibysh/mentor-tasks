export function createBoxes(amount) {
  const boxesContainer = document.getElementById("boxes");
  const existingBoxes = boxesContainer.children;
  const existingBoxCount = existingBoxes.length;

  if (amount > existingBoxCount) {
    for (let i = existingBoxCount; i < amount; i++) {
      const box = document.createElement("div");
      box.style.width = `${30 + i * 10}px`;
      box.style.height = `${30 + i * 10}px`;
      box.style.backgroundColor = getRandomColor();
      boxesContainer.appendChild(box);
    }
  } else if (amount < existingBoxCount) {
    for (let i = existingBoxCount - 1; i >= amount; i--) {
      boxesContainer.removeChild(existingBoxes[i]);
    }
  } else {
    for (let i = 0; i < existingBoxCount; i++) {
      const box = existingBoxes[i];
      box.style.backgroundColor = getRandomColor();
    }
  }

  const input = document.querySelector(".js-input");
  input.value = "";
}

export function destroyBoxes() {
  const boxesContainer = document.getElementById("boxes");
  boxesContainer.innerHTML = "";
}

function getRandomColor() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
}
