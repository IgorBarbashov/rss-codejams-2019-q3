import { initTownTool } from './panels/town';
import {
 initState, state, resetState, stateToStorage 
} from './state';
import { initTools, chooseToolByShortCut, applyTool } from './panels/tools';
import { initSizes } from './panels/resize';
import { initColors } from './panels/colors';
import { drawCanvas, convertToGrayscale } from './canvas/canvas';

function initApp() {
  initState().then(() => {
    initTools();
    initTownTool();
    initSizes();
    initColors();
    drawCanvas();

    window.addEventListener('keyup', chooseToolByShortCut);

    const refresh = document.querySelector('.header__icon.refresh');
    refresh.addEventListener('click', () => {
      localStorage.removeItem('savedState');
      resetState();
      initApp();
    });

    const grayscale = document.querySelector('.grayscale-button');
    grayscale.disabled = true;
    grayscale.addEventListener('click', convertToGrayscale);

    const canvas = document.getElementById('canvas-rules');
    canvas.addEventListener('mousedown', applyTool);

    window.addEventListener('mouseup', () => {
      state.prevX = null;
      state.prevY = null;
      state.isDrawing = false;
      stateToStorage();
    });
    canvas.addEventListener('mousemove', (event) => {
      if (state.isDrawing) {
        applyTool(event);
      }
    });
    canvas.addEventListener('mouseleave', (event) => {
      if (state.isDrawing) {
        applyTool(event);
      }
    });
    canvas.addEventListener('mouseenter', () => {
      if (state.isDrawing) {
        state.prevX = null;
        state.prevY = null;
        applyTool(event);
      }
    });
  });
}

initApp();
