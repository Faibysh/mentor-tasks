import SimpleLightbox from"simplelightbox";import"simplelightbox/dist/simple-lightbox.min.css";import Notiflix from"notiflix";import api from"./getImages.js";import"../../style.css";const form=document.querySelector(".search-form"),gallery=document.querySelector(".gallery"),goTopButton=document.getElementById("go-top-button");let lightbox,hits={},perPage=20,searchQuery="",endOfResultsNotified=!1,hasResults=!1;async function onSearch(e){e.preventDefault();const t=e.currentTarget;searchQuery=t.elements.query.value.trim(),searchQuery?(clearHtml(),endOfResultsNotified=!1,hasResults=!1,hits=await getQuery(),hits&&hits.numberOfTotalHits?(Notiflix.Notify.success(`Hurra! Znaleźliśmy ${hits.numberOfTotalHits} obrazów!`),hasResults=!0):(Notiflix.Notify.failure("Przepraszamy, nie ma obrazów pasujących do zapytania. Spróbuj ponownie."),hasResults=!1)):Notiflix.Notify.failure("Wprowadź frazę wyszukiwania!"),t.reset()}async function onLoadMore(){if(!hits||!hits.numberOfTotalHits||endOfResultsNotified)return;if(gallery.querySelectorAll("li").length>=hits.numberOfTotalHits)return Notiflix.Notify.info("Przepraszamy, ale dotarłeś do końca wyników wyszukiwania."),void(endOfResultsNotified=!0);const e=await getQuery();e&&e.arrayOfHits&&e.arrayOfHits.length>0&&lightbox.refresh()}async function getQuery(){try{const e=Math.ceil(gallery.querySelectorAll("li").length/perPage)+1,t=await api({perPage,queryPage:e,searchQuery});if(void 0===t.arrayOfHits||0===t.arrayOfHits.length)throw new Error;const o=Array.from(gallery.querySelectorAll(".photo-link")).map((e=>e.href)),r=t.arrayOfHits.filter((e=>!o.includes(e.largeImageURL))).reduce(((e,t)=>e+createPhotoCard(t)),"");return gallery.insertAdjacentHTML("beforeend",r),lightbox?lightbox.refresh():setTimeout((()=>{lightbox=new SimpleLightbox(".photo-link",{elements:".photo-link:not(.rendered)"})}),0),gallery.querySelectorAll(".photo-link").forEach((e=>{e.classList.add("rendered")})),t}catch(e){}}function clearHtml(){gallery.innerHTML="",hasResults=!1}function createPhotoCard({webformatURL:e,largeImageURL:t,tags:o}){return`\n    <li>\n      <a class="photo-link" href="${t}" data-lightbox="photo">\n        <img class="img" src="${e}" alt="${o}" />\n      </a>\n    </li>\n  `}const onClickTopHandler=e=>{e.preventDefault(),document.body.scrollTop=0,document.documentElement.scrollTop=0};goTopButton.addEventListener("click",onClickTopHandler),form.addEventListener("submit",onSearch),window.addEventListener("scroll",(e=>{const{scrollTop:t,scrollHeight:o,clientHeight:r}=document.documentElement;t+r>=o&&onLoadMore(),document.body.scrollTop>20||document.documentElement.scrollTop>20?goTopButton.classList.add("go-top-button-visible"):goTopButton.classList.remove("go-top-button-visible")})),window.addEventListener("DOMContentLoaded",(async()=>{searchQuery="Information Technology";try{hits=await getQuery(),hits&&hits.numberOfTotalHits&&(hasResults=!0)}catch(e){e instanceof TypeError&&"Cannot read properties of undefined (reading 'numberOfTotalHits')"===e.message&&Notiflix.Notify.failure("Przepraszamy, nie ma obrazów pasujących do zapytania. Spróbuj ponownie.")}finally{hasResults||Notiflix.Notify.failure("Przepraszamy, nie ma obrazów pasujących do zapytania. Spróbuj ponownie.")}}));