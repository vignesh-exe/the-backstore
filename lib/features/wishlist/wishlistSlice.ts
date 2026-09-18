import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type WishlistItem = {
  id: string | number;
  name?: string;
  slug?: string;
  image?: string;
  image_url?: string;
  price?: number;
  original_price?: number;
  mrp?: number;
  product_id?: string | number;
  [key: string]: unknown;
};

type WishlistState = {
  wishlistItems: WishlistItem[];
};

const initialState: WishlistState = {
  wishlistItems: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    addToWishlist: (
      state,
      action: PayloadAction<{
        product: WishlistItem;
      }>,
    ) => {
      const product = action.payload?.product;

      if (!product?.id) {
        return;
      }

      const alreadyExists = state.wishlistItems.some(
        (item) => String(item.id) === String(product.id),
      );

      if (!alreadyExists) {
        state.wishlistItems.push(product);
      }
    },

    removeFromWishlist: (
      state,
      action: PayloadAction<{
        productId: string | number;
      }>,
    ) => {
      const productId = String(action.payload.productId);

      state.wishlistItems = state.wishlistItems.filter(
        (item) => String(item.id) !== productId,
      );
    },

    clearWishlist: (state) => {
      state.wishlistItems = [];
    },

    setWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.wishlistItems = action.payload || [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlistItems,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
