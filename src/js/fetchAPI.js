import axios from 'axios';

const API_KEY = '29195070-4290b3a14e9c6272ed637c4ff';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 40;

async function fetchPicture(searchQuery, page) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`
  );

  return response;
}

export default fetchPicture;
