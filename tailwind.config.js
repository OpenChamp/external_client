/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"brand-dark": "#100E1A",
				"brand-light": "#FFEAD4",
			},
			animation: {
				"fade-in": "fadeIn 200ms ease-out forwards",
				"fade-zoom-in": "fadeZoomIn 200ms ease-out forwards",
			},
		},
	},
	plugins: [],
};
