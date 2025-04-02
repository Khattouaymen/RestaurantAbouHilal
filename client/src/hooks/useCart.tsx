import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CartItem } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  calculateSubtotal: () => number;
  calculateTax: (taxRate: number) => number; // Keep for backward compatibility
  calculateTotal: () => number;
  calculateDeliveryFee: () => number;
  meetsMinimumOrder: () => boolean;
}

const CART_STORAGE_KEY = 'abou-hilal-cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or empty array
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Add item to cart
  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === newItem.id);
      
      if (existingItemIndex >= 0) {
        // Increment quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        // Add new item if it doesn't exist
        return [...prevItems, newItem];
      }
    });
  };

  // Remove item from cart
  const removeItem = (itemId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId: number, quantity: number) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate tax
  const calculateTax = (taxRate: number) => {
    return calculateSubtotal() * taxRate;
  };

  // Calculate delivery fee (7% of subtotal)
  const calculateDeliveryFee = () => {
    return calculateSubtotal() * 0.07;
  };

  // Calculate total (now without tax)
  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };

  // Check if order meets minimum amount
  const meetsMinimumOrder = () => {
    return calculateSubtotal() >= 80;
  };

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        calculateSubtotal,
        calculateTax, // Keep for backward compatibility
        calculateTotal,
        calculateDeliveryFee,
        meetsMinimumOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
