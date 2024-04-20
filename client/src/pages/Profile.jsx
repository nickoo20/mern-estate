import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { MdModeEditOutline } from "react-icons/md";
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      toast.success(data);
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      toast.success(data);
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <h1 className='text-3xl font-semibold text-center my-7'>User Profile Page</h1>
      <div className='flex flex-col max-w-3xl mx-auto'>
        <div className='border rounded-lg bg-[#F8F0E5]'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type='file'
              ref={fileRef}
              hidden
              accept='image/*'
            />
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt='profile'
              className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-4 border-[#074173]'
            />
            <p className='text-sm self-center'>
              {fileUploadError ? (
                <span className='text-red-700'>
                  Error Image upload (image must be less than 2 mb)
                </span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
              ) : filePerc === 100 ? (
                <span className='text-green-700'>Image successfully uploaded!</span>
              ) : (
                ''
              )}
            </p>
            <div className='flex items-center justify-around'>
              <label className='font-semibold'>Username</label>
              <input
                type='text'
                placeholder='username'
                defaultValue={currentUser.username}
                id='username'
                className='border p-3 rounded-full bg-[#EEEEEE] focus:outline-none'
                onChange={handleChange}
              />
            </div>
            <div className='flex items-center justify-around'>
              <label className='font-semibold'>Email</label>
              <input
                type='email'
                placeholder='email'
                id='email'
                defaultValue={currentUser.email}
                className='border p-3 rounded-full bg-[#EEEEEE] focus:outline-none'
                onChange={handleChange}
              />
            </div>
            <div className='flex items-center justify-around'>
              <label className='font-semibold'>Password</label>
              <input
                type='password'
                placeholder='password'
                onChange={handleChange}
                id='password'
                className='border p-3 rounded-full bg-[#EEEEEE] focus:outline-none'
              />
            </div>
            <div className='flex justify-around'>
            <button
              disabled={loading}
              className='bg-[#007F73] text-white rounded-full p-3 uppercase hover:opacity-95 disabled:opacity-80'
            >
              {loading ? 'Loading...' : 'Update info'}
            </button>
            <Link
              className='bg-[#49243E] text-white p-3 rounded-full uppercase text-center hover:opacity-95'
              to={'/create-listing'}
            >
              Create Listing
            </Link>
            </div>
          </form>
          <div className='flex justify-between mt-5'>
            <span
              onClick={handleDeleteUser}
              className='cursor-pointer rounded-full p-3 text-red-600 '
            >
              Delete account
            </span>
            <span onClick={handleSignOut} className='text-red-800 cursor-pointer rounded-full p-3'>
              Sign out
            </span>
          </div>

          <p className='text-red-700 mt-5'>{error ? error : ''}</p>
          <p className='text-green-700 mt-2 mb-4 text-center'>
            {updateSuccess ? 'User is updated successfully!' : ''}
          </p>
        </div>

        <div className=' my-5'>
          <button onClick={handleShowListings} className='text-[#627254] w-full text-xl'>
            Show My Listings
          </button>
          <p className='text-red-700 mt-5'>
            {showListingsError ? 'Error showing listings' : ''}
          </p>

          {userListings && userListings.length > 0 && (
            <div className='flex flex-col gap-4'>
              <h1 className='text-center text-2xl font-semibold text-blue-700'>
                Your Listings
              </h1>
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className='shadow-md rounded-lg p-3 flex justify-between items-center gap-4 bg-[#F8F0E5]'
                >
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      src={listing.imageUrls[0]}
                      alt='listing cover'
                      className='h-20 object-contain'
                    />
                  </Link>
                  <Link
                    className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                    to={`/listing/${listing._id}`}
                  >
                    <p>{listing.name}</p>
                  </Link>

                  <div className='flex item-center'>
                    {/* <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button> */}
                    <MdOutlineDeleteOutline onClick={() => handleListingDelete(listing._id)} className='text-red-700' size={22} />
                    <Link to={`/update-listing/${listing._id}`}>
                      {/* <button className='text-green-700 uppercase'>Edit</button> */}
                      <MdModeEditOutline className='text-green-700' size={22} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}