import { API } from './config.js';
import { renderRoleMenu } from './src/components/RoleMenu.js';
let token = null;
let currentUser = null;

const loginForm = document.querySelector('#loginForm');
const loginResult = document.querySelector('#loginResult');
const sessionBadge = document.querySelector('#sessionBadge');
const roleMenu = document.querySelector('#roleMenu');
const loadIncidents = document.querySelector('#loadIncidents');
const incidentsOutput = document.querySelector('#incidentsOutput');

async function api(path, options = {}) {
  const headers = { ...(options.headers ?? {}) };
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await fetch(`${API}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginResult.textContent = 'Validando...';

  const result = await api('/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: document.querySelector('#email').value,
      password: document.querySelector('#password').value
    })
  });

  if (result.status !== 200) {
    token = null;
    currentUser = null;
    loginResult.textContent = result.body.error ?? 'No fue posible iniciar sesión';
    sessionBadge.textContent = 'Sin sesión';
    roleMenu.replaceChildren();
    loadIncidents.disabled = true;
    return;
  }

  token = result.body.token;
  currentUser = result.body.user;
  loginResult.textContent = `Sesión iniciada como ${currentUser.name}.`;
  sessionBadge.textContent = currentUser.role;
  renderRoleMenu(roleMenu, currentUser.role);
  loadIncidents.disabled = false;
});

loadIncidents.addEventListener('click', async () => {
  const result = await api('/incidents');
  incidentsOutput.textContent = JSON.stringify(result, null, 2);
});
