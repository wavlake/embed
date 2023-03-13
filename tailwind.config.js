/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      ...defaultTheme.screens,
    },
    extend: {
      animation: {
        'blink': 'blink 1.3s ease-out infinite',
        'pulsate': 'pulsate 1.7s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pump': 'pump 1.6s linear infinite',
        'pump-short': 'pumpShort 1.3s linear infinite',
        'pump-wav': 'pumpWav 7.1s ease-out infinite',
        'rock': 'rock 0.3s ease-in',
        'slide': 'slide 1s ease-out',
        'slow-bounce': 'slowBounce 3s ease-out infinite',
        'slow-bounce-down': 'slowBounceDown 3s ease-out infinite',
        'spinner': 'spinner 9s linear infinite',
        'sweep-up': 'sweepUp 2s ease-in-out infinite',
        'boost': 'boost 1s ease-out'
      },
      colors: {
        'brand-black': {
          'DEFAULT': '#171817',
          'light': '#7d7e7d'
        },
        'brand-pink': {
          'DEFAULT': '#f3aef2',
          'light': '#ffeeff',
          'dark': '#b36eb2'
        },
        'brand-beige': {
          'DEFAULT': '#fff6f1',
          'dark': '#CCC3BE'
        },
        'brand-highlight': {
          'DEFAULT': '#fffff2'
        },
        'brand-down': {
          'DEFAULT': '#ff4949'
        },
        'brand-up': {
          'DEFAULT': '#5bdeb1'
        },
        'brand-orange': {
          'DEFAULT': '#ffb848'
        },
        'brand-mint': {
          'DEFAULT': '#5bdeb1'
        }
      },
      keyframes: {
        blink: {
          "0%": { opacity: "0" },
          "20%": { opacity: "0.5" },
          "100%": { opacity: "1" }
        },
        pulsate: {
          "0%": { color: '#f3aef2' },
          "50%": { color: '#7d7e7d' },
          "100%": { color: '#f3aef2' },
        },
        pump: {
          "0%": { height: "15px",
                  transform: "translateY(0px)", /*translateY makes Y axis move down to give the effect that it is growing from the center*/
                  background: '#f3aef2'
                },
          "50%": { height: "40px",
                   transform: "translateY(-25px)",
                 },
          "70%": { background: '#ffeeff' },
          "100%": { height: "15px",
                    transform: "translateY(0px)",
                    background: '#f3aef2'
                  },
        },
        pumpShort: {
          "0%": { height: "15px",
                  transform: "translateY(0px)",
                  background: '#f3aef2'
                },
          "50%": { height: "25px",
                   transform: "translateY(-10px)"},
          "70%": { background: '#ffeeff' },
          "100%": { height: "15px",
                    transform: "translateY(0px)",
                    background: '#f3aef2'},
        },
        pumpWav: {
          "0%": { height: "30px"},
          "50%": { height: "30px", background: '#ffeeff'},
          "100%": { height: "30px"},
        },
        rock: {
          '0%': {
            transform: 'translateX(-5%)',
          },
          '50%': {
            transform: 'translateX(0%)',
          },
          '100%': {
            transform: 'translateX(-2%)',
          }
        },
        slide: {
          '0%': {
            transform: 'translateX(0)',
          },
          '50%': {
            transform: 'translateX(-20rem)',
          },
          '100%': {
            transform: 'translateX(-30rem)'
          }
        },
        slowBounce: {
          '0%': {
            transform: 'translateY(0%)',
            animationTimingFunction: 'cubic-bezier(1, 0, 1, 1)'
          },
          '80%': {
            transform: 'translateY(-15%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 0.5)'
          },
          '100%': {
            transform: 'translateY(0%)',
            animationTimingFunction: 'cubic-bezier(1, 0, 1, 1)'
          }
        },
        slowBounceDown: {
          '0%': {
            transform: 'translateY(0%)',
            animationTimingFunction: 'cubic-bezier(1, 0, 1, 1)'
          },
          '80%': {
            transform: 'translateY(15%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 0.5)'
          },
          '100%': {
            transform: 'translateY(0%)',
            animationTimingFunction: 'cubic-bezier(1, 0, 1, 1)'
          }
        },
        spinner: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '50%': {
            transform: 'rotate(180deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          }
        },
        sweepUp: {
          '0%': {
            backgroundPosition: '90% -200%',
            backgroundSize: '160% 160%'
          },
          '80%': {
            backgroundPosition: '0% 100%',
            backgroundSize: '160% 160%'
          },
          '100%': {
            backgroundPosition: '0% 100%',
            backgroundSize: '160% 160%'
          }
        },
        boost: {
          '0%': {
            transform: 'translateY(-0.7rem)',
          },
          '50%': {
            transform: 'translateY(-1.5rem)',
            opacity: '0.5'
          },
          '100%': {
            transform: 'translateY(-2rem)',
            opacity: '0.2'
          }
        }
      },
      margin: {
        'wav': '0.2rem',
      },
      rotate: {
        'wav': '35deg',
      },
      skew: {
        'wav': '35deg',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@headlessui/tailwindcss')
  ],
}
