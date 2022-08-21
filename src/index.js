import fetchPicture from './js/fetchAPI';
import renderMarkup from './js/render-markup';
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
  if (searchQuery === '') {
    return;
  }
  refs.gallery.innerHTML = '';
  resetPage();

  const response = await fetchPicture(searchQuery, page);
  const data = response.data;

  try {
    if (data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (data.totalHits < 40) {
      refs.loadMore.classList.add('is-hidden');
      renderMarkup(data.hits);
      simpleLightBox.refresh();
    } else {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      renderMarkup(data.hits);
      simpleLightBox.refresh();
      refs.searchForm.reset();
      refs.loadMore.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  increment();
  const response = await fetchPicture(searchQuery, page);
  const data = response.data;
  renderMarkup(data.hits);
  simpleLightBox.refresh();
  scrollGallery();

  if (page * 40 > data.totalHits) {
    refs.loadMore.classList.add('is-hidden');
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
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
