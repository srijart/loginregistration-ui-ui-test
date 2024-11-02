import './App.css';
import Register from './components/Register/register';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/resetpassword';
import Courses from './components/Courses/Courses';
import LoginPage from './components/LoginPage/LoginPage';
import CourseDetails from './components/CourseDetails/CourseDetails';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import SearchResultsPage from './components/SearchResultsPage/SearchResultsPage';
import EnrolledCourse from './components/EnrolledCourses/EnrolledCourse';
import EnrolledCourses from './components/EnrolledCourses/EnrolledCourses';
import AccountPage from './components/profile/AccountPage';
import ProgressBar from './components/ProgressBar/ProgressBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Store from './ReduxStore/Store';
import '@fontsource/inter';
import '@fontsource/playfair-display/400.css';
import '@fontsource/source-serif-pro/400.css';
import '@fontsource/poppins';
import Instructor from './Instructor/Instructor';
import AddCourse from './Instructor/AddCourse';
import Cart from './components/CheckOut/Cart';
import MainDashboard from './components/MainDashboard/MainDashboard';
import WishlistProfile from './components/profile/WishlistProfile';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaypalPayment from './components/CheckOut/PaypalPayment';
import PaymentComponent from './components/CheckOut/PaymentComponent';
import ScrollToTop from './ScrollToTop';  
import Wishlist from './components/profile/Wishlist';
import CategoriesCourses from './components/Navbar/CategoriesCourses';
import QuizCreation from './Instructor/QuizCreation';
import SupportPage from './components/Support/SupportPage';
 
function App() {
  return (
    <Provider store={Store}>
      <PayPalScriptProvider deferLoading={true}>
        <Router>
          <ScrollToTop />  
          <Navbar />
          <Routes>
            <Route path='/' element={<MainDashboard />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/courses' element={<Courses />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/resetpassword' element={<ResetPassword />} />
            <Route path='/coursedetails/:courseId' element={<CourseDetails />} />
            <Route path='/search' element={<SearchResultsPage />} />
            <Route path='/instructor' element={<Instructor />} />
            <Route path='/enrolledCourse/:id' element={<EnrolledCourse />} />
            <Route path='/enrolledCourses' element={<EnrolledCourses />} />
            <Route path='/mycourse' element={<ProgressBar />} />
            <Route path='/profile' element={<AccountPage />} />
            <Route path='/add-course' element={<AddCourse title="Add Course" />} />         
            <Route path='/checkOut' element={<PaypalPayment />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/wishlist' element={<Wishlist />} />
            <Route path="/categories" element={<CategoriesCourses />} />
            <Route path="/quiz-creation/:id" element={<QuizCreation />} />
            <Route path='/support' element={<SupportPage />} />
            <Route path='/Out' element={<PaymentComponent />} />
            <Route path='*' element={<div>Page Not Found</div>} />
          </Routes>
          <Footer />
        </Router>
      </PayPalScriptProvider>
    </Provider>
  );
}

export default App;  