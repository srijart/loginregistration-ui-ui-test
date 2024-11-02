import { createSlice } from "@reduxjs/toolkit";
 
 const getInitialLanguage = () => {
    const storedLanguage = localStorage.getItem('language');
    return storedLanguage ? JSON.parse(storedLanguage) : { code: 'en', name: 'English' };
};

const languageSlice = createSlice({
    name: 'language',
    initialState: {
        language: getInitialLanguage(),
    },
    reducers: {
        selectLanguage: (state, action) => {
            state.language = action.payload;
            localStorage.setItem('language', JSON.stringify(state.language));
        },
    },
});

export const { selectLanguage } = languageSlice.actions; 
export default languageSlice.reducer;
