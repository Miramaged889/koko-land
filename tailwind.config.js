/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6F61',    // أحمر وردي مرح
        secondary: '#4FC3F7',  // أزرق سماوي زاهي  
        accent1: '#FFD54F',    // أصفر شمسي دافئ
        accent2: '#81C784',    // أخضر نعناعي مبهج
        background: '#FFF8E1', // خلفية فاتحة دافئة
      },
      fontFamily: {
        'changa': ['Changa', 'sans-serif'],
        'reem': ['Reem Kufi Fun', 'sans-serif'], 
        'tajawal': ['Tajawal', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};