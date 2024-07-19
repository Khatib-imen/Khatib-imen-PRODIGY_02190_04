import React, { useState, useEffect } from 'react';
import { fetchWeatherByLocation, fetchWeatherByCoordinates } from './components/api/weatherApi';
import Weather from './components/Weather';
import Notification from './components/Notification/Notification.js';
import './components/styles/App.css';

const App = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [notification, setNotification] = useState('');

  const updateBackground = (temperature) => {
    let backgroundUrl = '';

    if (temperature < 20) {
      backgroundUrl = 'url(/rain.jpg)';
    } else if (temperature >= 20 && temperature <= 30) {
      backgroundUrl = 'url(/medium.jpg)';
    } else {
      backgroundUrl = 'url(/hot.jpg)';
    }

    document.body.style.backgroundImage = backgroundUrl;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
          setWeatherData(data);
          updateBackground(data.main.temp);
        } catch (err) {
          console.error(err);
          setNotification('Unable to fetch weather data.');
          setTimeout(() => setNotification(''), 3000); // Hide notification after 3 seconds
        }
      },
      () => {
        setNotification('Location access denied. Please enter a location.');
        setTimeout(() => setNotification(''), 3000); // Hide notification after 3 seconds
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWeatherByLocation(location);
      setWeatherData(data);
      updateBackground(data.main.temp);
      setNotification('');
    } catch (err) {
      console.error(err);
      // Check if err.response and err.response.data exist
      const errorMessage = err.response?.data?.message || 'Location not found. Please try again.';
      setNotification(errorMessage);
      setTimeout(() => setNotification(''), 3000); // Hide notification after 3 seconds
      setWeatherData(null);
    }
  };
  

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
        <button type="submit">Get Weather</button>
      </form>
      {weatherData && <Weather data={weatherData} />}
      <Notification 
        message={notification} 
        onClose={() => setNotification('')} 
        className={notification ? 'show' : ''}
      />
    </div>
  );
};

export default App;
