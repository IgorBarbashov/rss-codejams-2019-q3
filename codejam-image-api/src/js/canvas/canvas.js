import { state, stateToStorage } from '../state';
import renderRules from './rules';
import errorHandler from '../errorHandler';
import {
  rgbToHex, convertImageToArray, preloaderOnMouse, onloadToPromise,
} from '../helpers';
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

async function convertToGrayscale() {
  if (!state.wasImageLoaded) {
    /* eslint-disable-next-line */
    alert('Сначала загрузите картинку с сервера');
    return;
  }
  preloaderOnMouse(true);
  state.isDrawing = true;
  const { currentCanvasState } = state;
  const addZeros = (str, count = 2) => `${'0'.repeat(count)}${str}`.slice(count * -1);

  await new Promise((resolve) => {
    setTimeout(async () => {
      state.currentCanvasState = currentCanvasState.map((row) => row.map((el) => {
        const r = parseInt(el.substr(1, 2), 16);
        const g = parseInt(el.substr(3, 2), 16);
        const b = parseInt(el.substr(5, 2), 16);
        const avg = Math.floor((r + g + b) / 3);
        const hexAvg = addZeros(avg.toString(16));
        const hexColor = `${hexAvg.repeat(3)}`;
        return `#${hexColor}`;
      }));
      stateToStorage();
      drawCanvas();
      resolve();
    }, 50);
  });
  preloaderOnMouse(false);
  state.isDrawing = false;
}

async function drawImage() {
  state.isFetching = true;
  preloaderOnMouse(true);
  renderTownTool();
  try {
    await new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { currentSource, currentSize } = state;
          const img = new Image();
          const imgPromise = onloadToPromise(img);
          img.src = currentSource;
          img.crossOrigin = 'Anonymous';
          const data = await imgPromise;
          state.currentCanvasState = convertImageToArray(data, currentSize);
          drawCanvas();
          stateToStorage();
          errorHandler('hide');
          resolve();
        } catch (e) {
          errorHandler('show');
          reject();
        }
      }, 50);
    });
  } catch (e) {
    console.log(e);
  } finally {
    preloaderOnMouse(false);
    state.isFetching = false;
    renderTownTool();
  }
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

async function fillArea(i, j) {
  preloaderOnMouse(true);
  state.isDrawing = true;

  const { currentSize, currentCanvasState, currentColor } = state;
  const fillFrom = currentCanvasState[i][j];
  if (fillFrom.toLowerCase() === currentColor.toLowerCase()) {
    preloaderOnMouse(false);
    return;
  }
  await new Promise((resolve) => {
    setTimeout(() => {
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
      resolve();
    }, 50);
  });
  state.isDrawing = false;
  preloaderOnMouse(false);
}

async function resizeCurentCanvas() {
  state.isDrawing = true;
  preloaderOnMouse(true);
  try {
    await new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { currentSize } = state;
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = currentSize;
          tempCanvas.height = currentSize;
          const tempCtx = tempCanvas.getContext('2d');

          const currentImage = canvas.toDataURL();
          const tempImage = new Image();
          const tempImagePromise = onloadToPromise(tempImage);
          tempImage.crossOrigin = 'Anonymous';
          tempImage.src = currentImage;
          const data = await tempImagePromise;

          tempCtx.drawImage(data, 0, 0, currentSize, currentSize);
          const newArray = convertImageToArray(tempImage, currentSize);
          state.currentCanvasState = newArray;

          stateToStorage();
          drawCanvas();
          resolve();
        } catch (e) {
          console.log('Ошибка при изменении размера картинки', e);
          reject();
        }
      }, 50);
    });
  } catch (e) {
    console.log(e);
  } finally {
    state.isDrawing = false;
    preloaderOnMouse(false);
  }
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
