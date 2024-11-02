import React, { useRef, useState, useEffect } from 'react';
import './EnrolledCourse.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import { useDispatch, useSelector } from 'react-redux';
import { updateProgress, checkIfVideoUpdated, setSectionCompleted } from '../../ReduxStore/ProgressBarSlice';
import EnrolledCourseContents from './EnrolledCourseContents';
import RatingComponent from './RatingComponent';
import QuizQuestionComponent from './QuizQuestionComponent';
import { AiOutlineClose } from 'react-icons/ai';
import { faPlay, faPause, faVolumeUp, faVolumeMute, faExpand, faCompress, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Course = () => {
    const videoRef = useRef(null);
    const [currVideo, setCurrVideo] = useState(null);
    const [currTitle, setCurrTitle] = useState(null);
    const [currVideoId, setCurrVideoId] = useState(null);
    const [currDescription, setCurrDescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [coursesData, setCoursesData] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [isRated, setIsRated] = useState(false);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [activeSubId, setActiveSubId] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userId = localStorage.getItem("userId");
    const { progress, watchedVideos } = useSelector((store) => store.ProgressBarSlice);
    const sectionWatched = useSelector(Store => Store.ProgressBarSlice.sectionCompleted);


    const handleVideoChange = (videoId, videoSrc, title) => {
        setCurrVideo(videoSrc);
        setActiveSubId(videoId);
        setCurrVideoId(videoId);
        setIsPaused(false);
    
        const newSectionIndex = coursesData.data.sections
            .flatMap(section => section.lessons)
            .findIndex(lesson => lesson.id === videoId);
    
        const currentSection = coursesData.data.sections.findIndex(section =>
            section.lessons.some(lesson => lesson.id === videoId)
        );
    
        setCurrentSectionIndex(currentSection);
    
         const savedPlaybackTime = localStorage.getItem(`videoTime_${userId}_${id}_${videoId}`);
        const currentTime = savedPlaybackTime ? parseFloat(savedPlaybackTime) : 0;
    
         videoRef.current.src = videoSrc;
    
        videoRef.current.load();
        videoRef.current.currentTime = currentTime;
    };
    

    const updateProgressOnCompletion = async (videoId) => {
        const course = progress?.find(course => course.courseId === id);
        const currProgressValue = course ? course.currentProgress.undefined : 0;

        const uniqueVId = `${userId}V${videoId}`;

        if (!watchedVideos?.includes(uniqueVId)) {
            const newProgressValue = countVideoSources();
            const updatedProgressValue = currProgressValue + newProgressValue;
            console.log(updatedProgressValue)
            if (updatedProgressValue <= 100) {
                console.log("updatedProgressValue", updatedProgressValue)

                const value = await updateProgressBar(updatedProgressValue);
                if (value && value.status === 200) {

                    dispatch(updateProgress({ courseId: id, currentProgress: value.data.progressPercentage }));
                    dispatch(checkIfVideoUpdated({ uniqueVId }));
                }
            }

        }
    };

    useEffect(() => {
        // If progress updates 

    }, [progress]);

    useEffect(() => {
        fetchRatingsData();
    }, [])

    const handleRatingSubmitted = () => {
        fetchRatingsData();
    };

    const fetchRatingsData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8082/api/v1/course/${id}/${userId}/status`);


            setIsRated(response.data)
            if (response.status === 200) {
                console.log("israted", response)
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };



    const updateProgressBar = async (progressValue) => {
        try {
            const response = await axios.put(
                `http://localhost:8089/enrollments/${userId}/course/${id}/progress`,
                progressValue,
                { headers: { 'Content-Type': 'application/json' } }
            );
            return response;

        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const checkEnrollmentStatus = async (courseId) => {
        try {
            const response = await axios.get(`http://localhost:8089/enrollments/${userId}/${courseId}/getEnrollmentStatus`);
            if (response.status !== 200) {
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching enrollment status:', error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const countVideoSources = () => {
        let totalVideos = 0;
        coursesData?.data?.sections.forEach(section => {
            section.lessons.forEach(lesson => {
                if (lesson.videoUrl) {
                    totalVideos++;
                }
            });
        });
        return totalVideos > 0 ? 1 / totalVideos * 100 : 0;
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        checkEnrollmentStatus(id);
    }, [id]);


    useEffect(() => {
        const fetchEnrolledCourse = async () => {
            try {
                const courseDetailResponse = await fetch(`http://localhost:8082/api/v1/course/${id}`);
                if (!courseDetailResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const courseDetail = await courseDetailResponse.json();
                setCoursesData(courseDetail);
                setActiveSubId(courseDetail.data.sections[0].lessons[0].id)

                let savedVideoId = null;
                let savedTime = 0;

                courseDetail.data.sections.forEach(section => {
                    section.lessons.forEach(lesson => {
                        const savedPlaybackTime = localStorage.getItem(`videoTime_${userId}_${id}_${lesson.id}`);
                        if (savedPlaybackTime) {
                            savedVideoId = lesson.id;
                            savedTime = parseFloat(savedPlaybackTime);
                        }
                    });
                });

                if (savedVideoId) {
                    const savedVideo = courseDetail.data.sections
                        .flatMap(section => section.lessons)
                        .find(lesson => lesson.id === savedVideoId);

                    if (savedVideo) {
                        setCurrVideo(savedVideo.videoUrl);
                        setCurrVideoId(savedVideoId);
                        setActiveSubId(savedVideoId)
                        setCurrTitle(courseDetail.data.title);
                        setCurrDescription(courseDetail.data.description);


                        videoRef.current.currentTime = savedTime;
                        videoRef.current.load();

                        if (videoRef.current) {
                            videoRef.current.currentTime = savedTime;

                            videoRef.current.load();
                        }
                    }
                } else {
                    if (courseDetail.data.sections.length > 0 && courseDetail.data.sections[0].lessons.length > 0) {
                        const firstLesson = courseDetail.data.sections[0].lessons[0];
                        setCurrVideo(firstLesson.videoUrl);
                        setCurrTitle(courseDetail.data.title);
                        setCurrVideoId(firstLesson.id);
                        setCurrDescription(courseDetail.data.description);
                        setActiveSubId(firstLesson.id)

                        videoRef.current.load();
                    }
                }

                if (videoRef.current) {
                    videoRef.current.load();
                }
            } catch (error) {
                console.error('Error fetching course data:', error);
                // alert('Failed to load course data. Please try again later.');
            }
        };

        fetchEnrolledCourse();
    }, [id]);

    useEffect(() => {
        const handleVideoEnd = async () => {
            await updateProgressOnCompletion(currVideoId);

            const lessonsInCurrentSection = coursesData.data.sections[currentSectionIndex]?.lessons || [];
            const currentIndex = lessonsInCurrentSection.findIndex(lesson => lesson.id === currVideoId);

            const currentSectionId = coursesData.data.sections[currentSectionIndex]?.id;
            const currentCourseId = currVideoId;


            const allWatched = lessonsInCurrentSection.every(lesson => {

                const currentVideoId = `${userId}V${lesson.id}`;
                return watchedVideos.includes(currentVideoId);
            });


            const lastIndex = lessonsInCurrentSection.length - 1;

            const allWatchedExceptLast = lessonsInCurrentSection.slice(0, lastIndex).every(lesson => {
                const currentVideoId = `${userId}V${lesson.id}`;
                return watchedVideos.includes(currentVideoId);
            });


            //  &&  !sectionWatched?.[`${userId}S${currentSectionId}`]

            if (allWatched) {
                dispatch(setSectionCompleted({ userId, sectionId: currentSectionId }));

                // setTimeout(() => {
                //     setShowOverlay(false);
                //     console.log("showOverlayfrom settime", showOverlay)

                // }, 2000);
            }

            if (allWatchedExceptLast) {

                if (currentIndex == lessonsInCurrentSection.length - 1) {
                    // fetchRatingsData();
                    setShowOverlay(true);
                }
            }

            if (currentIndex < lessonsInCurrentSection.length - 1) {
                const nextLesson = lessonsInCurrentSection[currentIndex + 1];
                handleVideoChange(nextLesson.id, nextLesson.videoUrl, nextLesson.title);
                setActiveSubId(nextLesson.id);
                videoRef.current.load();
            }
        };

        if (videoRef.current) {
            videoRef.current.addEventListener('ended', handleVideoEnd);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('ended', handleVideoEnd);
            }
        };
    }, [currVideoId, coursesData]);

    useEffect(() => {
        const handleTimeUpdate = () => {
            if (videoRef.current) {
                localStorage.setItem(`videoTime_${userId}_${id}_${currVideoId}`, videoRef.current.currentTime);
            }
        };
        

        if (videoRef.current) {
            videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };

    }, [currVideoId]);

    useEffect(() => {
        const handleLoadedMetadata = () => {
            const savedPlaybackTime = localStorage.getItem(`videoTime_${userId}_${id}_${currVideoId}`);
            if (savedPlaybackTime) {
                videoRef.current.currentTime = parseFloat(savedPlaybackTime);
            }
        };
    
        if (videoRef.current) {
            videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        }
    
        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
            }
        };
    }, [currVideoId]);
        
    

    const [showRating, setShowRating] = useState(false);

    const handleOverlayClose = () => {
        setShowOverlay(false)
    }

    const [progresses, setProgresses] = useState(0);


    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [courseData, setCourseData] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);


    const handlePlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPaused(false);
        } else {
            videoRef.current.pause();
            setIsPaused(true);
            localStorage.setItem(`videoTime_${userId}_${id}_${currVideoId}`, videoRef.current.currentTime);
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
    }; const handleProgressClick = (e) => {
        const progressBar = e.currentTarget;
        const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
        const progressBarWidth = progressBar.clientWidth;
        const newTime = (clickPosition / progressBarWidth) * videoRef.current.duration;
        videoRef.current.currentTime = newTime;
        setProgresses((newTime / videoRef.current.duration) * 100);
    };


    const handleProgressUpdate = () => {
        const progressPercentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgresses(progressPercentage);
    };

    const videoContainerRef = useRef(null);

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
    return (
        <div>
            {loading ? (
                <ClipLoader color="#333333" loading={loading} size={30} id='clipLoader' />
            ) : (
                <div className="course-video-mainContainer">
                    <div className="course-video-container">{showOverlay && (
                        <div className="overlay">
                            <div className='overlay-child'>
                                {/* <img src={rewardImg} alt="Success" className='img-reward'/> */}
                                <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M113.811 69.5508C116.413 67.4062 131.436 58.1133 139.663 50.2851C146.085 44.1679 148.569 28.1953 138.69 20.4258C125.847 10.3359 113.519 20.9297 113.519 20.9297C113.519 20.9297 112.44 14.9414 104.94 11.4258C95.4951 6.99607 83.5302 5.34372 72.5263 5.48435C61.8623 5.61326 52.042 6.90232 43.3232 11.1797C35.5185 15.0117 35.0498 20.4726 35.0498 20.4726C35.0498 20.4726 24.8076 10.6875 12.2568 18.6328C-0.282266 26.5898 3.31539 42.5273 9.35055 49.2187C17.2138 57.9375 26.6591 62.3789 30.9482 65.5898C35.2255 68.8008 39.3271 71.8593 39.3271 74.6133C39.3271 77.3672 38.1084 77.9765 37.6396 77.8242C37.1826 77.6719 36.374 74.9883 34.2763 76.1367C31.417 77.7187 32.2841 84.0937 38.249 84.7031C44.0263 85.3008 45.1279 79.1953 45.1279 79.1953L46.042 73.2304L55.5224 79.8047L65.917 88.3711L65.6123 95.707C65.6123 95.707 65.1552 101.367 62.4013 106.266C59.6474 111.164 55.2177 116.051 55.2177 116.051L55.0771 120.48L93.6201 119.566L92.4013 115.289C92.4013 115.289 87.4326 109.828 84.4443 103.969C82.3115 99.7734 81.9716 95.5429 81.9716 95.5429L81.8779 85.0195L101.882 72.7617C101.882 72.7617 104.026 74.4492 103.722 75.0586C103.417 75.6679 103.347 81.914 108.151 84.2343C112.897 86.5312 116.718 83.625 116.261 79.6406C115.804 75.6679 113.354 77.039 112.593 77.6484C111.831 78.2578 110.144 78.4101 109.686 76.1133C109.218 73.8398 111.21 71.6953 113.811 69.5508ZM15.3388 47.9179L10.7568 33.9726L16.2998 26.7187L22.5107 24.9023C22.5107 24.9023 30.4443 30.8203 30.7255 31.3008C31.0068 31.7812 35.788 41.6133 35.788 41.6133L42.0927 64.4414L15.3388 47.9179ZM105.409 66.2578C105.503 65.7773 111.327 41.8008 111.327 41.8008C111.327 41.5195 115.429 39.6094 115.429 39.2226C115.429 38.8359 122.882 26.707 122.882 26.707L135.304 27.1875L137.882 39.5039L131.671 49.7226C131.683 49.7343 105.315 66.7265 105.409 66.2578Z" fill="#FEC417" />
                                    <path d="M140.531 35.9062C139.617 24.9844 128.812 22.3711 124.371 23.9531C119.93 25.5352 117.047 28.5 116.062 32.7188C115.265 36.1289 114.469 38.4023 113.555 38.7539C112.547 39.1289 111.621 38.9766 111.621 38.9766C111.621 38.9766 111.457 31.5938 111.504 28.6172C111.621 22.4766 113.496 20.9063 113.496 20.9063C113.496 20.9063 113.098 18.832 112.301 17.6836C111.504 16.5469 110.027 15.0703 110.027 15.0703C110.027 15.0703 110.367 18.0234 108.89 18.7148C107.414 19.4063 105.82 18.375 105.82 18.375L107.297 24.5156C107.297 24.5156 104.906 55.125 104.683 55.8047C104.461 56.4844 95.4725 72.0703 95.4725 72.0703C95.4725 72.0703 90.2342 76.9688 87.7382 78.1055C85.2303 79.2422 83.0741 82.207 73.4061 82.3125C63.7381 82.4297 55.4296 74.8008 55.4296 74.8008L47.121 66.832L40.9803 48.7383L40.0663 30.3047L40.453 23.6016L40.7225 20.8008L40.2889 19.3828C40.2889 19.3828 39.4921 20.1797 38.0155 19.8398C36.5389 19.5 35.9647 17.5664 35.9647 17.5664C35.9647 17.5664 35.3905 18.4805 35.285 18.9375C35.1678 19.3945 35.0506 20.4492 35.0506 20.4492C35.0506 20.4492 36.6444 22.125 36.9842 24.5156C37.3241 26.9062 36.8671 36.8086 35.1678 36.5742C33.4569 36.3516 34.0194 28.043 27.5389 24.8555C21.9256 22.0898 13.5467 22.9219 10.1249 29.8594C6.71471 36.7969 9.2108 44.9883 19.91 52.6172C30.6092 60.2461 41.9999 66.6562 43.8046 72.7734C45.9608 80.0508 41.0741 84.375 41.0741 84.375C41.0741 84.375 44.6249 83.8828 46.371 80.0742C46.9335 78.8438 47.1444 77.0508 47.2264 75.9844C51.2694 81.2578 56.6483 85.7227 63.7733 87.8789C66.4686 88.8047 69.5038 89.2734 73.7225 89.2734C74.3319 89.2734 74.9296 89.25 75.5272 89.2266C80.4608 89.0508 84.6796 88.125 88.7694 86.0977C94.2889 83.543 98.5663 79.6406 101.871 75.2109C101.777 76.2656 102.422 78.8906 103.652 80.9648C105.808 84.6094 109.453 84.832 109.453 84.832C109.453 84.832 104.449 81.8789 105.469 74.8242C106.488 67.7695 111.152 65.2617 118.207 60.7148C125.285 56.1562 141.433 46.8281 140.531 35.9062ZM24.9256 51.3867C21.7499 49.1484 16.1835 46.1602 13.8866 41.6016C10.828 35.5195 13.3124 28.1719 19.1249 27.2695C31.1952 25.3711 31.4178 40.3594 32.2147 42.1758C33.0116 43.9922 35.285 44.1094 35.285 44.1094C35.285 44.1094 35.3671 45.1172 35.6952 47.0625C35.7069 47.1211 35.7186 47.168 35.7186 47.2266L35.7538 47.4023C35.9764 48.7266 36.2928 50.3789 36.7381 52.2656L36.7733 52.4062C37.0194 53.4727 37.2772 54.4805 37.5467 55.4062C38.0858 57.3516 38.7421 59.4492 39.5506 61.6055C38.3788 60.8086 31.6639 56.1562 24.9256 51.3867ZM134.273 42.9609C131.754 47.0391 126.656 50.0742 122.894 52.6289C118.043 55.9219 110.824 60.8672 108.785 62.25C109.254 61.0078 109.664 59.7773 110.039 58.5703C110.648 56.9766 111.293 55.0312 111.738 52.9336C112.91 47.4258 113.109 42.6094 113.109 42.6094C113.109 42.6094 115.5 43.2891 116.976 41.6953C118.453 40.1016 119.004 35.1562 120.387 32.8242C122.543 29.1797 126.867 25.4297 133.359 29.9766C137.109 32.6133 137.25 38.1328 134.273 42.9609ZM70.9217 92.9414L77.5428 92.8594C77.5428 92.8594 77.7186 100.09 78.7616 105.48C79.8046 110.883 81.1991 116.883 81.1991 116.883C81.1991 116.883 67.7108 121.406 67.7928 116.531C67.8749 111.656 69.8788 102.164 69.8788 102.164C69.8788 102.164 71.0975 90.8555 70.9217 92.9414Z" fill="#FFA828" />
                                    <path d="M59.8125 17.8008C59.8125 17.8008 67.1836 16.9688 74.0391 17.0742C80.8945 17.1797 87.9492 18.5274 87.9492 18.5274C87.9492 18.5274 87.5391 41.4727 86.2852 54.3516C85.043 67.2305 80.168 76.875 78.8672 79.6055C77.6133 82.2539 76.6992 83.6719 76.6992 83.6719L70.0898 82.8985L58.6641 59.9531L59.8125 17.8008Z" fill="#FFA828" />
                                    <path d="M50.9895 21.2344C50.9895 21.2344 53.0638 20.1914 56.0755 19.0547C58.806 18.0234 61.2669 17.707 61.2669 17.707C61.2669 17.707 61.3372 32.918 61.5833 43.7695C61.7942 53.0156 65.2161 68.168 66.8802 72.2227C68.5442 76.2774 71.5442 82.4649 71.5442 82.4649C71.5442 82.4649 65.5091 81.5977 61.7942 76.8867C59.8372 74.4024 50.6849 55.1836 50.3685 42.5156C50.052 29.8477 51.2942 20.918 50.9895 21.2344Z" fill="#FFEFAB" />
                                    <path d="M47.5529 22.9922C47.342 23.6133 45.6897 36.7031 48.2795 48.8438C50.8694 60.9844 54.7014 69.293 57.2326 72.5859C59.4826 75.5039 60.9475 76.8867 61.7795 76.8867C62.6115 76.8867 58.3576 66.8203 56.3772 58.9219C54.4084 51.0352 53.3654 41.5781 53.1545 36.9141C52.9436 32.2383 52.7444 20.1914 52.7444 20.1914C52.7444 20.1914 50.4592 21.2344 49.9436 21.5391C49.4279 21.8555 47.5529 22.9922 47.5529 22.9922Z" fill="#E75A0A" />
                                    <path d="M62.5078 116.027C62.5078 116.027 66.9727 108.762 67.9102 103.254C68.8477 97.7461 69.3633 92.8711 69.3633 92.8711L72.1289 92.9883C72.1289 92.9883 71.8594 100.969 71.543 106.371C71.2266 111.773 70.3008 117.07 70.3008 117.07L62.5078 116.027Z" fill="#FFEFAB" />
                                    <path d="M65.9409 88.3711C65.9409 88.3711 68.0151 86.3437 73.7221 86.3437C79.4292 86.3437 81.8784 88.5351 81.8784 88.5351L82.0307 95.5781C82.0307 95.5781 78.2338 94.3945 73.6167 94.3359C69.7729 94.289 65.6362 95.7187 65.6362 95.7187L65.9409 88.3711ZM41.0151 18.4219C41.976 17.5312 51.187 10.6172 72.9956 10.4297C96.4565 10.2187 105.257 17.0156 105.808 17.3906C106.429 17.8008 107.156 19.6758 106.851 20.5078C106.535 21.3398 105.914 21.6445 104.156 20.918C102.386 20.1914 93.6674 13.8281 72.6909 14.4844C52.5463 15.1055 44.0034 21.2344 43.101 21.75C42.3745 22.1601 41.0268 22.2656 40.4057 21.4336C39.7729 20.6133 40.394 19.0078 41.0151 18.4219ZM106.851 23.3086C104.156 23.5195 106.019 45.2226 100.312 58.8164C94.1948 73.3594 86.3901 77.5078 86.7065 78.3398C87.0229 79.1719 94.6635 76.8633 99.4799 70.0312C103.945 63.7031 106.64 58.0898 107.894 50.6133C109.124 43.1367 109.851 23.0742 106.851 23.3086ZM40.4409 25.793C39.7612 25.7578 40.4526 36.5859 39.351 41.3437C38.9292 43.1719 37.8979 43.5469 37.7924 43.957C37.687 44.3672 40.0542 58.3008 44.0268 64.418C47.8706 70.3359 55.4526 77.707 56.6948 76.4648C57.937 75.2226 51.187 71.0625 46.6284 62.0273C44.0034 56.8476 41.3315 49.043 41.226 40.1133C41.1557 34.207 41.894 25.875 40.4409 25.793Z" fill="#D1701C" />
                                    <path d="M101.684 132.082L101.672 115.336H47.918C48.082 115.336 47.9531 128.953 47.9297 132.141H40.2891V144.27H108.551V132.141L101.684 132.082Z" fill="#865C50" />
                                    <path d="M65.1445 124.137C63.8203 124.078 62.2969 124.348 62.2383 125.988C62.1797 127.629 62.1797 132.375 62.1797 133.277C62.1797 134.18 62.918 134.965 64.7695 135.023C66.6211 135.082 84 135.023 85.2188 135.023C86.4375 135.023 87.0703 133.969 87.1172 132.914C87.1758 131.859 87.0586 127.418 87.0586 126.211C87.0586 124.207 85.2656 124.207 84.0469 124.207C82.7344 124.184 65.1445 124.137 65.1445 124.137Z" fill="#FCC219" />
                                </svg>

                                <p className="close-button" onClick={() => setShowOverlay(false)}><AiOutlineClose /></p>

                                <p>Congratulations! You Have Completed The Section.</p>
                                {!isRated && (
                                    <div className='rating-container'>
                                        {/* {showRating ? (
                                        <a onClick={() => setShowRating(false)} className="review-link"> Cancel rating</a>
                                    ) : (
                                        <a

                                            onClick={() => setShowRating(true)}
                                            className="review-link"
                                        >
                                            Click here to write a review
                                        </a>
                                    )} showRating &&  */}
                                        {<RatingComponent courseId={id} userId={userId} handleOverlayClose={handleOverlayClose} onRatingSubmitted={handleRatingSubmitted} />}

                                    </div>
                                )}
                            </div>
                        </div>


                    )}

                        <div className="course-video-content">

                            <div className="custom-video-player" ref={videoContainerRef}>
                                <video className='enrolled-video'
                                    ref={videoRef}
                                    onTimeUpdate={handleProgressUpdate}
                                    controls={false}
                                    autoPlay
                                    src={currVideo}
                                />


                                <div className={`custom-video-controls ${isFullscreen ? 'fullscreen' : ''}`}>
                                    <div className="progress-bar-container" onClick={handleProgressClick}>
                                        <div className="progress-bar" style={{ width: `${progresses}%` }} />
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
                        </div>
                        <div className="course-content-controls">
                            <EnrolledCourseContents
                                coursesData={coursesData?.data?.sections}
                                onVideoChange={handleVideoChange}
                                watchedVideos={watchedVideos}
                                activeSubId={activeSubId}
                                userId={userId}
                            />

                            <QuizQuestionComponent />
                        </div>


                    </div>
                </div>
            )}
        </div>
    );
};

export default Course;
