import { createSlice } from "@reduxjs/toolkit";

 const loadState = () => {
    try {
        const serializedState = localStorage.getItem("wishlist");
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error("Error loading state from local storage:", err);
        return undefined;
    }
};

 const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("wishlist", serializedState);
    } catch (err) {
        console.error("Error saving state to local storage:", err);
    }
};

 const initialState = {
    wishlistItems: [],
    
};

 const persistedState = loadState();
if (persistedState && persistedState.wishlistItems && Array.isArray(persistedState.wishlistItems)) {
    initialState.wishlistItems = persistedState.wishlistItems;
} else {
    saveState(initialState);
}

 const WishlistSlice = createSlice({
    name: "wishlist",
    initialState: initialState,
    reducers: {
        toggleWishlist: (state, action) => {
            const { courseId } = action.payload;
            const existingItemIndex = state.wishlistItems.findIndex(item => item.courseId === courseId);

            console.log(action.payload)
            
            if (existingItemIndex === -1) {
                 state.wishlistItems.push(action.payload);
            } else {
                 state.wishlistItems.splice(existingItemIndex, 1);
            }
            saveState(state);  // Save updated state to local storage
        },

        clearWishlist: (state) => {
            state.wishlistItems = [];
            saveState(state);  
        },
    }
});

 export const { toggleWishlist, clearWishlist } = WishlistSlice.actions;
export default WishlistSlice.reducer;
