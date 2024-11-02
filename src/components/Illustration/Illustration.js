import React, { useEffect, useState } from 'react';
import './Illustration.css';
import illustration_img_L from '../../assets/Illustrations_L.jpg'
import illustration_img_D from '../../assets/Illustrations_D.jpg'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';



const Illustration = () => {

    const  theme = useSelector((Store)=> Store.ThemeSlice.theme)

    const navigate = useNavigate()

    const handleLearning = () =>{
        navigate('/courses')
    }

    const {t}=useTranslation();

    const fullName= localStorage.getItem('fullName')
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="illustration">
            <div className="content-container">
                 <div className="text-content">
                    {
                        fullName && 
                        <h1 className='text-content-fullname'>Welcome back, {fullName} </h1>
                        
                    }
                    <h1>{t("MainQuote")}</h1>
                    <p>{t("SubQuote")}</p>
                    <button className="start-learning-btn" onClick={handleLearning}>Start Learning</button>
                </div>  
                <div className="image-content">
                    {
                        theme === 'light-mode' ?
                        
                    <img src={illustration_img_L} alt="Learning Illustration" className="illustration-image" />:
                    
                    <img src={illustration_img_D} alt="Learning Illustration" className="illustration-image" />
                    } 
                </div>
            </div>
        </div>
    )
}
export default Illustration;