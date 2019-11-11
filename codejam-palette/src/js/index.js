import state from './state';
import { drawCanvas, drawImage } from './canvas';

const sizeButtons = document.querySelectorAll('.aside-right__fsize');

sizeButtons.forEach(el => {
  el.addEventListener('click', () => {
    if (el.classList.contains('active')) {
      return;
    }
    sizeButtons.forEach(button => button.classList.remove('active'));
    el.classList.add('active');
    if (el.dataset.isImage === 'true') {
      drawImage(el.dataset.size, el.dataset.src);
    } else {
      drawCanvas(el.dataset.size, el.dataset.src);
    }
  });
});

drawCanvas(state.defaultSize, state.defaultSource);
