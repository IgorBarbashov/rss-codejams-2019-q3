import { state } from '../state';

const colorsButtons = document.querySelectorAll('.aside-left__color');
const currentColorButton = document.querySelector('.aside-left__color:first-child');
const prevColorButton = document.querySelector('.aside-left__color:nth-child(2)');

const currentColorMarker = document.querySelector('.color-example_current');
const prevColorMarker = document.querySelector('.color-example_prev');

function renderColors() {
  const { currentColor, prevColor } = state;
  currentColorMarker.style = `background: ${currentColor}`;
  prevColorMarker.style = `background: ${prevColor}`;
}

function cnahgeColor() {
  const pressedButton = event.currentTarget;
  if (pressedButton === prevColorButton) {
    const temp = state.currentColor;
    state.currentColor = state.prevColor;
    state.prevColor = temp;
  } else if (pressedButton !== currentColorButton) {
    state.prevColor = state.currentColor;
    state.currentColor = pressedButton.dataset.color;
  }
  renderColors();
}

function initColors() {
  colorsButtons.forEach(colorButton => colorButton.addEventListener('click', cnahgeColor));
  renderColors();
}

export { initColors };
