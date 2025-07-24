import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Sprout, 
  Stethoscope, 
  TrendingUp, 
  User
} from 'lucide-react';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'crop-recommendation', icon: Sprout, label: 'Crop Advisor', path: '/crop-recommendation' },
    { id: 'plant-health', icon: Stethoscope, label: 'Plant Health', path: '/plant-health' },
    { id: 'market-trends', icon: TrendingUp, label: 'Market Intel', path: '/market-trends' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
  ];

  const handleNavClick = (itemId, path) => {
    setActiveSection(itemId);
    navigate(path);
  };

  return (
    <div className={`fixed top-6 right-8 z-50 flex flex-row items-center transition-all duration-300 ${scrolled ? 'scale-95 opacity-90' : 'scale-100 opacity-100'}`}>
      <div className={
        `flex flex-row items-center justify-between min-w-[480px] max-w-[700px] w-full
        py-3 px-8 border border-emerald-400/60 shadow-2xl
        rounded-full backdrop-blur-xl bg-white/70 dark:bg-black/70
        transition-all duration-300
        ${scrolled ? 'shadow-emerald-400/30 bg-white/90 dark:bg-black/90 border-emerald-400/80' : ''}
        animated-gradient-border`
      } style={{ position: 'relative', zIndex: 10 }}>
        {/* Animated gradient border */}
        <div className="absolute -inset-1 rounded-full pointer-events-none z-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 blur-md opacity-60 animate-gradient-x" />
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id, item.path)}
            className={
              `relative flex items-center justify-center w-12 h-12 rounded-full
              transition-all duration-300 ease-out
              group
              ${activeSection === item.id 
                ? 'bg-emerald-50 text-emerald-600 dark:bg-white dark:text-black scale-110 shadow-lg shadow-emerald-100/40 dark:shadow-white/20 border-emerald-300 dark:border-white ring-2 ring-emerald-400/60 animate-pulse' 
                : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-emerald-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:border-gray-600'}
              border overflow-hidden`
            }
            title={item.label}
            aria-label={item.label}
          >
            <span className="relative z-10">
              <item.icon size={22} strokeWidth={1.5} />
            </span>
            {/* Active state animated ring */}
            {activeSection === item.id && (
              <span className="absolute inset-0 rounded-full ring-2 ring-emerald-400/40 animate-pulse pointer-events-none" />
            )}
            {/* Icon hover effect */}
            <span className="absolute inset-0 rounded-full group-hover:shadow-[0_0_16px_4px_rgba(34,211,238,0.25)] group-hover:scale-110 transition-all duration-300 pointer-events-none" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navbar;