import axios from "axios";

export const BASE_URL = "http://localhost:8085/api/v1";

export const COURSES_URL = "http://localhost:8082/api/v1";

export const ENROLLMENT_URL = "http://localhost:8089/enrollments";

export const INSTRUCTOR_URL = "http://localhost:8087/api/v1";

export const PAYMENTS_URL= "http://localhost:8082/api/v1/payments";


const SaveSearchedCourses = async(courseId, userId) =>{
  try{
    const response = await axios.post(`${COURSES_URL}/searchHistory?courseId=${courseId}`,null,{ params: {userId}});
    return response ;
  } catch (error){
    throw (error)
  }
}

export { SaveSearchedCourses };

const getAverageRatingByCourse = async(courseId) => {
  try{
    const response = await axios.get(`${COURSES_URL}/course/${courseId}/average-rating`);
    return response;
  } catch (error){
    throw error;
  }
}

export { getAverageRatingByCourse };

const getInstructorEarningsByCourse = async(courseId) =>{

  try{
    const response = await axios.get(`${INSTRUCTOR_URL}/course/${courseId}/earnings`)
    console.log(courseId)
    return response;
  } catch (error){
    throw(error)
  }

}

export { getInstructorEarningsByCourse }

const coursesByInstructor = async(userId) =>{
  try{
    const response = await axios.get(`${COURSES_URL}/course/instructor/${userId}`)
    console.log(response.data)
    return response;
  } catch(error){
    throw(error)
  }
}

export { coursesByInstructor }

const createCourse = async(data) =>{
  console.log(data)
  try{
    const response = await axios.post(`${COURSES_URL}/course`,data, {
      // headers: {  
        // Authorization: `Bearer ${localStorage.getItem('token')}`
    // }
    }
  );
  console.log(response.data)
    return response;
  } catch(error){
    throw error;
  }
};

export { createCourse };

const getCurrentUserId = () => {
  return localStorage.getItem('userId');
};

const createCourseEnrollment = async (courseId) => {
  const userId = getCurrentUserId();

  if (!userId) {
    throw new Error('User ID is not available');
  }

  const enrollmentDTO = {
    courseId,
    userId
  };

  try {
    const response = await axios.post(
      `${ENROLLMENT_URL}/createEnrollment`,
      enrollmentDTO
    );
    return response;
  } catch (error) {
    console.error('Error creating enrollment:', error);
    throw error;
  }
};

export { createCourseEnrollment };



const getCourseById = async (courseId) => {
  try{
    const response = await axios.get(`${COURSES_URL}/course/${courseId.courseId}`);
    return response;
  } catch(error){
    throw error
  }
};

export { getCourseById };



const register = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export { register };

const profile = async (email) => {

  try{
    const response = await axios.get(`${BASE_URL}/profile`,email, {
      headers: {  
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }});
    return response;
  } catch(error){
    throw error;
  }
};


export { profile };
const profileUpdate = async (formData) => {
  try {
    console.log('Form data:', formData);

    const response = await fetch(`${BASE_URL}/profileUpdate`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',  
      },
      body: JSON.stringify(formData),
    });

    console.log('Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.message || 'Failed to update profile');
    }

    const data = await response.json();
    console.log('Response Data:', data);
    return data;
  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw error;
  }
};

export { profileUpdate };



const loginWithUserName = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/loginWithUserName`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export { loginWithUserName };

const forgetPassword = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/forgot-password`, null, { params: { email } })
    return response;
  } catch (error) {
    throw error;
  }
}

export { forgetPassword };

const resetPassword = async (token,newPassword) => {
  try{
    const response = await axios.post(`${BASE_URL}/reset-password`,null,{params:{token,newPassword}});
    return response;
  }catch(error){
    throw error;
  }
}

export {resetPassword};

const listCourses = async (data) =>{
  try{
    const response = await axios.get(`${COURSES_URL}/course`,data)
    return response;
  } catch(error){
    throw(error);
  }
}

export {listCourses};


const PaginatedCourses = async(term,page,itemsPerPage) =>{

  try{
    const response = await axios.get(`${COURSES_URL}/pagination`,null,{params:{term,page,itemsPerPage}})
    return response;
  } catch(error){
    throw (error)
  }
}

export {PaginatedCourses};


const mostSearchedCourses = async () => {

  try{
    const response = await axios.get(`${COURSES_URL}/course/mostSearchedCourses`)
    console.log(response.data.data)
    return response;
  } catch(error){
    throw error
  }
}

export { mostSearchedCourses } ;

const  PrevSearchedCourses= async (userId) => {

  try {
    const response = await axios.get(`${COURSES_URL}/searchHistory/previousSearchedHistoryCourses`, { params: {userId}} );
    return response.data;
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    throw error;
  }
};

export { PrevSearchedCourses };


const LangRelevantCourses = async (lang) => {

  try {
    const response = await axios.get(`${COURSES_URL}/course/filter?language=${lang}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    throw error;
  }
};

export { LangRelevantCourses };


const CART_URL = 'http://localhost:8082/api/v1/cart';

const addToCart = async (userId, courseId) => {
  try {
    const response = await axios.post(`${CART_URL}/${userId}/add/${courseId}/`);
    return response;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

const removeFromCart = async (userId, courseId) => {
  try {
    const response = await axios.delete(`${CART_URL}/${userId}/remove/${courseId}/`);
    return response;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

const getCartItems = async (userId) => {
  try {
    const response = await axios.get(`${CART_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

const clearCart = async (userId) => {
  try {
    const response = await axios.delete(`${CART_URL}/${userId}/clear`);
    return response.data;
  } catch (error) {
    console.error('Error clearing cart items:', error);
    throw error;
  }
};

export { addToCart, removeFromCart, getCartItems ,clearCart};