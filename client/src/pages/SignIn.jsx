import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { toast } from 'react-hot-toast';

function SignIn() {
  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  const {loading, error} = useSelector((state) => state.user) ;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }
  console.log(formData);
  return (
    <div className='flex flex-col md:flex-row justify-evenly items-center mt-12'>
      <img src='https://media.istockphoto.com/id/1498811925/photo/real-estate-agent-or-real-estate-agent-was-holding-the-key-to-the-new-landlord-tenant-or.webp?b=1&s=170667a&w=0&k=20&c=llN8VkgxCJN89WHiL3yByIiQ7HlWSEaHvpTMV_g5Y9U=' className='rounded-md sm:h-1/4 p-2 shadow-2xl' alt='prop_img' />

      <div className='p-3'>
        <h1 className='text-2xl uppercase tracking-wide underline font-semibold my-7 text-[#135D66]'>Welcome back !</h1>
        <h2 className='text-2xl text-[#135D66] text-center my-4'>Sign In</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input type='text' placeholder='Enter your email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
          <input type='text' placeholder='Enter your password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
          <button disabled={loading}
            className='bg-[#135D66] text-[#E3FEF7] p-3 rounded-lg uppercase hover:opacity-75 disabled:opacity-80'>
            {loading ? 'Loading...' : 'Sign IN'}</button>
          <OAuth />
        </form>
        <div className='flex gap-2 mt-5'>
          <p>Dont have an account?</p>
          <Link to={'/sign-up'}>
            <span className='text-blue-700 hover:underline'>Sign up</span></Link>
        </div>
        {/* if(error) toast.error(error) ;  */}
        {/* {error && <p className='text-red-500 mt-5'>{error}</p>} */}
      </div>
    </div>
  )
}

export default SignIn
