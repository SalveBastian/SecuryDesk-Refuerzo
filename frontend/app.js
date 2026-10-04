import { API } from './config.js';
import { renderRoleMenu } from './src/components/RoleMenu.js';

const SEVERITY = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica'
};

const STATUS = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En progreso',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado'
};

let token = null;
let currentUser = null;
let incidents = [];

const loginForm = document.querySelector('#loginForm');
const loginResult = document.querySelector('#loginResult');
const sessionBadge = document.querySelector('#sessionBadge');
const roleMenu = document.querySelector('#roleMenu');
const loadIncidents = document.querySelector('#loadIncidents');
const incidentsHint = document.querySelector('#incidentsHint');
const incidentsList = document.querySelector('#incidentsList');
const filterQuery = document.querySelector('#filterQuery');
const filterSeverity = document.querySelector('#filterSeverity');
const filterStatus = document.querySelector('#filterStatus');
const panels = {
  incidents: document.querySelector('#panel-incidents'),
  'new-incident': document.querySelector('#panel-new-incident'),
  users: document.querySelector('#panel-users'),
  admin: document.querySelector('#panel-admin')
};

async function api(path, options = {}) {
  const headers = { ...(options.headers ?? {}) };
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await fetch(`${API}${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
}

function setFiltersEnabled(enabled) {
  filterQuery.disabled = !enabled;
  filterSeverity.disabled = !enabled;
  filterStatus.disabled = !enabled;
  loadIncidents.disabled = !enabled;
}

function showPanel(id, { load = true } = {}) {
  for (const [key, panel] of Object.entries(panels)) {
    panel.hidden = key !== id;
  }
  for (const button of roleMenu.querySelectorAll('button')) {
    button.classList.toggle('is-active', button.dataset.panel === id);
  }
  if (!load) return;
  if (id === 'incidents') loadIncidentList();
  if (id === 'users') loadUsers();
  if (id === 'admin') loadAdminPing();
}

function formatDate(value) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

function renderIncidents() {
  const query = filterQuery.value.trim().toLowerCase();
  const severity = filterSeverity.value;
  const status = filterStatus.value;
  const visible = incidents.filter((incident) => {
    const text = `${incident.title} ${incident.description}`.toLowerCase();
    if (query && !text.includes(query)) return false;
    if (severity && incident.severity !== severity) return false;
    if (status && incident.status !== status) return false;
    return true;
  });

  incidentsList.replaceChildren();
  if (visible.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'hint';
    empty.textContent = incidents.length === 0
      ? 'No hay incidentes registrados.'
      : 'Ningún incidente coincide con el filtro.';
    incidentsList.append(empty);
    return;
  }

  for (const incident of visible) {
    const article = document.createElement('article');
    article.className = 'incident';

    const header = document.createElement('div');
    header.className = 'incident-header';
    const title = document.createElement('h3');
    title.textContent = incident.title;
    const severityPill = document.createElement('span');
    severityPill.className = `pill severity-${incident.severity}`;
    severityPill.textContent = SEVERITY[incident.severity] ?? incident.severity;
    const statusPill = document.createElement('span');
    statusPill.className = 'pill';
    statusPill.textContent = STATUS[incident.status] ?? incident.status;
    header.append(title, severityPill, statusPill);

    const description = document.createElement('p');
    description.textContent = incident.description;

    const footer = document.createElement('p');
    footer.className = 'incident-meta';
    const reporter = document.createElement('span');
    reporter.textContent = `Reportó: ${incident.reporterEmail}`;
    const created = document.createElement('time');
    created.dateTime = incident.createdAt;
    created.textContent = formatDate(incident.createdAt);
    footer.append(reporter, created);

    article.append(header, description, footer);
    incidentsList.append(article);
  }
}

async function loadIncidentList() {
  incidentsHint.textContent = 'Cargando incidentes...';
  const result = await api('/incidents');
  if (result.status !== 200) {
    incidents = [];
    incidentsList.replaceChildren();
    incidentsHint.textContent = result.body.error ?? 'No fue posible consultar los incidentes.';
    return;
  }

  incidents = result.body.incidents ?? [];
  const fullEmail = currentUser?.role === 'ADMIN';
  incidentsHint.textContent = fullEmail
    ? `${incidents.length} incidente(s). Como ADMIN ves el correo completo del reportero.`
    : `${incidents.length} incidente(s). Tu rol ve el correo del reportero enmascarado.`;
  renderIncidents();
}

function clearSession() {
  token = null;
  currentUser = null;
  incidents = [];
  sessionBadge.textContent = 'Sin sesión';
  roleMenu.replaceChildren();
  setFiltersEnabled(false);
  incidentsList.replaceChildren();
  incidentsHint.textContent = 'Inicia sesión para consultar incidentes.';
  showPanel('incidents', { load: false });
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
    clearSession();
    loginResult.textContent = result.body.error ?? 'No fue posible iniciar sesión';
    return;
  }

  token = result.body.token;
  currentUser = result.body.user;
  loginResult.textContent = `Sesión iniciada como ${currentUser.name}.`;
  sessionBadge.textContent = currentUser.role;
  setFiltersEnabled(true);
  renderRoleMenu(roleMenu, currentUser.role, showPanel);
  showPanel('incidents');
});

loadIncidents.addEventListener('click', loadIncidentList);
filterQuery.addEventListener('input', renderIncidents);
filterSeverity.addEventListener('change', renderIncidents);
filterStatus.addEventListener('change', renderIncidents);

document.querySelector('#incidentForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const incidentResult = document.querySelector('#incidentResult');
  incidentResult.textContent = 'Registrando...';
  const result = await api('/incidents', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      title: document.querySelector('#incidentTitle').value,
      description: document.querySelector('#incidentDescription').value,
      severity: document.querySelector('#incidentSeverity').value
    })
  });

  if (result.status !== 201) {
    const details = result.body.details?.map((issue) => issue.message).join(' ');
    incidentResult.textContent = details || result.body.error || 'No fue posible crear el incidente.';
    return;
  }

  event.target.reset();
  incidentResult.textContent = `Incidente #${result.body.incident.id} registrado.`;
  showPanel('incidents');
});

