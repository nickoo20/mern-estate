import React from 'react'
function About() {
  return (
    <div className='py-20 max-w-3xl mx-auto border h-screen p-4'>
      <div className='flex justify-around gap-10'>
      <h1 className='text-4xl text-[#8B322C] font-semibold'>Features</h1>
      <ol className='flex flex-col items-center gap-4 text-xl text-[#003C43]'>
        <li className='shadow-2xl p-2'>Implemented advanced authentication mechanisms using <span className='text-red-700'>JWT, Firebase, and Google OAuth</span> to ensure secure and seamless user access</li>
        <li className='shadow-2xl p-2'> Developed real-world <span className='text-red-700'>CRUD</span> operations for property listings, utilizing MongoDB as the database management system.</li>
        <li className='shadow-2xl p-2'> Enhanced user experience through user-friendly features such as <span className='text-red-700'>image uploads and comprehensive property listing management tools.</span></li>
        <li className='shadow-2xl p-2'>Implemented cutting-edge <span className='text-red-700'>search functionality</span>  to empower users to easily find the properties they’re looking for, utilizing advanced search algorithms and filters.</li>
      </ol>
      </div>
      <div className='py-10'>
        <h1 className='text-4xl text-[#8B322C] font-semibold'>Technology Stack Used </h1>
        <ul className='flex p-4 items-center gap-4 text-xl text-[#003C43] my-5'>
          <li className='border p-2 rounded-full shadow-md'>React.js</li>
          <li className='border p-2 rounded-full shadow-md'>Node.js</li>
          <li className='border p-2 rounded-full shadow-md'>Express.js</li>
          <li className='border p-2 rounded-full shadow-md'>MongoDb</li>
          <li className='border p-2 rounded-full shadow-md'>TailwindCSS</li>
        </ul>
      </div>
    </div>
  )
}

export default About
