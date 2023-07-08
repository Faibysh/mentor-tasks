import Notiflix from "notiflix";

export function createBoxes(amount) {
  const boxesContainer = document.getElementById("boxes");

  if (amount === 0 || isNaN(amount)) {
    Notiflix.Notify.failure("Wprowadzono nieprawidłową wartość!");
    const input = document.querySelector(".js-input");
    input.value = "";
    return;
  }

  boxesContainer.innerHTML = "";

  for (let i = 0; i < amount; i++) {
    const box = document.createElement("div");
    box.style.width = `${30 + i * 10}px`;
    box.style.height = `${30 + i * 10}px`;
    box.style.backgroundColor = getRandomColor();
    box.style.marginTop = "10px";
    boxesContainer.appendChild(box);
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

const input = document.querySelector(".js-input");
const createButton = document.querySelector('[data-action="create"]');
const destroyButton = document.querySelector('[data-action="destroy"]');

createButton.addEventListener("click", () => {
  const amount = parseInt(input.value);
  if (!isNaN(amount)) {
    createBoxes(amount);
  }
});

destroyButton.addEventListener("click", destroyBoxes);
