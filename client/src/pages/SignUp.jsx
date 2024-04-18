import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message)
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');

    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }
  console.log(formData);
  return (
    <div className='flex flex-col md:flex-row justify-evenly items-center mt-12'>
      <img src='https://media.istockphoto.com/id/1498811925/photo/real-estate-agent-or-real-estate-agent-was-holding-the-key-to-the-new-landlord-tenant-or.webp?b=1&s=170667a&w=0&k=20&c=llN8VkgxCJN89WHiL3yByIiQ7HlWSEaHvpTMV_g5Y9U=' alt='prop' className='rounded-md sm:h-1/4 p-2 shadow-2xl '/>
    <div className='p-3'>
    <h1 className='text-2xl uppercase tracking-wide underline font-semibold my-7 text-[#135D66]'>Register Now !</h1>
      <h2 className='text-2xl text-[#003C43] text-center my-4'>Sign Up</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} />
        <input type='text' placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type='text' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading}
          className='bg-[#135D66] text-[#E3FEF7] p-3 rounded-lg uppercase hover:opacity-75 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign up'}</button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign in</span></Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
    </div>
  )
}

export default SignUp
