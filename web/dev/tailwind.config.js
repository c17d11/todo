const colors = require('tailwindcss/colors')
colors.orange = '#CA8A04';
colors.blue   = '#D1D5DB',
colors.pink   = '#FCA5A5';

colors.main_d = '#0D090A';
colors.main   = '#252E36';
colors.main_l = '#424242';
colors.sec_d  = '#541533';
colors.sec_l  = '#943C4B';
colors.accent = '#FFFF00';

module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{vue,js,ts,jsx,tsx}",
	],
	theme: {
		colors: colors,
	  // fontFamily: {},
	  // borderRadius: {},
	  extend: {},
	},
	plugins: [],
  }