async function loadUsers() {
  const usersList = document.querySelector('#usersList');
  usersList.textContent = 'Cargando usuarios...';
  const result = await api('/users');
  usersList.replaceChildren();
  if (result.status !== 200) {
    usersList.textContent = result.body.error ?? 'No fue posible consultar los usuarios.';
    return;
  }

  const table = document.createElement('table');
  table.className = 'data-table';
  table.innerHTML = '<thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th></th></tr></thead>';
  const tbody = document.createElement('tbody');

  for (const user of result.body.users ?? []) {
    const row = document.createElement('tr');
    for (const value of [user.name, user.email, user.role, user.active ? 'Activo' : 'Inactivo']) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.append(cell);
    }
    const actionCell = document.createElement('td');
    const action = document.createElement('button');
    action.type = 'button';
    const isSelf = user.id === currentUser?.id;
    action.textContent = isSelf ? 'Tu cuenta' : (user.active ? 'Desactivar' : 'Activar');
    action.disabled = isSelf;
    action.addEventListener('click', async () => {
      const path = user.active ? 'deactivate' : 'activate';
      const update = await api(`/users/${user.id}/${path}`, { method: 'PATCH' });
      if (update.status !== 200) {
        actionCell.textContent = update.body.error ?? 'No fue posible actualizar el usuario.';
        return;
      }
      loadUsers();
    });
    actionCell.append(action);
    row.append(actionCell);
    tbody.append(row);
  }

  table.append(tbody);
  usersList.append(table);
}

document.querySelector('#loadUsers').addEventListener('click', loadUsers);

async function loadAdminPing() {
  const adminResult = document.querySelector('#adminResult');
  adminResult.textContent = 'Comprobando acceso...';
  const result = await api('/admin/ping');
  if (result.status !== 200) {
    adminResult.textContent = `${result.status}: ${result.body.error ?? 'Acceso denegado'}`;
    return;
  }
  adminResult.textContent = `${result.body.message}. Usuario ${result.body.user.id}, rol ${result.body.user.role}.`;
}

document.querySelector('#adminPing').addEventListener('click', loadAdminPing);
