import React, { useState } from 'react';
import axios from 'axios';

const EnrollmentForm = () => {const [name, setName] = useState('John Doe'); // Initial name
    const [email, setEmail] = useState('john.doe@example.com'); // Initial email
    const [amount, setAmount] = useState(100); // Initial amount
    const [message, setMessage] = useState('');
  
    const handleEnroll = async (e) => {
      e.preventDefault(); // Prevent form from submitting the default way
  
      try {
        const response = await axios.post('http://localhost:8089/enrollments/enrollNow', {
          name,
          email,
          amount,
        });
        
        // Handle successful response
        setMessage(`Enrollment successful! Transaction ID: ${response.data.transactionId}`);
      } catch (error) {
        console.error("Enrollment error:", error);
        setMessage("Failed to enroll. Please try again.");
      }
    };
  
    return (
      <div>
        <h2>Enroll Now</h2>
        <form onSubmit={handleEnroll}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button type="submit">Enroll</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    );
  };

export default EnrollmentForm;
