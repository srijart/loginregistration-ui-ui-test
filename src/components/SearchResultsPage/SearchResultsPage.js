import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchResultsPage.css';
import ClipLoader from 'react-spinners/ClipLoader';
import { COURSES_URL, ENROLLMENT_URL, SaveSearchedCourses } from '../../Services/courseService';
import FilterComponent from './FilterComponent';
import { useTranslation } from 'react-i18next';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SearchResultsPage = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCourses, setTotalCourses] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const filterMenuRef = useRef();

    const notifyError = (message) => toast.error(message);
 
    const handleViewDetails = async (courseId) => {
        if (!userId) {
             navigate(`/coursedetails/${courseId}`)
        }
        try {
            await SaveSearchedCourses(courseId, userId);
            const isEnrolled = await checkEnrollmentStatus(courseId);
            navigate(isEnrolled ? `/enrolledCourse/${courseId}` : `/coursedetails/${courseId}`);
        } catch (error) {
            console.log('Error saving search history. Please try again.');
        }
    };

    const fetchCourses = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(`${COURSES_URL}/course/pagination`, {
                params: { searchTerm: query, page, size: 10 },
            });
            setCourses(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
            setTotalCourses(response.data.data.totalElements);
        } catch (error) {
            notifyError('Error fetching courses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query) {
            fetchCourses(currentPage);
        }
    }, [query, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const applyFilters = async (filters) => {
        try {
            const res = await axios.get(`${COURSES_URL}/course/allFilter`, { params: filters });
            setCourses(res.data);
            setTotalCourses(res.data.length);
        } catch (error) {
            notifyError('Error fetching filtered courses. Please try again.');
        }
    };

    const checkEnrollmentStatus = async (courseId) => {
        try {
            const response = await axios.get(`${ENROLLMENT_URL}/${userId}/${courseId}/getEnrollmentStatus`);
            return response.data;
        } catch (error) {
            notifyError('Error checking enrollment status. Please try again.');
        }
    };

    const handleClickOutside = (e) => {
        if (filterMenuRef.current && !filterMenuRef.current.contains(e.target)) {
            if (window.innerWidth <= 786) {
                setIsOpen(false);
            }
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFilterClose = () => {
        setIsOpen(false);
    };

    return (
        <div className="search-results-container">
             {loading ? (
                <ClipLoader color="#333333" loading={loading} size={30} id='clipLoader' />
            ) : (
                <>
                    <h1 className="search-results-title">{t('SearchResultsfor')} {query}</h1>
                    <p style={{ fontSize: '10px', color: 'grey', marginTop: '-15px' }}>
                        {t('Total')} {totalCourses} {t('Courses')}
                    </p>
                    {
                        isOpen ? 
                        <button className='apply-filter-button' onClick={handleFilterClose}>
                            {t('Filters')}
                        </button> : 
                        <button className='apply-filter-button' onClick={() => setIsOpen(true)}>
                            {t('Filters')}
                        </button>
                    }
                    <div className='search-main-container'>
                        <FilterComponent onFilter={applyFilters} isOpen={isOpen} ref={filterMenuRef} handleFilterClose={handleFilterClose} query={query} />
                        {courses.length > 0 ? (
                            <div className="search-results-list">
                                {courses.map((course) => (
                                    <div className="course-item" key={course.courseId}>
                                        <div>
                                            <img src={course.imageUrl} alt={course.title} className='search-results-img' />
                                        </div>
                                        <div>
                                            <h3>{course.title}</h3>
                                            <p>{course.description}</p>
                                            <p>${course.price}</p>
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
                                <div className="pagination">
                                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <button
                                            key={index}
                                            className={index === currentPage ? 'active' : ''}
                                            onClick={() => handlePageChange(index)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="no-results">No courses found.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchResultsPage;
