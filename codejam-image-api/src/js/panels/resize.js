import { state, fetchData, stateToStorage } from '../state';
import { drawCanvas, drawImage } from '../canvas/canvas';

const sizeButtons = document.querySelectorAll('.aside-right__fsize');

const changeCanvasSize = async (event) => {
  const pressedSize = event.currentTarget;
  if (pressedSize.classList.contains('active')) {
    return;
  }
  sizeButtons.forEach((button) => button.classList.remove('active'));
  pressedSize.classList.add('active');

  state.currentSize = +pressedSize.dataset.size;
  state.currentSource = pressedSize.dataset.src;
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
  sizeButtons.forEach((button) => {
    button.addEventListener('click', changeCanvasSize);
    if (button.dataset.size === `${currentSize}`) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

export { sizeButtons, changeCanvasSize, initSizes };
