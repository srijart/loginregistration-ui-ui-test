import React, { useEffect, useState } from 'react'
import { listCourses, mostSearchedCourses, PrevSearchedCourses } from '../../Services/courseService';
import CourseTemplate from '../ExploringSkills/CourseTemplate';
import ClipLoader from 'react-spinners/ClipLoader';

const ExploringSkills = () => {
    
  const [courses, setCourses] = useState([]);
//const [showAllCourses, setShowAllCourses] = useState(false);
  const [loading, setLoading]=useState(true);
  const [error, setError]=useState(null);

  const userId=localStorage.getItem('userId')

  useEffect(() => {
        const fetchCourses = async () => {
          setLoading(true);
          try {
            const response = await listCourses();
            setCourses(Array.isArray(response.data.data) ? response.data.data : []);
            console.log("exploring skills" ,response.data.data)
    
          } catch (error) {
            setError('Error fetching courses. Please try again later.');
            console.error('Error fetching courses:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchCourses();
      }, []);

  return (
    <div>
        {
        loading ? ( <ClipLoader color="#333333" loading={loading} size={30} id='clipLoader' /> ):
        <CourseTemplate    coursesData={courses} pageTitle={"ExploringSkills"}/>
        }
    </div>
  )
}

export default ExploringSkills













// import React, { useEffect, useState } from 'react'; 
// import { listCourses } from '../../Services/courseService';
// import { Link, useNavigate } from 'react-router-dom';
// import './ExploringSkills.css';
// import { Splide, SplideSlide } from '@splidejs/react-splide';
// import '@splidejs/react-splide/css';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { addToCart } from '../../ReduxStore/CartSlice';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import { toggleWishlist } from '../../ReduxStore/WishlistSlice';
// import { useTranslation } from 'react-i18next';
// import ClipLoader from 'react-spinners/ClipLoader';
 
// const ExploringSkills = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [hoveredCourseIndex, setHoveredCourseIndex] = useState(null); 
//   const [btnClicked, setBtnClicked] = useState({}); 
//   const {wishlistItems} = useSelector(Store=> Store.WishlistSlice); 
//   const [enrollmentStatus, setEnrollmentStatus] = useState({});
 
//   const {t}= useTranslation();
  

//   useEffect(() => {
//     const fetchCourses = async () => {
//       setLoading(true);
//       try {
//         const response = await listCourses();
//         setCourses(Array.isArray(response.data.data) ? response.data.data : []);
//         console.log("exploring skills" ,response.data.data)

//       } catch (error) {
//         setError('Error fetching courses. Please try again later.');
//         console.error('Error fetching courses:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

 
//   const handleCardMouseEnter = async(index, courseId) => {
//     setHoveredCourseIndex(index);
//     const isEnrolled = await handleSideCardHover(courseId);
//     setEnrollmentStatus(prev => ({ ...prev, [courseId]: isEnrolled }));
//     updateSideCardPosition();  
//   };

//   const handleCardMouseLeave = () => {
//     setHoveredCourseIndex(null);
//   };

//   const renderRating = (rating) => {
//     const fullStars = Math.floor(rating);
//     const halfStar = rating % 1 >= 0.5;
//     let stars = '★'.repeat(fullStars);
//     if (halfStar) stars += '☆';
//     return stars;
//   }; 

  
//   const getVisibleSlidesCount = () => {
//     const width = window.innerWidth;
//     if (width >= 1086) return 4; 
//     if (width >= 768) return 3;
//     if (width >= 480) return 2;
//     return 1; 
//   };

//   const updateSideCardPosition = () => {
//     const slides = document.querySelectorAll('.splide__slide');
//     const visibleSlidesCount = getVisibleSlidesCount();

//     setTimeout(() => {
//       const lastVisibleIndex = Math.min(visibleSlidesCount - 1, slides.length - 1);

//       slides.forEach((slide, index) => {
//         const sideCard = document.querySelector(`.side-card-${index}`);

//         if (sideCard) {
//           if (index === lastVisibleIndex || index===slides.length - 1) {
//              sideCard.style.left = 'auto';
//             sideCard.style.right = '100%'; 
//           } else if((index +1) % visibleSlidesCount==0){
//             console.log( (index +1) % visibleSlidesCount==0)
//             console.log("its working divisible")
//             sideCard.style.left = 'auto';
//             sideCard.style.right = '100%';
//           } 
//           else{
//             sideCard.style.left = '92%';  
//             sideCard.style.right = 'auto';
//           }
//         }
//       });
//     }, 0);
//   };



//   const checkEnrollmentStatus = async (userId, courseId) => {
//     try {
//       const response = await axios.get(`http://localhost:8089/enrollments/${userId}/${courseId}/getEnrollmentStatus`);
//       return response.data;
//     } catch (error) {
//       console.error('Error checking enrollment status:', error);
//       return false;
//     }
//   };
  
//   const userId = localStorage.getItem('userId');

//   const handleSideCardHover=async(courseId)=>{
//     if (userId) {
//       const isEnrolled = await checkEnrollmentStatus(userId, courseId);
//       if (isEnrolled) {
//          return true ;
//       } else {
//         return false;
//       }
//     }
//     else{
//       return false;
//         }
//   }

//   const handleCardClick = async (courseId) => {
//     console.log(userId)
  
//     if (userId) {
//       const isEnrolled = await checkEnrollmentStatus(userId, courseId);
//       if (isEnrolled) {
//         navigate(`/enrolledCourse/${courseId}`);
//         return;
//       } else {
//         navigate(`/coursedetails/${courseId}`);
//       }
//     }
//     else{
//       navigate(`/coursedetails/${courseId}`);
//     }
  
//     localStorage.setItem('courseId', courseId);
//   };

//   const handleWishlist = (course) => {
//     dispatch(toggleWishlist(course));
//     // setIsWishlisted(prev => ({
//     //   ...prev,
//     //   [course.courseId]: !prev[course.courseId]  
//     // }));
//   };

//   const handleAddToCart = (course) => {
//     dispatch(addToCart({ ...course, price: Math.floor(course.price), quantity: 1 }));
//     setBtnClicked(prev => ({ ...prev, [course.courseId]: true }));  
//   };

//   const isCourseWishlisted = (courseId) => {
//     return wishlistItems.some(item => item.courseId === courseId);
// };


//    if (error) return <div className='loading-courses'>{error}</div>;

//   return (
//     <div className='ES-Container'>
//       {
//         loading ? ( <ClipLoader color="#333333" loading={loading} size={30} id='clipLoader' /> ):

//         (<><h1 className='ES-Heading'>{t("ExploringSkills")}</h1>

//         <Splide options={{
//           perPage: 4,
//           gap: '0rem',
//           pagination: false,
//           arrows: true,
//           loop: true,
//           drag: false,
//           fixedWidth: '270px',
//           breakpoints: {
//             1086: { perPage: 3  },
//             768: { perPage: 2 , fixedWidth: '245px'},
//             480: { gap: '0.7rem', fixedWidth: '165px' }
//           },
//         }} className='splide-course-container'>
//           {courses.map((course, index) => (
//              <SplideSlide key={course.courseId}>
//              <div className='es-course-maincontainer'  
//                onMouseEnter={() => handleCardMouseEnter(index, course.courseId)} 
//                onMouseLeave={() => setHoveredCourseIndex(null)}>
//                <div className="es-course-card" 
//                  onClick={() => handleCardClick(course.courseId)}>
//                  <img 
//                    src={course.imageUrl || "https://thumbs.dreamstime.com/b/digital-background-glowing-orange-blue-lights-resembling-binary-code-sense-advanced-technology-data-flow-ideal-327299605.jpg"} 
//                    alt={course.title} 
//                    className="es-course-image" 
//                  />
//                  <h2 className="es-course-title">{course.title}</h2>
//                  <div className="course-rating">{renderRating(course.rating || 4)}</div>
//                  <div className="course-footer">
//                    <p className="course-instructor">{course.createdBy}</p>
//                    <p className="course-price">${Math.floor(course.price)}</p>
//                  </div>
//                </div>
//                {hoveredCourseIndex === index && (
//                  <div className={`side-card side-card-${index}`} key={`side-card-${course.courseId}`}>
//                    <h3 className="es-sidecard-title">{course.title}</h3>
//                    <p className="es-sidecard-description">{course.description}</p>
//                    <p className="es-sidecard-additionalInfo">{course.additionalInfo || "Become a Developer With ONE course JavaScript, React, Node, MongoDB and More!"}</p>
                   
//                    <div className='sidecard-buttons-container'>
//                      {enrollmentStatus[course.courseId] ? (
//                         <button className="ES-button" onClick={() => navigate(`/enrolledCourse/${course.courseId}`)}>Continue</button>
//                      ) : (
//                        <span>
//                          {!btnClicked[course.courseId] ? (  
//                            <button className="ES-button" onClick={() => handleAddToCart(course)}>Add to Cart</button>
//                          ) : (
//                            <Link to='/Cart'>
//                              <button className="ES-button">Go to Cart</button>
//                            </Link>
//                          )}
//                        </span>
//                      )}
//                      <button onClick={() => handleWishlist(course)} style={{ backgroundColor: 'transparent', border: 'none', padding: '8px 8px', margin: '0 5px', cursor: 'pointer', outline: 'none', fontSize: '26px' }}>
//                        <i className={`fa${isCourseWishlisted(course.courseId) ? 's' : 'r'} fa-heart`} 
//                           style={{ color: isCourseWishlisted(course.courseId) ? 'red' : 'black' }}></i>
//                      </button>
//                    </div>
//                  </div>
//                )}
//              </div>
//            </SplideSlide>
           
//           ))}
//         </Splide></>)
//       }
//     </div>
//   );
// };

// export default ExploringSkills;
