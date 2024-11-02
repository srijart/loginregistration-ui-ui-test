import React, { useState, useEffect } from 'react';
import CourseManagement from './CourseManagement';
import StudentAnalytics from './StudentAnalytics';
import Earnings from './Earnings';
import './Instructor.css';
import { FaPen } from 'react-icons/fa';  
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Instructor = () => {
    const [activeSection, setActiveSection] = useState('CourseManagement');
    const [isMobile, setIsMobile] = useState(false);
    const { t } = useTranslation();
    const token= localStorage.getItem("token");
    const fullName = localStorage.getItem('fullName');
    const firstLetter = fullName ? fullName.charAt(0).toUpperCase() : '';
    const navigate=useNavigate();

    useEffect(() => {

        if(!token){
            navigate('/login')
        }
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();  
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);



    const renderSection = () => {
        switch (activeSection) {
            case 'CourseManagement':
                return <CourseManagement />;
            case 'StudentAnalytics':
                return <StudentAnalytics />;
            case 'EarningsOverview':
                return <Earnings />;
            default:
                return <div>{t('SelectASection')}</div>; 
        }
    };

    return (
        <div className="instructor-page">
            <div className="i-sidebar">
                {isMobile ? (
                    <select
                        value={activeSection}
                        onChange={(e) => setActiveSection(e.target.value)}
                        className="dropdown"
                    >
                        <option value="CourseManagement">{t('CourseManagement')}</option>
                        <option value="StudentAnalytics">{t('StudentAnalytics')}</option>
                        <option value="EarningsOverview">{t('EarningsOverview')}</option>
                        <option value="CompletedCourses">{t('CourseReviews')}</option>
                        <option value="Wishlist">{t('Announcements')}</option>
                    </select>
                ) : (
                    <>
                        <button
                            className={activeSection === 'CourseManagement' ? 'active' : ''}
                            onClick={() => setActiveSection('CourseManagement')}
                        >
                            {t('CourseManagement')}
                        </button>
                        <button
                            className={activeSection === 'StudentAnalytics' ? 'active' : ''}
                            onClick={() => setActiveSection('StudentAnalytics')}
                        >
                            {t('StudentAnalytics')}
                        </button>
                        <button
                            className={activeSection === 'EarningsOverview' ? 'active' : ''}
                            onClick={() => setActiveSection('EarningsOverview')}
                        >
                            {t('EarningsOverview')}
                        </button>
                        <button
                            className={activeSection === 'CompletedCourses' ? 'active' : ''}
                            onClick={() => setActiveSection('CompletedCourses')}
                        >
                            {t('CourseReviews')}
                        </button>
                        <button
                            className={activeSection === 'Wishlist' ? 'active' : ''}
                            onClick={() => setActiveSection('Wishlist')}
                        >
                            {t('Announcements')}
                        </button>
                    </>
                )}
            </div>
            <div className="i-content">
                <div className='image-container'>
                <p 
                className="instructor-image"  >{firstLetter} </p>
                    <label htmlFor="imageUpload">
                        <FaPen style={{ cursor: 'pointer' }} color={'white'} />
                    </label>
                    <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        // onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    <h2>{t('Instructor')}</h2>
                </div>
                <div>
                    {renderSection()}
                </div>
            </div>
        </div>
    );
};

export default Instructor;
