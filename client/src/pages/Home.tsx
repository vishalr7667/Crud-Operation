import React, { useEffect } from 'react'
import { useContext } from 'react';
import { AuthContext } from '../context/Auth';
import { Link } from 'react-router-dom';
const Home : React.FC = () => {
  useEffect(() => {
    document.title = 'Home';
  }, []);
  const {auth} = useContext(AuthContext);
  // const auth = authContext?.auth;
  return (
    <>
    <div className='flex flex-col justify-center items-center'>
      <img src={auth?.avatar} alt="avatar" className='w-50 h-50 mb-3 rounded-full' /> 
      <div className='text-4xl font-bold'> Hi <span className='text-blue-500 capitalize'>{auth?.fullName}</span> Welcome to the Home Page </div>
      <Link title='Go to Products to perform CRUD operations' to={'/products'} className='text-black-500 bg-amber-200 px-4 py-2 rounded-md mt-4'> Go to Products </Link>
      <p className='text-gray-500 text-sm mt-2'>You can add, edit and delete products</p>
    </div>
    </>
  )
}

export default Home;