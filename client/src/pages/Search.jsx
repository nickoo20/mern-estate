import React from 'react'

const Search = () => {
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:h-screen'>
        <form className='flex flex-col gap-8'>
            <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap font-semibold '>Search Term :</label>
                <input type='text' id='searchTerm' placeholder='Search....' className='border rounded-lg p-3 w-full'/>
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Type :</label>
                <div className='flex gap-2'>
                    <input type='chexkbox' id='all' className='w-5'/>
                    <span>Rent & Sale</span>
                </div>
                <div className='flex gap-2'>
                    <input type='chexkbox' id='rent' className='w-5'/>
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input type='chexkbox' id='sale' className='w-5'/>
                    <span>Sale</span>
                </div>
                <div className='flex gap-2'>
                    <input type='chexkbox' id='offer' className='w-5'/>
                    <span>Offer</span>
                </div>
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Amenties :</label>
                <div className='flex gap-2'>
                    <input type='chexkbox' id='parking' className='w-5'/>
                    <span>Parking</span> 
                </div>
                <div className='flex gap-2'>
                    <input type='chexkbox' id='furnished' className='w-5'/>
                    <span>Furnished</span>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <label className='font-semibold'>Sort:</label>
                <select id='sort_order' className='border rounded-lg p-3'>
                    <option>Price high to low</option>
                    <option>Price low to high</option>
                    <option>Latest</option>
                    <option>Oldest</option>
                </select>
            </div>
            <button className='bg-slate-700 p-3 rounded-lg uppercase hover:opacity-95 text-white'>Search</button>
        </form>
      </div>
      <div>
        <h1 className='font-semibold text-3xl border-b p-3 mt-5'>Listing Results</h1></div>
    </div>
  )
}

export default Search
