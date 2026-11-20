import { useEffect, useReducer } from 'react';
import { CartContext } from './cart-context';
import { cartReducer } from './cartReducer';

// export const CartContext = createContext(null);

const CART_STORAGE_KEY = 'bakeryCart';

function getInitialCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(
    cartReducer,
    undefined,
    getInitialCart
  );

  // Persist cart whenever reducer state changes
  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  }, [cart]);

  const addItem = (item) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: item
    });
  };

  const updateQuantity = (key, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { key, quantity }
    });
  };

  const removeItem = (key) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: key
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        dispatch,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
