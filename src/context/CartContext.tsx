import React, { createContext, useContext, useState, useEffect } from 'react';


interface CartItem {
  product_id: string; 
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product_id: string) => void;
  removeFromCart: (product_id: string) => void;
  changeQuantity: (product_id: string, type: 'plus' | 'minus') => void;
  totalQuantity: number;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('Loaded cart from localStorage:', parsedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cart'); 
      }
    }
  }, []);

  useEffect(() => {

    const newTotalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    setTotalQuantity(newTotalQuantity);
    
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Cart saved to localStorage:', cart);
    }

  }, [cart]);

  const addToCart = (product_id: string) => {
    console.log(`Attempting to add product with ID: ${product_id}`);
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product_id === product_id);
      if (!existingItem) {
        console.log(`Added new item to cart: ${product_id}`);
        return [...prevCart, { product_id, quantity: 1 }];
      }
      console.log(`Increased quantity for item: ${product_id}`);
      return prevCart.map(item =>
        item.product_id === product_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  };

  const removeFromCart = (product_id: string) => {
    console.log(`Removing product with ID: ${product_id}`);
    setCart(prevCart => prevCart.filter(item => item.product_id !== product_id));
  };

  const changeQuantity = (product_id: string, type: 'plus' | 'minus') => {
    console.log(`Changing quantity for product ID: ${product_id}, type: ${type}`);
    setCart(prevCart => {
      const itemIndex = prevCart.findIndex(item => item.product_id === product_id);
      if (itemIndex === -1) {
        console.warn(`Product ID ${product_id} not found in cart`);
        return prevCart;
      }
      const updatedCart = [...prevCart];
      const item = updatedCart[itemIndex];
      if (type === 'plus') {
        console.log(`Increased quantity for item: ${product_id}`);
        updatedCart[itemIndex] = { ...item, quantity: item.quantity + 1 };
      } else {
        if (item.quantity === 1) {
          console.log(`Removed item from cart: ${product_id}`);
          updatedCart.splice(itemIndex, 1);
        } else {
          console.log(`Decreased quantity for item: ${product_id}`);
          updatedCart[itemIndex] = { ...item, quantity: item.quantity - 1 };
        }
      }
      return updatedCart;
    });
  };

  // Provide context value
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQuantity, totalQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}