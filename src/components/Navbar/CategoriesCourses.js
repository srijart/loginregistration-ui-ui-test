import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

const CategoriesCourses = () => {
    const [categoryCourse, setCategoryCourse] = useState([]);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const option = queryParams.get('option');
    const topic = queryParams.get('topic');

    useEffect(() => {
        const fetchCategoryCourses = async () => {
            if (!option || !topic) {
                console.error('Option /topic missing');
                return;
            }

            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:8082/api/v1/course/allFilter?${option}=${topic.toLowerCase()}`);
                setCategoryCourse(res.data);
            } catch (err) {
                console.error(err);
                setCategoryCourse([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryCourses();
    }, [option, topic]);

    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');

    const checkEnrollmentStatus = async (courseId) => {
        try {
            const response = await axios.get(`http://localhost:8089/enrollments/${userId}/${courseId}/getEnrollmentStatus`);
            return response.data;
        } catch (error) {
            console.error('Error checking enrollment status:', error);
        }
    };

    const handleViewDetails = async (courseId) => {
        try {

            const isEnrolled = await checkEnrollmentStatus(courseId);
            console.log(isEnrolled)
            if (isEnrolled) {
                navigate(`/enrolledCourse/${courseId}`)
            }
            else {
                navigate(`/coursedetails/${courseId}`)
            }
        } catch (error) {
            console.error('Error saving search history:', error);
        }
    };

    return (
        <div className="search-results-container">
            {loading ? (
                <ClipLoader color="#333333" loading={loading} size={30} id='clipLoader' />
            ) : (

                categoryCourse.length > 0 ? (

                    <div className="search-results-list">
                        <p className="search-results-title">{topic} Releated Courses</p>

                        {categoryCourse.map((course) => (
                            <div className="course-item" key={course.courseId}>
                                <div>
                                    <img src={course.imageUrl} alt='course.title' className='search-results-img' />
                                </div>
                                <div>
                                    <h3>{course.title}</h3>
                                    <p>{course.description}</p>
                                </div>
                                <a
                                    className="enrolledCourse-start-course"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleViewDetails(course.courseId);
                                    }}
                                >
                                    View Details
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-results">No courses found.</p>
                )
            )}
        </div>
    );
};

export default CategoriesCourses;
