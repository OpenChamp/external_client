/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"brand-dark": "#100E1A",
				"brand-light": "#FFEAD4",
				"copper": {
					DEFAULT: "#B68236",
					50: "#FAF5EE",
					100: "#F5EBDD",
					200: "#EAD6B9",
					300: "#E0C296",
					400: "#D5AD72",
					500: "#CB994F",
					600: "#B68236",
					700: "#93692B",
					800: "#6F4F21",
					900: "#4C3616",
					950: "#3A2A11",
				},
			},
			animation: {
				"fade-in": "fadeIn 200ms ease-out forwards",
				"fade-zoom-in": "fadeZoomIn 200ms ease-out forwards",
			},
		},
	},
	plugins: [],
};
