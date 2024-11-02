import React, { useState } from 'react'; 
import axios from 'axios';
import { toast } from 'react-toastify';

const RatingComponent = ({ courseId, userId, handleOverlayClose, onRatingSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [audio, setAudio] = useState(0);
    const [video, setVideo] = useState(0);
    const [tutor, setTutor] = useState(0);
    const [difficulty, setDifficulty] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStarClick = (value, type) => {
        switch (type) {
            case 'rating':
                setRating(value);
                break;
            case 'audio':
                setAudio(value);
                break;
            case 'video':
                setVideo(value);
                break;
            case 'tutor':
                setTutor(value);
                break;
            case 'difficulty':
                setDifficulty(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:8082/api/v1/course/${courseId}/${userId}/ratings`,
                null,
                {
                    params: {
                        rating,
                        audio,
                        video,
                        tutor,
                        difficulty,
                        feedback,
                    },
                }
            );
            setMessage(response.data); 
            setRating(0);  
            setAudio(0);  
            setVideo(0);  
            setTutor(0);  
            setDifficulty(0);  
            setFeedback('');  
            handleOverlayClose();
            toast.success("Rating submitted!");

            if (response.status === 200) {
                onRatingSubmitted();  
            }
        } catch (err) {
            setError(err.response?.data || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (currentRating, type) => {
        return [...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
                <span
                    key={starValue}
                    onClick={() => handleStarClick(starValue, type)}
                    style={{
                        cursor: 'pointer',
                        color: starValue <= currentRating ? 'gold' : 'gray',
                        fontSize: '30px',
                    }}
                >
                    ★
                </span>
            );
        });
    };

    return (
        <div className='review-section'>
            <form onSubmit={handleSubmit}>
                <div className='star-rating-container'>
                    <h5>How Effective Was This Course?</h5>
                    <div className='star-rating'>
                        {renderStars(rating, 'rating')}
                    </div>
                </div>

                <div className='star-rating-container'>
                    <h5>Audio Quality</h5>
                    <div className='star-rating'>
                        {renderStars(audio, 'audio')}
                    </div>
                </div>

                <div className='star-rating-container'>
                    <h5>Video Quality</h5>
                    <div className='star-rating'>
                        {renderStars(video, 'video')}
                    </div>
                </div>

                <div className='star-rating-container'>
                    <h5>Tutor Quality</h5>
                    <div className='star-rating'>
                        {renderStars(tutor, 'tutor')}
                    </div>
                </div>

                <div className='star-rating-container'>
                    <h5>Difficulty Level</h5>
                    <div className='star-rating'>
                        {renderStars(difficulty, 'difficulty')}
                    </div>
                </div>

                <textarea
                    value={feedback}
                    placeholder='Optional feedback'
                    className='ratingtextarea'
                    onChange={(e) => setFeedback(e.target.value)}
                />
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Rating'}
                </button>
            </form>
            {message && <p className='success-message'>{message}</p>}
            {error && <p className='error-message'>{error}</p>}
        </div>
    );
};

export default RatingComponent;
