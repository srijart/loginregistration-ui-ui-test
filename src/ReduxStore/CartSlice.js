import { createSlice } from "@reduxjs/toolkit";

const loadState = () => {
    try {
        const serializedState = localStorage.getItem("item");
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error("Error loading state from local storage:", err);
        return undefined;
    }
}

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("item", serializedState);
    } catch (err) {
        console.error("Error saving state to local storage:", err);
    }
}

const initialState = {
    cartItems: [],
};

const persistedState = loadState();
if (persistedState && persistedState.cartItems && Array.isArray(persistedState.cartItems)) {
    initialState.cartItems = persistedState.cartItems;
} else {
    saveState(initialState);
}

const CartSlice = createSlice({
    name: "Cart",
    initialState: initialState,
    reducers: {
        addToReduxCart: (state, action) => {
            const { courseId } = action.payload;
            console.log(courseId)
            const existingItem = state.cartItems.find(cartItem => cartItem.courseId === courseId);

            if (!existingItem) {
                 const newCartItems = [...state.cartItems, { ...action.payload, quantity: 1 }];
                const newState = { ...state, cartItems: newCartItems };
                saveState(newState);
                return newState;
            }
            return state;  
        },
        
        removeFromReduxCart: (state, action) => {
            const { courseId } = action.payload;
            const updatedItems = state.cartItems.filter(cartItem => cartItem.courseId !== courseId);
            const newState = { ...state, cartItems: updatedItems };
            saveState(newState);
            return newState;
        },

        clearReduxCart: (state) => {
            const newState = { ...state, cartItems: [] };
            saveState(newState);
            return newState;
        },
    }
});

export const { addToReduxCart, removeFromReduxCart, clearReduxCart } = CartSlice.actions;

export default CartSlice.reducer;
