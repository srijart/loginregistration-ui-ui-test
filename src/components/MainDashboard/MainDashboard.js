import React from 'react'
import Courses from '../Courses/Courses'
import Illustration from '../Illustration/Illustration';
import MostSearchedCourses from '../ExploringSkills/MostSearchedCourses';
import ExploringSkills from '../ExploringSkills/ExploringSkills';
import ChoosePlatform from '../ChoosePlatform/ChoosePlatform';
import PrevSearchedCourse from '../ExploringSkills/PrevSearchedCourse';
import LanguageRelevantCourses from '../ExploringSkills/LanguageRelevantCourses';
import ContactFormWithMap from '../Footer/ContactFormWithMap'
const MainDashboard = () => {
 
  return (
    <>
     <Illustration />
     <ExploringSkills />
     <ChoosePlatform /> 
     <LanguageRelevantCourses />
    <MostSearchedCourses/>
    <PrevSearchedCourse />
    <ContactFormWithMap />

    </>
  )
}

export default MainDashboard;