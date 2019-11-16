import { state, stateToStorage } from '../state';
import getLinkToImage from '../api/unsplash';
import { drawImage } from '../canvas/canvas';
import { preloaderOnMouse } from '../helpers';

const townButton = document.querySelector('.load-town');
const townInput = document.querySelector('.enter-town');

townInput.addEventListener('focusin', () => {
  state.isInputFocus = true;
});
townInput.addEventListener('focusout', () => {
  state.isInputFocus = false;
});

townButton.addEventListener('click', async () => {
  preloaderOnMouse(true);
  state.currentTown = townInput.value;
  const newSource = await getLinkToImage();
  state.currentSource = newSource;
  await drawImage();
  stateToStorage();
});

function renderTownTool() {
  const { isLoadImageEnable, currentTown, isFetching } = state;
  townInput.value = currentTown;

  if (isLoadImageEnable && !isFetching) {
    townButton.removeAttribute('disabled', isLoadImageEnable);
    townInput.removeAttribute('disabled', isLoadImageEnable);
  } else {
    townButton.setAttribute('disabled', isLoadImageEnable);
    townInput.setAttribute('disabled', isLoadImageEnable);
  }
}

function initTownTool() {
  const { currentSize } = state;
  state.isLoadImageEnable = currentSize >= 128;
  stateToStorage();
  renderTownTool();
}

export { initTownTool, renderTownTool };
