import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Warehouse, Star, MapPin, Phone } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, Legend } from 'recharts';

// Realistic AP cold storage providers, grouped by city
const storageByCity = [
  {
    city: 'Guntur',
    storages: [
      { name: 'Guntur Agri Storage', capacity: '1000 MT', contact: '91234 56789', location: 'Guntur, AP', details: 'Modern facility with climate control for grains.', featured: true },
      { name: 'Sri Venkateswara Cold Storage', capacity: '850 MT', contact: '98456 12345', location: 'Guntur, AP', details: '24/7 security, pest control, near Guntur market.' },
    ]
  },
  {
    city: 'Vijayawada',
    storages: [
      { name: 'Vijayawada Mega Storage', capacity: '2000 MT', contact: '94567 89012', location: 'Vijayawada, AP', details: 'Large facility with climate control and easy rail access.', featured: true },
      { name: 'Krishna Cold Storage', capacity: '1200 MT', contact: '98765 43210', location: 'Vijayawada, AP', details: 'Affordable, solar powered, near NH16.' },
    ]
  },
  {
    city: 'Nellore',
    storages: [
      { name: 'Nellore Fresh Storage', capacity: '950 MT', contact: '95678 90123', location: 'Nellore, AP', details: 'Cold storage for fruits and vegetables. Solar powered.' },
      { name: 'Sri Sai Cold Storage', capacity: '1100 MT', contact: '99887 66554', location: 'Nellore, AP', details: 'Humidity control, near Nellore agri market.' },
    ]
  },
  {
    city: 'Kurnool',
    storages: [
      { name: 'Kurnool Grain Vault', capacity: '1500 MT', contact: '97890 12345', location: 'Kurnool, AP', details: 'High-capacity grain storage with automated monitoring.' },
      { name: 'Rayalaseema Cold Storage', capacity: '900 MT', contact: '91234 55667', location: 'Kurnool, AP', details: 'Affordable, 24/7 access, near highway.' },
    ]
  },
  {
    city: 'Rajahmundry',
    storages: [
      { name: 'Rajahmundry Riverfront Storage', capacity: '1100 MT', contact: '96789 01234', location: 'Rajahmundry, AP', details: 'Modern storage near Godavari river. Flood protected.' },
      { name: 'East Godavari Cold Storage', capacity: '1000 MT', contact: '93456 77889', location: 'Rajahmundry, AP', details: 'Climate controlled, near Rajahmundry market.' },
    ]
  },
  {
    city: 'Visakhapatnam',
    storages: [
      { name: 'Vizag Port Storage', capacity: '1800 MT', contact: '98901 23456', location: 'Visakhapatnam, AP', details: 'Port-adjacent, ideal for export crops. CCTV monitored.', featured: true },
      { name: 'Coastal Cold Storage', capacity: '950 MT', contact: '90012 34567', location: 'Visakhapatnam, AP', details: 'Near port, humidity control, 24/7 access.' },
    ]
  },
];

// Flatten all storages into a single array for easy searching
const allStorages = storageByCity.flatMap(cityObj => cityObj.storages);

// All crop trends are increasing
const mockCropData = {
  Rice: [
    { day: 'Day 1', price: 2150, volume: 120 },
    { day: 'Day 10', price: 2200, volume: 140 },
    { day: 'Day 20', price: 2250, volume: 135 },
    { day: 'Day 30', price: 2280, volume: 150 },
  ],
  Chillies: [
    { day: 'Day 1', price: 7800, volume: 80 },
    { day: 'Day 10', price: 7900, volume: 90 },
    { day: 'Day 20', price: 8000, volume: 95 },
    { day: 'Day 30', price: 8100, volume: 100 },
  ],
  Maize: [
    { day: 'Day 1', price: 2100, volume: 110 },
    { day: 'Day 10', price: 2150, volume: 120 },
    { day: 'Day 20', price: 2175, volume: 125 },
    { day: 'Day 30', price: 2200, volume: 130 },
  ],
  Cotton: [
    { day: 'Day 1', price: 7000, volume: 60 },
    { day: 'Day 10', price: 7100, volume: 65 },
    { day: 'Day 20', price: 7150, volume: 70 },
    { day: 'Day 30', price: 7200, volume: 75 },
  ],
  Turmeric: [
    { day: 'Day 1', price: 15500, volume: 40 },
    { day: 'Day 10', price: 15750, volume: 45 },
    { day: 'Day 20', price: 15900, volume: 50 },
    { day: 'Day 30', price: 16000, volume: 55 },
  ],
};

