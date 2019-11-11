import { initState } from './state';
import { initTools } from './panels/tools';
import { initSizes } from './panels/resize';
import { initColors } from './panels/colors';
import { drawCanvas } from './canvas/canvas';

function initApp() {
  initTools();
  initSizes();
  initColors();
  initState().then(() => drawCanvas());
}

initApp();
