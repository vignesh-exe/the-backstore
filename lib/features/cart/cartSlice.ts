import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartCustomization = {
  color?: string;
  colour?: string;
  frontImages?: string[];
  backImages?: string[];
  leftSleeveImages?: string[];
  rightSleeveImages?: string[];
  [key: string]: unknown;
};

export type CartItem = {
  productId: string;
  size: string;
  quantity: number;
  productType?: "normal" | "custom" | string;
  productImage?: string;
  productName?: string;
  productPrice?: number;
  customization?: CartCustomization | null;
};

type CartState = {
  cartItems: Record<string, CartItem>;
};

const initialState: CartState = {
  cartItems: {},
};

const getCartKey = (productId: string | number, size = "") =>
  `${String(productId)}_${String(size)}`;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<
        CartItem & {
          quantity?: number;
        }
      >,
    ) => {
      const {
        productId,
        size,
        quantity = 1,
        productType = "normal",
        productImage,
        productName,
        productPrice,
        customization = null,
      } = action.payload;

      if (!productId || !size || quantity <= 0) {
        return;
      }

      const cartKey = getCartKey(productId, size);
      const existingItem = state.cartItems[cartKey];

      if (existingItem) {
        existingItem.quantity += quantity;

        if (productType) {
          existingItem.productType = productType;
        }

        if (productImage) {
          existingItem.productImage = productImage;
        }

        if (productName) {
          existingItem.productName = productName;
        }

        if (typeof productPrice === "number") {
          existingItem.productPrice = productPrice;
        }

        if (customization !== undefined) {
          existingItem.customization = customization;
        }
      } else {
        state.cartItems[cartKey] = {
          productId: String(productId),
          size: String(size),
          quantity,
          productType,
          ...(productImage ? { productImage } : {}),
          ...(productName ? { productName } : {}),
          ...(typeof productPrice === "number" ? { productPrice } : {}),
          ...(customization !== undefined ? { customization } : {}),
        };
      }
    },

    removeFromCart: (
      state,
      action: PayloadAction<{
        productId: string | number;
        size: string;
      }>,
    ) => {
      const cartKey = getCartKey(action.payload.productId, action.payload.size);

      delete state.cartItems[cartKey];
    },

    deleteItemFromCart: (
      state,
      action: PayloadAction<{
        cartKey?: string;
        productId?: string | number;
        size?: string;
      }>,
    ) => {
      const { cartKey, productId, size } = action.payload;

      if (cartKey) {
        delete state.cartItems[cartKey];
        return;
      }

      if (productId !== undefined && size !== undefined) {
        delete state.cartItems[getCartKey(productId, size)];
      }
    },

    incrementQuantity: (
      state,
      action: PayloadAction<{
        productId: string | number;
        size: string;
      }>,
    ) => {
      const cartKey = getCartKey(action.payload.productId, action.payload.size);

      const item = state.cartItems[cartKey];

      if (item) {
        item.quantity += 1;
      }
    },

    decrementQuantity: (
      state,
      action: PayloadAction<{
        productId: string | number;
        size: string;
      }>,
    ) => {
      const cartKey = getCartKey(action.payload.productId, action.payload.size);

      const item = state.cartItems[cartKey];

      if (!item) {
        return;
      }

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        delete state.cartItems[cartKey];
      }
    },

    updateCartItemQuantity: (
      state,
      action: PayloadAction<{
        productId: string | number;
        size: string;
        quantity: number;
      }>,
    ) => {
      const { productId, size, quantity } = action.payload;
      const cartKey = getCartKey(productId, size);
      const item = state.cartItems[cartKey];

      if (!item) {
        return;
      }

      if (quantity <= 0) {
        delete state.cartItems[cartKey];
        return;
      }

      item.quantity = quantity;
    },

    setCartItems: (state, action: PayloadAction<Record<string, CartItem>>) => {
      state.cartItems = action.payload || {};
    },

    clearCart: (state) => {
      state.cartItems = {};
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  deleteItemFromCart,
  incrementQuantity,
  decrementQuantity,
  updateCartItemQuantity,
  setCartItems,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
