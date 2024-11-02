import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart, faBell, faSignOutAlt, faUserCog, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../Navbar/Navbar.css';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthContext/AuthContext';
import axios from 'axios';
import debounce from 'lodash.debounce';
import image_logo from '../../assets/image_logo.png'
import ThemeToggleButton from './ThemeToggleButton';
import ProgressBar from '../ProgressBar/ProgressBar';
import Categories from './Categories'; import '../../i18n.js'
import { useDispatch, useSelector } from 'react-redux';
import { clearEnrollments, enrollCourse } from '../../ReduxStore/EnrollSlice';
import { toast } from 'react-toastify';
import MobileCategories from './MobileCategories.js';
import { AiOutlineClose } from 'react-icons/ai';
import { clearCart, clearReduxCart } from '../../ReduxStore/CartSlice.js';
import { COURSES_URL, ENROLLMENT_URL, getCartItems } from '../../Services/courseService.js';


const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showMyCoursesDropdown, setShowMyCoursesDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null)
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [cartItemsDB, setCartItemsDB] = useState([]);

  const { cartItems } = useSelector((Store) => Store.CartSlice)
  const { wishlistItems } = useSelector((store) => store.WishlistSlice);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async() => {
    const res= await logout();
     dispatch(clearReduxCart());
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate("/");
    
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
 
  };

  const fullName = localStorage.getItem('fullName');
  const firstLetter = fullName ? fullName.charAt(0).toUpperCase() : '';



  const fetchSearchResults = async (query) => {
    if (query.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      const response = await axios.get('http://localhost:8082/api/v1/course/pagination', {
        params: {
          searchTerm: query,
          page: 0,
          size: 10,
        },
      });
      const courses = response.data.data.content;
      setSearchResults(courses);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
      setShowDropdown(true);
    }
  };

  const debouncedFetchSearchResults = debounce(fetchSearchResults, 300);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFetchSearchResults(query);
  };

  const handleSearchSubmit = (e) => {
    console.log(searchResults)
    if (e.key === 'Enter' || e.type === 'click') {
      navigate(`/search?query=${searchQuery}`);
      setShowDropdown(false);
    }
  };

  const handleSearchItemClick = (courseId) => {
    navigate(`/coursedetails/${courseId}`);
    setShowDropdown(false);
  };

  useEffect(() => {
    if (location.pathname !== '/search') {
      setSearchQuery('');
  }
}, [location]);

  const handlMyCourseClick = (courseId) => {
    navigate(`/EnrolledCourse/${courseId}`);
    setShowDropdown(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };



  const handleClickOutside = (event) => {
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target)
    ) {
      setShowProfileDropdown(false);
    }

    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
    }

    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
    }
  };


  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);

      window.removeEventListener('resize', handleResize);

    };
  }, []);

  let numOfItem = 0;
  let totalPrice = 0;

  // cartItems.forEach(cartItem => {
  //   numOfItem += cartItem.quantity;
  //   totalPrice += cartItem.price * cartItem.quantity;
  // });

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => setIsOrderPlaced(false);
  }, []);


  const handleEnroll = async () => {
    navigate('/cart')
  };


  const userId = localStorage.getItem('userId');

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch(`${ENROLLMENT_URL}/${userId}/enrollments`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const enrolledCoursesData = await response.json();
      console.log({ "enrolledCoursesData": enrolledCoursesData });

      const courseDetailsPromises = enrolledCoursesData.map(async course => {
        const courseDetailResponse = await fetch(`${COURSES_URL}/course/${course.courseId}`);
        const courseDetail = await courseDetailResponse.json();

        const progressResponse = await fetch(`${ENROLLMENT_URL}/${course.id}/progress`);
        if (!progressResponse.ok) {
          throw new Error('Network response was not ok, status: ' + progressResponse.status);
        }


        const progressData = await progressResponse.text();
        const progressMatch = progressData.match(/(\d+\.\d+)/);
        const progressValue = progressMatch ? parseFloat(progressMatch[1]) : null;

        return {
          ...courseDetail,
          progress: progressValue,
        };
      });

      const courseDetails = await Promise.all(courseDetailsPromises);
      setEnrolledCourses(courseDetails);

    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const  cartLength=cartItems?.length ;
  console.log(cartLength)

   

  useEffect(() => {
    const fetchCartItems = async () => {
      if(!userId){
        setCartItemsDB([])
      }
      try {
        const res = await getCartItems(userId);
        setCartItemsDB(res.cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
  
    fetchEnrolledCourses();
    fetchCartItems();
  }, [cartLength, location.pathname, userId]); 
  

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);


  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 790);

  const handleMyCoursesMouseEnter = () => {
    if (isDesktop) {
      console.log(isDesktop, "Ddd")
      fetchEnrolledCourses();
      setShowMyCoursesDropdown(true);
    }
  };

  const handleMyCoursesMouseLeave = () => {
    if (isDesktop) {
      setShowMyCoursesDropdown(false);
    }
  };

  const handleCategoriesMouseEnter = () => {
    if (isDesktop) {
      fetchEnrolledCourses();
      setShowCategories(true);
    }
  };

  const handleCategoriesMouseLeave = () => {
    if (isDesktop) {
      setShowCategories(false);
    }
  };

  const handleCartMouseEnter = () => {
    if (isDesktop) {
      setShowCart(true);
    }
  };

  const handleCartMouseLeave = () => {
    if (isDesktop) {
      setShowCart(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 790);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 786);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCategoriesClick = () => {
    console.log("true")
    setShowCategories(true);
  };

  const handleCategoriesFalse = (ebe) => {
    console.log("false")
    setShowCategories(false);
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <nav className={` ${location.pathname === "/" ? "navbar" : "navbar2"} `}>
      <div className="container">
        <div className="nav-logo">
          <Link to="/">
            <img src={image_logo} alt="nav-logo" className="nav-logoo" />
          </Link>
        </div>


        <div >
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>☰</button>
          <div className={`nav-links-mob  ${isMobileMenuOpen ? 'open' : ''}`}>
            <div ref={mobileMenuRef} className={`nav-links ${isMobileMenuOpen ? 'open' : ''} ${location.pathname === "/" ? "navmob-bg" : "navmob-bg2"}`} >

              <button className='nav-close-buttton' onClick={() => setIsMobileMenuOpen(false)} ><AiOutlineClose size={20} />
              </button>

              {!isLoginPage && (
                <div className="search-container" ref={searchContainerRef}>
                  <div className={`search-container ${location.pathname === "/" ? "search-input" : "search-input2"}`}>

                    <FontAwesomeIcon icon={faSearch} color="white" size="md" className="search-icon" />
                    <input
                      type="text"
                      name="search-box"
                      className="search-box"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchSubmit}
                      autoComplete="off"
                      placeholder={t("SearchHere")} />
                  </div>
                  {showDropdown && (
                    <div className="search-dropdown">
                      {searchResults.length > 0 ? (
                        searchResults.map(course => (
                          <div
                            key={course.course_id}
                            className="search-dropdown-item"
                            onClick={() => handleSearchItemClick(course.courseId)}
                          >
                            <FontAwesomeIcon icon={faSearch} color="black" size="md" className="search-icon" />
                            {course.title}
                          </div>
                        ))
                      ) : (
                        <div className="search-dropdown-item no-results">{t('NoResultsFound')}</div>
                      )}
                    </div>
                  )}
                </div>
              )}


              <Link to="/courses" className="nav-link">{t("Courses")}</Link>

              {isLoggedIn && (

                <div
                  className="nav-link"
                  onMouseEnter={handleMyCoursesMouseEnter}
                  onMouseLeave={handleMyCoursesMouseLeave}
                >
                  <Link to="/enrolledCourses" className="nav-mycourses">
                    {t("MyCourses")}
                  </Link>
                  {showMyCoursesDropdown && (
                    <div className="mycourses-dropdown">
                      {enrolledCourses?.length > 0 ? (
                        <>
                          {enrolledCourses.slice(0, 4).map(course => (
                            <div
                              key={course.data.courseId}
                              className="mycourses-dropdown-item"
                              onClick={() => handlMyCourseClick(course.data.courseId)}
                            >
                              {course.data.title}
                              <ProgressBar progress={course.progress} />
                            </div>
                          ))}
                          <div className="go-to-my-courses" onClick={() => navigate('/enrolledCourses')}>
                            {t('GoToMyCourses')}
                          </div>
                        </>
                      ) : (
                        <div className="no-courses-dropdown">{t('NoCoursesEnrolled')}</div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div className="nav-link" onClick={handleCategoriesClick} onMouseEnter={handleCategoriesMouseEnter} onMouseLeave={handleCategoriesMouseLeave}>
                {t("Categories")}
                {showCategories && (isMobile ? <MobileCategories handleCat={handleCategoriesFalse} /> : <Categories />)}
              </div>

              <Link to="/instructor" className="nav-link">{t("Instructor")}</Link>


              <div className="nav-icons">
                {/* <Link to={'/wishlist'}>
                  <FontAwesomeIcon icon={faHeart} className="nav-icon" />
                </Link> */}


                <Link to="/cart" className="cart-link"
                  onMouseEnter={handleCartMouseEnter}
                  onMouseLeave={handleCartMouseLeave}>
                  <FontAwesomeIcon icon={faShoppingCart} className="nav-icon" />

                  {cartItemsDB.length > 0 && <span className="cart-count">{cartItemsDB.length}</span>}
                </Link>

                {showCart && cartItemsDB.length > 0 && (
                  <div
                    className="nav-cart-container"
                    onMouseEnter={handleCartMouseEnter}
                    onMouseLeave={handleCartMouseLeave}
                  >
                    {cartItemsDB.slice(0, 4).map((cartItem) => (
                      <div key={cartItem.id} className='nav-cart-item'>
                        <img
                          src={cartItem.course.imageUrl}  
                          alt={`${cartItem.course.title} image`}
                          className='nav-cart-item-imageUrl'
                          onClick={() => navigate(`/coursedetails/${cartItem.course.courseId}`)}  
                        />
                        <div>
                          <p className='nav-cart-item-name'>{cartItem.course.title}</p>  
                          <p className='nav-cart-item-price'>${cartItem.course.price}</p>  
                        </div>
                      </div>
                    ))}
                    <button className='nav-cart-checkout-button' onClick={handleEnroll}>
                      {t('Gotocart')}
                    </button>
                  </div>

                )}


                <FontAwesomeIcon icon={faBell} className="nav-icon" />

              </div>


              {isLoggedIn && (
                <div className="profile-container" ref={profileDropdownRef}>
                  <p
                    className="profile-image"
                    onClick={toggleProfileDropdown} >{firstLetter} </p>

                  <div className={`profile-dropdown ${showProfileDropdown ? 'show' : ''}`}>
                    <div className="profile-dropdown-item" onClick={() => navigate('/profile')}>
                      <FontAwesomeIcon icon={faUserCog} /> {t('AccountSettings')}
                    </div>
                    <div className="profile-dropdown-item" onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} /> {t('Signout')}
                    </div>
                  </div>
                </div>
              )}

              {!isLoggedIn && !isLoginPage && (
                <div className="signup-container">
                  <button className="nav-button" onClick={handleLogin}>{t('Login')}</button>
                </div>
              )}
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

