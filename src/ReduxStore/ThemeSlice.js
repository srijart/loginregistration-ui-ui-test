import { createSlice } from "@reduxjs/toolkit"


const loadStateFromLocal=()=>{
    const StoredTheme= localStorage.getItem('mode');
    return StoredTheme ? StoredTheme :'light-mode';
}
 

const ThemeSlice= createSlice({
    name: 'theme',
    initialState:{
        theme:loadStateFromLocal()
    },
    reducers:{
        toggleTheme:(state)=>{
            state.theme = state.theme === 'light-mode' ? 'dark-mode' : 'light-mode';
            localStorage.setItem('mode', state.theme);
        }
    }
})

export const {toggleTheme}= ThemeSlice.actions;

export default ThemeSlice.reducer;