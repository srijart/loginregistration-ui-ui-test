import React, { useEffect } from 'react';
import '../EnrolledCourses/EnrolledCourses.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../ReduxStore/WishlistSlice';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems } = useSelector((store) => store.WishlistSlice);
  const dispatch = useDispatch();

  useEffect(() => {
     window.scrollTo(0, 0);
  }, []);

  const handleClick = (courseId) => {
    navigate(`/enrolledCourse/${courseId}`);
  };

  const handleWishlist = (course) => {
    dispatch(toggleWishlist(course));
  };

  const isCourseWishlisted = (courseId) => {
    return wishlistItems.some((item) => item.courseId === courseId);
  };

  return (
    <div className="enrolledCourse-courses-page">
      <h1 className="enrolledCourse-header">Wishlist</h1>
      <div className="enrolledCourse-courses-grids">
        {wishlistItems.length > 0 ? (
          wishlistItems.map((course) => (
            <div key={course.courseId} className="enrolledCourse-course-card">
              <div className="enrolledCourse-course-image">
                <img
                  src="https://thumbs.dreamstime.com/b/digital-background-glowing-orange-blue-lights-resembling-binary-code-sense-advanced-technology-flow-ideal-327299605.jpg"
                  alt={course.title}
                />
                <h2 className="enrolledCourse-course-title">{course.title}</h2>
              </div>
              <div className="enrolled-course-wishlist-container">
                <p
                  className="enrolledCourse-view-course"
                  onClick={() => handleClick(course.courseId)}
                >
                  View Course
                </p>
                <button
                  onClick={() => handleWishlist(course)}
                  className="wishlist-button"
                >
                  <i
                    className={`fa${isCourseWishlisted(course.courseId) ? 's' : 'r'} fa-heart`}
                    style={{ color: isCourseWishlisted(course.courseId) ? 'red' : 'black' }}
                  ></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="enrolledCourse-no-courses">No courses in wishlist yet.</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
