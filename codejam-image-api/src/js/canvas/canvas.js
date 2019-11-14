import { state, stateToStorage } from '../state';
import renderRules from './rules';
import errorHandler from '../errorHandler';
import { rgbToHex, convertImageToArray } from '../helpers';

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

function convertToGrayscale() {
  const { currentSize, currentCanvasState } = state;
  state.currentCanvasState = currentCanvasState.map((row) =>
    row.map((el) => {
      console.log('el', el);
      const r = parseInt(el.substr(0, 2), 16);
      console.log('r', r);
      const g = parseInt(el.substr(2, 2), 16);
      console.log('el.slice(2, 2)', el.substr(2, 2));
      console.log('g', g);
      const b = parseInt(el.substr(4, 2), 16);
      console.log('b', b);
      const avg = Math.floor((r + g + b) / 3);
      console.log('avg', avg);
      const hexAvg = avg.toString(16);
      console.log('hexAvg', hexAvg);
      const hexColor = hexAvg.repeat(3);
      console.log('hexColor', hexColor);
      return hexColor;
    }),
  );
  stateToStorage();
  drawCanvas();
}

function drawImage() {
  const { currentSource, currentSize } = state;
  const img = new Image();
  img.src = currentSource;
  img.crossOrigin = 'Anonymous';
  img.addEventListener('load', () => {
    state.currentCanvasState = convertImageToArray(img, currentSize);
    drawCanvas();
    stateToStorage();
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
    const hexColor = rgbToHex(rgbaColor);
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
  const pixels = [[i, j], [i, j], 'end'];
  while (pixels.length !== 1) {
    const [x, y] = pixels.shift();
    if (x + 1 < currentSize && currentCanvasState[x + 1][y] === fillFrom) {
      pixels.unshift([x + 1, y]);
    }
    if (x - 1 >= 0 && currentCanvasState[x - 1][y] === fillFrom) {
      pixels.unshift([x - 1, y]);
    }
    if (y + 1 < currentSize && currentCanvasState[x][y + 1] === fillFrom) {
      pixels.unshift([x, y + 1]);
    }
    if (y - 1 >= 0 && currentCanvasState[x][y - 1] === fillFrom) {
      pixels.unshift([x, y - 1]);
    }
    currentCanvasState[x][y] = fillTo;
  }
  state.isDrawing = false;
}

async function resizeCurentCanvas() {
  state.isDrawing = true;
  const { currentSize } = state;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = currentSize;
  tempCanvas.height = currentSize;
  const tempCtx = tempCanvas.getContext('2d');

  const currentImage = canvas.toDataURL();
  const tempImage = new Image();
  tempImage.src = currentImage;

  tempImage.addEventListener('load', () => {
    tempCtx.drawImage(tempImage, 0, 0, currentSize, currentSize);

    const newArray = convertImageToArray(tempImage, currentSize);
    state.currentCanvasState = newArray;
    stateToStorage();
    drawCanvas();
    state.isDrawing = false;
  });
}

export {
 drawCanvas, drawImage, getPixelColor, fillArea, resizeCurentCanvas, convertToGrayscale 
};
