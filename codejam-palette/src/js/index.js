import { initState } from './state';
import { initTools, chooseToolByShortCut } from './panels/tools';
import { initSizes } from './panels/resize';
import { initColors } from './panels/colors';
import { drawCanvas } from './canvas/canvas';

function initApp() {
  initState().then(() => {
    initTools();
    initSizes();
    initColors();
    drawCanvas();
  });
}

window.addEventListener('keyup', chooseToolByShortCut);
initApp();
