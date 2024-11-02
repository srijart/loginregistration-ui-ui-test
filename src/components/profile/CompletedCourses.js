import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import ProgressBar from '../ProgressBar/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ClipLoader from 'react-spinners/ClipLoader';
import { enrollCourse } from '../../ReduxStore/EnrollSlice';
import '../EnrolledCourses/EnrolledCourses.css'
import { COURSES_URL, ENROLLMENT_URL } from '../../Services/courseService';


const CompletedCourses = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState({});  
  const navigate=useNavigate();
  const skilltechera_user_id = localStorage.getItem('userId');
 
  useEffect(() => {
    const fetchMyCourses = async () => {
      setLoading(true);
      try {
        const enrollmentResponse = await axios.get(`${ENROLLMENT_URL}/${skilltechera_user_id}/enrollments`);
        const courseIds = enrollmentResponse.data.map(enrollment => enrollment.courseId);
        const enrollmentIds= enrollmentResponse.data.map(enrollment => enrollment.id)
 
        if (courseIds.length > 0) {
          const progressRequests = enrollmentIds.map(enrollmentId =>
              axios.get(`${ENROLLMENT_URL}/${enrollmentId}/progress`)
          );
      
          const progressResponses = await Promise.all(progressRequests);
          
       
          const progressData = progressResponses.reduce((acc, response, index) => {
              const courseId = enrollmentResponse.data[index].courseId;
      
               const progressString = response.data;  
      
               const match = progressString.match(/(\d+(\.\d+)?)/);
              
              if (!acc[courseId]) {
                  acc[courseId] = [];
              }
      
              if (match) {
                   acc[courseId].push({"courseId": courseId, "Percentage" :parseFloat(match[1])})  
              } else {
                  acc[courseId].push(null);  
              }
      
              return acc;
          }, {});
      
          setCourseProgress(progressData);

 
          const courseIds = Object.values(progressData).flat().map((item) => {
            if (item.Percentage == 100) {
              return item.courseId;  
            }
          }).filter(Boolean); 
          
          console.log(courseIds);
          

          if (courseIds.length > 0) {
              const courseRequests = courseIds.map(courseId =>
                  axios.get(`${COURSES_URL}/course/${courseId}`)
              );
          
              const coursesResponse = await Promise.all(courseRequests);
              const allCourses = coursesResponse.map(response => response.data);
               setMyCourses(allCourses);
          }

        } else {
          setMyCourses([]);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchMyCourses();
  }, [skilltechera_user_id]);


  const handleClick=(courseId)=>{
    navigate(`/enrolledCourse/${courseId}`);
  }

  const { t } = useTranslation(); 
 

  return (
    <div className="section-content-courses">
          <div className="enrolledCourse-courses-page">

        {
        loading ? ( <ClipLoader color="#333333" loading={loading} size={30} id='clipLoader' /> ):
        (<>
          <h1 className="enrolledCourse-page-header">{t('CompletedCourses')}</h1>
          <div className="enrolledCourse-courses-grids">
            {myCourses.length > 0 ? (
              myCourses.map((course) => (
                <div 
                  key={course.data.courseId} 
                  className="enrolledCourse-course-card" 
                 
                >
                  <div className="enrolledCourse-course-image">
                    <img 
                      src="https://thumbs.dreamstime.com/b/digital-background-glowing-orange-blue-lights-resembling-binary-code-sense-advanced-technology-data-flow-ideal-327299605.jpg" 
                      alt={course.data.title} 
                    />
                     <h2 className="enrolledCourse-course-title">{course.data.title}</h2>
                   
                  </div>
                 <p className="enrolledCourse-start-course" onClick={() => handleClick(course.data.courseId)}>
                  View Course  </p>
                </div>
              ))
            ) : (
              <p className="enrolledCourse-no-courses">{t('NoCoursesEnrolled')}</p>
            )}
          </div></>)
      }
      </div>
    </div>
  );
};

export default CompletedCourses;
