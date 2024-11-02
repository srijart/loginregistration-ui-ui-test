import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Earnings.css';

const Earnings = () => {
  const { t } = useTranslation();
  const [showReport, setShowReport] = useState(false);
  const [earnings, setEarnings] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        // const response = await instructorEarnings(userId);
        // setEarnings(response);
      } catch (error) {
        console.error('Error fetching earnings:', error);
      }
    };

    fetchEarnings();
  }, []);

  const handleToggleReport = () => {
    setShowReport(!showReport);
  };

  return (
    <div className="earnings-container">
      <div className="earnings-box">
        <h1 className="earnings-title">{t('Earnings')}</h1>
        <p className="earnings-description">
          {t('TrackYourEarnings')}
        </p>
        <button className="earnings-btn" onClick={handleToggleReport}>
          {showReport ? t('HideReport') : t('ViewReport')}
        </button>
      </div>

      {showReport && (
        <div className="earnings-report">
          <h2 className="report-title">{t('YourEarningsReport')}</h2>
          <p>{t('TotalEarnings')}: $5,000</p>
          <p>{t('CoursesSold')}: 100</p>
          <p>{t('LastPayout')}: $1,200</p>
          <p>{t('NextPayout')}: $800</p>
        </div>
      )}
    </div>
  );
};

export default Earnings;
