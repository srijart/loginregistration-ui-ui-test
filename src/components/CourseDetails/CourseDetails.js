import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../CourseDetails/CourseDetails.css';
import { toast, ToastContainer } from 'react-toastify';
import CourseDetailsContent from './CourseDetailsContent';
import VideoModal from './VideoModal';
import { useDispatch } from 'react-redux';
import { clearEnrollments, enrollCourse } from '../../ReduxStore/EnrollSlice';
import { addToReduxCart } from '../../ReduxStore/CartSlice';
import { getCartItems, addToCart } from '../../Services/courseService';  

const CourseDetails = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const skilltechera_user_id = localStorage.getItem('userId');
  const courseDropdownRef = useRef(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const dispatch = useDispatch();
  const [btnClicked, setBtnClicked] = useState(false); 


  // useEffect(() => {
  //   if (!localStorage.getItem('token')) {
  //     navigate('/login');
  //   }
  // }, [navigate]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/v1/course/${courseId}`);
        setCourse(response.data); 
        // console.log(course.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();

    const checkEnrollmentStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8089/enrollments/${skilltechera_user_id}/${courseId}/getEnrollmentStatus`);
        setIsEnrolled(response.data);
      } catch (error) {
        console.error('Error checking enrollment status:', error);
      }
    };

    checkEnrollmentStatus();
  }, [courseId, skilltechera_user_id]);

  const handleEnroll = async () => {
    if (localStorage.getItem('token')) {
      dispatch(clearEnrollments());
    dispatch(enrollCourse([{ courseId: course?.data?.courseId, title: course?.data?.title , price: course?.data?.price}]));
    toast.success('Successfully prepared for enrollment! Proceed to payment.');
    navigate('/checkout');
    }
    else{
       navigate('/login');
    
    }
  };

  const openVideoModal = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setModalOpen(true);
  };

  const closeVideoModal = () => {
    setModalOpen(false);
    setSelectedVideo(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(isoString).toLocaleDateString('en-US', options);
  };
 
  const userId = localStorage.getItem('userId');

  const handleAddToCart = async(course) => {
    if (!userId) {
      toast.error('Please login to add to cart');
       return;
    }
 
    try{
    const res= await addToCart(userId, course?.data?.courseId);
  
    if(res.status==201){
      dispatch(addToReduxCart({ ...course.data, price: Math.floor(course.price), quantity: 1 }));
      setBtnClicked(prev => ({ ...prev, [course.courseId]: true }));
      toast.success('Item added to cart!');
    } else if(res.status === 500){
      toast.error("This item is already in your cart")
    }else{
      toast.error('Failed to add item.');
    }}
    catch (error) {
       toast.error('"This item is already in your cart"');       
    setBtnClicked(true);
    }
  };
  return (
    <div className="course-detail-container">
      <div className='course-detail-container2'>
        <div className='course-detail-card'>
          <h1 className="course-detail-title">{course.data.title}</h1>
          <p className="course-detail-description">{course.data.description}</p>
          <p className="enrolled-detail-count">Price $<span className='enrolled-detail-count-price'>{course.data.price}</span></p>

          <button 
            className="enroll-detail-button" 
            onClick={handleEnroll} 
            disabled={isEnrolled}
          >
            {isEnrolled ? 'Enrolled' : 'Enroll Now'}
          </button>    

           

             {!btnClicked  ? 
                         (  
                           <button className="enroll-detail-button"  onClick={() => handleAddToCart(course)}>Add to Cart</button>
                         ) : (
                           <Link to='/Cart'>
                             <button className="enroll-detail-button" >Go to Cart</button>
                           </Link>
                         )}      

           

          <p className="enrolled-detail-count">2,307,504 already enrolled</p>
        </div>

        <div className='demoVideo-container' onClick={() => openVideoModal(course?.data?.sections[0]?.lessons[0]?.videoUrl)}>
          <img src={course?.data?.imageUrl} alt='video-thumbnail' className='demoVideo-img'/>
          <button className='play-button'>▶</button>
        </div>

        {isModalOpen && (
          <VideoModal 
             courseData={course}
             onClose={closeVideoModal} 
             refe={courseDropdownRef}
          />
        )}
      </div>

      <div className="course-detail-info">
        <div className="course-detail-module">
          <strong>{course?.data?.sections?.length} Course modules</strong>
          <p>Earn a career credential that demonstrates your expertise</p>
        </div>
        <div className="course-detail-schedule">
          <strong>Flexible schedule</strong>
          <p>Learn at your own pace</p>
        </div>
        <div className="course-detail-level">
          <strong>{course?.data?.level}</strong>
          <p>Recommended experience</p>
        </div>
        <div className="course-detail-update">
          <strong>Created at</strong>
          <p>{formatDate(course?.data?.createdAt)}</p>
        </div>
        <div className="course-detail-rating">
          <strong>4.8 <span className="stars"> ★★★★★</span></strong>
          <p>(141,402 reviews)</p>
        </div>
      </div>

      {/* <div className='course-learnings-container'>
        <h2 className='course-learnings-title'>What you'll learn</h2>
        <div className='course-learnings-container2'>
          <p className="course-detail-syllabus">{course.data.sections[0].title}</p>
          <p className="course-detail-syllabus">{course?.data?.sections?.[0]?.title || 'No syllabus available'}</p>
          <ul style={{ columns: 2 }}>
            {course?.data?.sections[0]?.lessons?.map((lesson, index) => (
              <li key={index} style={{ listStyleType: 'none', marginBottom: '10px', color: '#1a1a66' }}>
                <span style={{ marginRight: '10px', color: 'blue' }} className='course-item-description'>✔️</span>
                {lesson.title}
              </li>
            ))}
          </ul>
        </div>
      </div> */}

      <div className='course-content-mainContainer'>
        <CourseDetailsContent courseData={course} handleEnroll={handleEnroll}/>
      </div>
      
     </div>
  );
};

export default CourseDetails;
