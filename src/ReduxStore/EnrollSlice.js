import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorage = () => {
  const savedCourse = localStorage.getItem('enrolledCourse');
  return savedCourse ? JSON.parse(savedCourse) : null;
};

const enrollSlice = createSlice({
  name: 'enroll',
  initialState: {
    course: loadFromLocalStorage(),
  },
  reducers: {
    enrollCourse: (state, action) => {
      state.course = action.payload;
      localStorage.setItem('enrolledCourse', JSON.stringify(action.payload));
    },
    clearEnrollments: (state) => {
      state.course = null;
      localStorage.removeItem('enrolledCourse');
    },
  },
});

export const { enrollCourse, clearEnrollments } = enrollSlice.actions;
export default enrollSlice.reducer;
