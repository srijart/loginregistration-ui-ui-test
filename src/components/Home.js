import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate=useNavigate();

  useEffect(()=> {
    if(!localStorage.getItem('token')){
      navigate('/login')
    }
  },[navigate])
  return (
    <div>
      {/* <Carousel/> */}
    </div>
  )
}

export default Home;