function MarketTrends() {
  const [selectedCrop, setSelectedCrop] = useState('Rice');
  const [modalOpen, setModalOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cropData, setCropData] = useState([]);
  const [todayPrice, setTodayPrice] = useState(null);
  const [trend, setTrend] = useState('Increasing');
  const [filteredStorages, setFilteredStorages] = useState([allStorages[0]]);

  useEffect(() => {
    const data = mockCropData[selectedCrop] || [];
    setCropData(data);
    setTodayPrice(data.length > 0 ? data[data.length - 1].price : null);
  }, [selectedCrop]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredStorages([allStorages[0]]);
      return;
    }
    const filtered = allStorages.filter(
      s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           s.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStorages(filtered);
  }, [searchTerm]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8 flex flex-col items-center bg-transparent">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <motion.span
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400 via-cyan-400 to-emerald-400 shadow-lg shadow-purple-400/20 w-14 h-14 cursor-pointer relative group"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.12, 0.96, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
          >
            <TrendingUp className="w-8 h-8 text-white drop-shadow-md relative z-10" />
          </motion.span>
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 drop-shadow-lg flex items-center">
            Market Trends & Storage
        </h2>
        </div>
        <div className="flex justify-center">
          <span className="block h-1 w-32 rounded-full bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 animate-gradient-x" />
        </div>
        <p className="text-xl text-gray-700 dark:text-gray-200 max-w-xl mx-auto mt-4 font-medium">
          Live crop prices and the best cold storage options across Andhra Pradesh.
        </p>
      </motion.div>

      {/* Crop Price Card */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl p-10 rounded-3xl border border-purple-400/40 hover:border-purple-500/70 shadow-2xl shadow-purple-400/10 transition-all duration-300 group mb-10 w-full max-w-4xl"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 rounded-t-3xl" />
        <h3 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 flex items-center mb-6 mt-4">
          <TrendingUp className="w-7 h-7 mr-2 text-purple-400" />
          Crop Price Trends
        </h3>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-lg mb-2 font-semibold">Select Crop</label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full bg-white dark:bg-gray-900/80 text-gray-800 dark:text-white p-4 rounded-lg border transition-all focus:outline-none focus:ring-2 text-lg font-medium border-gray-200 dark:border-gray-700 focus:ring-purple-400"
          >
            {Object.keys(mockCropData).map((crop) => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
        </div>
        {todayPrice && (
          <div className="flex items-center gap-6 mb-4">
            <span className="text-3xl font-bold text-purple-500">₹{todayPrice}</span>
            <span className="text-lg font-semibold text-emerald-500 flex items-center gap-2">
              Increasing
              <TrendingUp className="w-5 h-5 text-emerald-500 animate-bounce" />
            </span>
          </div>
        )}
        <motion.div
          key={selectedCrop}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-96"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cropData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" opacity={0.3} />
              <XAxis dataKey="day" tick={{ fill: '#a78bfa', fontWeight: 600, fontSize: 16 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#6366f1', fontWeight: 500, fontSize: 14 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#06b6d4', fontWeight: 500, fontSize: 14 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#181825', borderRadius: 12, border: '1px solid #a78bfa', color: '#fff', fontWeight: 600 }}
                labelStyle={{ color: '#a7f3d0', fontWeight: 700 }}
                itemStyle={{ color: '#fff' }}
                formatter={(value, name) => name === 'price' ? [`₹${value}`, 'Price'] : [value, 'Volume']}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="price"
                stroke="#a78bfa"
                fillOpacity={1}
                fill="url(#priceGradient)"
                strokeWidth={4}
                dot={{ fill: '#a78bfa', r: 6 }}
                activeDot={{ r: 10, fill: '#a78bfa', stroke: '#fff', strokeWidth: 2 }}
              />
              <Bar
                yAxisId="right"
                dataKey="volume"
                barSize={24}
                fill="url(#volumeGradient)"
                radius={[8, 8, 0, 0]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#a78bfa', fontWeight: 700 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* Storage Solutions Card */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl p-10 rounded-3xl border border-emerald-400/40 hover:border-emerald-500/70 shadow-2xl shadow-emerald-400/10 transition-all duration-300 group w-full max-w-4xl"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 rounded-t-3xl" />
        <h3 className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300 flex items-center mb-6 mt-4">
          <Warehouse className="w-7 h-7 mr-2 text-emerald-400" />
          Storage Solutions (AP)
        </h3>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search storage providers (e.g., FarmSafe, Tenali, Nellore)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-gray-900/80 text-gray-800 dark:text-white p-4 pl-12 rounded-lg border transition-all focus:outline-none focus:ring-2 text-lg font-medium border-gray-200 dark:border-gray-700 focus:ring-emerald-400"
          />
          <MapPin className="absolute left-4 top-4 w-5 h-5 text-emerald-400" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredStorages.length > 0 ? (
              filteredStorages.map((provider, index) => (
                <motion.div
                  key={provider.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white dark:bg-gray-900/80 p-6 rounded-lg border border-gray-200 dark:border-gray-700/50 hover:border-emerald-400/70 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg`}
                  onClick={() => setModalOpen(index)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Warehouse className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-lg">{provider.name}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-sm mt-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400" /> {provider.location}</p>
                  <p className="text-gray-700 dark:text-gray-200 text-sm flex items-center gap-2"><Phone className="w-4 h-4 text-purple-400" /> {provider.contact}</p>
                  <p className="text-gray-700 dark:text-gray-200 text-sm mt-2">{provider.details}</p>
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-700 dark:text-gray-200 text-center col-span-3 text-lg"
              >
                No storage providers found. Try searching for FarmSafe or Nellore.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modal for Storage Provider Details */}
      <AnimatePresence>
        {modalOpen !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setModalOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-900/90 p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl border border-emerald-400/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <Warehouse className="w-6 h-6 text-emerald-400" />
                  {filteredStorages[modalOpen].name}
                </h3>
                <button onClick={() => setModalOpen(null)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700 dark:text-gray-200"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="text-emerald-700 dark:text-emerald-300 text-lg">Capacity: {filteredStorages[modalOpen].capacity}</p>
              <p className="text-gray-700 dark:text-gray-200 text-lg">Location: {filteredStorages[modalOpen].location}</p>
              <p className="text-gray-700 dark:text-gray-200 text-lg">Contact: {filteredStorages[modalOpen].contact}</p>
              <p className="text-gray-700 dark:text-gray-200 text-lg mt-2">Details: {filteredStorages[modalOpen].details}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MarketTrends;