import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from "notiflix";
import api from "./getImages.js";
import "../../style.css";

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const goTopButton = document.getElementById("go-top-button");
let hits = {};
let perPage = 20;
let queryPage = 1;
let searchQuery = "";

async function onSearch(e) {
  e.preventDefault();
  queryPage = 1;
  const form = e.currentTarget;
  searchQuery = form.elements.query.value.trim();

  if (searchQuery) {
    clearHtml();

    hits = await getQuery();

    if (hits && hits.numberOfTotalHits) {
      Notiflix.Notify.success(
        `Hurra! Znaleźliśmy ${hits.numberOfTotalHits} obrazów!`
      );
    }
  } else {
    Notiflix.Notify.failure("Wprowadź frazę wyszukiwania!");
  }

  form.reset();
}

let lightbox;
let endOfResultsNotified = false;

async function onLoadMore() {
  if (perPage * queryPage >= hits.numberOfTotalHits) {
    if (!endOfResultsNotified) {
      Notiflix.Notify.info(
        "Przepraszamy, ale dotarłeś do końca wyników wyszukiwania."
      );
      endOfResultsNotified = true;
    }
    return;
  }
  queryPage += 1;

  if (lightbox) {
    lightbox.refresh();
  }
}

async function getQuery() {
  try {
    hits = await api({ perPage, queryPage, searchQuery });
    if (hits.arrayOfHits === undefined || hits.arrayOfHits.length === 0) {
      throw new Error();
    }

    const markUp = hits.arrayOfHits.reduce(
      (markUp, hit) => createPhotoCard(hit) + markUp,
      ""
    );

    gallery.insertAdjacentHTML("beforeend", markUp);
    lightbox = new SimpleLightbox(".photo-link");
    return hits;
  } catch (error) {
    Notiflix.Notify.failure(
      "Przepraszamy, nie ma obrazów pasujących do zapytania. Spróbuj ponownie."
    );
  }
}

function clearHtml() {
  gallery.innerHTML = "";
}

function createPhotoCard({ webformatURL, largeImageURL, tags }) {
  return `
    <li>
      <a class="photo-link" href="${largeImageURL}">
        <img class="img" src="${webformatURL}" alt="${tags}" />
      </a>
    </li>
  `;
}

const onClickTopHandler = (e) => {
  e.preventDefault();
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

goTopButton.addEventListener("click", onClickTopHandler);
form.addEventListener("submit", onSearch);
window.addEventListener("scroll", (e) => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight) {
    onLoadMore();
  }

  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    goTopButton.classList.add("go-top-button-visible");
  } else {
    goTopButton.classList.remove("go-top-button-visible");
  }
});

export {
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
};
