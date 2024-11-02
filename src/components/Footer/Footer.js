import React, { useEffect, useState } from 'react';
import './Footer.css';
import { useTranslation } from 'react-i18next'; 
import Footer_L from '../../assets/Footer_L.jpg';
import Footer_D from '../../assets/Footer_D.jpg';
import { useDispatch, useSelector } from 'react-redux';
import image from '../../assets/image_logo.png';
import LanguageSelector from './LanguageSelector';
import { selectLanguage } from '../../ReduxStore/LanguageSlice';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'ru', name: 'Русский (Russian)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
 ];


const Footer = () => {
  const { t, i18n } = useTranslation(); 
  const theme = useSelector((store) => store.ThemeSlice.theme);
  const [isLanguageBtnClicked, setIsLanguageBtnClicked] = useState(false);
  const language = useSelector(store => store.LanguageSlice.language) || { code: 'en', name: 'English' }; // Default to English if not set

  const dispatch = useDispatch();

  const onLanguageChange = (lang) => {
    dispatch(selectLanguage(lang));  
    i18n.changeLanguage(lang.code);  
    setIsLanguageBtnClicked(false);
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || JSON.stringify({ code: 'en', name: 'English' });
    try {
      const parsedLanguage = JSON.parse(storedLanguage);
      dispatch(selectLanguage(parsedLanguage));
      i18n.changeLanguage(parsedLanguage.code);
    } catch (error) {
      console.error('Error parsing language from localStorage:', error);
    }
  }, [dispatch, i18n]);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language.code);
    }
  }, [language, i18n]);

  const handleCloseOverlay = () => {
    setIsLanguageBtnClicked(false);
  };

  return (
    <footer className="footer">
      <img 
        src={theme === 'light-mode' ? Footer_L : Footer_D} 
        alt="Learning Illustration" 
        className="footer-image" 
      />
      <div className="footer-container">
        <div className="footer-logo">
          <img src={image} alt='Company Logo' className='image-logo' />
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <a href="/home">{t("Home")}</a>
            <a href="/instructors">{t("Instructors")}</a>
            <a href="/categories">{t("Categories")}</a>
            <a href="/about">{t("AboutUs")}</a>
            <a href="/support">{t("ContactUs")}</a>
          </div>
          <div className="footer-column">
            <a href="/teams">{t("Teams")}</a>
            <a href="/privacy-policy">{t("PrivacyPolicy")}</a>
            <a href="/cooking-settings">{t("CookingSettings")}</a>
            <a href="/sitemap">{t("SiteMap")}</a>
          </div>
          <div className="footer-language">
          <button 
            className="language-button" 
            onClick={() => setIsLanguageBtnClicked(true)}
            aria-label="Language Selector"
          >
            <span className="language-icon">🌐 {t(language.name)}</span>
          </button>
        </div>
        </div>
       
      </div>

      {isLanguageBtnClicked && (
        <LanguageSelector 
          currLanguage={language}
          languages={languages} // Pass languages here
          onLanguageChange={onLanguageChange} 
          onClose={handleCloseOverlay} 
        />
      )}
    </footer>
  );
};

export default Footer;
