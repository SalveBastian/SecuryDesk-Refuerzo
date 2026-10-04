import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4000';
const outputDir = process.env.EVIDENCE_DIR ?? path.resolve('../artifacts/evidencia');

await fs.mkdir(outputDir, { recursive: true });

async function request(name, url, options = {}, expectedStatus = null) {
  const response = await fetch(`${baseUrl}${url}`, options);
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  const record = { name, method: options.method ?? 'GET', url, status: response.status, body };
  await fs.writeFile(path.join(outputDir, `${name}.json`), JSON.stringify(record, null, 2));
  console.log(`${name}: ${record.method} ${url} -> ${response.status}`);
  if (expectedStatus !== null) assert.equal(response.status, expectedStatus, `${name}: status inesperado`);
  return record;
}

async function login(email) {
  const result = await request(`login-${email.split('@')[0]}`, '/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: 'Sena2026!' })
  }, 200);
  assert.ok(result.body.token, `Login sin token: ${email}`);
  return result.body.token;
}

function auth(token) {
  return { authorization: `Bearer ${token}` };
}

await request('01-health', '/health', {}, 200);
await request('02-admin-sin-token', '/admin/ping', {}, 401);

const admin = await login('admin@securedesk.local');
const analista = await login('analista@securedesk.local');
const consulta = await login('consulta@securedesk.local');

await request('03-admin-con-consulta', '/admin/ping', { headers: auth(consulta) }, 403);
await request('04-admin-con-admin', '/admin/ping', { headers: auth(admin) }, 200);

await request('05-incidente-body-invalido', '/incidents', {
  method: 'POST',
  headers: { ...auth(analista), 'content-type': 'application/json' },
  body: JSON.stringify({ title: 'x', description: 'corto', severity: 'NO_VALIDO' })
}, 400);

await request('06-incidente-con-consulta', '/incidents', {
  method: 'POST',
  headers: { ...auth(consulta), 'content-type': 'application/json' },
  body: JSON.stringify({
    title: 'Intento no permitido',
    description: 'Este usuario no debería tener permisos para crear incidentes.',
    severity: 'LOW'
  })
}, 403);

const created = await request('07-incidente-sanitizado', '/incidents', {
  method: 'POST',
  headers: { ...auth(analista), 'content-type': 'application/json' },
  body: JSON.stringify({
    title: '<b>Alerta de seguridad</b>',
    description: '<script>alert(1)</script> Se detectó una actividad anómala controlada para la práctica.',
    severity: 'HIGH'
  })
}, 201);
assert.equal(created.body.incident.title, 'Alerta de seguridad');
assert.equal(created.body.incident.reporterEmail, 'analista@securedesk.local');
assert.ok(!created.body.incident.description.includes('<'));

const consultaList = await request('08-lista-consulta-masking', '/incidents', { headers: auth(consulta) }, 200);
assert.ok(consultaList.body.incidents.every((incident) => incident.reporterEmail.includes('*')));

const adminList = await request('09-lista-admin-sin-masking', '/incidents', { headers: auth(admin) }, 200);
assert.ok(adminList.body.incidents.some((incident) => incident.reporterEmail === 'analista@securedesk.local'));

await request('10-ruta-inexistente', '/no-existe', {}, 404);
await request('11-usuarios-consulta-prohibido', '/users', { headers: auth(consulta) }, 403);
const users = await request('12-usuarios-admin', '/users', { headers: auth(admin) }, 200);
const consultaUser = users.body.users.find((user) => user.email === 'consulta@securedesk.local');
assert.ok(consultaUser, 'No se encontró usuario CONSULTA del seed');

const deactivated = await request('13-desactivar-usuario-admin', `/users/${consultaUser.id}/deactivate`, {
  method: 'PATCH',
  headers: auth(admin)
}, 200);
assert.equal(deactivated.body.user.active, false);

// El token existente debe dejar de servir porque authenticate vuelve a consultar el estado del usuario.
await request('14-usuario-desactivado-token-invalido', '/incidents', { headers: auth(consulta) }, 401);

const activated = await request('15-activar-usuario-admin', `/users/${consultaUser.id}/activate`, {
  method: 'PATCH',
  headers: auth(admin)
}, 200);
assert.equal(activated.body.user.active, true);

let rateLimited = false;
for (let index = 1; index <= 100; index += 1) {
  const result = await request(`16-rate-limit-${String(index).padStart(3, '0')}`, '/health');
  if (result.status === 429) {
    rateLimited = true;
    break;
  }
}
assert.equal(rateLimited, true, 'No se obtuvo 429 dentro del número esperado de solicitudes');

await fs.writeFile(
  path.join(outputDir, 'SUMMARY.txt'),
  'Suite HTTP SecureDesk: APROBADA\n401/403/200/201/400/404/429, sanitización, masking y desactivación verificadas.\n'
);

console.log(`Evidencias guardadas en ${outputDir}`);
