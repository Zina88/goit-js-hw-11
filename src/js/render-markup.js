const refs = {
  gallery: document.querySelector('.gallery'),
};

async function renderMarkup(images) {
  const markup = images
    .map(img => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = img;
      return `
      <div class="photo-card">
          <a class="photo-link" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
        <div class="info">
          <p class="info-item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${downloads}</b>
          </p>
        </div>
      </div>
        `;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

export default renderMarkup;
