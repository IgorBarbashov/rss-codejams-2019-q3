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

function fillArea(i, j) {
  state.isDrawing = true;
  const { currentSize, currentCanvasState, currentColor } = state;
  const fillFrom = currentCanvasState[i][j];
  const fillTo = currentColor.slice(1);
  if (fillFrom.toLowerCase() === fillTo.toLowerCase()) {
    return;
  }
  function fillCell(x, y) {
    currentCanvasState[x][y] = fillTo;
    drawCanvas();
    if (x + 1 < currentSize && currentCanvasState[x + 1][y] === fillFrom) {
      fillCell(x + 1, y);
    }
    if (x - 1 >= 0 && currentCanvasState[x - 1][y] === fillFrom) {
      fillCell(x - 1, y);
    }
    if (y + 1 < currentSize && currentCanvasState[x][y + 1] === fillFrom) {
      fillCell(x, y + 1);
    }
    if (y - 1 >= 0 && currentCanvasState[x][y - 1] === fillFrom) {
      fillCell(x, y - 1);
    }
    currentCanvasState[x][y] = fillTo;
  }
  fillCell(i, j);
  state.isDrawing = false;
}

export {
 drawCanvas, drawImage, getPixelColor, fillArea 
};
