import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n'; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from './components/AuthContext/AuthContext';
import { ToastContainer } from 'react-toastify';
import ToastProvider from './ToastProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
    <ToastProvider>
      <App /> 
    </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);

 reportWebVitals();
