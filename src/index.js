import { fetchPicture } from './js/fetchAPI';
import { renderMarkup } from './js/render-markup';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

Notify.init({
  width: '50%',
});

const simpleLightBox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
  captionSelector: 'img',
});

let searchQuery = '';
let page = 1;
const perPage = 40;

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearchForm);
refs.loadMore.addEventListener('click', onLoadMore);

refs.loadMore.classList.add('is-hidden');

async function onSearchForm(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.searchQuery.value.trim();
  refs.gallery.innerHTML = '';
  resetPage();

  if (searchQuery === '') {
    return;
  }

  const response = await fetchPicture(searchQuery, page, perPage);
  const data = response.data;
  console.log(response.data);

  if (data.totalHits === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    await renderMarkup(data.hits);
    simpleLightBox.refresh();
    refs.searchForm.reset();
  }
}

async function onLoadMore() {
  increment();
  const response = await fetchPicture(searchQuery, page, perPage);
  const data = response.data;

  renderMarkup(data.hits);
  await simpleLightBox.refresh();
  scrollGallery();

  if (page * 40 > data.totalHits) {
    refs.loadMore.classList.add('is-hidden');
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
  refs.loadMore.classList.add('is-hidden');
}

function increment() {
  page += 1;
}

function resetPage() {
  page = 1;
}

async function scrollGallery() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
