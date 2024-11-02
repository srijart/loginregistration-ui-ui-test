import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faPen, faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../Instructor/CourseManagement.css';
import { coursesByInstructor, getInstructorEarningsByCourse,getAverageRatingByCourse } from '../Services/courseService';
import { useTranslation } from 'react-i18next';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [earnings, setEarnings] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const userId = localStorage.getItem('userId');

  const { t } = useTranslation();

  console.log(courses)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursesByInstructor(userId);
        setCourses(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [userId]);

  const navigate = useNavigate();

  const handleAddNewCourse = () => {
    navigate('/add-course');
  };

  const handleDollarClick = async (course) => {
    try {
      const response = await getInstructorEarningsByCourse(course.courseId);
      const earningsData = response.data;
      setEarnings(earningsData);
      setSelectedCourse(course);
      
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const handleStarClick = async (course) => {
    try {
      const response = await getAverageRatingByCourse(course.courseId);
      setAverageRating(response.data);
      setSelectedCourse(course);
    
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCourse(null);
    setAverageRating(null);
  };
  const truncateDescription = (description, wordCount) => {
    const words = description.split(' ');
    return words.length > wordCount ? words.slice(0, wordCount).join(' ') + '...' : description;
};


  return (
    <div className="course-management-container">
      <button className="new-course-button" onClick={handleAddNewCourse}>
        {t('NewCourse')}
      </button>

      <table className="course-table">
        <thead>
          <tr>
            <th>{t('CourseName')}</th>
            <th>{t('Description')}</th>
            <th>{t('Price')}</th>
            <th>{t('Action')}</th>
            <th>Status</th>

          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{truncateDescription(course.description, 6)}</td>
              <td>{course.price}</td>
              <td className="action-buttons">
                <button onClick={() => handleDollarClick(course)} title="View Earnings">
                  <FontAwesomeIcon icon={faDollarSign} className="Earnings-Button" />
                </button>
                <button onClick={() => handleStarClick(course)} title="View Average Rating">
                  <FontAwesomeIcon icon={faStar} className="Rating-Button" />
                </button>
              </td>
              <td>{course.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Course Earnings/Rating Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>{selectedCourse ? selectedCourse.title : ''}</h2>
        {selectedCourse && (
          <div>
            {earnings && (
              <div>
                <p><strong>Total Earnings:</strong> ${earnings.earnings}</p>
                <p><strong>Students Enrolled:</strong> {earnings.enrollmentCount}</p>
              </div>
            )}
            {averageRating !== null && (
              <div>
                <p><strong>Average Rating:</strong> {averageRating ? averageRating.toFixed(2) : 'No ratings yet'}</p>
              </div>
            )}
          </div>
        )}
        <button onClick={closeModal} className="close-modal-button">Close</button>
      </Modal>
    </div>
  );
};

export default CourseManagement;
