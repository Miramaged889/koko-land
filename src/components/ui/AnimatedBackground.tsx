import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Clouds */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute text-white/20 text-6xl"
          style={{
            top: `${20 + i * 15}%`,
            right: `${-10 + i * 25}%`,
          }}
          animate={{
            x: [-100, window.innerWidth + 100],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ☁️
        </motion.div>
      ))}

      {/* Floating Balloons */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`balloon-${i}`}
          className="absolute text-4xl"
          style={{
            bottom: `${10 + i * 20}%`,
            left: `${10 + i * 20}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🎈
        </motion.div>
      ))}

      {/* Twinkling Stars */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute text-accent1 text-2xl"
          style={{
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 90}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          ⭐
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedBackground;