import { initState, state, resetState } from './state';
import { initTools, chooseToolByShortCut, applyTool } from './panels/tools';
import { initSizes } from './panels/resize';
import { initColors } from './panels/colors';
import { drawCanvas } from './canvas/canvas';
import { initTownTool } from './panels/town';

function initApp() {
  initState().then(() => {
    initTools();
    initTownTool();
    initSizes();
    initColors();
    drawCanvas();

    const canvas = document.getElementById('canvas-rules');
    canvas.addEventListener('mousedown', applyTool);
    window.addEventListener('mouseup', () => {
      state.prevX = null;
      state.prevY = null;
      state.isDrawing = false;
    });
    canvas.addEventListener('mousemove', (event) => {
      if (state.isDrawing) {
        applyTool(event);
      }
    });
    canvas.addEventListener('mouseenter', (event) => {
      if (state.isDrawing) {
        state.prevX = null;
        state.prevY = null;
        applyTool(event);
      }
    });
  });
}

window.addEventListener('keyup', chooseToolByShortCut);
const refresh = document.querySelector('.header__icon.refresh');
refresh.addEventListener('click', () => {
  localStorage.removeItem('savedState');
  resetState();
  initApp();
});

initApp();
