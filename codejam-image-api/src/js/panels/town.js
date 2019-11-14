import { state, stateToStorage } from '../state';
import getLinkToImage from '../api/unsplash';
import { drawImage } from '../canvas/canvas';

const townButton = document.querySelector('.load-town');
const townInput = document.querySelector('.enter-town');

townButton.addEventListener('click', async () => {
  state.currentTown = townInput.value;
  const newSource = await getLinkToImage();
  state.currentSource = newSource;
  drawImage();
  stateToStorage();
});

function renderTownTool() {
  const { isLoadImageEnable, currentTown } = state;
  townInput.value = currentTown;

  if (isLoadImageEnable) {
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
