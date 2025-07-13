# 🌤️ Weather Dashboard

A beautiful, modern weather dashboard built with React, featuring real-time weather data, interactive charts, and a responsive design with dark/light theme support.

![Weather Dashboard](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.6-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite)

## ✨ Features

- **🌍 Global Weather Data** - Search any city worldwide using Open-Meteo's geocoding API
- **📍 Current Location** - Get weather for your current location with geolocation
- **📊 Interactive Charts** - Temperature trends and precipitation probability charts
- **📅 7-Day Forecast** - Detailed daily weather forecasts
- **🌙 Dark/Light Theme** - Beautiful theme toggle with system preference detection
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **⚡ Fast Performance** - Built with Vite and optimized for speed
- **🔄 Data Caching** - Reduces API calls for better performance

## 🚀 Live Demo

[View Live Demo](https://your-demo-link.com) *(Add your deployment link here)*

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Styling**: Tailwind CSS 3.3.6
- **Charts**: Recharts 2.8.0
- **Icons**: Lucide React 0.294.0
- **Weather API**: Open-Meteo (Free, no API key required)
- **Testing**: Vitest + React Testing Library

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ndeiya/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 🏗️ Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🌐 Deployment

This project can be deployed to any static hosting service:

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with one click

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist/` folder to Netlify
3. Or connect your GitHub repository for automatic deployments

### GitHub Pages
1. Add this to your `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/weather-dashboard",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Deploy: `npm run deploy`

## 📁 Project Structure

```
weather-dashboard/
├── src/
│   ├── components/
│   │   └── ui/           # Reusable UI components
│   ├── App.jsx           # Main application component
│   ├── App.css           # Custom styles and theme variables
│   ├── index.css         # Tailwind CSS imports
│   └── main.jsx          # Application entry point
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vitest.config.js
└── README.md
```

## 🎨 Customization

### Adding New Cities
The app uses Open-Meteo's geocoding API, so any city worldwide is automatically supported. No configuration needed!

### Styling
- Modify `src/App.css` for custom CSS variables and theme colors
- Update `tailwind.config.js` for Tailwind customization
- Edit component styles in `src/components/ui/`

### Weather Data
The app fetches data from Open-Meteo API. You can modify the API parameters in `src/App.jsx` to include additional weather data.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Open-Meteo** for providing free weather data API
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Recharts** for the beautiful chart components
- **Lucide** for the beautiful icons

## 👨‍💻 Author

**Abdul Rahaman Abdulai**
- GitHub: [@ndeiya](https://github.com/ndeiya)
- LinkedIn: [Your LinkedIn]
- Portfolio: [Your Portfolio]

---

⭐ **Star this repository if you found it helpful!** 