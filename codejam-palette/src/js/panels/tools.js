import { state } from '../state';

const toolsButtons = document.querySelectorAll('.aside-left__tool:not(.aside-left__tool_disable)');

const chooseTool = (event) => {
  const pressedTool = event.currentTarget;
  if (pressedTool.classList.contains('active')) {
    return;
  }
  toolsButtons.forEach((button) => button.classList.remove('active'));
  pressedTool.classList.add('active');
  state.currentTool = pressedTool.dataset.tool;
};

function initTools() {
  const { currentTool } = state;
  toolsButtons.forEach((button) => {
    button.addEventListener('click', chooseTool);
    if (button.dataset.tool === currentTool) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

export { toolsButtons, chooseTool, initTools };
