import state from '../state';
import { drawCanvas, drawImage } from '../canvas/canvas';

const sizeButtons = document.querySelectorAll('.aside-right__fsize');

const changeCanvasSize = event => {
  const pressedSize = event.currentTarget;
  if (pressedSize.classList.contains('active')) {
    return;
  }
  sizeButtons.forEach(button => button.classList.remove('active'));
  pressedSize.classList.add('active');

  state.currentSize = pressedSize.dataset.size;
  state.currentSource = pressedSize.dataset.src;

  if (pressedSize.dataset.isImage === 'true') {
    drawImage();
  } else {
    drawCanvas();
  }
};

export { sizeButtons, changeCanvasSize };
