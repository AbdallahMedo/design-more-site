import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { create, act } from 'react-test-renderer';
import { build } from 'esbuild';
import { createRequire } from 'node:module';

// Compile the actual page with only its application boundaries mocked.
const mocks = {
  '../config/api': 'export const apiAssetUrl = x => x;',
  '../context/CartContext': 'export const useCart = () => globalThis.checkoutTest.cart;',
  '../context/AuthContext': 'export const useAuth = () => globalThis.checkoutTest.auth;',
  '../context/LanguageContext': 'export const useLanguage = () => ({ language: "en", str: x => x, t: x => x.titleEn });',
  '../utils/bilingual': 'export const formatEGP = x => `EGP ${x}`;',
  '../api/ordersApi': 'export const ordersApi = new Proxy({}, { get: (_, key) => globalThis.checkoutTest.api[key] });',
  'react-router-dom': 'export const useNavigate = () => globalThis.checkoutTest.navigate; export const Link = "a";',
  'lucide-react': 'export const ShieldCheck = "i", Truck = "i", ArrowLeft = "i", ArrowRight = "i", AlertCircle = "i", ShoppingBag = "i";',
};
const compiled = await build({
  entryPoints: ['src/pages/CheckoutPage.jsx'], bundle: true, write: false, format: 'cjs', platform: 'node', external: ['react'],
  plugins: [{ name: 'boundaries', setup(builder) {
    builder.onResolve({ filter: /.*/ }, args => mocks[args.path] ? { path: args.path, namespace: 'mock' } : undefined);
    builder.onLoad({ filter: /.*/, namespace: 'mock' }, args => ({ contents: mocks[args.path], loader: 'js' }));
  } }],
});
const module = { exports: {} };
new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports);
const { CheckoutPage } = module.exports;
let renderer;
afterEach(() => { if (renderer) act(() => renderer.unmount()); renderer = null; });
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };

async function setup() {
  const calls = [];
  const h = globalThis.checkoutTest = {
    calls,
    cart: { items: [{ id: 'local-a', productId: 'a', quantity: 2, price: 100, titleEn: 'Chair' }], subtotal: 200, clearCart: () => calls.push(['clear']) },
    auth: { user: { id: 'user-a', name: 'Actual Customer', phoneNumber: '01012345678' }, isAuthenticated: true, openAuthModal: () => calls.push(['login']) },
    navigate: (...args) => calls.push(['navigate', ...args]),
    api: {
      getGovernorates: async () => [{ id: 'cairo', name: 'Cairo', deliveryFee: 20 }, { id: 'giza', name: 'Giza', deliveryFee: 30 }],
      prepareCart: async items => calls.push(['sync', items]),
      applyPromoCode: async (...args) => { calls.push(['promo', ...args]); return { subtotal: 250, discountPercentage: 10, discountAmount: 25, shippingCost: 45, total: 270, promoCode: 'SAVE' }; },
      createOrder: async payload => { calls.push(['order', payload]); return { id: 'order-uuid', ...payload }; },
    },
  };
  await act(async () => { renderer = create(React.createElement(CheckoutPage)); });
  return h;
}
const text = () => renderer.root.findAll(node => typeof node.type === 'string').map(node => node.children.filter(child => typeof child === 'string').join('')).join(' ');
const input = index => renderer.root.findAllByType('input')[index];
const change = async (node, value) => act(async () => node.props.onChange({ target: { value } }));
const code = value => change(renderer.root.findByProps({ id: 'promo-code' }), value);
const apply = () => renderer.root.findAllByType('button').find(button => button.props.type === 'button').props.onClick();
const submit = () => renderer.root.findByType('form').props.onSubmit({ preventDefault() {} });

