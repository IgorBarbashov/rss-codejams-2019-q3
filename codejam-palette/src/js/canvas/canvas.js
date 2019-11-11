import state from '../state';
import renderRules from './rules';
import errorHandler from '../errorHandler';

const canvas = document.getElementById('canvas');
canvas.width = state.baseSize;
canvas.height = state.baseSize;
const ctx = canvas.getContext('2d');

async function drawCanvas() {
  const { currentSize, currentSource, baseSize } = state;
  const spriteSize = baseSize / currentSize;
  try {
    const response = await fetch(currentSource);
    if (!response.ok) {
      throw new Error('Server response is not OK');
    }
    const data = await response.json();
    data.forEach((row, i) => {
      row.forEach((column, j) => {
        ctx.fillStyle = Array.isArray(column)
          ? `rgba(${column[0]},${column[1]},${column[2]},${column[3]})`
          : `#${column}`;
        ctx.fillRect(spriteSize * i, spriteSize * j, spriteSize * (i + 1), spriteSize * (j + 1));
      });
    });
    errorHandler('hide');
  } catch (e) {
    /* eslint-disable-next-line */
    console.log('Ошибка получения данных от сервера:', e);
    errorHandler('show');
  }
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

export { drawCanvas, drawImage };
