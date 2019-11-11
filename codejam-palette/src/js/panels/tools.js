import { state, stateToStorage } from '../state';
import { drawCanvas } from '../canvas/canvas';

const toolsButtons = document.querySelectorAll('.aside-left__tool:not(.aside-left__tool_disable)');
const allShortCuts = [...toolsButtons].map(el => el.dataset.shortcut);

const chooseTool = event => {
  const pressedTool = event.currentTarget;
  if (pressedTool.classList.contains('active')) {
    return;
  }
  toolsButtons.forEach(button => button.classList.remove('active'));
  pressedTool.classList.add('active');
  state.currentTool = pressedTool.dataset.tool;
  stateToStorage();
};

function chooseToolByShortCut(shortCut) {
  const pressedKey = shortCut.key.toLowerCase();
  if (state.isDrawing || !allShortCuts.includes(pressedKey)) {
    return;
  }
  toolsButtons.forEach(button => {
    if (button.dataset.shortcut === pressedKey && !button.classList.contains('active')) {
      button.classList.add('active');
      state.currentTool = button.dataset.tool;
      stateToStorage();
    } else if (button.dataset.shortcut !== pressedKey && button.classList.contains('active')) {
      button.classList.remove('active');
    }
  });
}

function initTools() {
  const { currentTool } = state;
  toolsButtons.forEach(button => {
    button.addEventListener('click', chooseTool);
    if (button.dataset.tool === currentTool) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

function applyTool(event) {
  state.isDrawing = true;
  const { baseSize, currentSize } = state;
  const i = Math.floor((event.layerX / baseSize) * currentSize);
  const j = Math.floor((event.layerY / baseSize) * currentSize);
  state.currentCanvasState[i][j] = state.currentColor.slice(1);
  drawCanvas();
  stateToStorage();
}

export { chooseToolByShortCut, toolsButtons, chooseTool, initTools, applyTool };
