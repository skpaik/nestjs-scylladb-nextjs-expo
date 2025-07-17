import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Product } from '@/types/product';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product['Internal ID'] === action.payload['Internal ID']);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product['Internal ID'] === action.payload['Internal ID']
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return calculateTotals(updatedItems);
      }
      
      const newItems = [...state.items, { product: action.payload, quantity: 1 }];
      return calculateTotals(newItems);
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product['Internal ID'] !== action.payload);
      return calculateTotals(newItems);
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.product['Internal ID'] === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      return calculateTotals(newItems);
    }
    
    case 'CLEAR_CART':
      return initialState;
    
    default:
      return state;
  }
};

const calculateTotals = (items: CartItem[]): CartState => {
  const total = items.reduce((sum, item) => sum + (item.product.Price * item.quantity), 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  return { items, total, itemCount };
};

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
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