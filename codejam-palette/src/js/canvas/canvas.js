import { state } from '../state';
import renderRules from './rules';
import errorHandler from '../errorHandler';

const canvas = document.getElementById('canvas');
canvas.width = state.baseSize;
canvas.height = state.baseSize;
const ctx = canvas.getContext('2d');

function drawCanvas() {
  const { currentSize, currentCanvasState, baseSize } = state;
  const spriteSize = baseSize / currentSize;
  currentCanvasState.forEach((row, i) => {
    row.forEach((column, j) => {
      ctx.fillStyle = Array.isArray(column)
        ? `rgba(${column[0]},${column[1]},${column[2]},${column[3]})`
        : `#${column}`;
      ctx.fillRect(spriteSize * i, spriteSize * j, spriteSize * (i + 1), spriteSize * (j + 1));
    });
  });
  renderRules();
}

function drawImage() {
  const { baseSize, currentSource } = state;
  const img = new Image();
  img.src = currentSource;
  img.addEventListener('load', () => {
    ctx.drawImage(img, 0, 0, baseSize, baseSize);
    errorHandler('hide');
  });
  img.addEventListener('error', () => {
    errorHandler('show');
  });
  renderRules();
}

function getPixelColor(x, y) {
  try {
    const rgbaColor = ctx.getImageData(x, y, 1, 1).data;
    const hexColor = rgbaColor
      .slice(0, 3)
      .reduce((acc, el) => `${acc}${el.toString(16)}`, '000000')
      .slice(-6);
    return `#${hexColor}`;
  } catch (e) {
    console.log('Ошибка при получении цвета точки', e);
  }
  return state.currentColor;
}

export { drawCanvas, drawImage, getPixelColor };
