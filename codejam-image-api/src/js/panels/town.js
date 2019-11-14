import { state, stateToStorage } from '../state';
import { getLinkToImage } from '../api/unsplash';

const townButton = document.querySelector('.load-town');
const townInput = document.querySelector('.enter-town');
townButton.addEventListener('click', () => console.log(townInput.value));

function renderTownTool() {
  const { isLoadImageEnable } = state;
  console.log('isLoadImageEnable:', isLoadImageEnable);

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
  renderTownTool();
}

export { initTownTool, renderTownTool };
