import errorHandler from './errorHandler';

const state = {
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
const defaultCanvasState = new Array(state.defaultSize).fill(
  new Array(state.defaultSize).fill('cccccc')
);

async function fetchData() {
  const { currentSource } = state;
  try {
    const response = await fetch(currentSource);
    if (!response.ok) {
      throw new Error('Server response is not OK');
    }
    const data = await response.json();
    state.currentCanvasState = data;
    errorHandler('hide');
  } catch {
    state.currentSize = defaultSize;
    state.currentCanvasState = defaultCanvasState;
    errorHandler('show');
  }
}

async function initState() {
  if (state.currentCanvasState === null) {
    await fetchData();
  }
}

export { initState, fetchData, state };

// paint-bucket
// choose-color
// pencil
