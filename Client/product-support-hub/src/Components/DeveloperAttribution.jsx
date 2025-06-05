// DeveloperAttribution.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaCode, FaHeart } from 'react-icons/fa';

const DeveloperAttribution = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll events to show/hide and animate
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if we're scrolling up or down
      if (currentScrollY > lastScrollY) {
        // Scrolling down - minimize
        setIsExpanded(false);
      } else {
        // Scrolling up - make visible
        setIsVisible(true);
      }

      // Update scroll position
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Animation variants
  const containerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    hover: { scale: 1.05 },
  };

  const iconVariants = {
    initial: { rotate: 0 },
    hover: { rotate: 360, transition: { duration: 0.5 } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.2 } },
  };

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-50"
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={containerVariants}
      whileHover="hover"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <motion.div
        className="flex items-center bg-gradient-to-r from-purple-600 to-blue-500 text-white px-3 py-2 rounded-full shadow-lg cursor-pointer"
        whileHover={{ boxShadow: '0 0 15px rgba(123, 104, 238, 0.8)' }}
      >
        <motion.div
          className="flex items-center justify-center bg-white text-purple-600 rounded-full p-2 mr-2"
          variants={iconVariants}
          whileHover="hover"
        >
          {isExpanded ? (
            <FaHeart className="w-4 h-4 text-red-500" />
          ) : (
            <FaCode className="w-4 h-4" />
          )}
        </motion.div>

        {isExpanded && (
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center"
          >
            <span className="text-sm font-medium mr-2">
              Crafted with <span className="animate-pulse">♥</span> by John
              Bekele
            </span>
            <a
              href="https://github.com/johnbekele"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-300 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub className="w-5 h-5" />
            </a>
          </motion.div>
        )}

        {!isExpanded && (
          <motion.div
            className="text-xs font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            JB
          </motion.div>
        )}
      </motion.div>

      {/* Bouncing arrow indicator when collapsed */}
      {!isExpanded && (
        <motion.div
          className="absolute -top-3 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
          }}
        >
          <span className="text-xs text-purple-600 bg-white px-2 py-1 rounded-full shadow-sm">
            Click me!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DeveloperAttribution;
