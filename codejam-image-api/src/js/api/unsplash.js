import { state, stateToStorage } from '../state';
import { renderTownTool } from '../panels/town';

const API_URL = 'https://api.unsplash.com';
const GET_RND_PHOTO = '/photos/random';
const API_ACCESS_KEY = 'a20766416cd49e7e0867bacd51e4e24ea537ecda23853cc7c291461e79eeeb46';

async function getLinkToImage() {
  state.isFetching = true;
  stateToStorage();
  renderTownTool();

  const { currentTown, currentSize } = state;
  const resizeQuery = `fit=fill&fill=solid&fill-color=c4c4c4&w=${currentSize}&h=${currentSize}`;
  try {
    const response = await fetch(
      `${API_URL}${GET_RND_PHOTO}?${resizeQuery}&query=town,${currentTown}&client_id=${API_ACCESS_KEY}`,
      { mode: 'cors' },
    );
    if (!response.ok) {
      throw new Error('Ошибка получения адреса картинки');
    }

    const data = await response.json();
    const url = `${data.urls.custom.split('?')[0]}?${resizeQuery}`;
    document.querySelector('.grayscale-button').classList.remove('disable');
    state.wasImageLoaded = true;
    return url;
  } catch (e) {
    console.log('Ошибка при получении данных по API', e);
    throw e;
  } finally {
    state.isFetching = false;
    stateToStorage();
    renderTownTool();
  }
}

export default getLinkToImage;
