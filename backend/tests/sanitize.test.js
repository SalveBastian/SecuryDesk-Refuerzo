import test from 'node:test';
import assert from 'node:assert/strict';
import { maskEmail, sanitizeObject, sanitizeText } from '../src/lib/sanitize.js';

test('sanitizeText elimina etiquetas HTML y caracteres angulares', () => {
  assert.equal(sanitizeText('  <script>alert(1)</script>Incidente <b>crítico</b>  '), 'alert(1)Incidente crítico');
});

test('sanitizeText elimina caracteres de control', () => {
  assert.equal(sanitizeText('alerta\u0000 segura'), 'alerta segura');
});

test('sanitizeObject limpia valores anidados', () => {
  assert.deepEqual(
    sanitizeObject({ title: '<b>Alerta</b>', nested: { note: '<x>dato</x>' } }),
    { title: 'Alerta', nested: { note: 'dato' } }
  );
});

test('maskEmail oculta el correo preservando dominio', () => {
  assert.equal(maskEmail('analista@securedesk.local'), 'an******@securedesk.local');
});
