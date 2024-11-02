 

    import React, { useEffect, useState } from 'react'
    import { LangRelevantCourses, listCourses, mostSearchedCourses, PrevSearchedCourses } from '../../Services/courseService';
    import CourseTemplate from '../ExploringSkills/CourseTemplate';
    import ClipLoader from 'react-spinners/ClipLoader';
import { useSelector } from 'react-redux';
    
    const LanguageRelevantCourses = () => {
        const language = useSelector(store => store.LanguageSlice.language) || { code: 'en', name: 'english' }; 
        const languageName = language.name.includes('(') ? 
        language.name.split('(')[1].replace(')', '').trim().toLowerCase() : 
        language.name.toLowerCase();

      const [courses, setCourses] = useState([]);
    //const [showAllCourses, setShowAllCourses] = useState(false);
      const [loading, setLoading]=useState(true);
      const [error, setError]=useState(null);
    
      const userId=localStorage.getItem('userId')
    
      useEffect(() => {
            const fetchCourses = async () => {
              setLoading(true);
              try {
                const response = await LangRelevantCourses(languageName);
                setCourses(Array.isArray(response.data) ? response.data : []);
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
            <CourseTemplate    coursesData={courses} pageTitle={"languageCourse"}/>
            }
        </div>
      )
    } 
export default LanguageRelevantCourses