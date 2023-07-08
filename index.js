import "./style.css";
import * as stringBuilder from "./src/js/task1.js";
import { createBoxes, destroyBoxes } from "./src/js/task2.js";
import {
  form,
  gallery,
  goTopButton,
  hits,
  perPage,
  queryPage,
  searchQuery,
  onSearch,
  onLoadMore,
  getQuery,
  clearHtml,
  createPhotoCard,
} from "./src/js/task3.js";

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
