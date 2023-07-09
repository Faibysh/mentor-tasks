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
let searchQuery = "";
let endOfResultsNotified = false;
let hasResults = false;

async function onSearch(e) {
  e.preventDefault();
  const form = e.currentTarget;
  searchQuery = form.elements.query.value.trim();

  if (searchQuery) {
    clearHtml();
    endOfResultsNotified = false;
    hasResults = false;

    hits = await getQuery();

    if (hits && hits.numberOfTotalHits) {
      Notiflix.Notify.success(
        `Hurra! Znaleźliśmy ${hits.numberOfTotalHits} obrazów!`
      );
      hasResults = true;
    } else {
      Notiflix.Notify.failure(
        "Przepraszamy, nie ma obrazów pasujących do zapytania. Spróbuj ponownie."
      );
      hasResults = false;
    }
  } else {
    Notiflix.Notify.failure("Wprowadź frazę wyszukiwania!");
  }

  form.reset();
}

let lightbox;

async function onLoadMore() {
  if (!hits || !hits.numberOfTotalHits || endOfResultsNotified) {
    return;
  }

  const currentResults = gallery.querySelectorAll("li").length;

  if (currentResults >= hits.numberOfTotalHits) {
    Notiflix.Notify.info(
      "Przepraszamy, ale dotarłeś do końca wyników wyszukiwania."
    );
    endOfResultsNotified = true;
    return;
  }

  const newHits = await getQuery();
  if (newHits && newHits.arrayOfHits && newHits.arrayOfHits.length > 0) {
    lightbox.refresh();
  }
}

async function getQuery() {
  try {
    const queryPage =
      Math.ceil(gallery.querySelectorAll("li").length / perPage) + 1;
    const newHits = await api({ perPage, queryPage, searchQuery });
    if (newHits.arrayOfHits === undefined || newHits.arrayOfHits.length === 0) {
      throw new Error();
    }

    const existingImageUrls = Array.from(
      gallery.querySelectorAll(".photo-link")
    ).map((link) => link.href);

    const uniqueHits = newHits.arrayOfHits.filter(
      (hit) => !existingImageUrls.includes(hit.largeImageURL)
    );

    const markUp = uniqueHits.reduce(
      (markUp, hit) => markUp + createPhotoCard(hit),
      ""
    );

    gallery.insertAdjacentHTML("beforeend", markUp);

    if (!lightbox) {
      setTimeout(() => {
        lightbox = new SimpleLightbox(".photo-link", {
          elements: ".photo-link:not(.rendered)",
        });
      }, 0);
    } else {
      lightbox.refresh();
    }

    gallery.querySelectorAll(".photo-link").forEach((link) => {
      link.classList.add("rendered");
    });

    return newHits;
  } catch (error) {}
}

function clearHtml() {
  gallery.innerHTML = "";
  hasResults = false;
}

function createPhotoCard({ webformatURL, largeImageURL, tags }) {
  return `
    <li>
      <a class="photo-link" href="${largeImageURL}" data-lightbox="photo">
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

window.addEventListener("DOMContentLoaded", async () => {
  searchQuery = "Information Technology";
  try {
    hits = await getQuery();
    if (hits && hits.numberOfTotalHits) {
      hasResults = true;
    }
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message ===
        "Cannot read properties of undefined (reading 'numberOfTotalHits')"
    ) {
      Notiflix.Notify.failure(
        "Przepraszamy, nie ma obrazów pasujących do zapytania. Spróbuj ponownie."
      );
    }
  } finally {
    if (!hasResults) {
      Notiflix.Notify.failure(
        "Przepraszamy, nie ma obrazów pasujących do zapytania. Spróbuj ponownie."
      );
    }
  }
});
