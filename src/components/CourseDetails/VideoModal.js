import React, { useRef, useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeMute, faExpand, faCompress, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import './VideoModal.css';
import { useDispatch } from 'react-redux';
import { clearEnrollments, enrollCourse } from '../../ReduxStore/EnrollSlice';
import { COURSES_URL } from '../../Services/courseService';
import axios from 'axios';

const VideoModal = ({ onClose, refe }) => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [currVideo, setCurrVideo] = useState(null);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [courseData, setCourseData] = useState(null);
    const [videos, setVideos] = useState([]);
    const videoRef = useRef(null);
    const videoContainerRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [promptVisible, setPromptVisible] = useState(false);
    const [loginPromptVisible, setLoginPromptVisible] = useState(false);
    const dispatch = useDispatch();
 
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchEnrolledCourse = async () => {
            try {
                const courseDetailResponse = await fetch(`http://localhost:8082/api/v1/course/${courseId}`);
                if (!courseDetailResponse.ok) throw new Error('Network response was not ok');
                const courseDetail = await courseDetailResponse.json();
                setCourseData(courseDetail.data);
                const lessonVideos = [];
                courseDetail.data.sections.forEach(section => {
                    section.lessons.forEach(lesson => {
                        if (lesson.videoUrl) {
                            lessonVideos.push({ id: lesson.id, title: lesson.title, src: lesson.videoUrl });
                        }
                    });
                });
                setVideos(lessonVideos);
                if (lessonVideos.length > 0) {
                    setCurrVideo(lessonVideos[0].src);
                    setSelectedVideoId(lessonVideos[0].id);
                }
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };

        fetchEnrolledCourse();
    }, [courseId]);

    const handleVideoChange = (video) => {
        setCurrVideo(video.src);
        setSelectedVideoId(video.id);
        videoRef.current.load();
        setIsPaused(false);
        setPromptVisible(false);
        setLoginPromptVisible(false);
    };

    const handlePlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPaused(false);
        } else {
            videoRef.current.pause();
            setIsPaused(true);
        }
    };

    const handleVolumeToggle = () => {
        if (volume > 0) {
            setVolume(0);
            videoRef.current.volume = 0;
        } else {
            setVolume(1);
            videoRef.current.volume = 1;
        }
    };

    const handleProgressUpdate = () => {
        const progressPercentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(progressPercentage);
    };

    const handleProgressClick = (e) => {
        const progressBar = e.currentTarget;
        const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
        const progressBarWidth = progressBar.clientWidth;
        const newTime = (clickPosition / progressBarWidth) * videoRef.current.duration;
        videoRef.current.currentTime = newTime;
        setProgress((newTime / videoRef.current.duration) * 100);
    };

    const handleFullscreenToggle = () => {
        if (!isFullscreen) {
            if (videoContainerRef.current.requestFullscreen) {
                videoContainerRef.current.requestFullscreen();
            } else if (videoContainerRef.current.mozRequestFullScreen) {
                videoContainerRef.current.mozRequestFullScreen();
            } else if (videoContainerRef.current.webkitRequestFullscreen) {
                videoContainerRef.current.webkitRequestFullscreen();
            } else if (videoContainerRef.current.msRequestFullscreen) {
                videoContainerRef.current.msRequestFullscreen();
            }
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else if (document.mozFullScreenElement) {
                document.mozCancelFullScreen();
            } else if (document.webkitFullscreenElement) {
                document.webkitExitFullscreen();
            } else if (document.msFullscreenElement) {
                document.msExitFullscreen();
            }
        }
        setIsFullscreen(!isFullscreen);
    };

    const saveDemoView = async () => {

        if (userId) {
            try {
                const response = await axios.post(`${COURSES_URL}/course/${courseId}/demo-view`, {
                    userId: parseInt(userId),
                });
                console.log(response.data);
            } catch (error) {
                console.error('An error occurred while counting the demo view:', error);
            }
        } else {
            console.log('User ID not found in localStorage. Not calling the API.');
        }
    };

    const handleVideoEnd = () => {
        if (userId) {
            setPromptVisible(true);
            saveDemoView();
            setTimeout(() => setPromptVisible(false), 4000);  
        } else {
            setLoginPromptVisible(true);
            setTimeout(() => setLoginPromptVisible(false), 4000);  
        }
    };

    const handleEnrollClick = () => {
        dispatch(clearEnrollments());
        dispatch(enrollCourse([{ courseId: courseData.courseId, title: courseData.title, price: courseData.price }]));
        toast.success('Successfully prepared for enrollment! Proceed to payment.');
        navigate('/checkout');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    useEffect(() => {
        const fullscreenChange = () => {
            setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement));
        };

        document.addEventListener('fullscreenchange', fullscreenChange);
        document.addEventListener('webkitfullscreenchange', fullscreenChange);
        document.addEventListener('mozfullscreenchange', fullscreenChange);
        document.addEventListener('MSFullscreenChange', fullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', fullscreenChange);
            document.removeEventListener('webkitfullscreenchange', fullscreenChange);
            document.removeEventListener('mozfullscreenchange', fullscreenChange);
            document.removeEventListener('MSFullscreenChange', fullscreenChange);
        };
    }, []);

    const displayedVideos = videos.slice(0, 1);

    return (
        <div className="video-modal-overlay">
            <div className="video-modal-container" ref={refe}>
                <div className='video-top-container'>
                    <div className='video-title-container'>
                        <h4>Course Preview</h4>
                        <button className="close-button" onClick={onClose}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <h3 className="video-title">{courseData?.title}</h3>
                </div>

                <div className="video-modal-content">
                    <div className="custom-video-player" ref={videoContainerRef}>
                        <video
                            ref={videoRef}
                            onTimeUpdate={handleProgressUpdate}
                            onEnded={handleVideoEnd}
                            controls={false}
                            autoPlay
                            src={currVideo}
                        />
                        <div className={`custom-video-controls ${isFullscreen ? 'fullscreen' : ''}`}>
                            <div className="progress-bar-container" onClick={handleProgressClick}>
                                <div className="progress-bar" style={{ width: `${progress}%` }} />
                            </div>
                            <div className="video-timestamp">
                                {videoRef.current && !isNaN(videoRef.current.currentTime)
                                    ? new Date(videoRef.current.currentTime * 1000).toISOString().substr(14, 5)
                                    : "00:00"}
                                /
                                {videoRef.current && !isNaN(videoRef.current.duration)
                                    ? new Date(videoRef.current.duration * 1000).toISOString().substr(14, 5)
                                    : "00:00"}
                            </div>
                            <button onClick={handlePlayPause} className="play-pause-btn">
                                <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
                            </button>
                            <button onClick={handleVolumeToggle} className="volume-btn">
                                <FontAwesomeIcon icon={volume > 0 ? faVolumeUp : faVolumeMute} />
                            </button>
                            <button onClick={handleFullscreenToggle} className="fullscreen-btn">
                                <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
                            </button>
                        </div>
                    </div>

                    {(promptVisible || loginPromptVisible) && (
                        <div className="notification-prompt" onClick={promptVisible ? handleEnrollClick : handleLoginClick}>
                            <span>
                                {promptVisible
                                    ? "Unlock the full course experience—enroll now to gain access!"
                                    : "Please log in to continue enjoying this content!"}
                            </span>
                            <button className="close-button" onClick={promptVisible ? handleEnrollClick : handleLoginClick}>
                                <FontAwesomeIcon icon={faTimes} color='white' />
                            </button>
                        </div>
                    )}
                </div>

                <div className="video-controls">
                    {displayedVideos.map(video => (
                        <button
                            key={video.id}
                            onClick={() => handleVideoChange(video)}
                            className={selectedVideoId === video.id ? 'selected' : ''}
                        >
                            {video.title}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VideoModal;
