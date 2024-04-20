import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa';

const Listing = () => {
    const { currentUser } = useSelector(state => state.user);
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const params = useParams();
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true) ;
                    setLoading(false) ;
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchListing() ;
    }, [params.listingId])
    console.log(loading)
    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && <p className='text-red-700'>Something went wrong!</p>}
            {
                listing && !loading && !error && (
                    <div className='relative'>
                        <Swiper navigation>
                            {listing.imageUrls.map((url) => (
                                <SwiperSlide key={url}>
                                    <div className='h-[600px]' style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}></div>
                                </SwiperSlide>
                            )
                            )}
                        </Swiper>
                        <div className='absolute top-20 md:right-30 xl:right-60 right-10 z-10 border border-[#135D66] rounded-full w-12 h-12 flex justify-center items-center bg-[#EADBC8] cursor-pointer'>
                            <FaShare
                                className='text-slate-500'
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    setCopied(true);
                                    setTimeout(() => {
                                        setCopied(false);
                                    }, 2000);
                                }}
                            />
                        </div>
                        {copied && (
                            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                                Link copied!
                            </p>
                        )}
                        <div className='flex flex-col max-w-5xl border-l-4 mx-auto p-3 my-7 gap-4'>
                            <div className='flex justify-between items-center gap-10'>
                                <p className='text-3xl font-semibold'>
                                    {listing.name} - ${' '}
                                    {listing.offer
                                        ? listing.discountPrice.toLocaleString('en-US')
                                        : listing.regularPrice.toLocaleString('en-US')}
                                    {listing.type === 'rent' && ' / month'}
                                </p>
                                <div className='flex md:flex-row flex-col flex-1 items-center text-sm gap-4'>
                                    <div className='bg-[#10439F] w-full max-w-[200px] text-white text-center p-1 rounded-lg'>
                                        {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                                    </div>
                                    {listing.offer && (
                                        <p className='bg-[#C65BCF] w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                            ${+listing.regularPrice - +listing.discountPrice} OFF
                                        </p>
                                    )}
                                </div>
                            </div>

                            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                                <FaMapMarkerAlt className='text-green-700' />
                                {listing.address}
                            </p>
                            <p className='text-slate-800'>
                                <span className='font-semibold text-black'>Description - </span>
                                {listing.description}
                            </p>
                            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                                <li className='flex items-center gap-1 whitespace-nowrap'>
                                    <FaBed className='text-lg' />
                                    {listing.bedrooms > 1
                                        ? `${listing.bedrooms} beds `
                                        : `${listing.bedrooms} bed `}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaBath className='text-lg' />
                                    {listing.bathrooms > 1
                                        ? `${listing.bathrooms} baths `
                                        : `${listing.bathrooms} bath `}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaParking className='text-lg' />
                                    {listing.parking ? 'Parking spot' : 'No Parking'}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaChair className='text-lg' />
                                    {listing.furnished ? 'Furnished' : 'Unfurnished'}
                                </li>
                            </ul>
                            {currentUser && listing.userRef !== currentUser._id && !contact && (
                                <button onClick={() => setContact(true)} className='bg-[#074173] w-[300px] my-3 text-[#F0EBE3] uppercase rounded-full hover:opacity-95 px-4 py-2'>
                                    Contact Landlord
                                </button>
                            )}
                            {
                                contact && <Contact listing={listing} />
                            }
                        </div>
                    </div>
                )}
        </main>
    )
}

export default Listing
