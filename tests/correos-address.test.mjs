import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildShipmentDraft,
  normalizeName,
  parseShippingAddress,
  postalCode,
  resolveTerritory,
} from '../src/lib/correosAddress.mjs';

test('names resolve to the codes Panama shipments use', () => {
  const r = resolveTerritory({ province: 'Panamá', canton: 'Panamá', district: 'San Francisco' });
  assert.equal(r.level, 'district');
  assert.deepEqual([r.provinceCode, r.cantonCode, r.districtCode], ['1', '01', '01']);
  assert.equal(r.postalCode, '10101');
});

test('cantón 01 answers to both of its names', () => {
  const central = resolveTerritory({ province: 'Panamá', canton: 'Central', district: 'Bella Vista' });
  const named = resolveTerritory({ province: 'Panamá', canton: 'Panamá', district: 'Bella Vista' });
  assert.equal(central.postalCode, '10102');
  assert.equal(named.postalCode, central.postalCode);
});

test('accents and case do not decide where a parcel goes', () => {
  assert.equal(normalizeName('Chiriquí'), normalizeName('CHIRIQUI'));
  const a = resolveTerritory({ province: 'Chiriquí', canton: 'David', district: 'Boquete' });
  const b = resolveTerritory({ province: 'chiriqui', canton: 'DAVID', district: 'boquete' });
  assert.equal(a.postalCode, '30102');
  assert.equal(b.postalCode, a.postalCode);
});

test('a district is only ever looked for inside its own cantón', () => {
  const city = resolveTerritory({ province: 'Panamá', canton: 'Panamá', district: 'San Francisco' });
  const miguelito = resolveTerritory({ province: 'Panamá', canton: 'San Miguelito', district: 'Belisario Porras' });
  assert.equal(city.level, 'district');
  assert.equal(miguelito.level, 'district');
  assert.notEqual(city.postalCode, miguelito.postalCode);

  const wrong = resolveTerritory({ province: 'Panamá', canton: 'San Miguelito', district: 'San Francisco' });
  assert.equal(wrong.level, 'canton');
  assert.equal(wrong.postalCode, '');
  assert.deepEqual(wrong.unresolved, ['district']);
});

test('an unknown place resolves to nothing rather than to something near it', () => {
  assert.equal(resolveTerritory({ province: 'Bogotá', canton: 'X', district: 'Y' }).level, 'none');
  assert.equal(resolveTerritory({}).level, 'none');
  assert.equal(postalCode({ provinceCode: '1', cantonCode: '01' }), '');
});

test('the location line is read whichever way round it was written', () => {
  const forward = parseShippingAddress('San Francisco, Panamá, Panamá');
  const reversed = parseShippingAddress('Chiriquí, David, Boquete');
  assert.equal(forward.postalCode, '10101');
  assert.equal(reversed.postalCode, '30102');
});

test('labels people type around the values are ignored', () => {
  const r = parseShippingAddress('Provincia Panamá, Cantón Panamá, distrito Betania, edificio blue');
  assert.equal(r.postalCode, '10104');
});

test('the customer\'s own directions do not get mined for place names', () => {
  const r = parseShippingAddress([
    'Cerca de San Francisco, torre verde',
    'Betania, Panamá, Panamá',
  ].join('\n'));
  assert.equal(r.postalCode, '10104');
  assert.equal(r.line, 'Betania, Panamá, Panamá');
});

test('a postal code written into the text is used only if it is real', () => {
  assert.equal(parseShippingAddress('Entrega en casa\n10105').postalCode, '10105');
  assert.equal(parseShippingAddress('San Miguelito código postal 40610').level, 'none');
});

test('a trailing postal code does not stop the name beside it matching', () => {
  const r = parseShippingAddress('Oficinas Correo de Panamá, Juan Díaz, Panamá, Panamá 10105');
  assert.equal(r.postalCode, '10105');
});

test('an address with no destination in it resolves to nothing', () => {
  assert.equal(parseShippingAddress('Pick Up').level, 'none');
  assert.equal(parseShippingAddress('Karen Ramírez\nCondominio Rialto casa a12').level, 'none');
  assert.equal(parseShippingAddress('').level, 'none');
  assert.equal(parseShippingAddress(null).level, 'none');
});

test('a draft says plainly whether it can be shipped without a human', () => {
  const ready = buildShipmentDraft({
    order_number: 'PCR-10428',
    customer_name: 'Ana Solís',
    customer_phone: '+507 6123 4567',
    customer_email: 'ana@example.com',
    shipping_address: 'De la escuela 100m norte, casa 4\nBetania, Panamá, Panamá',
  });
  assert.equal(ready.ready, true);
  assert.deepEqual(ready.missing, []);
  assert.equal(ready.destination.postalCode, '10104');
  assert.equal(ready.recipient.phone, '61234567');
  assert.equal(ready.directions, 'De la escuela 100m norte, casa 4');
});

test('a draft that cannot be shipped names what is missing', () => {
  const draft = buildShipmentDraft({
    order_number: 'PCR-10429',
    customer_name: 'Karen Ramírez',
    customer_phone: '',
    shipping_address: 'Condominio Rialto casa a12',
  });
  assert.equal(draft.ready, false);
  assert.ok(draft.missing.includes('customer_phone'));
  assert.ok(draft.missing.includes('district'));
  assert.equal(draft.destination.postalCode, '');
});