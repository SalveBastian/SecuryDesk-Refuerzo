import test from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../src/middlewares/validate.js';

function responseDouble() {
  const state = { statusCode: null, body: null };
  return {
    state,
    res: {
      status(code) { state.statusCode = code; return this; },
      json(body) { state.body = body; return this; }
    }
  };
}

test('validate rechaza datos inválidos con 400 y detalles controlados', () => {
  const schema = {
    safeParse() {
      return {
        success: false,
        error: { issues: [{ path: ['title'], message: 'Muy corto' }] }
      };
    }
  };
  const req = { body: { title: 'x' } };
  const { state, res } = responseDouble();
  let nextCalled = false;

  validate(schema)(req, res, () => { nextCalled = true; });

  assert.equal(state.statusCode, 400);
  assert.equal(state.body.error, 'Datos inválidos');
  assert.deepEqual(state.body.details, [{ path: 'title', message: 'Muy corto' }]);
  assert.equal(nextCalled, false);
});

test('validate reemplaza el target por los datos normalizados', () => {
  const schema = {
    safeParse() { return { success: true, data: { id: 8 } }; }
  };
  const req = { params: { id: '8' } };
  const { res } = responseDouble();
  let nextCalled = false;

  validate(schema, 'params')(req, res, () => { nextCalled = true; });

  assert.deepEqual(req.params, { id: 8 });
  assert.equal(nextCalled, true);
});
