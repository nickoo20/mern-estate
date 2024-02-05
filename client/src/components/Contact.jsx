import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Contact = ({listing}) => {
  const [landlord, setLandlord] = useState(false) ;
  const [message, setMessage] = useState('') ;
  useEffect(()=>{
    const fetchLandlord=async()=>{
      try{
        const res = await fetch(`/api/user/${listing.userRef}`) ;
        const data=await res.json() ;
        setLandlord(data) ;
      }catch(error){ 
        console.log(error) ;
      }
    }
      fetchLandlord() ;
  }, [listing.userRef]) ;

  const onChange = (e) => {
      setMessage(e.target.value) ;
  }

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>Contact <span className='font-semibold'>{landlord.username}</span> for
          <span className='font-semibold'> {listing.name.toLowerCase()}</span></p>
          <textarea name='message' rows='2' id='message' value={message} onChange={onChange} placeholder='Enter your message here....'
          className='w-full p-3 rounded-lg border'></textarea>
          <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'>
              Send Message
          </Link>
        </div>
      )}
    </>
  )
}

export default Contact
