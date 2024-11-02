import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ClipLoader from 'react-spinners/ClipLoader';
import '../EnrolledCourses/EnrolledCourses.css';
import { PAYMENTS_URL } from '../../Services/courseService';

const CompletedCourses = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const skilltechera_user_id = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      setLoading(true);
      try {
        const paymentResponse = await axios.get(`${PAYMENTS_URL}/user/${skilltechera_user_id}`);
        setPaymentHistory(paymentResponse.data);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [skilltechera_user_id]);

  const handleClick = (courseId) => {
    navigate(`/enrolledCourse/${courseId}`);
  };

  const { t } = useTranslation(); 

  return (
    <div className="section-content-courses">
      <div className="enrolledCourse-courses-page">
        {loading ? (
          <ClipLoader color="#333333" loading={loading} size={30} id='clipLoader' />
        ) : (
          <>
            <h1 className="enrolledCourse-page-header">{t('PaymentHistory')}</h1>
            <div className="payment-history">
              {paymentHistory.length > 0 ? (
                paymentHistory.map(payment => (
                  <div key={payment.id} className="payment-card">
                    <p className="transaction-id">Transaction ID: {payment.transactionId}</p>
                   <p className='amount-info'> <span className="total-amount">Amount: ${payment.totalAmount}</span>
                    <span className="course-info">Type: {payment.paymentType}</span></p>
                    <ul>
                      {payment.courses.map(course => (
                        <li key={course.courseId} className="course-card" onClick={() => handleClick(course.courseId)}>
                          {course.title}
                        </li>
                      ))}
                    </ul>
                    <p>Date: {new Date(payment.transactionDate).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p>{t('NoPaymentHistory')}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompletedCourses;
