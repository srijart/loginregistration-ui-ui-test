import axios from 'axios'; 
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';

const AccountSecurity = () => {
  const [activeSection, setActiveSection] = useState('password');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  
  const { t } = useTranslation();

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const validatePassword = (newPassword, confirmPassword) => {
    const passwordCriteria = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$.!%*?&]{8,}$/; 
    if (!passwordCriteria.test(newPassword)) {
      return "Password must be at least 8 characters long, include a letter & a number.";
    }
    if (newPassword !== confirmPassword) {
      return "New password and confirmation do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validatePassword(newPassword, confirmPassword);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }
    setError('');

    const email = localStorage.getItem('email');
    const oldPassword = currentPassword;
    const url = `http://localhost:8085/api/v1/addPassword?email=${email}&oldPassword=${oldPassword}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`;

    setLoading(true); 

    try {
      const res = await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Response:', res.data);
      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Error updating password. Please try again.');
      toast.error('Error updating password. Please try again.');
    } finally {
      setLoading(false); 
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'password':
        return (
          <div className="section-content">
            {loading && (
              <div className="loading-overlay">
                <ClipLoader color="black" loading={loading} size={50} />
                <p>{t("Please wait, your password is being updated.")}</p>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <input
                className='input-password'
                type="password"
                placeholder={t('CurrentPassword')}
                autoComplete="off"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                className='input-password'
                type="password"
                placeholder={t('NewPassword')}
                autoComplete="off"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                className='input-password'
                type="password"
                placeholder={t('ReTypeNewPassword')}
                autoComplete="off"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {error && <div className="error-message">{error}</div>}
              <button className="save-btn">{t('PasswordUpdate')}</button>
            </form>
          </div>
        );
      // Commented out sections for future use
      // case '2fa':
      //   return (
      //     <div className="section-content-2fa">
      //       <div className='label-2fa'>
      //         <input type="radio" name="2fa" value="mobile" />
      //         {t('MobileAppAuthenticator')}
      //         <p>{t('UseMobileApp')}</p>
      //       </div>
      //       <div className='label-2fa'>
      //         <input type="radio" name="2fa" value="email" />
      //         {t('Email')}
      //         <p>{t('ReceiveVerificationCode')}</p>
      //       </div>
      //       <button className="save-btn">{t('Continue')}</button>
      //     </div>
      //   );
      // case 'activity':
      //   return (
      //     <div className="section-content-activity">
      //       <ul className="activity-log">
      //         <li>Aug 16 - {t('AccountActivityLog')}</li>
      //         <li>Aug 15 - {t('AccountActivityLog')}</li>
      //         <li>Aug 14 - {t('AccountActivityLog')}</li>
      //         <li>Aug 13 - {t('AccountActivityLog')}</li>
      //       </ul>
      //     </div>
      //   );
      default:
        return null;
    }
  };

  return (
    <div className="account-security">
      <ToastContainer />
      <div className="tabs">
        <button
          className={activeSection === 'password' ? 'active' : ''}
          onClick={() => handleSectionClick('password')}
        >
          {t('PasswordUpdate')}
        </button>
        {/* Uncomment if needed in future */}
        {/* <button
          className={activeSection === '2fa' ? 'active' : ''}
          onClick={() => handleSectionClick('2fa')}
        >
          {t('TwoFASettings')}
        </button>
        <button
          className={activeSection === 'activity' ? 'active' : ''}
          onClick={() => handleSectionClick('activity')}
        >
          {t('AccountActivityLog')}
        </button> */}
      </div>
      {renderContent()}
    </div>
  );
};

export default AccountSecurity;
