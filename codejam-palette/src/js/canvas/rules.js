import { state } from '../state';

const canvas = document.getElementById('canvas-rules');
canvas.width = state.baseSize;
canvas.height = state.baseSize;
const ctx = canvas.getContext('2d');

function renderRules() {
  const {
    currentSize, isShowRules, baseSize, maxGridCapacity,
  } = state;
  ctx.clearRect(0, 0, baseSize, baseSize);

  if (!isShowRules || currentSize > maxGridCapacity) {
    return;
  }

  const step = Math.floor(baseSize / currentSize);
  const rulesCount = currentSize + 1;

  ctx.setLineDash([1, 3]);
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#000000cc';

  for (let i = 0; i < rulesCount; i += 1) {
    ctx.beginPath();
    ctx.moveTo(0, step * i);
    ctx.lineTo(baseSize, step * i);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(step * i, 0);
    ctx.lineTo(step * i, baseSize);
    ctx.stroke();
    ctx.closePath();
  }
}

export default renderRules;
