import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CourseDetails/CourseDetails.css';
import './SupportPage.css';
import { toast, ToastContainer } from 'react-toastify';

const SupportPage = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchTickets = async (page = 0) => {
        setLoading(true);  
        try {
            const response = await axios.get(`http://localhost:8085/api/v1/tickets/user/${userId}?page=${page}&size=10`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTickets(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTicket = { subject, description, userId: parseInt(userId) };
        try {
            await axios.post('http://localhost:8085/api/v1/tickets', newTicket, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Ticket created successfully!');
            setSubject('');
            setDescription('');
            fetchTickets(currentPage);
        } catch (error) {
            toast.error('Error creating ticket');
            console.error('Error creating ticket:', error);
        }
    };

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        } else {
            fetchTickets(currentPage);
        }
    }, [userId, currentPage, navigate]);

    if (loading) {
        return <div className="loading">Loading tickets...</div>;  
    }

    return (
        <div className="support-container">
            <div>
                <div className="course-detail-card">
                    <h1 className="ES-Heading">Submit a Support Ticket</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className="course-detail-description"
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="course-detail-description"
                        />
                        <button type="submit" className="enroll-detail-button">Submit Ticket</button>
                    </form>

                    <h3>Your Support Tickets</h3>
                    {
                        tickets.length > 0 ? (
                            <>
                                <div>
                                    {tickets.map(ticket => (
                                        <div key={ticket.id} className='support-card'>
                                            <strong>Subject: {ticket.subject}</strong> - {ticket.resolved ? "Resolved ✔️" : "Pending ⌛"}
                                            <p>Description: {ticket.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="pagination">
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} 
                                        disabled={currentPage === 0}
                                        aria-label="Previous Page"
                                    >
                                        Previous
                                    </button>
                                    <span>Page {currentPage + 1} of {totalPages}</span>
                                    <button 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))} 
                                        disabled={currentPage === totalPages - 1}
                                        aria-label="Next Page"
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="no-tickets-message">No tickets found.</div> 
                        )
                    }
                </div>
            </div>
         </div>
    );
};

export default SupportPage;
