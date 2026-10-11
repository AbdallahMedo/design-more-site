import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { create, act } from 'react-test-renderer';
import { build } from 'esbuild';
import { createRequire } from 'node:module';

const mocks = {
  '../context/AuthContext': 'export const useAuth = () => globalThis.receiptTest.auth;',
  '../context/LanguageContext': 'export const useLanguage = () => ({ language: "en", str: x => x });',
  '../utils/bilingual': 'export const formatEGP = x => `EGP ${x}`;',
  '../api/ordersApi': 'export const ordersApi = { getOrderById: id => globalThis.receiptTest.getOrder(id) };',
  'react-router-dom': 'export const useParams = () => ({ id: "order-uuid" }); export const useLocation = () => globalThis.receiptTest.location; export const Link = "a";',
  'canvas-confetti': 'export default () => {};',
  'lucide-react': 'export const CheckCircle2 = "i", MessageSquare = "i", ArrowRight = "i", ArrowLeft = "i", Printer = "i", ShoppingBag = "i";',
};
const compiled = await build({
  entryPoints: ['src/pages/OrderSuccessPage.jsx'], bundle: true, write: false, format: 'cjs', platform: 'node', external: ['react'],
  plugins: [{ name: 'boundaries', setup(builder) {
    builder.onResolve({ filter: /.*/ }, args => mocks[args.path] ? { path: args.path, namespace: 'mock' } : undefined);
    builder.onLoad({ filter: /.*/, namespace: 'mock' }, args => ({ contents: mocks[args.path], loader: 'js' }));
  } }],
});
const module = { exports: {} };
new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports);
const { OrderSuccessPage } = module.exports;
let renderer;
afterEach(() => { if (renderer) act(() => renderer.unmount()); renderer = null; });
const order = { id: 'order-uuid', total: 270, customerName: 'Actual Customer', phoneNumber: '01012345678', address: 'Returned Street', city: 'Returned City', governorate: 'Cairo', customerNotes: 'Returned Notes' };
function setup(getOrder, state) {
  const calls = [];
  globalThis.receiptTest = { auth: { isAuthenticated: true, openAuthModal: () => calls.push('login') }, location: { state }, getOrder: async id => { calls.push(id); return getOrder(id); } };
  return calls;
}
test('refresh retrieves by URL ID and displays returned address and notes', async () => {
  const calls = setup(() => order);
  await act(async () => { renderer = create(React.createElement(OrderSuccessPage)); });
  assert.deepEqual(calls, ['order-uuid']);
  const rendered = JSON.stringify(renderer.toJSON());
  for (const value of ['Returned Street', 'Returned Notes', 'EGP 270']) assert.ok(rendered.includes(value));
});
test('uses successful navigation result without fetching or inventing receipt data', async () => {
  const calls = setup(() => { throw new Error('Should not fetch'); }, { order });
  await act(async () => { renderer = create(React.createElement(OrderSuccessPage)); });
  assert.deepEqual(calls, []);
  assert.ok(JSON.stringify(renderer.toJSON()).includes('Returned Notes'));
});
test('lookup authentication errors show an error and open login instead of a success receipt', async () => {
  const calls = setup(() => { throw { response: { status: 401, data: { message: 'Sign in required' } } }; });
  await act(async () => { renderer = create(React.createElement(OrderSuccessPage)); });
  assert.deepEqual(calls, ['order-uuid', 'login']);
  const rendered = JSON.stringify(renderer.toJSON());
  assert.ok(rendered.includes('Sign in required'));
  assert.ok(!rendered.includes('Commission Received'));
});
