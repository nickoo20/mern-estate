import React, { useState } from 'react'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { MdCloudUpload } from "react-icons/md";
import { BsUpload } from "react-icons/bs";
import { FaImages } from "react-icons/fa6";
import toast from 'react-hot-toast';
// import {toast} from 'react-hot-toast';

const CreateListing = () => {
    const { currentUser } = useSelector(state => state.user)
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    console.log(formData);
    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch((err) => {
                    setImageUploadError('Image upload failed (2 mb max per image)');
                    setUploading(false);
                });
        } else {
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    }

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }

        if (
            e.target.type === 'number' ||
            e.target.type === 'text' ||
            e.target.type === 'textarea'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1){
                return setError('You must upload at least one image ! ');
            }
            if (+formData.regularPrice < +formData.discountPrice)
                return setError('Discount price must be lower than regular price');
            setLoading(true);
            setError(false);
            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }

    }

    return (
        <main className='p-3 max-w-6xl mx-auto'>
            <h1 className='text-2xl text-blue-700 font-semibold my-7 text-right'>Create new Listing now !</h1>
            <div className='border border-[#F7DCB9] p-4 bg-[#F8EAD8]'>
                <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-8'>
                    <div className='flex flex-col gap-4 flex-1'>
                        <div className='flex items-center justify-around'>
                            <label>Name : </label>
                            <input type='text' placeholder='Enter your name...' className='border p-3 rounded-lg bg-[#FEFAF6]'
                                id='name' minLength='12' maxLength='62' onChange={handleChange} value={formData.name} required />
                        </div>
                        <div className='flex items-center justify-around'>
                            <label>Description : </label>
                            <textarea type='text' placeholder='Describe your property here...' className='border p-3 rounded-lg bg-[#FEFAF6]'
                                id='description' onChange={handleChange} value={formData.description} rows={5} cols={20} required />
                        </div>
                        <div className='flex items-center justify-around'>
                            <label>Address : </label>
                            <input type='text' placeholder='Enter your address...' className='border p-3 rounded-lg bg-[#FEFAF6]'
                                id='address' onChange={handleChange} value={formData.address} required />
                        </div>
                        <div className='flex items-center justify-around px-6 my-4'>
                            <p>Do you want to : </p>
                            <div className='flex items-center gap-2'>
                                <input type='checkbox' id='sale' className='w-5 bg-[#FEFAF6]' onChange={handleChange}
                                    checked={formData.type === 'sale'} />
                                <span>Sell</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <input type='checkbox' id='rent' className='w-5 bg-[#FEFAF6]' onChange={handleChange}
                                    checked={formData.type === 'rent'} />
                                <span>Rent</span>
                            </div>
                        </div>
                        <div className='flex items-center justify-around flex-wrap px-10 mb-4'>
                            <p>Have :</p>
                            <div className='flex items-center gap-2'>
                                <input type='checkbox' id='parking' className='w-5 bg-[#FEFAF6]' onChange={handleChange}
                                    checked={formData.parking} />
                                <span>Parking spot</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <input type='checkbox' id='furnished' className='w-5  bg-[#FEFAF6]' onChange={handleChange}
                                    checked={formData.furnished} />
                                <span>Furnished</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <input type='checkbox' id='offer' className='w-5 bg-[#FEFAF6]' onChange={handleChange}
                                    checked={formData.offer} />
                                <span>offer</span>
                            </div>
                        </div>
                        <div className='flex flex-wrap justify-around gap-4'>
                            <div className='flex items-center gap-2'>
                                <p>Bedrooms : </p>
                                <input className='p-3 border border-gray-300 rounded-lg bg-[#FEFAF6]' type='number' id='bedrooms' min='1' max='10'
                                    onChange={handleChange} value={formData.bedrooms} required />
                            </div>
                            <div className='flex items-center gap-2'>
                                <p>Bathrooms : </p>
                                <input className='p-3 border border-gray-300 rounded-lg bg-[#FEFAF6]' type='number' id='bathrooms' min='1' max='10'
                                    onChange={handleChange} value={formData.bathrooms} required />
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='flex flex-col items-center'>
                                    <p>Regular Price</p>
                                    <span className='text-xs'>($ / month)</span>
                                </div>
                                <input className='p-3 border border-gray-300 rounded-lg bg-[#FEFAF6]' type='number' id='regularPrice' min='50' max='10000000'
                                    onChange={handleChange} value={formData.regularPrice} required />
                            </div>
                            {
                                formData.offer && (
                                    <div className='flex items-center gap-2'>
                                        <div className='flex flex-col items-center'>
                                            <p>Discounted Price</p>
                                            <span className='text-xs'>($ / month)</span>
                                        </div>
                                        <input className='p-3 border border-gray-300 rounded-lg bg-[#FEFAF6]' type='number' id='discountPrice' min='0' max='10000000'
                                            onChange={handleChange} value={formData.discountPrice} required />
                                    </div>
                                )}
                        </div>
                    </div>
                    <div className='flex flex-col flex-1 gap-4'>
                        <div className='flex gap-2 items-center'>
                            <p className='font-semibold'>Images: </p>
                                <FaImages size={22} className='text-slate-700' />
                        </div>
                        <span className='font-semibold text-[#803D3B] ml-2 italic'>The first image will be the cover (max 6)</span>
                    <div className='flex gap-4'>
                        <input onChange={(e) => setFiles(e.target.files)}
                            className='p-3 shadow-sm rounded w-full'
                            type='file' id='images'
                            accept='image/*' multiple />
                        <button disabled={uploading} type='button' onClick={handleImageSubmit}
                            className='p-3 text-green-700 rounded-full disabled:opacity-80 cursor-pointer'>
                            {uploading ? <BsUpload size={22} /> : <MdCloudUpload size={22} />}
                        </button>
                        <p className='text-sm text-blue-700'>Click to upload!</p>
                    </div>
                    <p className='text-red-700 text-sm   '>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className='flex justify-between p-3 shadow-md items-center'>
                                <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
                                {/* <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button> */}
                                <div className='hover:bg-red-300 cursor-pointer rounded-full p-1'>
                                    <MdOutlineDeleteOutline onClick={() => handleRemoveImage(index)} className='text-red-800' size={22} />
                                </div>
                            </div>
                        ))
                    }

                    <button disabled={loading || uploading} className='bg-[#135D66] w-[200px] text-white rounded-full self-center p-3 uppercase hover:opacity-95 disabled:opacity-80'>
                        {loading ? 'Creating...' : 'Create a Listing'}
                    </button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
            </div>
        </form>
            </div >
        </main >
    )
}

export default CreateListing
