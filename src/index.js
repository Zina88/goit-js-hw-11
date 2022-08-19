import { fetchPicture } from './js/fetchAPI';
import { renderMarkup } from './js/render-markup';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

Notify.init({
  width: '50%',
});

let simpleLightBox = new SimpleLightbox('.photo-card a', {
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

function onSearchForm(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.searchQuery.value.trim();
  refs.gallery.innerHTML = '';
  resetPage();

  if (searchQuery !== '') {
    fetchPicture(searchQuery, page, perPage)
      .then(({ data }) => {
        if (data.totalHits === 0) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        renderMarkup(data.hits);
        simpleLightBox.refresh();

        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });

        if (data.totalHits > 40) {
          refs.loadMore.classList.remove('is-hidden');
        } else {
          refs.loadMore.classList.add('is-hidden');
        }
      })
      .catch(error => console.log(error))
      .finally(() => {
        refs.searchForm.reset();
      });
  }
}

function onLoadMore() {
  increment();
  fetchPicture(searchQuery, page, perPage).then(({ data }) => {
    renderMarkup(data.hits);

    if (page * 40 > data.totalHits) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

function increment() {
  page += 1;
}

function resetPage() {
  page = 1;
}
