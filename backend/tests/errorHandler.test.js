import test from 'node:test';
import assert from 'node:assert/strict';
import { errorHandler, notFound } from '../src/middlewares/errorHandler.js';

function makeRes() {
  const state = { statusCode: null, body: null };
  return {
    state,
    res: {
      status(code) { state.statusCode = code; return this; },
      json(body) { state.body = body; return this; }
    }
  };
}

test('notFound devuelve 404 con método y ruta', () => {
  const { state, res } = makeRes();
  notFound({ method: 'GET', originalUrl: '/no-existe' }, res);
  assert.equal(state.statusCode, 404);
  assert.equal(state.body.error, 'Ruta no encontrada');
});

test('errorHandler no expone mensaje interno cuando es 500', () => {
  const { state, res } = makeRes();
  const old = console.error;
  console.error = () => {};
  try {
    errorHandler(new Error('detalle interno sensible'), {}, res, () => {});
  } finally {
    console.error = old;
  }
  assert.equal(state.statusCode, 500);
  assert.deepEqual(state.body, { error: 'Error interno del servidor' });
});
