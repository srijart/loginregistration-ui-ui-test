import React, { useState, forwardRef, useEffect } from 'react';
import { Range } from 'react-range';
import './FilterComponent.css';
import { AiOutlineClose } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';  
 import { ToastContainer, toast } from 'react-toastify';

const FilterComponent = forwardRef(({ onFilter, isOpen, handleFilterClose, query }, ref) => {
    const { t } = useTranslation(); 
    const [values, setValues] = useState([0, 5000]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [showMoreLanguages, setShowMoreLanguages] = useState(false);
    const [showLevelOptions, setShowLevelOptions] = useState(false);
    const [showRatingOptions, setShowRatingOptions] = useState(false);
    const [showPriceRange, setShowPriceRange] = useState(false); 
    const [showLanguages, setShowLanguages] = useState(true); 
    const [rating, setRating] = useState(0);

    const languages = ['English', 'Telugu', 'Hindi', 'Spanish', 'French', 'German', 'Chinese'];
    const levels = ['Beginner', 'Intermediate', 'Advanced'];

    const handleFilter = () => {
        const filters = {
            ...(values[0] > 0 && { minPrice: values[0] }),
            ...(values[1] < 5000 && { maxPrice: values[1] }),
            ...(selectedLanguage && { language: selectedLanguage }),
            ...(selectedLevel && { level: selectedLevel }),
            ...(rating > 0 && { rating }),
            searchTerm: query,
        };
        
        console.log(filters);
        onFilter(filters);
    };

    useEffect(() => {
        handleFilter();
    }, [values, selectedLanguage, selectedLevel, rating]);

    const clearFilters = () => {
        setValues([0, 5000]);
        setSelectedLanguage('');
        setSelectedLevel('');
        setRating(0);
        handleFilter();
    
         toast.success("Filters cleared successfully!");
    };
    

    const handleCloseFilter = () => {
        if (window.innerWidth <= 786) {
            handleFilterClose();
        }
    }

    return (
        <div className={`filter-container ${isOpen ? 'open' : 'closed'}`}>
             
            {isOpen && (
                <div className="filter-sidebar" ref={ref}>
                    <div className="close-icon" onClick={handleCloseFilter}>
                        <AiOutlineClose size={20} />
                    </div>
                    <div className='subsidebar'>
                        <div onClick={() => {
                            setShowMoreLanguages(false);
                            setShowLevelOptions(false);
                            setShowRatingOptions(false);
                            setShowPriceRange(false);
                            setShowLanguages(!showLanguages);
                        }} className='toggle-label'>
                            <span>{t('Language')}</span>
                            <span>{showLanguages ? '▲' : '▼'}</span>
                        </div>
                        {showLanguages && (
                            <>
                                {languages.slice(0, showMoreLanguages ? languages.length : 3).map((lang) => (
                                    <div key={lang}>
                                        <label>
                                            <input
                                            className='filter-radio'
                                                type="radio"
                                                value={lang}
                                                checked={selectedLanguage === lang}
                                                onChange={() => setSelectedLanguage(lang)}
                                            />
                                            {lang}
                                        </label>
                                    </div>
                                ))}
                                <p className='showmorebutton' onClick={() => setShowMoreLanguages(!showMoreLanguages)}>
                                    {showMoreLanguages ? t('ShowLess') : t('ShowMore')}
                                </p>
                            </>
                        )}
                    </div>

                    <div className='subsidebar'>
                        <div onClick={() => {
                            setShowMoreLanguages(false);
                            setShowLevelOptions(!showLevelOptions);
                            setShowRatingOptions(false);
                            setShowPriceRange(false);
                            setShowLanguages(false);
                        }} className='toggle-label'>
                            <span>{t('Level')}</span>
                            <span>{showLevelOptions ? '▲' : '▼'}</span>
                        </div>
                        {showLevelOptions && levels.map((lvl) => (
                            <div key={lvl}>
                                <label>
                                    <input
                                    className='filter-radio'
                                        type="radio"
                                        value={lvl}
                                        checked={selectedLevel === lvl}
                                        onChange={() => setSelectedLevel(lvl)}
                                    />
                                    {lvl}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className='subsidebar'>
                        <div onClick={() => {
                            setShowMoreLanguages(false);
                            setShowLevelOptions(false);
                            setShowRatingOptions(false);
                            setShowPriceRange(!showPriceRange);
                            setShowLanguages(false);
                        }} className='toggle-label'>
                            <span>{t('PriceRange')}</span>
                            <span>{showPriceRange ? '▲' : '▼'}</span>
                        </div>
                        {showPriceRange && (
                            <>
                                <div className="range-slider">
                                    <Range
                                        values={values}
                                        step={1}
                                        min={0}
                                        max={5000}
                                        onChange={setValues}
                                        renderTrack={({ props, children }) => {
                                            const [min, max] = values;
                                            return (
                                                <div {...props} className="track">
                                                    <div
                                                        className="selected-track"
                                                        style={{
                                                            left: `${(min / 5000) * 100}%`,
                                                            width: `${((max - min) / 5000) * 100}%`,
                                                        }}
                                                    />
                                                    {children}
                                                </div>
                                            );
                                        }}
                                        renderThumb={({ props }) => (
                                            <div {...props} className="thumb" />
                                        )}
                                    />
                                </div>
                                <div>
                                      ${values[0]} -  ${values[1]}
                                </div>
                            </>
                        )}
                    </div>

                    <div className='subsidebar'>
                        <div onClick={() => {
                            setShowMoreLanguages(false);
                            setShowLevelOptions(false);
                            setShowRatingOptions(!showRatingOptions);
                            setShowPriceRange(false);
                            setShowLanguages(false);
                        }} className='toggle-label'>
                            <span>{t('Rating')}</span>
                            <span>{showRatingOptions ? '▲' : '▼'}</span>
                        </div>
                        {showRatingOptions && (
                            <>
                                {[5, 4, 3, 2, 1].map((rate) => (
                                    <div key={rate}>
                                        <label>
                                            <input
                                            className='filter-radio'
                                                type="radio"
                                                value={rate}
                                                checked={rating === rate}
                                                onChange={() => setRating(rate)}
                                            />
                                            {'★'.repeat(rate)}{'☆'.repeat(5 - rate)}
                                        </label>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    <button className='apply-filter-button' onClick={clearFilters}>{t('ClearFilters')}</button>
                </div>
            )}
        </div>
    );
});

export default FilterComponent;
