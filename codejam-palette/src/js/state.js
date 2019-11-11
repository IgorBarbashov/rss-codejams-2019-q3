import errorHandler from './errorHandler';

let state = {
  isDrawing: false,
  currentTool: 'pencil',
  isShowRules: true,
  baseSize: 512,
  currentSize: 4,
  currentSource: './assets/data/4x4.json',
  maxGridCapacity: 64,
  currentCanvasState: null,
  currentColor: '#41f795',
  prevColor: '#ffeb3b',
};

const defaultSize = 4;
const defaultCanvasState = new Array(defaultSize).fill(new Array(defaultSize).fill('cccccc'));

async function fetchData() {
  const { currentSource } = state;
  try {
    const response = await fetch(currentSource);
    if (!response.ok) {
      throw new Error('Server response is not OK');
    }
    const data = await response.json();
    state.currentCanvasState = data;
    stateToStorage();
    errorHandler('hide');
  } catch {
    state.currentSize = defaultSize;
    state.currentCanvasState = defaultCanvasState;
    stateToStorage();
    errorHandler('show');
  }
}

function stateToStorage() {
  try {
    const stringifiedState = JSON.stringify(state);
    localStorage.setItem('savedState', stringifiedState);
  } catch (e) {
    console.log('Ошибка при сохранении данных', e);
  }
}

async function initState() {
  const savedState = localStorage.getItem('savedState');
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);
      state = parsedState;
      state.isDrawing = false;
    } catch (e) {
      console.log('Ошибка восстановления сохраненных данных', e);
    }
  }
  if (state.currentCanvasState === null) {
    await fetchData();
  }
}

export { stateToStorage, initState, fetchData, state };
