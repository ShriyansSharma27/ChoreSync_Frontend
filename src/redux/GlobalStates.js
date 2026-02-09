import {createSlice, configureStore} from '@reduxjs/toolkit';

// Slice for managing shopping cart state and persistence
const cartSlice = createSlice({
    name: 'cartItems',
    initialState: {
        value: JSON.parse(localStorage.getItem('cartItems')) || []
    },
    reducers: {
        // Add service to cart and update local storage
        add: (state, action) => {
            state.value.push(action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.value));
        },
        // Remove item by index
        remove: (state, action) => {
            state.value = state.value.filter((_, i) => i !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.value));
        },
        // Reset cart
        clear: (state, action) => {
            state.value = [];
            localStorage.setItem('cartItems', JSON.stringify([]));
        }   
    }
});

// Slice for tracking successful checkout status
const purchaseSlice = createSlice({
    name: 'orderItems',
    initialState: {
        value: JSON.parse(localStorage.getItem('orderItems')) || []
    },
    reducers: {
        // Record a purchase even for UI updates
        purchased: (state, action) => {
            state.value.push(action.payload);
            localStorage.setItem('orderItems', JSON.stringify(state.value));
        }
    }
});

// Export actions
export const {add, remove, clear} = cartSlice.actions;
export const {purchased} = purchaseSlice.actions;

// Configure global store with combined reducers
export const store = configureStore({
    reducer: {
        cartItems: cartSlice.reducer,
        orderItems: purchaseSlice.reducer
    }
});