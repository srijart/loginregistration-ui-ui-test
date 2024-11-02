import React, { useState } from 'react';
import './CourseDetailsContent.css';  

const CourseDetailsContent = ({ courseData, handleEnroll }) => {
    const [visibleModuleIndex, setVisibleModuleIndex] = useState(0);  
    const [activeModule, setActiveModule] = useState('');

    const toggleModuleVisibility = (index) => {
        setVisibleModuleIndex(index);
    };

    const handleLessonSelect = (id, videoUrl, title) => {
        setActiveModule(title);
    };

    return (
        <div className="coursedetails-content-maincontainer">
            <h2 className="course-learnings-title">Course Content</h2>
            <div className="coursedetails-content-wrapper">
                
                {/* For desktop: Module list */}
                <div className="coursedetails-modules-desktop">
                    <h3 className="course-module-title">Module</h3>
                    {courseData && courseData.data && (
                        <div>
                            {courseData.data.sections.map((module, moduleIndex) => (
                                <div 
                                    className={`coursedetails-module ${visibleModuleIndex === moduleIndex ? 'active' : ''}`} 
                                    key={module.id} 
                                    onClick={() => toggleModuleVisibility(moduleIndex)}
                                >
                                    <span>{module.title}</span>
                                    <span className="coursedetails-arrow-icon">
                                        {visibleModuleIndex === moduleIndex ? '>' : '>'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* For mobile: Dropdown */}
                <div className="coursedetails-modules-mobile">
                    <h3 className="course-module-title">Module</h3>
                    {courseData && courseData?.data && (
                        <select 
                            value={visibleModuleIndex}
                            onChange={(e) => setVisibleModuleIndex(parseInt(e.target.value))}
                            className="coursedetails-dropdown"
                        >
                            {courseData.data.sections.map((module, moduleIndex) => (
                                <option key={module.id} value={moduleIndex}>
                                    {module.title}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="coursedetails-lessons">
                    <h4 className='coursedetails-lessons-title'>Lessons:</h4>
                    {courseData.data.sections[visibleModuleIndex]?.lessons.map((lesson) => (
                        <div
                            className={`coursedetails-lesson ${lesson?.title === activeModule ? "active" : ""}`}
                            key={lesson?.id}
                            onClick={() => handleLessonSelect(lesson?.id, lesson?.videoUrl, lesson?.title)}
                        >
                            <span>{lesson?.title}</span>
                            <span className="coursedetails-start" onClick={handleEnroll}>Start Now →</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsContent;
