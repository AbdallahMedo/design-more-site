import test from 'node:test';
import assert from 'node:assert/strict';
import { reconcileCart } from '../src/api/cartSync.js';

function clientFor(items) {
  const calls = [];
  return {
    calls,
    get: async () => ({ data: { items } }),
    delete: async (...args) => calls.push(['delete', ...args]),
    put: async (...args) => calls.push(['put', ...args]),
    post: async (...args) => calls.push(['post', ...args]),
  };
}

test('reconciles quantities, removes absent products, adds missing products', async () => {
  const client = clientFor([{ id: 'item-a', productId: 'a', quantity: 1 }, { id: 'item-b', productId: 'b', quantity: 3 }]);
  await reconcileCart(client, [{ productId: 'a', quantity: 2 }, { productId: 'c', quantity: 4 }]);
  assert.deepEqual(client.calls, [
    ['put', '/api/cart/items/item-a', { quantity: 2 }],
    ['delete', '/api/cart/items/item-b'],
    ['post', '/api/cart/items', { productId: 'c', quantity: 4 }],
  ]);
});

test('unchanged products are never posted again', async () => {
  const client = clientFor([{ id: 'item-a', productId: 'a', quantity: 2 }]);
  await reconcileCart(client, [{ productId: 'a', quantity: 2 }]);
  assert.deepEqual(client.calls, []);
});

test('coalesces duplicate local products and removes duplicate server rows', async () => {
  const client = clientFor([{ id: 'first', productId: 'a', quantity: 1 }, { id: 'duplicate', productId: 'a', quantity: 1 }]);
  await reconcileCart(client, [{ productId: 'a', quantity: 1 }, { productId: 'a', quantity: 2 }]);
  assert.deepEqual(client.calls, [['put', '/api/cart/items/first', { quantity: 3 }], ['delete', '/api/cart/items/duplicate']]);
});

test('a failed mutation rejects synchronization and stops remaining operations', async () => {
  const client = clientFor([{ id: 'item-a', productId: 'a', quantity: 1 }]);
  client.put = async () => { throw new Error('Out of stock'); };
  await assert.rejects(reconcileCart(client, [{ productId: 'a', quantity: 2 }, { productId: 'b', quantity: 1 }]), /Out of stock/);
  assert.deepEqual(client.calls, []);
});

test('malformed cart responses and invalid quantities fail closed', async () => {
  await assert.rejects(reconcileCart({ get: async () => ({ data: {} }) }, []), /server cart/);
  await assert.rejects(reconcileCart(clientFor([]), [{ productId: 'a', quantity: 0 }]), /Invalid cart/);
});
