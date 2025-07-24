import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Thermometer, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

function CropRecommendation() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const apiData = {
        State_Name: data.State_Name,
        District_Name: data.District_Name.toUpperCase(),
        Crop_Year: parseInt(data.Crop_Year),
        Season: data.Season,
        Crop: data.Crop,
        Area: parseFloat(data.Area)
      };
      // Simulate API call since we don't have the actual backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      setRecommendation({
        production: Math.random() * 5000 + 1000, // Random production value for demo
        ...apiData
      });
      reset();
    } catch (error) {
      setRecommendation({
        production: 'Error',
        error: 'Prediction failed. Check inputs or server.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8 flex flex-col items-center bg-transparent">
      {/* Hero Section - OUTSIDE the card */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-2">
          <motion.span
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-yellow-400 shadow-lg shadow-emerald-400/20 w-14 h-14 cursor-pointer relative group"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 1], opacity: 1, rotate: [0, 8, -8, 0] }}
            transition={{ duration: 1, type: 'spring', bounce: 0.4, repeat: Infinity, repeatType: 'reverse', repeatDelay: 2 }}
            whileHover={{ scale: 1.18, boxShadow: '0 0 32px #a78bfa', filter: 'brightness(1.2)' }}
            onMouseEnter={() => {
              // Particle burst effect (optional, can be implemented with a library or custom code)
            }}
          >
            <motion.span
              className="absolute inset-0 rounded-full blur-2xl opacity-70 group-hover:opacity-100"
              style={{ background: 'radial-gradient(circle, #fbbf24 0%, #34d399 60%, transparent 100%)' }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
            <Sparkles className="w-8 h-8 text-white drop-shadow-md animate-pulse relative z-10" />
          </motion.span>
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-yellow-400 drop-shadow-lg flex items-center">
            AI Crop Production Predictor
          </h2>
        </div>
        <div className="flex justify-center">
          <span className="block h-1 w-32 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-yellow-400 animate-gradient-x" />
        </div>
        <p className="text-xl text-gray-700 dark:text-gray-200 max-w-xl mx-auto mt-4 font-medium">
          Empowering Andhra Pradesh farmers with precise, AI-driven crop production predictions.
        </p>
      </div>
      {/* Main Card - only the form inside */}
      <motion.div
        className={`w-full max-w-6xl transition-all duration-300 ${scrolled ? 'scale-95 shadow-2xl shadow-emerald-400/30 border-emerald-400/60' : 'scale-100 shadow-xl border-white/20 dark:border-white/10'}`}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <div className="relative rounded-3xl border p-0 overflow-hidden bg-white/80 dark:bg-[#101624]/90 backdrop-blur-2xl group transition-all duration-500">
          {/* Glassy white shine effect */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute left-[-60%] top-0 w-2/3 h-full bg-gradient-to-r from-white/60 via-white/10 to-transparent opacity-30 blur-xl animate-shine" />
          </div>
          {/* Form Box - glassy inside */}
          <div className="w-full max-w-3xl mx-auto p-10 rounded-2xl relative z-20">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Side */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300 flex items-center">
                    <MapPin className="w-7 h-7 mr-2 text-emerald-400" />
                    Location & Crop Details
                  </h3>
                  {/* State Name */}
                  <div className="relative">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">State Name</label>
                    <motion.input
                      {...register('State_Name', { required: 'State Name is required' })}
                      className={`w-full bg-white/70 dark:bg-gray-900/70 text-gray-800 dark:text-white p-4 pl-12 rounded-lg border transition-all focus:outline-none focus:ring-2 text-lg font-medium ${
                        errors.State_Name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-400'
                      }`}
                      placeholder="e.g., Andhra Pradesh"
                      whileFocus={{ scale: 1.04, boxShadow: '0 0 0 2px #34d399' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                    <MapPin className="absolute left-4 top-12 w-5 h-5 text-gray-400" />
                    {errors.State_Name && (
                      <motion.p
                        className="text-red-400 text-sm mt-1 flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.State_Name.message}
                      </motion.p>
                    )}
                  </div>
                  {/* District Name */}
                  <div className="relative">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">District Name</label>
                    <motion.input
                      {...register('District_Name', { required: 'District Name is required' })}
                      className={`w-full bg-white/70 dark:bg-gray-900/70 text-gray-800 dark:text-white p-4 pl-12 rounded-lg border transition-all focus:outline-none focus:ring-2 text-lg font-medium ${
                        errors.District_Name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-400'
                      }`}
                      placeholder="e.g., Anantapur"
                      whileFocus={{ scale: 1.04, boxShadow: '0 0 0 2px #34d399' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                    <MapPin className="absolute left-4 top-12 w-5 h-5 text-gray-400" />
                    {errors.District_Name && (
                      <motion.p
                        className="text-red-400 text-sm mt-1 flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.District_Name.message}
                      </motion.p>
                    )}
                  </div>
                </div>
                {/* Right Side */}
                <div className="space-y-8">
                  <h3 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300 flex items-center">
                    <Thermometer className="w-7 h-7 mr-2 text-emerald-400" />
                    Crop Parameters
                  </h3>
                  {/* Crop Year */}
                  <div className="relative">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Crop Year</label>
                    <motion.input
                      {...register('Crop_Year', {
                        required: 'Crop Year is required',
                        min: { value: 2000, message: 'Year must be >= 2000' },
                        max: { value: 2100, message: 'Year must be <= 2100' }
                      })}
                      type="number"
                      className={`w-full bg-white/70 dark:bg-gray-900/70 text-gray-800 dark:text-white p-4 pl-12 rounded-lg border transition-all focus:outline-none focus:ring-2 text-lg font-medium ${
                        errors.Crop_Year ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-400'
                      }`}
                      placeholder="e.g., 2022"
                      whileFocus={{ scale: 1.04, boxShadow: '0 0 0 2px #34d399' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                    <Thermometer className="absolute left-4 top-12 w-5 h-5 text-gray-400" />
                    {errors.Crop_Year && (
                      <motion.p
                        className="text-red-400 text-sm mt-1 flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.Crop_Year.message}
                      </motion.p>
                    )}
                  </div>
                  {/* Season */}
                  <div className="relative">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Season</label>
                    <motion.input
                      {...register('Season', { required: 'Season is required' })}
                      className={`w-full bg-white/70 dark:bg-gray-900/70 text-gray-800 dark:text-white p-4 pl-12 rounded-lg border transition-all focus:outline-none focus:ring-2 text-lg font-medium ${
                        errors.Season ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-400'
                      }`}
                      placeholder="e.g., Kharif"
                      whileFocus={{ scale: 1.04, boxShadow: '0 0 0 2px #34d399' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                    <Thermometer className="absolute left-4 top-12 w-5 h-5 text-gray-400" />
                    {errors.Season && (
                      <motion.p
                        className="text-red-400 text-sm mt-1 flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.Season.message}
                      </motion.p>
                    )}
                  </div>
                  {/* Crop */}
                  <div className="relative">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Crop</label>
                    <motion.input
                      {...register('Crop', { required: 'Crop is required' })}
                      className={`w-full bg-white/70 dark:bg-gray-900/70 text-gray-800 dark:text-white p-4 pl-12 rounded-lg border transition-all focus:outline-none focus:ring-2 text-lg font-medium ${
                        errors.Crop ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-400'
                      }`}
                      placeholder="e.g., Rice"
                      whileFocus={{ scale: 1.04, boxShadow: '0 0 0 2px #34d399' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                    <Thermometer className="absolute left-4 top-12 w-5 h-5 text-gray-400" />
                    {errors.Crop && (
                      <motion.p
                        className="text-red-400 text-sm mt-1 flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.Crop.message}
                      </motion.p>
                    )}
                  </div>
                  {/* Area */}
                  <div className="relative">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Area (in hectares)</label>
                    <motion.input
                      {...register('Area', {
                        required: 'Area is required',
                        min: { value: 0.1, message: 'Area must be positive' }
                      })}
                      type="number"
                      step="0.01"
                      className={`w-full bg-white/70 dark:bg-gray-900/70 text-gray-800 dark:text-white p-4 pl-12 rounded-lg border transition-all focus:outline-none focus:ring-2 text-lg font-medium ${
                        errors.Area ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-400'
                      }`}
                      placeholder="e.g., 1000"
                      whileFocus={{ scale: 1.04, boxShadow: '0 0 0 2px #34d399' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                    <Thermometer className="absolute left-4 top-12 w-5 h-5 text-gray-400" />
                    {errors.Area && (
                      <motion.p
                        className="text-red-400 text-sm mt-1 flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.Area.message}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>
              {/* Submit button */}
              <div className="text-center pt-4">
                <motion.button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting || isLoading}
                  className={`bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-12 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg shadow-emerald-600/40 ${
                    isSubmitting || isLoading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105 hover:shadow-emerald-600/60 hover:from-emerald-500 hover:to-teal-500'
                  }`}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  animate={{ boxShadow: isSubmitting || isLoading ? '0 0 0 0 #34d399' : '0 4px 32px 0 #34d39944' }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    'Get Production Prediction'
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
      {/* Prediction Result Card - OUTSIDE the main card */}
      {recommendation && (
        <div className="w-full max-w-4xl mt-12 animate-fadeIn">
          <div className="relative rounded-2xl shadow-2xl p-10 mx-auto bg-white/80 dark:bg-[#101624]/90 backdrop-blur-2xl border border-white/20 dark:border-white/10 overflow-hidden group">
            {/* Glassy white shine effect */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute left-[-60%] top-0 w-2/3 h-full bg-gradient-to-r from-white/60 via-white/10 to-transparent opacity-30 blur-xl animate-shine" />
            </div>
            <h3 className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mb-6 flex items-center justify-center">
              <Sparkles className="w-7 h-7 mr-2 text-emerald-400 animate-pulse" />
              Prediction Result
            </h3>
            <div className="flex items-center justify-between mb-6">
              <span className="text-4xl font-extrabold text-gray-800 dark:text-white">
                {recommendation.production === 'Error' ? 'Error' : recommendation.production.toFixed(2)}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-2xl">
                {recommendation.production === 'Error' ? '' : 'tonnes'}
              </span>
            </div>
            {recommendation.error && (
              <p className="text-red-500 dark:text-red-400 text-lg mb-4 text-center">{recommendation.error}</p>
            )}
            <div className="grid grid-cols-2 gap-4 text-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">State:</span> {recommendation.State_Name}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">District:</span> {recommendation.District_Name}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Year:</span> {recommendation.Crop_Year}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Season:</span> {recommendation.Season}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Crop:</span> {recommendation.Crop}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Area:</span> {recommendation.Area} hectares
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CropRecommendation;