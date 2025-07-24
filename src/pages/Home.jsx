import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import confetti from 'canvas-confetti';
import { Sprout, Stethoscope, TrendingUp } from 'lucide-react';
import { FaLinkedin, FaGithub, FaEnvelope, FaArrowRight, FaCheckCircle, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import logo from '/logo.svg';

// Particle burst for icons
function ParticleBurst({ trigger }) {
  const ref = useRef();
  useEffect(() => {
    if (trigger && ref.current) {
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        particle.style.background = `linear-gradient(90deg, #34d399, #a78bfa)`;
        particle.style.left = `${40 + 30 * Math.cos((i / 8) * 2 * Math.PI)}%`;
        particle.style.top = `${40 + 30 * Math.sin((i / 8) * 2 * Math.PI)}%`;
        ref.current.appendChild(particle);
        setTimeout(() => ref.current.removeChild(particle), 700);
      }
    }
  }, [trigger]);
  return <span ref={ref} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />;
}

function Home() {
  // Confetti on load
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.2 },
      colors: ['#34d399', '#22d3ee', '#a78bfa', '#f472b6'],
      scalar: 1.2,
    });
  }, []);

  // For icon particle burst
  const [iconBurst, setIconBurst] = useState({});

  // Section reveal variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="space-y-20 px-4 pt-12 pb-24 ml-[80px] scroll-smooth">
      {/* Logo + Title */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Tilt tiltMaxAngleX={18} tiltMaxAngleY={18} glareEnable={true} glareMaxOpacity={0.25} scale={1.08} transitionSpeed={1200} className="animated-border rounded-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative group"
          >
            <span className="absolute -inset-2 rounded-full bg-gradient-to-tr from-emerald-400 via-cyan-400 to-purple-500 blur-xl opacity-70 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500 animate-gradient-x"></span>
            <img src={logo} alt="Agrisage Logo" className="w-24 h-24 z-10 relative rounded-full border-4 border-transparent group-hover:border-emerald-400 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-fade-in" />
          </motion.div>
        </Tilt>
        <motion.h1
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 tracking-tight leading-[1.1] animate-gradient-x"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >Agrisage</motion.h1>
      </div>

      {/* Farming in Andhra Pradesh is tough. (Pro Hero Section, No Background/Border, Slightly Reduced Image Width, Aligned Image) */}
      <section className="flex flex-col md:flex-row items-center w-full mt-20 py-16 rounded-3xl relative overflow-hidden">
        {/* Image aligned with text start */}
        <div className="flex-shrink-0 w-[400px] h-[320px] md:w-[950px] md:h-[700px] overflow-hidden flex items-center md:items-start" style={{ alignSelf: 'flex-start' }}>
          <img src="/farmer-crying.png" alt="Andhra Pradesh Farmer Crying" className="object-cover object-left w-full h-full" />
        </div>
        {/* Text right, 100px gap, left-aligned, max width, elaborate text */}
        <div className="flex-1 flex flex-col justify-center pl-0 md:pl-[100px] py-4 text-left max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-extrabold text-rose-600 dark:text-rose-300 leading-tight mb-6">
            Farming in Andhra Pradesh is tough.
          </h2>
          <p className="text-lg md:text-2xl font-medium text-gray-900 dark:text-slate-100 leading-relaxed mb-4">
            Every day, farmers in Andhra Pradesh face unpredictable weather, volatile markets, and the constant threat of crop diseases. The information they need is scattered, and every decision carries risk. <span className="block mt-2">For many, a single season can decide the fate of an entire family. <span className='font-semibold text-rose-500 dark:text-rose-300'>But you don’t have to face it alone.</span></span>
          </p>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mt-2">
            Agrisage is here to empower you with knowledge, support, and AI-driven insights—so you can farm smarter, grow stronger, and secure your future.
          </p>
        </div>
      </section>

      {/* Meet Agrisage: Your AI-Powered Farming Partner (Image Right, Clean Section, Image Touches Right, Text Moved Right, Left Gap) */}
      <section className="flex flex-col md:flex-row items-center w-full mt-14 py-16 rounded-3xl relative overflow-hidden ml-0 md:ml-[100px]">
        {/* Text left, more gap to image, left-aligned, max width, elaborate text */}
        <div className="flex-1 flex flex-col justify-center pr-0 md:pr-[160px] py-4 text-left max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-extrabold text-cyan-700 dark:text-cyan-200 leading-tight mb-6">
            Meet Agrisage: Your AI-Powered Farming Partner
          </h2>
          <p className="text-lg md:text-2xl font-medium text-gray-900 dark:text-slate-100 leading-relaxed mb-4">
            Imagine having a trusted companion by your side—one that brings together the power of AI, real-time data, and local expertise. Agrisage helps you make smarter decisions, boost your yields, and navigate every challenge with confidence.
          </p>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mt-2">
            Get personalized crop advice, instant disease detection, live market prices, and verified storage options—all in one place, designed for AP farmers. With Agrisage, you’re not just farming; you’re farming with the future in your hands.
          </p>
        </div>
        {/* Large image, right side, flush with right edge */}
        <div className="flex-shrink-0 w-[320px] h-[180px] md:w-[700px] md:h-[500px] overflow-hidden">
          <img src="/our-solution.jpg" alt="Agrisage AI" className="object-cover object-right w-full h-full" />
        </div>
      </section>

      {/* How It Works */}
      <motion.section className="max-w-6xl w-full mx-auto mt-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.18} scale={1.02} transitionSpeed={1200} className="glass-card animated-border rounded-3xl">
          <div className="p-8 md:p-16">
            <h3 className="text-xl font-bold text-center bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-6 inline-block underline decoration-purple-400/40 decoration-4 underline-offset-8">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-10">
              <motion.div className="flex flex-col items-center space-y-2 group relative" whileHover={{ scale: 1.08, rotate: -2 }} onMouseEnter={() => setIconBurst({ ...iconBurst, how1: true })} onAnimationEnd={() => setIconBurst({ ...iconBurst, how1: false })}>
                <FaCheckCircle className="w-14 h-14 text-emerald-400 mb-1 drop-shadow-lg group-hover:scale-125 group-hover:text-emerald-500 group-hover:rotate-6 transition-all duration-500 animate-bounce-slow" style={{ filter: 'drop-shadow(0 0 12px #34d39988)' }} />
                {iconBurst.how1 && <ParticleBurst trigger={iconBurst.how1} />}
                <h4 className="font-semibold text-lg mb-1 text-emerald-700 dark:text-emerald-300">1. Tell Us About Your Farm</h4>
                <p className="text-gray-800 dark:text-gray-300 text-center">Enter your location, crops, and a few details. We personalize everything for you.</p>
              </motion.div>
              <motion.div className="flex flex-col items-center space-y-2 group relative" whileHover={{ scale: 1.08, rotate: 2 }} onMouseEnter={() => setIconBurst({ ...iconBurst, how2: true })} onAnimationEnd={() => setIconBurst({ ...iconBurst, how2: false })}>
                <FaArrowRight className="w-14 h-14 text-cyan-400 mb-1 drop-shadow-lg group-hover:scale-125 group-hover:text-cyan-500 group-hover:-rotate-6 transition-all duration-500 animate-bounce-slow" style={{ filter: 'drop-shadow(0 0 12px #22d3ee88)' }} />
                {iconBurst.how2 && <ParticleBurst trigger={iconBurst.how2} />}
                <h4 className="font-semibold text-lg mb-1 text-cyan-700 dark:text-cyan-300">2. Get Instant AI Insights</h4>
                <p className="text-gray-800 dark:text-gray-300 text-center">See crop recommendations, disease alerts, market prices, and storage options—instantly.</p>
              </motion.div>
              <motion.div className="flex flex-col items-center space-y-2 group relative" whileHover={{ scale: 1.08, rotate: 6 }} onMouseEnter={() => setIconBurst({ ...iconBurst, how3: true })} onAnimationEnd={() => setIconBurst({ ...iconBurst, how3: false })}>
                <FaArrowRight className="w-14 h-14 text-purple-400 mb-1 drop-shadow-lg group-hover:scale-125 group-hover:text-purple-500 group-hover:rotate-12 transition-all duration-500 animate-bounce-slow" style={{ filter: 'drop-shadow(0 0 12px #a78bfa88)' }} />
                {iconBurst.how3 && <ParticleBurst trigger={iconBurst.how3} />}
                <h4 className="font-semibold text-lg mb-1 text-purple-700 dark:text-purple-300">3. Take Action & Grow</h4>
                <p className="text-gray-800 dark:text-gray-300 text-center">Apply the advice, track your progress, and maximize your yield and profits every season.</p>
              </motion.div>
            </div>
          </div>
        </Tilt>
      </motion.section>

      {/* Features */}
      <motion.section className="max-w-6xl w-full mx-auto mt-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.18} scale={1.02} transitionSpeed={1200} className="glass-card animated-border rounded-3xl">
          <div className="p-8 md:p-16">
            <h3 className="text-xl font-bold text-center bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6 inline-block underline decoration-emerald-400/40 decoration-4 underline-offset-8">What You Get</h3>
            <div className="grid md:grid-cols-3 gap-10">
              <motion.div className="flex flex-col items-center space-y-2 group relative" whileHover={{ scale: 1.08, rotate: -6 }} onMouseEnter={() => setIconBurst({ ...iconBurst, feat1: true })} onAnimationEnd={() => setIconBurst({ ...iconBurst, feat1: false })}>
                <Sprout className="w-16 h-16 text-emerald-400 mb-1 drop-shadow-lg group-hover:scale-125 group-hover:text-emerald-500 group-hover:-rotate-6 transition-all duration-500 animate-float" style={{ filter: 'drop-shadow(0 0 12px #34d39988)' }} />
                {iconBurst.feat1 && <ParticleBurst trigger={iconBurst.feat1} />}
                <h4 className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-1">Crop Advisor</h4>
                <p className="text-gray-800 dark:text-gray-300 text-center">Personalized crop suggestions based on your soil, weather, and local trends.</p>
              </motion.div>
              <motion.div className="flex flex-col items-center space-y-2 group relative" whileHover={{ scale: 1.08, rotate: 6 }} onMouseEnter={() => setIconBurst({ ...iconBurst, feat2: true })} onAnimationEnd={() => setIconBurst({ ...iconBurst, feat2: false })}>
                <Stethoscope className="w-16 h-16 text-blue-400 mb-1 drop-shadow-lg group-hover:scale-125 group-hover:text-blue-500 group-hover:rotate-6 transition-all duration-500 animate-float" style={{ filter: 'drop-shadow(0 0 12px #60a5fa88)' }} />
                {iconBurst.feat2 && <ParticleBurst trigger={iconBurst.feat2} />}
                <h4 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1">Plant Health</h4>
                <p className="text-gray-800 dark:text-gray-300 text-center">Detect diseases from images, get water advice, and keep your crops healthy.</p>
              </motion.div>
              <motion.div className="flex flex-col items-center space-y-2 group relative" whileHover={{ scale: 1.08, rotate: 6 }} onMouseEnter={() => setIconBurst({ ...iconBurst, feat3: true })} onAnimationEnd={() => setIconBurst({ ...iconBurst, feat3: false })}>
                <TrendingUp className="w-16 h-16 text-purple-400 mb-1 drop-shadow-lg group-hover:scale-125 group-hover:text-purple-500 group-hover:-rotate-6 transition-all duration-500 animate-float" style={{ filter: 'drop-shadow(0 0 12px #a78bfa88)' }} />
                {iconBurst.feat3 && <ParticleBurst trigger={iconBurst.feat3} />}
                <h4 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-1">Market Intel</h4>
                <p className="text-gray-800 dark:text-gray-300 text-center">Live crop prices, verified storage, and smart selling tips for AP farmers.</p>
              </motion.div>
            </div>
          </div>
        </Tilt>
      </motion.section>

      {/* Replace the old testimonial/impact section with the new card: */}
      <section className="flex flex-col items-center justify-center w-full mt-24 md:mt-32 px-2">
        <div className="relative max-w-2xl w-full mx-auto glass-card animated-border rounded-3xl p-10 md:p-16 shadow-2xl border-2 border-transparent bg-white/60 dark:bg-[#181825]/80 backdrop-blur-xl">
          <FaQuoteLeft className="absolute left-6 top-6 text-emerald-400 text-3xl animate-bounce-slow" />
          <blockquote className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-6 leading-relaxed">
            “Agrisage helped me choose the right crop and find the best price for my harvest. The disease detection is a game changer!”
          </blockquote>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-300 text-center mt-2">
            — Ramesh, Farmer from Guntur
          </div>
          <FaQuoteRight className="absolute right-6 bottom-6 text-purple-400 text-3xl animate-bounce-slow" />
        </div>
      </section>

      {/* Call to Action */}
      <motion.div className="flex justify-center" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
        <a href="/crop-recommendation">
          <motion.button
            className="mt-2 px-10 py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-emerald-500 via-cyan-400 to-purple-400 text-white shadow-lg hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none relative overflow-hidden"
            whileHover={{ scale: 1.08, boxShadow: '0 0 32px #a78bfa' }}
          >
            <span className="relative z-10">Get Started </span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 animate-bounce-slow text-2xl"><FaArrowRight /></span>
          </motion.button>
        </a>
      </motion.div>

      {/* Footer with Connect */}
      <footer className="mt-20 text-gray-400 text-sm text-center space-y-2">
        <div className="flex justify-center gap-6 text-2xl mb-2">
          <a href="https://github.com/Guna42" target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 flex items-center gap-2"><FaGithub /> GitHub</a>
          <a href="http://www.linkedin.com/in/guna-byraju" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 flex items-center gap-2"><FaLinkedin /> LinkedIn</a>
          <a href="mailto:gunavardhan_byraju@srmap.edu.in" className="hover:text-blue-500 flex items-center gap-2"><FaEnvelope /> Email</a>
      </div>
        <div>&copy; {new Date().getFullYear()} Agrisage. All rights reserved.</div>
        <div className="text-xs">Made with ❤️ by Guna Vardhan Byraju & Team | Smart Agriculture for a Better Tomorrow</div>
      </footer>
    </div>
  );
}

export default Home;

