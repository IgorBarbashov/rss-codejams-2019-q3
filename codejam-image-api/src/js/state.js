import errorHandler from './errorHandler';
import { rgbToHex, convertImageToArray, onloadToPromise } from './helpers';

const defaultSize = 128;
const defaultCanvasState = new Array(defaultSize)
  .fill(0)
  .map(() => new Array(defaultSize).fill('cccccc'));

let state = {
  prevX: null,
  prevY: null,
  isDrawing: false,
  currentTool: 'pencil',
  isShowRules: true,
  baseSize: 512,
  currentSize: defaultSize,
  currentSource: '',
  maxGridCapacity: 32,
  currentCanvasState: null,
  currentColor: '#41f795',
  prevColor: '#ffeb3b',
  currentTown: 'Nizhny Novgorod',
  isLoadImageEnable: false,
};

function stateToStorage() {
  try {
    const stringifiedState = JSON.stringify(state);
    localStorage.setItem('savedState', stringifiedState);
  } catch (e) {
    console.log('Ошибка при сохранении данных', e);
  }
}

async function fetchData() {
  const { currentSource, currentSize } = state;
  try {
    const response = await fetch(currentSource);
    if (!response.ok) {
      throw new Error('Server response is not OK');
    }
    if (response.headers.get('Content-Type').startsWith('image')) {
      const blob = await response.blob();
      const img = document.createElement('img');
      const imgPromise = onloadToPromise(img);
      img.src = URL.createObjectURL(blob);
      const data = await imgPromise;
      const dataInArray = convertImageToArray(data, currentSize);
      state.currentCanvasState = dataInArray;
    } else {
      const data = await response.json();
      state.currentCanvasState = data.map(row =>
        row.map(cell => (Array.isArray(cell) ? rgbToHex(cell) : cell))
      );
    }
    stateToStorage();
    errorHandler('hide');
  } catch {
    state.currentSize = defaultSize;
    state.currentCanvasState = defaultCanvasState;
    stateToStorage();
    errorHandler('show');
  }
}

async function initState() {
  const savedState = localStorage.getItem('savedState');
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);
      state = parsedState;
      state.isDrawing = false;
      state.prevX = null;
      state.prevY = null;
      currentSource = '';
    } catch (e) {
      console.log('Ошибка восстановления сохраненных данных', e);
    }
  }
  if (state.currentCanvasState === null) {
    const sizeButtons = document.querySelectorAll('.aside-right__fsize');
    const sizeButtonsWithSource = [...sizeButtons].filter(el => {
      return +el.dataset.size === state.currentSize && el.dataset.src;
    });
    if (sizeButtonsWithSource.length) {
      state.currentSource = sizeButtonsWithSource[0].dataset.src;
      await fetchData();
    } else {
      state.currentCanvasState = defaultCanvasState;
    }
  }
}

export { stateToStorage, initState, fetchData, state };
