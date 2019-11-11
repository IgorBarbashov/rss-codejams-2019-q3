import state from '../state';

const toolsButtons = document.querySelectorAll('.aside-left__tool:not(.aside-left__tool_disable)');

const chooseTool = event => {
  const pressedTool = event.currentTarget;
  if (pressedTool.classList.contains('active')) {
    return;
  }
  toolsButtons.forEach(button => button.classList.remove('active'));
  pressedTool.classList.add('active');
  state.currentTool = pressedTool.dataset.tool;
};

export { toolsButtons, chooseTool };
