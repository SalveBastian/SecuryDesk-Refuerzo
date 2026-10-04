import test from 'node:test';
import assert from 'node:assert/strict';
import { authorizeRoles } from '../src/middlewares/authorizeRoles.js';

function run(role, allowed) {
  const req = role ? { user: { role } } : {};
  const response = { statusCode: null, body: null };
  const res = {
    status(code) { response.statusCode = code; return this; },
    json(body) { response.body = body; return this; }
  };
  let nextCalled = false;
  authorizeRoles(...allowed)(req, res, () => { nextCalled = true; });
  return { ...response, nextCalled };
}

test('sin usuario devuelve 401', () => {
  assert.equal(run(null, ['ADMIN']).statusCode, 401);
});

test('rol no autorizado devuelve 403', () => {
  assert.equal(run('CONSULTA', ['ADMIN']).statusCode, 403);
});

test('rol autorizado continúa', () => {
  assert.equal(run('ADMIN', ['ADMIN']).nextCalled, true);
});
