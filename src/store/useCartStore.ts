import { create } from 'zustand';

interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precioFinal: number;
  imagen: string;
  destacado: boolean;
  nuevo?: boolean;
  slug?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  isCartOpen: false,

  addToCart: (product) => set((state) => {
    const existing = state.cart.find((item) => item._id === product._id);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        ),
        isCartOpen: true,
      };
    }
    return { 
      cart: [...state.cart, { ...product, quantity: 1 }],
      isCartOpen: true 
    };
  }),

  updateQuantity: (productId, delta) => set((state) => ({
    cart: state.cart
      .map((item) =>
        item._id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
      .filter((item) => item.quantity > 0),
  })),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item._id !== productId),
  })),

  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  clearCart: () => set({ cart: [] }),
}));