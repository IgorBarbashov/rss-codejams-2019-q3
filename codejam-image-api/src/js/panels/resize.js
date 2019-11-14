import { state, fetchData, stateToStorage } from '../state';
import { drawCanvas, drawImage, resizeCurentCanvas } from '../canvas/canvas';
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
  state.currentSize = newSize;

  if (pressedSize.dataset.src) {
    state.currentSource = pressedSize.dataset.src;
    if (pressedSize.dataset.isImage === 'true') {
      drawImage();
    } else {
      await fetchData();
      drawCanvas();
    }
  } else {
    resizeCurentCanvas();
  }

  initTownTool();
  stateToStorage();
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
