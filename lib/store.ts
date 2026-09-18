import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "@/lib/features/cart/cartSlice";
import wishlistReducer from "@/lib/features/wishlist/wishlistSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
