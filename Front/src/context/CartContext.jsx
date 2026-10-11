import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dm_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('dm_cart_items', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.productId === product.id || item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.productId === product.id || item.id === product.id
            ? {
                ...item,
                quantity: Math.min((item.quantity || 1) + quantity, product.stockQuantity || 99),
                lineTotal: (item.price || product.price) * Math.min((item.quantity || 1) + quantity, product.stockQuantity || 99),
              }
            : item
        );
      }

      const newItem = {
        id: `cart-item-${Date.now()}`,
        productId: product.id,
        titleEn: product.titleEn,
        titleAr: product.titleAr,
        price: product.price,
        quantity: Math.min(quantity, product.stockQuantity || 99),
        stockQuantity: product.stockQuantity || 10,
        imageUrl: product.images?.[0]?.imageUrl || product.imageUrl,
        lineTotal: product.price * Math.min(quantity, product.stockQuantity || 99),
        slug: product.slug,
      };

      return [...prevItems, newItem];
    });

    setIsDrawerOpen(true);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId || item.productId === itemId
          ? {
              ...item,
              quantity: Math.min(newQuantity, item.stockQuantity || 99),
              lineTotal: item.price * Math.min(newQuantity, item.stockQuantity || 99),
            }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId && item.productId !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const itemCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        toggleDrawer: () => setIsDrawerOpen((prev) => !prev),
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
