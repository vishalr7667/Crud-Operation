import React from 'react'

const Footer: React.FC = ()  => {
  const year = new Date().getFullYear();
  return (
    <div className='bg-gray-800 text-white text-center p-4'>
      <p> Copy 2021 - {year} All Rights Reserved </p>
    </div>
  )
}

export default Footer