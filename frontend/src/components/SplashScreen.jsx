import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import './SplashScreen.css';

const SplashScreen = ({ finishLoading, isLoading }) => {

  useEffect(() => {
    const timeout = setTimeout(() => {
      finishLoading();
    }, 2500); // 2.5 seconds display time

    return () => clearTimeout(timeout);
  }, [finishLoading]);

  return (
    <motion.div
      className="splash-screen"
      animate={{ 
        backgroundColor: isLoading ? 'var(--bg-main)' : 'rgba(255, 255, 255, 0)',
        zIndex: isLoading ? 9999 : -1,
      }}
      style={{ pointerEvents: isLoading ? 'auto' : 'none' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div
        className="splash-text-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isLoading ? 1 : 0.05, 
          scale: isLoading ? 1 : 1.2 
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <h1 className="splash-title">MoonLight</h1>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
