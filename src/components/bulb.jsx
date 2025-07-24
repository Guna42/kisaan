import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

function getInitialTheme() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    // System preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return true;
}

function Bulb() {
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      className="fixed top-4 left-4 p-3 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-emerald-600 shadow-lg shadow-emerald-100/30 dark:shadow-emerald-900/40 cursor-pointer transition-all duration-300 z-50"
      onClick={toggleTheme}
    >
      <motion.div
        animate={{ rotate: isDark ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-emerald-500" />
        ) : (
          <Moon className="w-6 h-6 text-emerald-500" />
        )}
      </motion.div>
    </motion.div>
  );
}

export default Bulb;