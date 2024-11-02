import React, { useEffect, useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { CLIENT_ID } from '../../Config'; 
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify'; 
import './PaypalPayment.css'; 
import axios from 'axios';
import { clearEnrollments } from '../../ReduxStore/EnrollSlice';
import { useNavigate } from 'react-router-dom';
import { clearCart, COURSES_URL, ENROLLMENT_URL } from '../../Services/courseService';

const PaypalPayment = () => {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [orderIsPaid, setOrderIsPaid] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const courses = useSelector(state => state.EnrollSlice.course) || [];
  const totalAmount = courses.reduce((acc, course) => acc + course.price, 0).toFixed(2);

  const orderPlaced = (details) => {
    console.log("Order placed successfully: ", {
      username: localStorage.getItem("fullName"),
      email: localStorage.getItem("email"),
      transactionId: details.id,
    });
  };

  useEffect(() => {
    if (!courses.length > 0) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    const handlePayment = async () => {
      if (!isPending) {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': CLIENT_ID,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      }
    };

    if (!orderIsPaid) {
      if (!window.paypal) {
        handlePayment();
      }
    }
  }, [isPending, paypalDispatch, orderIsPaid]);

  const handleEnroll = async (transactionId) => {
    try {
      const userId = localStorage.getItem('userId');
      const enrollmentDTO = {
        courses: courses.map(course => ({
          course_id: course?.courseId,
          course_name: course?.title,
        })),
        skilltechera_user_id: userId,
        transactionId,
        totalAmount,
        transactionDate: new Date().toISOString(),
        paymentType: "paypal",
      };
  
      const response = await axios.post(`${COURSES_URL}/payments`, enrollmentDTO);
  
      if (response.status === 200) {
        for (const course of courses) {
          const courseData = {
            course_id: course.courseId,
            skilltechera_user_id: userId,
          };
  
          await axios.post(`${ENROLLMENT_URL}/createEnrollment`, courseData);
        }
  
        dispatch(clearEnrollments());
        clearCart(userId);
        toast.success('Successfully enrolled in the courses!');
        setPopupVisible(true);
      } else {
        toast.error('Unexpected response from the server.');
      }
    } catch (error) {
      setPaymentError(true);
      const message = error.response?.data?.message || 'An error occurred during enrollment.';
      toast.error(message);
    }
  };
  

  const handlePopupClose = () => {
    setPopupVisible(false);
    if (paymentError) {
      setPaymentError(false);
    } else {
      navigate(`/enrolledCourses`);
    }
  };

  return (
    <div className="payment-container">
      <h1 className="payment-header">Payment</h1>

     

      {!orderIsPaid && (
        <>
         <div className="course-summary">
        <h2>Courses:</h2>
        {courses.map(course => (
          <div key={course?.courseId} className="course-item-title">
            <p>{course?.title}</p>
            <p> - ${course?.price}</p>
          </div>
        ))}
        <div className="course-item-title">
          <h3>Total Amount</h3>
          <h3> ${totalAmount}</h3>
        </div>
      </div>
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: totalAmount,
                },
              }],
            });
          }}
          onApprove={async (data, actions) => {
            return actions.order.capture().then((details) => {
              setOrderIsPaid(true);
              orderPlaced(details);
              handleEnroll(details?.id);
            });
          }}
          onCancel={() => {
            toast.error("Payment cancelled");
          }}
          onError={(err) => {
            console.error("Payment error:", err);
            setPaymentError(true);
            toast.error("An error occurred during the payment. Please try again.");
          }}
        />
        </>
      )}

      {popupVisible && (
        <div className='popup-overlay'>
          <div className='popup-content'>
            {paymentError ? (
              <div>
                <h2>Payment Failed</h2>
                <p>Please try again.</p>
                <button onClick={handlePopupClose}>Retry</button>
              </div>
            ) : (
              <div className='payment-success-container'>
                <h2>Payment Successful!</h2>
                <p>Your order has been placed successfully.</p>
                <button onClick={handlePopupClose} className='proceed-button'>Go to Enrolled Courses</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* <ToastContainer /> */}
    </div>
  );
};

export default PaypalPayment;
