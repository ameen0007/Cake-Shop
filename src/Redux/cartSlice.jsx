import { createSlice } from "@reduxjs/toolkit";

const MAX_QUANTITY = 5;
const MIN_QUANTITY = 1;

const initialState = JSON.parse(localStorage.getItem('cart')) || [];

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
      addtocart(state, action) {
        const existingItemIndex = state.findIndex(item => item.id === action.payload.id);
  
        if (existingItemIndex !== -1) {
          // If item already exists, update its quantity with limit
          state[existingItemIndex].quantity = Math.min(MAX_QUANTITY, state[existingItemIndex].quantity + 1);
        } else {
          // If item is not in the cart, add it with quantity 1
          state.push({ ...action.payload, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(state));
      },
      deletefromcart(state, action) {
        const itemIdToDelete = action.payload;
        const updatedState = state.filter(item => item.id !== itemIdToDelete);
        localStorage.setItem('cart', JSON.stringify(updatedState));
        return updatedState
      },
      decrementQuantity(state, action) {
        const existingItem = state.find(item => item.id === action.payload.id);
  
        if (existingItem) {
          // If quantity is greater than 1, decrement it with limit
          const updatedState = state.map(item =>
            item.id === existingItem.id
              ? { ...item, quantity: Math.max(MIN_QUANTITY, item.quantity - 1) }
              : item
          );
          localStorage.setItem('cart', JSON.stringify(updatedState));
          return updatedState;
        }
  
        return state;
      },
      clearCart(state) {
        // Clear the entire cart
        localStorage.removeItem('cart');
        return [];
      }
    }
  });
  export const { addtocart, deletefromcart, decrementQuantity,clearCart } = cartSlice.actions;
export default cartSlice.reducer;