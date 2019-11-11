import { state, stateToStorage } from '../state';

const colorsButtons = document.querySelectorAll('.aside-left__color');
const currentColorButton = document.querySelector('.aside-left__color:first-child');
const prevColorButton = document.querySelector('.aside-left__color:nth-child(2)');
const currentColorMarker = document.querySelector('.color-example_current');
const prevColorMarker = document.querySelector('.color-example_prev');
const customColorInput = document.getElementById('custom-color');

function renderColors() {
  const { currentColor, prevColor } = state;
  currentColorMarker.style = `background: ${currentColor}`;
  prevColorMarker.style = `background: ${prevColor}`;
}

function customColorChange(event) {
  state.prevColor = state.currentColor;
  state.currentColor = event.target.value;
  renderColors();
  stateToStorage();
}
customColorInput.addEventListener('change', customColorChange);

function customColorClick() {
  customColorInput.focus();
  customColorInput.click();
}

function cnahgeColor() {
  const pressedButton = event.currentTarget;
  if (pressedButton === currentColorButton) {
    customColorInput.value = state.currentColor;
    customColorClick();
  } else if (pressedButton === prevColorButton) {
    const temp = state.currentColor;
    state.currentColor = state.prevColor;
    state.prevColor = temp;
  } else {
    state.prevColor = state.currentColor;
    state.currentColor = pressedButton.dataset.color;
  }
  stateToStorage();
  renderColors();
}

function initColors() {
  colorsButtons.forEach((colorButton) => colorButton.addEventListener('click', cnahgeColor));
  renderColors();
}

export { initColors };
