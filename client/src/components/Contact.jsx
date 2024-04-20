import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { IoIosSend } from "react-icons/io";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchLandlord(); 
  }, [listing.userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  }

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p className='text-xl'>Contact <span className='font-semibold text-[#0E46A3]'>{landlord.username}</span> for
            <span className='font-semibold text-[#DD5746] capitalize italic'> {listing.name.toLowerCase()}</span> :</p>
          <textarea name='message' rows='5' id='message' value={message} onChange={onChange} placeholder='Enter your message here....'
            className='p-3 rounded-lg border w-[400px] my-4 bg-[#F6F5F2]'></textarea>
          <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='w-[95px] bg-[#41B06E] text-white text-center px-4 py-2 uppercase rounded-full hover:opacity-95'>
            <div className='flex items-center gap-1'>
              <div>Send</div> <IoIosSend className='hover:opacity-80' />
            </div>
          </Link>
        </div>
      )}
    </>
  )
}

export default Contact ;
