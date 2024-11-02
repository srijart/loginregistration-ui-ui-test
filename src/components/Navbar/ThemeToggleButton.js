import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../ReduxStore/ThemeSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import './ThemeToggleButton.css';  

const ThemeToggleButton = () => {
    const dispatch = useDispatch();
    const theme = useSelector(store => store.ThemeSlice.theme); 

    
    useEffect(() => {
        document.body.className = theme;  
    }, [theme]);

    return (
        <button className="theme-toggle-button" onClick={() => dispatch(toggleTheme())}>
            <FontAwesomeIcon icon={theme === 'light-theme' ? faMoon : faSun} />
        </button>
    );
};

export default ThemeToggleButton;
 