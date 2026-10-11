// The visible browser cart is authoritative for quantities, never for prices.
export async function reconcileCart(client, items) {
  const desired = new Map();
  for (const item of items) {
    const productId = item.productId || item.id;
    const quantity = Number(item.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Invalid cart item. Please review your cart.');
    }
    desired.set(productId, (desired.get(productId) || 0) + quantity);
  }
  const { data } = await client.get('/api/cart');
  if (!Array.isArray(data?.items)) throw new Error('Unable to read the server cart.');
  const retained = new Set();
  for (const item of data.items) {
    if (!item.id || !item.productId) throw new Error('Invalid server cart item.');
    if (!desired.has(item.productId) || retained.has(item.productId)) {
      await client.delete(`/api/cart/items/${item.id}`);
    } else {
      retained.add(item.productId);
      const quantity = desired.get(item.productId);
      if (Number(item.quantity) !== quantity) {
        await client.put(`/api/cart/items/${item.id}`, { quantity });
      }
    }
  }
  for (const [productId, quantity] of desired) {
    if (!retained.has(productId)) await client.post('/api/cart/items', { productId, quantity });
  }
}
