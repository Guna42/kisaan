import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Tractor, Sprout, Wheat, Edit2, User2, Phone, MapPin } from 'lucide-react';

function Profile() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(() => {
    const savedData = localStorage.getItem('farmerProfile');
    return savedData
      ? JSON.parse(savedData)
      : {
          name: 'Farmer Guna',
          farmLocation: 'Guntur, Andhra Pradesh',
          crops: ['Rice', 'Chillies', 'Groundnuts'],
          farmsManaged: 2,
          cropsGrown: 5,
          experience: 10,
          contact: '+91-123-456-7890',
          farmSize: '5 acres'
        };
  });
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token') || '';

  const handleProfileUpdate = (data) => {
    const updatedData = {
      ...profileData,
      name: data.name,
      farmLocation: data.farmLocation,
      crops: data.crops.split(',').map(crop => crop.trim()),
      contact: data.contact,
      farmSize: data.farmSize
    };
    setProfileData(updatedData);
    localStorage.setItem('farmerProfile', JSON.stringify(updatedData));
    setIsEditing(false);
    reset(data);
    console.log('Updated Profile:', updatedData);
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Profile fetch failed');
      setUserProfile(result);
      setError(null);
    } catch (err) {
      console.error('Profile Fetch Error:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  useEffect(() => {
    localStorage.setItem('farmerProfile', JSON.stringify(profileData));
  }, [profileData]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8 flex flex-col items-center bg-transparent">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-5xl mx-auto flex flex-col items-center mb-12 relative"
      >
        {/* Animated User Icon */}
        <motion.span
          className="inline-flex items-center justify-center rounded-full bg-white/30 dark:bg-black/40 shadow-lg shadow-emerald-400/20 w-24 h-24 md:w-32 md:h-32 absolute -top-10 left-1/2 -translate-x-1/2 z-20 border-2 border-emerald-400/40 backdrop-blur-xl"
          animate={{ y: [0, -10, 0], boxShadow: [
            '0 4px 32px 0 rgba(16,185,129,0.18)',
            '0 8px 48px 0 rgba(16,185,129,0.28)',
            '0 4px 32px 0 rgba(16,185,129,0.18)'] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
        >
          <User2 className="w-14 h-14 md:w-20 md:h-20 text-emerald-400 drop-shadow-lg" />
        </motion.span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-700 to-emerald-400 dark:from-white dark:via-gray-200 dark:to-emerald-400 drop-shadow-lg text-center mt-24">
          Farmer Profile
        </h2>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mt-4 font-medium text-center">
          Manage your farm details and showcase your agricultural journey.
        </p>
      </motion.div>

      {error && <p className="text-red-400 text-center">Error: {error}</p>}
      {userProfile ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative w-full max-w-5xl mx-auto rounded-3xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-[#101624]/90 backdrop-blur-2xl shadow-2xl overflow-hidden group"
        >
          {/* Glassy white shine effect */}
          <div className="absolute left-[-60%] top-0 w-2/3 h-full bg-gradient-to-r from-white/60 via-white/10 to-transparent opacity-30 blur-xl animate-shine pointer-events-none z-10" />
          <div className="flex flex-col md:flex-row items-center md:items-start gap-0 md:gap-10 p-8 md:p-16 relative z-20">
            {/* Profile Info */}
            <div className="flex-1 flex flex-col items-start justify-center w-full max-w-xl">
              <h3 className="text-3xl md:text-4xl font-bold text-emerald-700 dark:text-emerald-200 mb-4 flex items-center gap-3">
                <Tractor className="w-8 h-8 text-emerald-400" />
                {userProfile.name || profileData.name}
              </h3>
              <p className="text-gray-900 dark:text-gray-100 text-lg flex items-center mb-2">
                <MapPin className="w-6 h-6 mr-2 text-emerald-400" />
                <span className="font-medium">{profileData.farmLocation}</span>
              </p>
              <p className="text-gray-900 dark:text-gray-100 text-lg flex items-center mb-2">
                <Sprout className="w-6 h-6 mr-2 text-emerald-400" />
                <span className="font-medium">{profileData.crops.join(', ')}</span>
              </p>
              <p className="text-gray-900 dark:text-gray-100 text-lg flex items-center mb-2">
                <Phone className="w-6 h-6 mr-2 text-emerald-400" />
                <span className="font-medium">{profileData.contact}</span>
              </p>
              <p className="text-gray-900 dark:text-gray-100 text-lg flex items-center mb-2">
                <Wheat className="w-6 h-6 mr-2 text-emerald-400" />
                <span className="font-medium">{profileData.farmSize}</span>
              </p>
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: '0 0 32px #34d399', filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsEditing(!isEditing)}
                className="mt-6 bg-white/60 dark:bg-black/40 border border-emerald-400/40 text-emerald-700 dark:text-emerald-200 px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-400/10 transition-all duration-300 backdrop-blur-xl hover:bg-emerald-400/20 hover:text-emerald-900 dark:hover:text-emerald-100 focus:outline-none"
              >
                <Edit2 className="w-5 h-5" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </motion.button>
            </div>
            {/* Stat Cards */}
            <div className="flex flex-col gap-6 w-full md:w-72 mt-10 md:mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-lg p-6 flex flex-col items-center group overflow-hidden"
              >
                <div className="absolute left-[-60%] top-0 w-2/3 h-full bg-gradient-to-r from-white/60 via-white/10 to-transparent opacity-30 blur-xl animate-shine pointer-events-none z-10" />
                <span className="text-3xl font-extrabold text-emerald-400 mb-1">{profileData.farmsManaged}</span>
                <span className="text-gray-900 dark:text-gray-100 text-base font-medium">Farms Managed</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-lg p-6 flex flex-col items-center group overflow-hidden"
              >
                <div className="absolute left-[-60%] top-0 w-2/3 h-full bg-gradient-to-r from-white/60 via-white/10 to-transparent opacity-30 blur-xl animate-shine pointer-events-none z-10" />
                <span className="text-3xl font-extrabold text-emerald-400 mb-1">{profileData.cropsGrown}</span>
                <span className="text-gray-900 dark:text-gray-100 text-base font-medium">Crops Grown</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="relative bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-lg p-6 flex flex-col items-center group overflow-hidden"
              >
                <div className="absolute left-[-60%] top-0 w-2/3 h-full bg-gradient-to-r from-white/60 via-white/10 to-transparent opacity-30 blur-xl animate-shine pointer-events-none z-10" />
                <span className="text-3xl font-extrabold text-emerald-400 mb-1">{profileData.experience}</span>
                <span className="text-gray-900 dark:text-gray-100 text-base font-medium">Years Farming</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : (
        <p className="text-center text-gray-500">Please log in to view your profile.</p>
      )}

      <AnimatePresence>
        {isEditing && userProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-2xl mx-auto rounded-3xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-[#101624]/95 backdrop-blur-2xl shadow-2xl overflow-hidden group p-0"
              style={{ boxShadow: '0 8px 64px 0 rgba(16,185,129,0.18)' }}
            >
              {/* Shine effect */}
              <div className="absolute left-[-60%] top-0 w-2/3 h-full bg-gradient-to-r from-white/60 via-white/10 to-transparent opacity-30 blur-xl animate-shine pointer-events-none z-10" />
              {/* Floating Sprout icon */}
              <motion.span
                className="inline-flex items-center justify-center rounded-full bg-white/40 dark:bg-black/40 shadow-lg shadow-emerald-400/20 w-16 h-16 absolute top-4 left-1/2 -translate-x-1/2 z-20 border-2 border-emerald-400/40 backdrop-blur-xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
              >
                <Sprout className="w-8 h-8 text-emerald-400 drop-shadow-lg" />
              </motion.span>
              <div className="flex flex-col md:flex-row w-full pt-20 md:pt-24">
                {/* Form left */}
                <div className="flex-1 p-8 md:p-12">
                  <h3 className="text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-200 mb-8 text-center md:text-left mt-8 md:mt-0">Update Profile</h3>
                  <form onSubmit={handleSubmit(handleProfileUpdate)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                      <label className="block text-gray-700 dark:text-gray-200 text-base mb-2">Name</label>
                      <div className="relative">
                        <motion.input
                          {...register('name', { required: 'Name is required' })}
                          defaultValue={profileData.name}
                          className="w-full bg-white/80 dark:bg-black/60 text-gray-900 dark:text-white p-4 pl-12 rounded-xl border border-white/30 dark:border-white/10 focus:border-emerald-400 focus:outline-none transition-all text-base shadow-sm focus:shadow-emerald-400/20"
                          placeholder="e.g., Farmer Guna"
                          whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #34d399' }}
                        />
                        <Tractor className="absolute left-4 top-4 w-5 h-5 text-emerald-400" />
                      </div>
                      {errors.name && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-2">{errors.name.message}</motion.p>}
                    </div>
                    <div className="col-span-1">
                      <label className="block text-gray-700 dark:text-gray-200 text-base mb-2">Farm Location</label>
                      <div className="relative">
                        <motion.input
                          {...register('farmLocation', { required: 'Farm location is required' })}
                          defaultValue={profileData.farmLocation}
                          className="w-full bg-white/80 dark:bg-black/60 text-gray-900 dark:text-white p-4 pl-12 rounded-xl border border-white/30 dark:border-white/10 focus:border-emerald-400 focus:outline-none transition-all text-base shadow-sm focus:shadow-emerald-400/20"
                          placeholder="e.g., Guntur, Andhra Pradesh"
                          whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #34d399' }}
                        />
                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-emerald-400" />
                      </div>
                      {errors.farmLocation && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-2">{errors.farmLocation.message}</motion.p>}
                    </div>
                    <div className="col-span-1">
                      <label className="block text-gray-700 dark:text-gray-200 text-base mb-2">Crops Grown</label>
                      <div className="relative">
                        <motion.input
                          {...register('crops', { required: 'Crops are required' })}
                          defaultValue={profileData.crops.join(', ')}
                          className="w-full bg-white/80 dark:bg-black/60 text-gray-900 dark:text-white p-4 pl-12 rounded-xl border border-white/30 dark:border-white/10 focus:border-emerald-400 focus:outline-none transition-all text-base shadow-sm focus:shadow-emerald-400/20"
                          placeholder="e.g., Rice, Chillies, Groundnuts"
                          whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #34d399' }}
                        />
                        <Sprout className="absolute left-4 top-4 w-5 h-5 text-emerald-400" />
                      </div>
                      {errors.crops && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-2">{errors.crops.message}</motion.p>}
                    </div>
                    <div className="col-span-1">
                      <label className="block text-gray-700 dark:text-gray-200 text-base mb-2">Contact</label>
                      <div className="relative">
                        <motion.input
                          {...register('contact', { 
                            required: 'Contact is required',
                            pattern: {
                              value: /^\+?[1-9]\d{9,14}$/,
                              message: 'Enter a valid phone number (e.g., +911234567890)'
                            }
                          })}
                          defaultValue={profileData.contact}
                          className="w-full bg-white/80 dark:bg-black/60 text-gray-900 dark:text-white p-4 pl-12 rounded-xl border border-white/30 dark:border-white/10 focus:border-emerald-400 focus:outline-none transition-all text-base shadow-sm focus:shadow-emerald-400/20"
                          placeholder="e.g., +91-123-456-7890"
                          whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #34d399' }}
                        />
                        <Phone className="absolute left-4 top-4 w-5 h-5 text-emerald-400" />
                      </div>
                      {errors.contact && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-2">{errors.contact.message}</motion.p>}
                    </div>
                    <div className="col-span-1">
                      <label className="block text-gray-700 dark:text-gray-200 text-base mb-2">Farm Size</label>
                      <div className="relative">
                        <motion.input
                          {...register('farmSize', { 
                            required: 'Farm size is required',
                            pattern: {
                              value: /^\d+\s*(acres|hectares)$/i,
                              message: 'Enter size in acres or hectares (e.g., 5 acres)'
                            }
                          })}
                          defaultValue={profileData.farmSize}
                          className="w-full bg-white/80 dark:bg-black/60 text-gray-900 dark:text-white p-4 pl-12 rounded-xl border border-white/30 dark:border-white/10 focus:border-emerald-400 focus:outline-none transition-all text-base shadow-sm focus:shadow-emerald-400/20"
                          placeholder="e.g., 5 acres"
                          whileFocus={{ scale: 1.03, boxShadow: '0 0 0 2px #34d399' }}
                        />
                        <Wheat className="absolute left-4 top-4 w-5 h-5 text-emerald-400" />
                      </div>
                      {errors.farmSize && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-2">{errors.farmSize.message}</motion.p>}
                    </div>
                    {/* Buttons full width on mobile, right on desktop */}
                    <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4 mt-4 md:justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 24px #34d399' }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-emerald-400/20 text-base"
                      >
                        Save Profile
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="w-full md:w-auto bg-black/60 dark:bg-white/10 text-white dark:text-gray-200 px-8 py-3 rounded-xl font-bold transition-all duration-300 text-base border border-white/20"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </div>
                {/* Optionally, right side illustration or info */}
                <div className="hidden md:flex flex-col items-center justify-center w-64 p-8">
                  {/* You can add a farm illustration, quote, or info here for extra polish */}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Profile;