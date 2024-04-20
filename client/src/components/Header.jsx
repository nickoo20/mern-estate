import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
    const { currentUser } = useSelector(state => state.user)
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

    return (
        <header className='bg-[#EAD8C0] shadow-md pt-2'>
            <div className='flex items-center justify-between p-2 sm:pl-12 gap-3'>
            <Link to='/' className='flex items-center'>
                    <h1 className='font-bold text-sm xl:text-xl flex uppercase shadow-xl border-none rounded-full p-2 tracking-tighter'>
                        <span className='text-[#003C43]'>Nest</span>
                        <span className='text-[#135D66]'>Nexus </span>
                    </h1>
            </Link>
            <div className='flex justify-between items-center max-w-6xl'>
                <form onSubmit={handleSubmit} className='bg-[#FFF2E1] p-3 rounded-full flex items-center'>
                    <input type='text' placeholder='Search...'
                        className='bg-transparent focus:outline-none w-20 sm:w-40 md:w-60 '
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <FaSearch className='text-slate-600' />
                    </button>
                </form>
                <ul className='flex items-center gap-3 text-[#003C43] font-roboto md:ml-20 md:mr-8 xl:mr-20'>
                    <Link to='/'><li className='hidden md:inline hover:bg-[#FEFDED] rounded-full p-2 hover:transition duration-900'>Home</li></Link>
                    <Link to='/about'><li className='hidden md:inline hover:bg-[#FEFDED] rounded-full p-2 hover:transition duration-900'>About</li></Link>
                    <Link to='/profile'>
                        {
                            currentUser ? (
                                <img className='rounded-full h-7 c-7 object-cover' src={currentUser.avatar} alt='profile' />
                            ) : (
                                <li className='hover:bg-[#FEFDED] rounded-full p-2'>Sign</li>
                            )}
                    </Link>
                </ul>
            </div>
            </div>
        </header>
    )
}

export default Header
