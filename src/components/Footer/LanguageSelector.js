import React, { useEffect, useRef, useState } from 'react';
import './LanguageSelector.css';
import { AiOutlineClose } from 'react-icons/ai';

const LanguageSelector = ({ currLanguage, languages, onLanguageChange, onClose }) => {
  const modalRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState(currLanguage.code);

  const handleChange = (lang) => {
    setSelectedLanguage(lang.code);
    onLanguageChange(lang);
    onClose();
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    setSelectedLanguage(currLanguage.code); 
  }, [currLanguage]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="language-overlay">
      <div className="language-modal" ref={modalRef}>
        <h2>Select Language</h2>
        <button className="close-button" onClick={onClose}>
          <AiOutlineClose />
        </button>
        <div className="language-buttons">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang)}
              className={selectedLanguage === lang.code ? 'active' : ''}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
