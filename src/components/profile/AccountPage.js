import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PersonalInfo from './PersonalInfo';
import AccountSecurity from './AccountSecurity';
import EnrolledCourses from './ProfileEnrolledCourses';
import CompletedCourses from './CompletedCourses';
import PaymentHistory from './PaymentHistory';
import WishlistProfile from './WishlistProfile';
import './AccountPage.css';

const AccountPage = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('PersonalInfo');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);  
    };
    
    handleResize(); 
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = {
    PersonalInfo: <PersonalInfo />,
    AccountSecurity: <AccountSecurity />,
    EnrolledCourses: <EnrolledCourses />,
    CompletedCourses: <CompletedCourses />,
    // Wishlist: <WishlistProfile />,
    PaymentHistory: <PaymentHistory />,
  };

  return (
    <div className="account-page">
      <div className="sidebar">
        {isMobile ? (
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="dropdown"
          >
            {Object.keys(sections).map((key) => (
              <option key={key} value={key}>
                {t(key)} 
              </option>
            ))}
          </select>
        ) : (
          Object.keys(sections).map((key) => (
            <button
              key={key}
              className={activeSection === key ? 'active' : ''}
              onClick={() => setActiveSection(key)}
            >
              {t(key)}  
            </button>
          ))
        )}
      </div>
      <div className="content">{sections[activeSection]}</div>
    </div>
  );
};

export default AccountPage;
