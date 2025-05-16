// tailwind.config.js
module.exports = {
  // ...other config
  daisyui: {
    themes: [
      {
        light: {
          primary: '#007AFF',
          secondary: '#4635B1',
          accent: '#4CAF50',
          neutral: '#191D24',
          'base-100': '#ffffff', // This is your light mode background
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
        dark: {
          primary: '#4CAF50',
          secondary: '#AD49E1',
          accent: '#4CAF50',
          neutral: '#191D24',
          'base-100': '#000000', // This is your dark mode background
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
      },
    ],
  },
};
