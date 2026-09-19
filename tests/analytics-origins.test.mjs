import test from 'node:test';
import assert from 'node:assert/strict';

import {
  allowedAnalyticsCorsOrigin,
  isAllowedAnalyticsOrigin,
} from '../src/lib/analyticsOrigins.mjs';

test('analytics accepts the apex and every HTTPS subdomain', () => {
  assert.equal(isAllowedAnalyticsOrigin('https://peptidospty.com'), true);
  assert.equal(isAllowedAnalyticsOrigin('https://www.peptidospty.com'), true);
  assert.equal(isAllowedAnalyticsOrigin('https://catalog.peptidospty.com'), true);
  assert.equal(isAllowedAnalyticsOrigin('https://crm.admin.peptidospty.com'), true);
});

test('analytics rejects insecure, lookalike, and malformed origins', () => {
  assert.equal(isAllowedAnalyticsOrigin('http://catalog.peptidospty.com'), false);
  assert.equal(isAllowedAnalyticsOrigin('https://peptidospty.com.example.com'), false);
  assert.equal(isAllowedAnalyticsOrigin('https://evilpeptidospty.com'), false);
  assert.equal(isAllowedAnalyticsOrigin('https://catalog.peptidospty.com/path'), false);
  assert.equal(isAllowedAnalyticsOrigin('not-an-origin'), false);
  assert.equal(isAllowedAnalyticsOrigin(''), false);
});

test('analytics keeps the two development origins available', () => {
  assert.equal(isAllowedAnalyticsOrigin('http://localhost:3000'), true);
  assert.equal(isAllowedAnalyticsOrigin('http://127.0.0.1:3000'), true);
});

test('CORS only reflects an approved origin', () => {
  assert.equal(
    allowedAnalyticsCorsOrigin('https://offers.peptidospty.com'),
    'https://offers.peptidospty.com'
  );
  assert.equal(allowedAnalyticsCorsOrigin('https://peptidospty.com.attacker.test'), '');
});
