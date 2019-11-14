import { state, fetchData, stateToStorage } from '../state';
import { drawCanvas, drawImage } from '../canvas/canvas';
import { initTownTool } from './town';

const sizeButtons = document.querySelectorAll('.aside-right__fsize');

const changeCanvasSize = async event => {
  const pressedSize = event.currentTarget;
  if (pressedSize.classList.contains('active')) {
    return;
  }
  const newSize = +pressedSize.dataset.size;
  sizeButtons.forEach(button => {
    if (+button.dataset.size === newSize) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  state.currentSize = +pressedSize.dataset.size;
  state.currentSource = pressedSize.dataset.src;
  initTownTool();
  stateToStorage();

  if (pressedSize.dataset.isImage === 'true') {
    drawImage();
  } else {
    await fetchData();
    drawCanvas();
  }
};

function initSizes() {
  const { currentSize } = state;
  sizeButtons.forEach(button => {
    button.addEventListener('click', changeCanvasSize);
    if (button.dataset.size === `${currentSize}`) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

export { sizeButtons, changeCanvasSize, initSizes };
