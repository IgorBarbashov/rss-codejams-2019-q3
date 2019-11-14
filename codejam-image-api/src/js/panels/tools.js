import { state, stateToStorage } from '../state';
import { drawCanvas, getPixelColor, fillArea } from '../canvas/canvas';
import { renderColors } from './colors';
import renderRules from '../canvas/rules';

const toolsButtons = document.querySelectorAll('.aside-left__tool:not(.aside-left__tool_disable)');
const rulesInput = document.getElementById('tool-rules');

const allShortCuts = [...toolsButtons].map((el) => el.dataset.shortcut);

const chooseTool = (event) => {
  event.preventDefault();
  const pressedTool = event.currentTarget;
  if (pressedTool.classList.contains('active')) {
    return;
  }
  if (pressedTool.dataset.tool === 'rules') {
    state.isShowRules = !state.isShowRules;
    rulesInput.checked = state.isShowRules;
    renderRules();
  } else {
    toolsButtons.forEach((button) => button.classList.remove('active'));
    pressedTool.classList.add('active');
    state.currentTool = pressedTool.dataset.tool;
  }
  stateToStorage();
};

function chooseToolByShortCut(shortCut) {
  const pressedKey = shortCut.key.toLowerCase();
  if (state.isDrawing || !allShortCuts.includes(pressedKey)) {
    return;
  }
  toolsButtons.forEach((button) => {
    if (button.dataset.shortcut === pressedKey && button.dataset.tool === 'rules') {
      state.isShowRules = !state.isShowRules;
      rulesInput.checked = state.isShowRules;
      renderRules();
      stateToStorage();
    } else if (button.dataset.shortcut === pressedKey && !button.classList.contains('active')) {
      button.classList.add('active');
      state.currentTool = button.dataset.tool;
      stateToStorage();
    } else if (
      button.dataset.shortcut !== pressedKey
      && button.classList.contains('active')
      && pressedKey !== 'r'
    ) {
      button.classList.remove('active');
    }
  });
}

function initTools() {
  const { currentTool } = state;
  toolsButtons.forEach((button) => {
    button.addEventListener('click', chooseTool);
    if (button.dataset.tool === 'rules') {
      rulesInput.checked = state.isShowRules;
      renderRules();
    } else if (button.dataset.tool === currentTool) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

function calculateLine(x1, y1, x2, y2) {
  const deltaX = Math.abs(x2 - x1);
  const deltaY = Math.abs(y2 - y1);
  const signX = x1 < x2 ? 1 : -1;
  const signY = y1 < y2 ? 1 : -1;
  let error = deltaX - deltaY;

  state.currentCanvasState[x2][y2] = state.currentColor.slice(1);

  let cX = x1;
  let cY = y1;
  while (cX !== x2 || cY !== y2) {
    state.currentCanvasState[cX][cY] = state.currentColor.slice(1);
    const error2 = error * 2;
    if (error2 > -deltaY) {
      error -= deltaY;
      cX += signX;
    }
    if (error2 < deltaX) {
      error += deltaX;
      cY += signY;
    }
  }
}

function applyTool(event) {
  if (event.which !== 1) {
    return;
  }
  state.isDrawing = true;
  const {
 baseSize, currentSize, currentColor, currentTool 
} = state;

  const { layerX, layerY } = event;
  const i = Math.floor((layerX / baseSize) * currentSize);
  const j = Math.floor((layerY / baseSize) * currentSize);

  switch (currentTool) {
    case 'pencil':
      if (state.prevX === i && state.prevY === j) {
        break;
      } else if (state.prevX === null || state.prevY === null) {
        state.currentCanvasState[i][j] = currentColor.slice(1);
        drawCanvas();
      } else {
        calculateLine(state.prevX, state.prevY, i, j);
        drawCanvas();
      }
      state.prevX = i;
      state.prevY = j;
      break;
    case 'paint-bucket':
      fillArea(i, j);
      drawCanvas();
      break;
    case 'choose-color':
      state.prevColor = state.currentColor;
      state.currentColor = getPixelColor(layerX, layerY);
      renderColors();
      break;
    default:
      break;
  }
  stateToStorage();
}

export {
 chooseToolByShortCut, toolsButtons, chooseTool, initTools, applyTool 
};
