import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import '../Courses/PaginatedCourses.css'
import ClipLoader from 'react-spinners/ClipLoader';
import { COURSES_URL } from '../../Services/courseService';

const PaginatedCourses = () => {
    const [courses, setCourses] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 2;

    useEffect(() => {
        fetchCourses(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const fetchCourses = (page, term) => {
        setLoading(true);
        axios.get(`${COURSES_URL}/course/pagination`, {
            params: {
                searchTerm: term,
                page: page,
                size: itemsPerPage
            }
        })
        .then(response => {
            setCourses(response.data.data.content);
            setPageCount(response.data.data.totalPages);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching courses:", error);
            setLoading(false);
        });
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0);
    };

    return (
        <div className="course-container">
            <h2 className="course-title">Courses</h2>
            <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchTerm} 
                onChange={handleSearch} 
                className="course-search"
            />
            {loading ? (
               <ClipLoader color="#333333" loading={loading} size={30} id='clipLoader' /> 
            ) : (
                <ul className="course-list">
                    {courses.map(course => (
                        <li key={course.courseId} className="course-item">
                            <h3 className="course-name">{course.title}</h3>
                            <p className="course-description">{course.description}</p>
                        </li>
                    ))}
                </ul>
            )}
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
                previousClassName={"previous-button"}
                nextClassName={"next-button"}
                disabledClassName={"disabled-button"}
                breakClassName={"break-button"}
            />
        </div>
    );
};

export default PaginatedCourses;