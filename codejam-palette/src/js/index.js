import { initState, state } from './state';
import { initTools, chooseToolByShortCut, applyTool } from './panels/tools';
import { initSizes } from './panels/resize';
import { initColors } from './panels/colors';
import { drawCanvas } from './canvas/canvas';

function initApp() {
  initState().then(() => {
    initTools();
    initSizes();
    initColors();
    drawCanvas();

    const canvas = document.getElementById('canvas-rules');
    canvas.addEventListener('mousedown', applyTool);
    window.addEventListener('mouseup', () => {
      state.isDrawing = false;
    });
    canvas.addEventListener('mousemove', (event) => {
      if (state.isDrawing) {
        applyTool(event);
      }
    });
    canvas.addEventListener('mouseup', () => {
      state.isDrawing = false;
    });
    canvas.addEventListener('mouseenter', (event) => {
      if (state.isDrawing) {
        applyTool(event);
      }
    });
  });
}

window.addEventListener('keyup', chooseToolByShortCut);
initApp();
