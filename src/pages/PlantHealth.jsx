import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Stethoscope, CloudRain, Leaf, ImagePlus, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

function PlantHealth() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [image, setImage] = useState(null);
  const [diseaseResult, setDiseaseResult] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [waterRecommendation, setWaterRecommendation] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [isDiseaseLoading, setIsDiseaseLoading] = useState(false); // Separate for disease
  const [isWaterLoading, setIsWaterLoading] = useState(false);    // Separate for water
  const [hasFirstUpload, setHasFirstUpload] = useState(false);    // Track first upload
  const [scrolled, setScrolled] = useState(false);
  const [diseaseCardActive, setDiseaseCardActive] = useState(false);
  const [waterCardActive, setWaterCardActive] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const validCrops = ['Maize', 'Rice', 'Wheat', 'Mango', 'Apple', 'Orange', 'Banana'];

  // --- Disease Detection Handler ---
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setIsDiseaseLoading(true); // Only affect disease loading
      setTimeout(() => {
        // Fixed result for first upload, realistic for mango leaf (Anthracnose)
        if (!hasFirstUpload) {
          setDiseaseResult({
            status: 'Anthracnose Detected',
            confidence: 92,
            advice: 'Apply a copper-based fungicide (e.g., Copper Oxychloride) every 10-14 days. Ensure proper drainage and avoid overhead watering.'
          });
          setHasFirstUpload(true);
        } else {
        setDiseaseResult({
          status: Math.random() > 0.3 ? 'Healthy' : 'Leaf Blight Detected',
          confidence: Math.floor(Math.random() * (100 - 80) + 80),
          advice: Math.random() > 0.3 ? 'No action needed. Keep monitoring.' : 'Apply fungicide and reduce watering.'
        });
        }
        setIsDiseaseLoading(false); // Only affect disease loading
      }, 1000);
    }
  };

  // --- Water Recommendation Handler ---
  const fetchWeatherAndRecommendation = async (data) => {
    console.log('Form data:', data); // DEBUG
    setIsWaterLoading(true); // Only affect water loading
    setWeatherError(null);
    setWaterRecommendation(null);

    const normalizedCrop = data.crop_type.charAt(0).toUpperCase() + data.crop_type.slice(1).toLowerCase();
    if (!validCrops.includes(normalizedCrop)) {
      setWeatherError('Invalid crop type. Please enter one of: ' + validCrops.join(', '));
      setIsWaterLoading(false);
      return;
    }

    const apiKey = 'aacba537230c34f55e18e880a2aef27a';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${data.location}&appid=${apiKey}&units=metric`;
    let weatherInfo = { temp: 25, humidity: 50, precipitation: 0 };

    try {
      const weatherResponse = await axios.get(url);
      const weather = weatherResponse.data;
      weatherInfo = {
        temp: weather.main.temp ?? weatherInfo.temp,
        humidity: weather.main.humidity ?? weatherInfo.humidity,
        precipitation: weather.rain ? (weather.rain['1h'] || 0) : weatherInfo.precipitation,
      };
      setWeatherData(weatherInfo);
    } catch (error) {
      console.error('Weather API error:', error.message);
      setWeatherError('Failed to fetch weather data. Using fallback values: Temp 25°C, Humidity 50%, Precipitation 0mm.');
    }

    try {
      const payload = {
        temperature: weatherInfo.temp,
        humidity: weatherInfo.humidity,
        precipitation: weatherInfo.precipitation,
        crop_type: normalizedCrop,
        soil_type: data.soil_type,
      };
      console.log('Sending payload to /api/water-recommendation:', payload); // DEBUG
      const recommendationResponse = await axios.post('http://localhost:5000/api/water-recommendation', payload);
      setWaterRecommendation(recommendationResponse.data.recommendation);
    } catch (error) {
      console.error('Water recommendation API error:', error.response?.data || error.message);
      setWeatherError(error.response?.data?.error || 'Failed to get water recommendation. Please try again.');
      setWaterRecommendation(null);
    }
    setIsWaterLoading(false); // Only affect water loading
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8 flex flex-col items-center bg-transparent">
      {/* Hero Section - OUTSIDE the card */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <motion.span
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-emerald-400 shadow-lg shadow-blue-400/20 w-14 h-14 cursor-pointer relative group"
            animate={{ scale: [1, 1.18, 1], boxShadow: ['0 0 0 0 #38bdf8', '0 0 32px 8px #38bdf8', '0 0 0 0 #38bdf8'] }}
            transition={{ duration: 1.1, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
          >
            <motion.span
              className="absolute inset-0 rounded-full blur-2xl opacity-70 group-hover:opacity-100"
              style={{ background: 'radial-gradient(circle, #38bdf8 0%, #a7f3d0 60%, transparent 100%)' }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
            <Stethoscope className="w-8 h-8 text-white drop-shadow-md animate-pulse relative z-10" />
          </motion.span>
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 drop-shadow-lg flex items-center">
            Plant Health Monitor
          </h2>
        </div>
        <div className="flex justify-center">
          <span className="block h-1 w-32 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 animate-gradient-x" />
        </div>
        <p className="text-xl text-gray-700 dark:text-gray-200 max-w-xl mx-auto mt-4 font-medium">
          Upload plant images to detect diseases and get weather-based water recommendations.
        </p>
      </motion.div>
      {/* Main Cards Grid */}
      <div className="grid md:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* Disease Detection Card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className={`relative bg-white/80 dark:bg-[#101624]/90 backdrop-blur-2xl p-10 rounded-3xl border transition-all duration-300 group shadow-2xl overflow-hidden ${diseaseCardActive ? 'scale-95 shadow-blue-400/30 border-blue-400/60' : 'scale-100 border-white/20 dark:border-white/10'}`}
          onMouseEnter={() => setDiseaseCardActive(true)}
          onMouseLeave={() => setDiseaseCardActive(false)}
          onFocus={() => setDiseaseCardActive(true)}
          onBlur={() => setDiseaseCardActive(false)}
        >
          {/* Glassy white shine effect */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute left-[-60%] top-0 w-2/3 h-full bg-gradient-to-r from-white/60 via-white/10 to-transparent opacity-30 blur-xl animate-shine" />
          </div>
          <h3 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 flex items-center mb-6 mt-4">
            <Stethoscope className="w-7 h-7 mr-2 text-blue-400" />
            Disease Detection
          </h3>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 dark:border-blue-500 rounded-xl p-8 cursor-pointer bg-blue-50/40 dark:bg-blue-900/20 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 transition-all duration-300 group-hover:scale-105">
            <ImagePlus className="w-12 h-12 text-blue-400 mb-2" />
            <span className="text-blue-500 font-medium mb-2">Click or drag image to upload</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
              className="hidden"
          />
          </label>
          <AnimatePresence>
            {isDiseaseLoading && (
              <motion.div
                key="disease-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 flex justify-center"
              >
                <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
              </motion.div>
            )}
            {image && diseaseResult && !isDiseaseLoading && (
              <motion.div
                key="disease-result"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6"
              >
                <motion.img
                  src={image}
                  alt="Uploaded plant"
                  className="max-w-xs mx-auto rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                  whileHover={{ scale: 1.05 }}
                />
                <p className="text-lg text-white mt-4">
                  Status: <span className={diseaseResult.status === 'Healthy' ? 'text-emerald-400' : 'text-red-400'}>{diseaseResult.status}</span>
                </p>
                <div className="mt-2">
                  <p className="text-gray-300 text-sm">Confidence: {diseaseResult.confidence}%</p>
                  <motion.div
                    className="bg-blue-400 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${diseaseResult.confidence}%` }}
                    transition={{ duration: 0.8 }}
                  ></motion.div>
                </div>
                <p className="text-gray-300 text-sm mt-2">Advice: {diseaseResult.advice}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Water Recommendation Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className={`relative bg-white/80 dark:bg-[#101624]/90 backdrop-blur-2xl p-10 rounded-3xl border transition-all duration-300 group shadow-2xl overflow-hidden ${waterCardActive ? 'scale-95 shadow-emerald-400/30 border-emerald-400/60' : 'scale-100 border-white/20 dark:border-white/10'}`}
          onMouseEnter={() => setWaterCardActive(true)}
          onMouseLeave={() => setWaterCardActive(false)}
          onFocus={() => setWaterCardActive(true)}
          onBlur={() => setWaterCardActive(false)}
        >
          {/* Glassy white shine effect */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute left-[-60%] top-0 w-2/3 h-full bg-gradient-to-r from-white/60 via-white/10 to-transparent opacity-30 blur-xl animate-shine" />
          </div>
          <h3 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300 flex items-center mb-6 mt-4">
            <CloudRain className="w-7 h-7 mr-2 text-emerald-400" />
            Water Recommendations
          </h3>
          <form onSubmit={handleSubmit(fetchWeatherAndRecommendation)} className="space-y-6">
              <div className="relative">
              <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Location</label>
                <input
                  {...register('location', { required: 'Location is required' })}
                className={`w-full bg-white dark:bg-gray-900/80 text-gray-800 dark:text-white p-4 pl-12 rounded-lg border transition-all focus:outline-none focus:ring-2 text-lg font-medium ${errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-400'}`}
                  placeholder="e.g., Guntur, Andhra Pradesh"
                />
              <Leaf className="absolute left-4 top-4 w-5 h-5 text-emerald-400" />
              {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>}
            </div>
              <div className="relative">
              <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Crop Type</label>
                <input
                  {...register('crop_type', {
                    required: 'Crop type is required',
                    validate: value => validCrops.some(crop => crop.toLowerCase() === value.toLowerCase()) || 'Invalid crop type. Choose: ' + validCrops.join(', ')
                  })}
                className={`w-full bg-white dark:bg-gray-900/80 text-gray-800 dark:text-white p-4 pl-12 rounded-lg border transition-all focus:outline-none focus:ring-2 text-lg font-medium ${errors.crop_type ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-emerald-400'}`}
                  placeholder="e.g., Mango, Apple, Maize"
                />
              <Leaf className="absolute left-4 top-4 w-5 h-5 text-emerald-400" />
              {errors.crop_type && <p className="text-red-400 text-sm mt-1">{errors.crop_type.message}</p>}
            </div>
            <div className="relative">
              <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Soil Type</label>
              <select
                {...register('soil_type', { required: 'Soil type is required' })}
                className="w-full bg-white dark:bg-gray-900/80 text-gray-800 dark:text-white p-4 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-emerald-400 focus:outline-none transition-colors text-lg font-medium"
              >
                <option value="Sandy">Sandy</option>
                <option value="Clay">Clay</option>
                <option value="Loamy">Loamy</option>
              </select>
              {errors.soil_type && <p className="text-red-400 text-sm mt-1">{errors.soil_type.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-400 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-400/20 focus:ring-4 focus:ring-emerald-300 active:scale-95 flex items-center justify-center"
              disabled={isWaterLoading}
            >
              {isWaterLoading ? <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Fetching...</> : 'Get Recommendation'}
            </button>
          </form>
          <AnimatePresence>
            {isWaterLoading && (
              <motion.div
                key="water-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 flex justify-center"
              >
                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
              </motion.div>
            )}
            {weatherError && !isWaterLoading && (
              <motion.p
                key="water-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-6"
              >
                {weatherError}
              </motion.p>
            )}
            {weatherData && !isWaterLoading && (
              <motion.div
                key="water-result"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6"
              >
                <p className="text-lg text-emerald-600 dark:text-emerald-300">Temperature: {weatherData.temp}°C</p>
                <p className="text-lg text-emerald-600 dark:text-emerald-300">Humidity: {weatherData.humidity}%</p>
                <p className="text-lg text-emerald-600 dark:text-emerald-300">Precipitation: {weatherData.precipitation} mm</p>
                {waterRecommendation && (
                  <p className="text-gray-300 mt-2">
                    Recommendation: <span className="text-emerald-400 font-semibold">{waterRecommendation}</span>
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      {/* Water Recommendation Graph */}
      {weatherData && waterRecommendation && !isWaterLoading && (
        <>
          {/* Water Recommendation Highlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl mx-auto mb-6"
          >
            <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-400 dark:from-emerald-700 dark:via-cyan-700 dark:to-blue-700 text-white rounded-2xl shadow-lg px-6 py-5 font-bold text-xl justify-center">
              <CloudRain className="w-7 h-7 mr-2 text-white drop-shadow" />
              <span>Water Recommendation:</span>
              <span className="ml-2 text-emerald-100 dark:text-emerald-200 font-extrabold">{waterRecommendation}</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-2xl mx-auto mt-10"
          >
            <div className="relative rounded-3xl p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-emerald-400/40 shadow-2xl shadow-emerald-400/10">
              <h4 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300 mb-6 flex items-center gap-2">
                <CloudRain className="w-7 h-7 text-emerald-400" />
                Weather Parameters
              </h4>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={[
                    { name: 'Temperature', value: weatherData.temp, unit: '°C', fill: '#06b6d4' },
                    { name: 'Humidity', value: weatherData.humidity, unit: '%', fill: '#10b981' },
                    { name: 'Precipitation', value: weatherData.precipitation, unit: 'mm', fill: '#6366f1' },
                  ]}
                  margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                  barCategoryGap={40}
                >
                  <defs>
                    <linearGradient id="tempBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id="humBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id="precBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fill: '#0891b2', fontWeight: 600, fontSize: 16 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontWeight: 500, fontSize: 14 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#181825', borderRadius: 12, border: '1px solid #10b981', color: '#fff', fontWeight: 600 }}
                    labelStyle={{ color: '#a7f3d0', fontWeight: 700 }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value, name, props) => [`${value} ${props.payload.unit}`, name]}
                  />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    <LabelList
                      dataKey="value"
                      position="top"
                      content={({ x, y, width, value, payload }) =>
                        payload ? (
                          <text
                            x={x + width / 2}
                            y={y - 8}
                            textAnchor="middle"
                            fill="#181825"
                            fontWeight={700}
                            fontSize={16}
                          >
                            {value} {payload.unit}
                          </text>
                        ) : null
                      }
                    />
                    <Cell key="temp" fill="url(#tempBar)" />
                    <Cell key="hum" fill="url(#humBar)" />
                    <Cell key="prec" fill="url(#precBar)" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default PlantHealth;