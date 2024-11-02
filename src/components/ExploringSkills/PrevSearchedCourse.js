import React, { useEffect, useState } from 'react';
import { PrevSearchedCourses } from '../../Services/courseService';
import CourseTemplate from '../ExploringSkills/CourseTemplate';
import ClipLoader from 'react-spinners/ClipLoader';

const PrevSearchedCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await PrevSearchedCourses(userId);
        const responseData = response?.data;

        if (Array.isArray(responseData)) {
          setCourses(responseData);
        } else {
          console.error('Response data is undefined');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.data);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      {loading ? (
        <ClipLoader color="#333333" loading={loading} size={30} id='clipLoader' />
      ) : courses.length > 0 && (
        <CourseTemplate coursesData={courses} pageTitle={"PreviousSearchedCourses"} />
      )  }
    </div>
  );
};

export default PrevSearchedCourse;





// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../Courses/Courses.css';
// import { PrevSearchedCourses } from '../../Services/courseService';
// import { useTranslation } from 'react-i18next';
// import ClipLoader from 'react-spinners/ClipLoader';

// const PrevCourse = () => {
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState([]);
//   const [showAllCourses, setShowAllCourses] = useState(false);
//   const [loading, setLoading]=useState(true)

//   const {t}=useTranslation();

//   // useEffect(() => {
//   //   const token = localStorage.getItem('token');
//   //   console.log('In courses', token);
//   //   if (!token) {
//   //     navigate('/');
//   //   }
//   // }, [navigate]);
//   const userId= localStorage.getItem('userId')

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await PrevSearchedCourses(userId);
//         const responseData = response?.data; 
        
//         if (responseData) {
//           setCourses(responseData.data);
//           console.log(responseData);
//         } else {
//           console.error('Response data is undefined');
//         }
//       } catch (error) {
//         console.error('Error fetching courses:', error);
//       } finally{
//         setLoading(false)
//     }
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

//   return (
//     <div className="course-container">
//           {
//              loading ? ( <ClipLoader color="#333333" loading={loading} size={30} id='clipLoader' /> ):

//              (<>
//              <h1 className="course-header">{t("PreviousSearchedCourses")} </h1>
//       <div className="course-grid">
//         {(showAllCourses ? courses : courses.slice(0, 4)).map(course => (
//           <div key={course.courseId} className="es-course-card " onClick={() => handleCardClick(course.courseId)}>
//             <img src={course.imageUrl} alt={course.title} className="course-image" />
//             <h2 className="course-title">{course.title}</h2>
//             <p className="course-description">{course.description}</p>
//             <p className="course-syllabus">{course.syllabus}</p>
//             <div className="course-rating"> {renderRating(course.rating || 4)}</div>
//             <div className="course-footer">
//               <p className="course-instructor">{course.createdBy}</p>
//               <p className="course-price">${course.price.toFixed(2)}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className='container'>
//         <button className="explore-more-btn" onClick={() => setShowAllCourses(prev => !prev)}>
//         {showAllCourses ? t("ExploreLess") : t("ExploreMore") }
//         </button>
//       </div></>)
//           }
      
//     </div>
//   );
// };

// export default PrevCourse;
