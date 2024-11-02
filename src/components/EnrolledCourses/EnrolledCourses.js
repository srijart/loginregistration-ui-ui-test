import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EnrolledCourses.css';
import ProgressBar from '../ProgressBar/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ClipLoader from 'react-spinners/ClipLoader';
import { useDispatch } from 'react-redux';
import { updateProgress } from '../../ReduxStore/ProgressBarSlice';

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState({});  
  const navigate=useNavigate();
  const skilltechera_user_id = localStorage.getItem('userId');
  const dispatch=useDispatch();
  

  useEffect(() => {
    const fetchMyCourses = async () => {
      setLoading(true);

      try {
        const enrollmentResponse = await axios.get(`http://localhost:8089/enrollments/${skilltechera_user_id}/enrollments`);
        const courseIds = enrollmentResponse.data.map(enrollment => enrollment.courseId);
        const enrollmentIds = enrollmentResponse.data.map(enrollment => enrollment.id);
        if (courseIds.length > 0) {
          const courseRequests = courseIds.map(courseId => 
            axios.get(`http://localhost:8082/api/v1/course/${courseId}`)
          );

          const coursesResponse = await Promise.all(courseRequests);
          const allCourses = coursesResponse.map(response => response.data);
          setMyCourses(allCourses);
          console.log(coursesResponse);

          const progressRequests = enrollmentIds.map(enrollment =>
            axios.get(`http://localhost:8089/enrollments/${enrollment}/progress`)
          );

          const progressResponses = await Promise.all(progressRequests);
          const progressData = {};

          progressResponses.forEach((response, index) => {
            const courseId = allCourses[index].data.courseId;
            const currentProgress = parseFloat(response.data.match(/(\d+(\.\d+)?)/));
           
            if (!isNaN(currentProgress)) {
              progressData[courseId] = currentProgress;
              console.log(currentProgress)
              //  dispatch(updateProgress({ courseId, currentProgress }));
            }
          });

          console.log({ progressData });
          setCourseProgress(progressData);
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
  }, [skilltechera_user_id, dispatch]); 

  const handleClick=(courseId)=>{
    navigate(`/enrolledCourse/${courseId}`);
  }

  const { t } = useTranslation(); 
 

  return (
    <div className="enrolledCourse-courses-page">
      {
        loading ? ( <ClipLoader color="#333333" loading={loading} size={30} id='clipLoader' /> ):
        (<>
          <h1 className="enrolledCourse-page-header">{t('EnrolledCourses')}</h1>
          <div className="enrolledCourse-courses-grids">
            {myCourses.length > 0 ? (
              myCourses.map((course) => (
                <div 
                  key={course.data.courseId} 
                  className="enrolledCourse-course-card">
                  <div className="enrolledCourse-course-image">
                    <img 
                      src="https://thumbs.dreamstime.com/b/digital-background-glowing-orange-blue-lights-resembling-binary-code-sense-advanced-technology-data-flow-ideal-327299605.jpg" 
                      alt={course.data.title} 
                    />
                     <h2 className="enrolledCourse-course-title">{course.data.title}</h2>
                    <ProgressBar progress={courseProgress[course.data.courseId] || 0} /> 
                    {
                    courseProgress[course.data.courseId] > 0 ?  
                    <p className='enrolledCourse-course-status'> {courseProgress[course.data.courseId]}% completed</p> : ""
                    }
                  </div>
                 <p className="enrolledCourse-start-course" onClick={() => handleClick(course.data.courseId)}>
                    {courseProgress[course.data.courseId] > 0 ? "Continue" : "Start Course"}
                    
                  </p>
                </div>
              ))
            ) : (
              <p className="enrolledCourse-no-courses">{t('NoCoursesEnrolled')}</p>
            )}
          </div></>)
      }
    </div>
  );
};

export default MyCourses;
