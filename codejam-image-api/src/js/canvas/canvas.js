import { state, stateToStorage } from '../state';
import renderRules from './rules';
import errorHandler from '../errorHandler';
import { rgbToHex, convertImageToArray } from '../helpers';
import { renderTownTool } from '../panels/town';

const canvas = document.getElementById('canvas');
canvas.width = state.baseSize;
canvas.height = state.baseSize;
const ctx = canvas.getContext('2d');

function drawPixel(x, y) {
  const { currentSize, currentColor, baseSize } = state;
  const spriteSize = baseSize / currentSize;
  ctx.fillStyle = currentColor;
  ctx.fillRect(spriteSize * x, spriteSize * y, spriteSize, spriteSize);
}

function drawCanvas() {
  const { currentSize, currentCanvasState, baseSize } = state;
  const spriteSize = baseSize / currentSize;
  currentCanvasState.forEach((row, i) => {
    row.forEach((column, j) => {
      ctx.fillStyle = column;
      ctx.fillRect(spriteSize * i, spriteSize * j, spriteSize, spriteSize);
    });
  });
  renderRules();
}

function convertToGrayscale() {
  const { currentCanvasState } = state;
  const addZeros = (str, count = 2) => `${'0'.repeat(count)}${str}`.slice(count * -1);

  state.currentCanvasState = currentCanvasState.map((row) =>
    row.map((el) => {
      const r = parseInt(el.substr(1, 2), 16);
      const g = parseInt(el.substr(3, 2), 16);
      const b = parseInt(el.substr(5, 2), 16);
      const avg = Math.floor((r + g + b) / 3);
      const hexAvg = addZeros(avg.toString(16));
      const hexColor = `${hexAvg.repeat(3)}`;
      return `#${hexColor}`;
    }),
  );
  stateToStorage();
  drawCanvas();
}

function drawImage() {
  state.isFetching = true;
  renderTownTool();

  const { currentSource, currentSize } = state;
  const img = new Image();
  img.src = currentSource;
  img.crossOrigin = 'Anonymous';
  img.addEventListener('load', () => {
    try {
      state.currentCanvasState = convertImageToArray(img, currentSize);
    } catch (e) {
      errorHandler('show');
      console.log('Ошибка преобразования данных', e);
    }

    state.isFetching = false;
    renderTownTool();
    drawCanvas();
    stateToStorage();
    errorHandler('hide');
  });
  img.addEventListener('error', () => {
    errorHandler('show');
    state.isFetching = false;
    renderTownTool();
  });
  renderRules();
}

function getPixelColor(x, y) {
  try {
    const rgbaColor = ctx.getImageData(x, y, 1, 1).data;
    const hexColor = rgbToHex(rgbaColor);
    return hexColor;
  } catch (e) {
    console.log('Ошибка при получении цвета точки', e);
  }
  return state.currentColor;
}

function fillArea(i, j) {
  state.isDrawing = true;
  const { currentSize, currentCanvasState, currentColor } = state;
  const fillFrom = currentCanvasState[i][j];
  if (fillFrom.toLowerCase() === currentColor.toLowerCase()) {
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
    currentCanvasState[x][y] = currentColor;
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
  tempImage.crossOrigin = 'Anonymous';
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
  drawCanvas,
  drawImage,
  getPixelColor,
  fillArea,
  resizeCurentCanvas,
  convertToGrayscale,
  drawPixel,
};
