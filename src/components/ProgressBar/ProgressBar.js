import React  from 'react';
import { Line } from 'rc-progress';  
import './ProgressBar.css';
import { useSelector } from 'react-redux';
 
const ProgressBar = ({progress}) => {

  const theme =useSelector((Store)=> Store.ThemeSlice.theme)
  
  return (
    <div className='enrolled-progress-bar-container'>
      {/* <h3>Enrollment Progress: {progress.toFixed(2)}%</h3> */}
      <Line 
        percent={progress} 
        strokeWidth="2" 
        strokeColor={`${theme === 'light-mode'? '#E75A0A': '#1f56a8'}`}  
      />
    </div>
  );
};

export default ProgressBar;
