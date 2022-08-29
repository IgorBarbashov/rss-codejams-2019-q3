const errorMsg = document.querySelector('.error-msg');
let errorTimer;

function errorHandler(action = 'hide', time = 3000) {
  if (action === 'show') {
    errorMsg.classList.add('shown');
    errorTimer = setTimeout(() => {
      errorMsg.classList.remove('shown');
    }, time);
  } else if (action === 'hide') {
    errorMsg.classList.remove('shown');
    clearTimeout(errorTimer);
  }
}

export default errorHandler;
