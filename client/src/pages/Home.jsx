import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import ListingItem from "../components/ListingItem";

function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  console.log(saleListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
  }, [])

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto text-center tracking-wide">
        <h1 className="text-[#49243E] font-bold text-3xl lg:text-6xl">
          "Unlock Your Dream Home with Ease: " 
        </h1>
        <h2 className="text-2xl">
          <span className="text-[#704264]">Your Key to Seamless ! </span>
          <span className="text-[#BB8493]">Real Estate Solutions</span>
        </h2>
          
        
        <div className="text-[#481E14] text-sm sm:text-xl">
          At NestNexus, you'll discover your next perfect living space effortlessly, with a vast array of properties to choose from.
        </div>
        <Link className="text-xs sm:text-xl text-blue-800 font-bold underline tracking-wider" to={'/search'}>Let's get started...</Link>
      </div>
      {/* swiper */}
      <Swiper navigation>
        {
          offerListings && offerListings.length > 0
          && offerListings.map((listing) => (
            <SwiperSlide>
              <div key={listing._id}
                style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover' }}
                className="h-[550px]">
              </div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}
      <div className="max-w-6xl mx-auto flex flex-col gap-8 my-10">
        {
          offerListings && offerListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?offer=true'}>Show More Offers</Link>
              </div>
              <div className="flex flex-wrap gap-4">{
                  offerListings.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id}/>
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
      <div className="max-w-6xl mx-auto flex flex-col gap-8 my-10">
        {
          rentListings && rentListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent places for Rent</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?offer=true'}>Show more places rent</Link>
              </div>
              <div className="flex flex-wrap gap-4">{
                  rentListings.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id}/>
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
      <div className="max-w-6xl mx-auto flex flex-col gap-8 my-10">
        {
          saleListings && saleListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent places for Sale</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?offer=true'}>Show more places for sale</Link>
              </div>
              <div className="flex flex-wrap gap-4">{
                  saleListings.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id}/>
                  ))
                }
              </div>
            </div>
          )
        }
      </div>

    </div>
  )
}

export default Home
