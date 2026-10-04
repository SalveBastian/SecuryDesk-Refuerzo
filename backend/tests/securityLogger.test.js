import test from 'node:test';
import assert from 'node:assert/strict';
import { logSecurityEvent } from '../src/lib/securityLogger.js';

test('securityLogger no incluye claves sensibles conocidas', () => {
  const old = console.info;
  console.info = () => {};
  try {
    const record = logSecurityEvent('TEST', {
      userId: 1,
      role: 'ADMIN',
      password: 'no-debe-salir',
      token: 'no-debe-salir'
    });
    assert.equal(record.userId, 1);
    assert.equal(record.role, 'ADMIN');
    assert.equal('password' in record, false);
    assert.equal('token' in record, false);
  } finally {
    console.info = old;
  }
});
