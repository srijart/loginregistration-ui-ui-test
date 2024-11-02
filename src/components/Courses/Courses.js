import React, { useEffect, useState } from 'react'
import { listCourses, mostSearchedCourses, PrevSearchedCourses } from '../../Services/courseService';
import CourseTemplate from '../ExploringSkills/CourseTemplate';
import ClipLoader from 'react-spinners/ClipLoader';
import axios from 'axios';
import './Courses.css'

const  Courses = () => {
    
  const [courses, setCourses] = useState([]);
//const [showAllCourses, setShowAllCourses] = useState(false);
  const [loading, setLoading]=useState(true);
  const [error, setError]=useState(null);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const userId=localStorage.getItem('userId')
    
    useEffect(() => {
      const fetchEnrollments = async () => {
        try {
          const enrollmentResponse = await axios.get(`http://localhost:8089/enrollments/${userId}/enrollments`);
          return enrollmentResponse.data.map(enrollment => enrollment.courseId);
        } catch (error) {
          console.error('Error fetching enrollments:', error);
          return [];
        }
      };
  
      const fetchCourses = async () => {
        try {
          const response = await listCourses();
          const allCourses = Array.isArray(response.data.data) ? response.data.data : [];
  
          const enrolledCourseIds = await fetchEnrollments();
          const availableCourses = allCourses.filter(course => !enrolledCourseIds.includes(course.courseId));
  
          setCourses(allCourses);
          setFilteredCourses(availableCourses);
          // setFilteredCourses(Array.isArray(availableCourses.data.data) ? availableCourses.data.data : []);

        } catch (error) {
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
        <div className='course-main-container'>
        <CourseTemplate    coursesData={filteredCourses} pageTitle={"Courses"}/>
        </div>
        }
    </div>
  )
}

export default Courses


 










// import React, { useEffect, useState } from 'react';
// import { listCourses, SaveSearchedCourses } from '../../Services/courseService';
// import { Link, useNavigate } from 'react-router-dom';
// import './Courses.css';
// import { useTranslation } from 'react-i18next';
// import ClipLoader from 'react-spinners/ClipLoader';
// import axios from 'axios';
// import { addToCart } from '../../ReduxStore/CartSlice';
// import { toggleWishlist } from '../../ReduxStore/WishlistSlice';
// import { useDispatch, useSelector } from 'react-redux';

// const Courses = () => {
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [showAllCourses, setShowAllCourses] = useState(false);
//   const { t } = useTranslation();
//   const [loading, setLoading] = useState(true);
//   const [hoveredCourseIndex, setHoveredCourseIndex] = useState(null); 
//   const [btnClicked, setBtnClicked] = useState({}); 
//   const {wishlistItems} = useSelector(Store=> Store.WishlistSlice); 
//   const [enrollmentStatus, setEnrollmentStatus] = useState({});

//  const skilltecheraUserId= localStorage.getItem('userId');
//  const dispatch=useDispatch();

//   useEffect(() => {
//     const fetchEnrollments = async () => {
//       try {
//         const enrollmentResponse = await axios.get(`http://localhost:8089/enrollments/${skilltecheraUserId}/enrollments`);
//         return enrollmentResponse.data.map(enrollment => enrollment.courseId);
//       } catch (error) {
//         console.error('Error fetching enrollments:', error);
//         return [];
//       }
//     };

//     const fetchCourses = async () => {
//       try {
//         const response = await listCourses();
//         const allCourses = Array.isArray(response.data.data) ? response.data.data : [];

//         const enrolledCourseIds = await fetchEnrollments();
//         const availableCourses = allCourses.filter(course => !enrolledCourseIds.includes(course.courseId));

//         setCourses(allCourses);
//         setFilteredCourses(availableCourses);
//       } catch (error) {
//         console.error('Error fetching courses:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const renderRating = (rating) => {
//     const fullStars = Math.floor(rating);
//     const halfStar = rating % 1 >= 0.5;
//     let stars = '★'.repeat(fullStars);
//     if (halfStar) stars += '☆';
//     return stars;
//   };

//   const handleCardClick = (courseId) => {
//     navigate(`/coursedetails/${courseId}`);
//     localStorage.setItem('courseId', courseId);
//   };

//   const handleCardMouseEnter = async(index, courseId) => {
//     setHoveredCourseIndex(index);
//     const isEnrolled = await handleSideCardHover(courseId);
//     setEnrollmentStatus(prev => ({ ...prev, [courseId]: isEnrolled }));
//     updateSideCardPosition();  
//   };

//   const handleCardMouseLeave = () => {
//     setHoveredCourseIndex(null);
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


// const handleSideCardHover=async(courseId)=>{
//   if (userId) {
//     const isEnrolled = await checkEnrollmentStatus(userId, courseId);
//     if (isEnrolled) {
//        return true ;
//     } else {
//       return false;
//     }
//   }
//   else{
//     return false;
//       }
// }

 
// const getVisibleSlidesCount = () => {
//   const width = window.innerWidth;
//   if (width >= 1086) return 4; 
//   if (width >= 768) return 3;
//   if (width >= 480) return 2;
//   return 1; 
// };

// const updateSideCardPosition = () => {
//   const slides = document.querySelectorAll('.course-card');
//   const visibleSlidesCount = getVisibleSlidesCount();

//   setTimeout(() => {
//     const lastVisibleIndex = Math.min(visibleSlidesCount - 1, slides.length - 1);

//     slides.forEach((slide, index) => {
//       const sideCard = document.querySelector(`.side-card-${index}`);

//       if (sideCard) {
//         if (index === lastVisibleIndex || index===slides.length - 1) {
//            sideCard.style.left = 'auto';
//           sideCard.style.right = '100%'; 
//         } else if((index +1) % visibleSlidesCount==0){
//           console.log( (index +1) % visibleSlidesCount==0)
//           console.log("its working divisible")
//           sideCard.style.left = 'auto';
//           sideCard.style.right = '100%';
//         } 
//         else{
//           sideCard.style.left = '92%';  
//           sideCard.style.right = 'auto';
//         }
//       }
//     });
//   }, 0);
// };

// const userId = localStorage.getItem('userId');

// const checkEnrollmentStatus = async (userId, courseId) => {
//   try {
//     const response = await axios.get(`http://localhost:8089/enrollments/${userId}/${courseId}/getEnrollmentStatus`);
//     return response.data;
//   } catch (error) {
//     console.error('Error checking enrollment status:', error);
//     return false;
//   }
// };


//   return (
//     <div className="course-main-container" >
//       {
//         loading ? (
//           <ClipLoader color="#333333" loading={loading} size={30} id='clipLoader' />
//         ) : (
//           <>
//             <h1 className="course-header">Courses</h1>
//             <div className="course-grid">
//               {(showAllCourses ? filteredCourses : filteredCourses.slice(0, 4)).map((course, index) => (
//                 <div key={course.courseId} className="es-course-card" 
//                 onMouseEnter={() => handleCardMouseEnter(index, course.courseId)} 
//                 onMouseLeave={() => setHoveredCourseIndex(null)}>
//                   <div   onClick={() => handleCardClick(course.courseId)}>
//                   <img src={course.imageUrl}  alt={course.title} className="es-course-image" />
//                   <h2 className="es-course-title">{course.title}</h2>
//                    <div className="course-rating">{course.rating || 4} {renderRating(course.rating || 4)}</div>
//                   <div className="course-footer">
//                     <p className="course-instructor">{course.createdBy}</p>
//                     <p className="course-price">${course.price.toFixed(2)}</p>
//                   </div>
//                   </div>
//                   {hoveredCourseIndex === index && (
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
//                 </div>
//               ))}
//             </div>
//             <div className='btn-container'>
//               <button className="explore-more-btn" onClick={() => setShowAllCourses(prev => !prev)}>
//                 {showAllCourses ? t("ExploreLess") : t("ExploreMore")}
//               </button>
//             </div>
//           </>
//         )
//       }
//     </div>
//   );
// }

// export default Courses;
