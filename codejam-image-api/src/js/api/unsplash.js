import { state, stateToStorage } from '../state';
import { renderTownTool } from '../panels/town';

const API_URL = 'https://api.unsplash.com';
const GET_RND_PHOTO = '/photos/random';
const API_ACCESS_KEY = 'b5fd9af85c9e3187e9d8a1fa3e90f844f3aca08b0b5593b82186881e55dd14e7';

async function getLinkToImage() {
  state.isFetching = true;
  stateToStorage();
  renderTownTool();

  const { currentTown, currentSize } = state;
  const resizeQuery = `fit=fill&fill=solid&fill-color=c4c4c4&w=${currentSize}&h=${currentSize}`;
  try {
    const response = await fetch(
      `${API_URL}${GET_RND_PHOTO}?${resizeQuery}&query=town,${currentTown}&client_id=${API_ACCESS_KEY}`,
      { mode: 'cors' }
    );
    if (!response.ok) {
      throw new Error('Ошибка получения адреса картинки');
    }
    const data = await response.json();
    const url = `${data.urls.custom.split('?')[0]}?${resizeQuery}`;
    return url;
  } catch (e) {
    console.log(e);
  } finally {
    state.isFetching = false;
    stateToStorage();
    renderTownTool();
  }
}

export default getLinkToImage;
