import { createSlice } from "@reduxjs/toolkit";

const loadStateFromLocal = () => {
   const storedProgress = localStorage.getItem('progress');
   return storedProgress 
       ? JSON.parse(storedProgress) 
       : { progress: [], watchedVideos: [], sectionCompleted: {} }; 
};

const ProgressBarSlice = createSlice({
   name: 'progressBar',
   initialState: loadStateFromLocal(),
   reducers: {
       updateProgress: (state, action) => {
           const { courseId, sectionId, currentProgress } = action.payload;
           const existingItem = state.progress.find(item => item.courseId === courseId);

           if (existingItem) {
               existingItem.currentProgress[sectionId] = currentProgress;
           } else {
               state.progress.push({ courseId, currentProgress: { [sectionId]: currentProgress } });
           }

           localStorage.setItem('progress', JSON.stringify(state));
       },
       checkIfVideoUpdated: (state, action) => {
           const { uniqueVId } = action.payload; 
           if (!state.watchedVideos.includes(uniqueVId)) {
               state.watchedVideos.push(uniqueVId);
           }
       },
       setSectionCompleted: (state, action) => {
           const { userId, sectionId } = action.payload;
           const key = `${userId}S${sectionId}`;
           console.log("Setting section completed for key:", key);
           console.log("Current sectionCompleted state:", state.sectionCompleted); // Should not be undefined
           state.sectionCompleted[key] = true;  
       },
       resetProgress: (state) => {
           state.progress = [];
           state.watchedVideos = [];
           state.sectionCompleted = {};
           localStorage.removeItem('progress');
       }
   }
});

export const { updateProgress, checkIfVideoUpdated, resetProgress, setSectionCompleted } = ProgressBarSlice.actions;
export default ProgressBarSlice.reducer;
