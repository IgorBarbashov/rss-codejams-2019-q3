const netlify = require('netlify-auth-providers');

const GITHUB_API_URL = 'https://api.github.com/user';
const GITHUB_API_METHOD = 'GET';
const NETLIFY_SITE_ID = '0709c9e1-04c8-4b1d-b837-e8b15bf77a58';

const authButton = document.querySelector('.js_auth');
const logoutButton = document.querySelector('.logout-github');
const defaultIcon = '../assets/images/github.svg';
const defaultLabel = 'Sign in with GitHub';
const clientIcon = document.querySelector('.signin-github > img');
const clientNic = document.querySelector('.signin-github > div');

const defaultAuthState = {
  isAuth: false,
  token: null,
  avatar: null,
  name: null,
};

let authState = { ...defaultAuthState };

function initAuthState() {
  const savedAuthState = localStorage.getItem('authState');
  try {
    if (savedAuthState) {
      const parsedAuthState = JSON.parse(savedAuthState);
      authState = parsedAuthState;
    } else {
      authState = { ...defaultAuthState };
    }
  } catch (e) {
    authState = { ...defaultAuthState };
    console.log('Ошибка восстановления аутентификационных данных', e);
  }
}

function authStateToLocalStorage() {
  try {
    const stringifiedSAuthState = JSON.stringify(authState);
    localStorage.setItem('authState', stringifiedSAuthState);
  } catch (e) {
    localStorage.setItem('authState', JSON.stringify(defaultAuthState));
    console.log('Ошибка при сохранении аутентификационных данных', e);
  }
}

async function renderAuthButton() {
  const icon = authState.avatar || defaultIcon;
  const label = authState.name || defaultLabel;
  clientNic.textContent = label;
  clientIcon.setAttribute('alt', label);
  clientIcon.src = icon;
  if (authState.isAuth) {
    clientIcon.onerror = () => (clientIc.src = defaultIcon);
    logoutButton.classList.remove('hide');
  } else {
    logoutButton.classList.add('hide');
  }
}

function resetAuthState() {
  authState = { ...defaultAuthState };
  authStateToLocalStorage();
  renderAuthButton();
}

logoutButton.addEventListener('click', (e) => {
  e.preventDefault();
  setTimeout(resetAuthState, 500);
});

authButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (authState.isAuth) {
    return;
  }
  const authenticator = new netlify.default({ site_id: NETLIFY_SITE_ID });
  authenticator.authenticate({ provider: 'github', scope: 'user' }, async (err, data) => {
    if (err) {
      throw new Error('Не удалось авторизоваться через GitHub');
    } else {
      authState.token = data.token;
      try {
        const response = await fetch(GITHUB_API_URL, {
          method: GITHUB_API_METHOD,
          mode: 'cors',
          headers: {
            Authorization: `token ${authState.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Не удалось авторизоваться через GitHub');
        }
        const data = await response.json();
        authState.isAuth = true;
        authState.avatar = data.avatar_url;
        authState.name = data.name;
      } catch (e) {
        authState = { ...defaultAuthState };
        console.log('Ошибка получения данных с GitHub', e);
      } finally {
        renderAuthButton();
        authStateToLocalStorage();
      }
    }
  });
});

export {
 authState, renderAuthButton, authStateToLocalStorage, initAuthState, resetAuthState 
};
