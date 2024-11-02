import React, { useEffect, useState } from 'react'; 
import { FaChevronDown, FaChevronUp, FaCheckCircle, FaRegCircle } from 'react-icons/fa';  
import './EnrolledCourseContent.css'

const EnrolledCourseContents = ({ coursesData, onVideoChange, watchedVideos, activeSubId, userId }) => {
    const [visibleModuleIndex, setVisibleModuleIndex] = useState(null);
    const [activeModule, setActiveModule] = useState(null);

    const toggleModuleVisibility = (index) => {
        setVisibleModuleIndex(visibleModuleIndex === index ? null : index);
    };

    const handleClick = (id, videoSrc, title) => {
        setActiveModule(id);
        onVideoChange(id, videoSrc, title); 
    };

    useEffect(() => {
        if (coursesData) {
            const activeLesson = coursesData.flatMap(section => 
                section.lessons.map(lesson => ({ ...lesson, sectionId: section.id }))
            ).find(lesson => lesson.id === activeSubId);

            if (activeLesson) {
                setActiveModule(activeLesson.id);
                setVisibleModuleIndex(activeLesson.sectionId);  
            }
        }
    }, [activeSubId, coursesData]);

    useEffect(() => {
        setActiveModule(activeSubId);
    }, [activeSubId]);

    return (
        <div className="course-content-maincontainer">
            <h2 className='course-learnings-title'>Course Content</h2>
            <div className="course-content-container">
                {coursesData?.map(section => (
                    <div key={section.id} className="content-module">
                        <div 
                            className="content-module-title" 
                            onClick={() => toggleModuleVisibility(section.id)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && toggleModuleVisibility(section.id)}
                        >
                            <span>{section.title}</span>
                            <span className="arrow-icon">
                                {visibleModuleIndex === section.id ? <FaChevronUp /> : <FaChevronDown />}
                            </span>
                        </div>
                        {visibleModuleIndex === section.id && (
                            section.lessons.map((lesson) => {
                                const uniqueVId = `${userId}V${lesson.id}`;  
                                return (
                                    <div 
                                        className={`content-submodule-container ${lesson.id === activeModule ? "active" : ""}`}  
                                        key={lesson.id}  
                                        role="button"
                                        onKeyPress={(e) => e.key === 'Enter' && handleClick(lesson.id, lesson.videoUrl, lesson.title)}
                                        onClick={() => handleClick(lesson.id, lesson.videoUrl, lesson.title)}
                                    >
                                        <div className="content-submodule" tabIndex={0}>
                                            <span className="video-status">
                                                {watchedVideos.includes(uniqueVId) ? <FaCheckCircle /> : <FaRegCircle />}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="content-submodule-title">{lesson.title}</h4> 
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EnrolledCourseContents;