import test from 'node:test';
import assert from 'node:assert/strict';

import {
  allowedAnalyticsCorsOrigin,
  isAllowedAnalyticsOrigin,
} from '../src/lib/analyticsOrigins.mjs';

test('analytics accepts the apex and every HTTPS subdomain', () => {
  assert.equal(isAllowedAnalyticsOrigin('https://peptidespanama.net'), true);
  assert.equal(isAllowedAnalyticsOrigin('https://www.peptidespanama.net'), true);
  assert.equal(isAllowedAnalyticsOrigin('https://catalog.peptidespanama.net'), true);
  assert.equal(isAllowedAnalyticsOrigin('https://crm.admin.peptidespanama.net'), true);
});

test('analytics rejects insecure, lookalike, and malformed origins', () => {
  assert.equal(isAllowedAnalyticsOrigin('http://catalog.peptidespanama.net'), false);
  assert.equal(isAllowedAnalyticsOrigin('https://peptidespanama.net.example.com'), false);
  assert.equal(isAllowedAnalyticsOrigin('https://evilpeptidespanama.net'), false);
  assert.equal(isAllowedAnalyticsOrigin('https://catalog.peptidespanama.net/path'), false);
  assert.equal(isAllowedAnalyticsOrigin('not-an-origin'), false);
  assert.equal(isAllowedAnalyticsOrigin(''), false);
});

test('analytics keeps the two development origins available', () => {
  assert.equal(isAllowedAnalyticsOrigin('http://localhost:3000'), true);
  assert.equal(isAllowedAnalyticsOrigin('http://127.0.0.1:3000'), true);
});

test('CORS only reflects an approved origin', () => {
  assert.equal(
    allowedAnalyticsCorsOrigin('https://offers.peptidespanama.net'),
    'https://offers.peptidespanama.net'
  );
  assert.equal(allowedAnalyticsCorsOrigin('https://peptidespanama.net.attacker.test'), '');
});