test('synchronizes before promo and order, displays API amounts, submits real customer fields', async () => {
  const h = await setup();
  await change(input(2), '01112345678');
  await change(input(3), 'Actual City');
  await change(input(4), 'Actual Street 27');
  await change(renderer.root.findByType('textarea'), 'Leave with reception');
  await code('SAVE');
  await act(async () => { await apply(); });
  for (const amount of ['EGP 250', 'EGP 45', 'EGP 270', '-EGP 25']) assert.ok(text().includes(amount));
  await act(async () => { await submit(); });
  assert.deepEqual(h.calls.map(call => call[0]), ['sync', 'promo', 'sync', 'order', 'clear', 'navigate']);
  assert.deepEqual(h.calls.find(call => call[0] === 'order')[1], {
    customerName: 'Actual Customer', phoneNumber: '01012345678', whatsAppNumber: '01112345678',
    address: 'Actual Street 27', city: 'Actual City', governorate: 'Cairo', customerNotes: 'Leave with reception', promoCode: 'SAVE',
  });
  assert.equal(h.calls.at(-1)[1], '/orders/order-uuid/success');
});

test('sync failure blocks both promo application and order and retains browser cart', async () => {
  const h = await setup();
  h.api.prepareCart = async () => { throw new Error('Cart sync failed'); };
  await code('SAVE');
  await act(async () => { await apply(); });
  assert.ok(text().includes('Cart sync failed'));
  await code('');
  await act(async () => { await submit(); });
  assert.ok(text().includes('Cart sync failed'));
  assert.deepEqual(h.calls, []);
});

for (const changeKind of ['code', 'governorate', 'cart']) {
  test(`ignores pending promo after ${changeKind} changes, even if changed back`, async () => {
    const h = await setup();
    const pending = deferred();
    h.api.applyPromoCode = () => pending.promise;
    await code('SAVE');
    let applying;
    await act(async () => { applying = apply(); });
    if (changeKind === 'code') { await code('OTHER'); await code('SAVE'); }
    if (changeKind === 'governorate') {
      await change(renderer.root.findByType('select'), 'Giza');
      await change(renderer.root.findByType('select'), 'Cairo');
    }
    if (changeKind === 'cart') {
      await act(async () => { h.cart = { ...h.cart, items: [{ ...h.cart.items[0], quantity: 3 }] }; renderer.update(React.createElement(CheckoutPage)); });
      await act(async () => { h.cart = { ...h.cart, items: [{ ...h.cart.items[0], quantity: 2 }] }; renderer.update(React.createElement(CheckoutPage)); });
    }
    await act(async () => { pending.resolve({ subtotal: 250, discountAmount: 25, shippingCost: 45, promoCode: 'SAVE' }); await applying; });
    assert.ok(!text().includes('Discount applied to products only'));
    await act(async () => { await submit(); });
    assert.ok(text().includes('Apply the code or remove it'));
    assert.ok(!h.calls.some(call => call[0] === 'order'));
  });
}

for (const message of ['Invalid code', 'Expired code', 'Disabled code', 'Already-used code']) {
  test(`displays API promo error: ${message}`, async () => {
    const h = await setup();
    h.api.applyPromoCode = async () => { throw { response: { status: 400, data: { message } } }; };
    await code('SAVE');
    await act(async () => { await apply(); });
    assert.ok(text().includes(message));
    assert.ok(!text().includes('Discount applied to products only'));
  });
}

test('failed order creation never clears the cart or navigates', async () => {
  const h = await setup();
  h.api.createOrder = async () => { throw new Error('Order rejected'); };
  await act(async () => { await submit(); });
  assert.ok(text().includes('Order rejected'));
  assert.deepEqual(h.calls.map(call => call[0]), ['sync']);
});

test('unauthenticated checkout opens login without sending cart or order requests', async () => {
  const h = await setup();
  await act(async () => { h.auth.isAuthenticated = false; renderer.update(React.createElement(CheckoutPage)); });
  await code('SAVE');
  await act(async () => { await apply(); });
  await act(async () => { await submit(); });
  assert.deepEqual(h.calls.map(call => call[0]), ['login', 'login']);
});
