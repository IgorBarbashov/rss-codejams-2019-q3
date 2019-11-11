import { toolsButtons, chooseTool } from './panels/tools';
import { sizeButtons, changeCanvasSize } from './panels/resize';
import { drawCanvas } from './canvas/canvas';

sizeButtons.forEach(size => size.addEventListener('click', changeCanvasSize));
toolsButtons.forEach(tool => tool.addEventListener('click', chooseTool));

drawCanvas();
