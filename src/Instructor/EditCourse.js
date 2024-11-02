import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
// import { updateCourse } from '../Services/courseService'; // not updateCourse function

const EditCourse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const courseToEdit = location.state?.course;

  const [formData, setFormData] = useState(courseToEdit || {
    name: '',
    description: '',
    price: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // try {
    //   const response = await updateCourse(formData);
    //   if (response.status === 200) {
    //     toast.success('Course updated successfully!');
    //     navigate('/');
    //   } else {
    //     toast.error('Failed to update course!');
    //   }
    // } catch (error) {
    //   toast.error('An error occurred!');
    // }
  };

  return (
    <div className="course-form-container">
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit}>
         <div>
          <label>Course Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Course</button>
      </form>
    </div>
  );
};

export default EditCourse;
