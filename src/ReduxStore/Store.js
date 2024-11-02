import { configureStore } from "@reduxjs/toolkit";
import ThemeSlice from "./ThemeSlice";
import CartSlice from "./CartSlice";
import WishlistSlice from "./WishlistSlice";
import LanguageSlice from "./LanguageSlice";
import EnrollSlice from "./EnrollSlice"; 
import ProgressBarSlice from "./ProgressBarSlice";


const Store= configureStore({
    reducer:{
        ThemeSlice:ThemeSlice,
        CartSlice: CartSlice,
        WishlistSlice:WishlistSlice,
        LanguageSlice: LanguageSlice,
        ProgressBarSlice: ProgressBarSlice,
        EnrollSlice: EnrollSlice,
    }
})

export default Store;