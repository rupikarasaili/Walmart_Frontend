import { IProduct } from "@/components/products/UserProductList";
import React, { createContext } from "react";

export interface ICartProduct extends IProduct {
  quantity: number;
}

export interface ICart {
  products: Record<string, ICartProduct> | null;
  length: number;
}

export interface CartContextProps {
  addItem: (product: IProduct) => void;
  removeItem: (product: IProduct) => void;
  getProducts: () => Record<string, ICartProduct> | null;
  length: number;
  cart: ICart;
  resetCart: () => void;
}

export const CartContext = createContext<CartContextProps>({
  addItem: (product: IProduct) => {},
  removeItem: (product: IProduct) => {},
  getProducts: () => null,
  length: 0,
  cart: {
    length: 0,
    products: {},
  },
  resetCart: () => {},
});

export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cart, setCart] = React.useState<ICart>({
    products: {},
    length: 0,
  });

  const resetCart = () => {
    setCart({
      products: {},
      length: 0,
    });
  };

  const addProduct = (product: IProduct) => {
    setCart((cart) => {
      let length = cart.length;
      if (cart.products) {
        if (cart.products[product.id]) {
          cart.products[product.id].quantity++;
        } else {
          cart.products = {
            ...cart.products,
            [product.id]: { ...product, quantity: 1 },
          };
          length++;
        }
      }

      return {
        ...cart,
        length,
      };
    });
  };

  const removeProduct = (product: IProduct) => {
    setCart((cart) => {
      let length = cart.length;
      if (cart.products) {
        if (cart.products[product.id]) {
          const quantity = cart.products[product.id].quantity;

          if (quantity - 1 == 0) {
            cart.products;
            delete cart.products[product.id];
            length--;
          }
          cart.products[product.id].quantity--;
        }
      }

      return {
        ...cart,
        length,
      };
    });
  };

  return (
    <CartContext.Provider
      value={{
        addItem: addProduct,
        removeItem: removeProduct,
        getProducts: () => cart.products,
        length: cart.length,
        cart: cart,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  return React.useContext(CartContext);
};
