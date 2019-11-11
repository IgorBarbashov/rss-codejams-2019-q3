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

  state.currenttSize = pressedSize.dataset.size;
  state.currenttSource = pressedSize.dataset.src;

  if (pressedSize.dataset.isImage === 'true') {
    drawImage(pressedSize.dataset.size, pressedSize.dataset.src);
  } else {
    drawCanvas(pressedSize.dataset.size, pressedSize.dataset.src);
  }
};

export { sizeButtons, changeCanvasSize };
