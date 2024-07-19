import React, { useState, useEffect } from 'react';
import { fetchWeatherByLocation, fetchWeatherByCoordinates } from './components/api/weatherApi';
import Weather from './components/Weather';
import './components/styles/App.css';
const App = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const updateBackground = (weather) => {
    let backgroundUrl = '';

    if (weather === 'rain') {
      backgroundUrl = 'url(/rain.jpg)';
    } else if (weather === 'hot') {
      backgroundUrl = 'url(/hot.jpg)';
    } else {
      backgroundUrl = 'url(/medium.jpg)';
    }

    document.body.style.backgroundImage = backgroundUrl;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
          setWeatherData(data);
          updateBackground(data.weather[0].main.toLowerCase());
        } catch (err) {
          console.error(err);
          setError('Unable to fetch weather data.');
        }
      },
      () => {
        setError('Location access denied. Please enter a location.');
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWeatherByLocation(location);
      setWeatherData(data);
      updateBackground(data.weather[0].main.toLowerCase());
      setError('');
    } catch (err) {
      console.error(err.response.data);
      setError('Location not found. Please try again.');
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
      {error && <p>{error}</p>}
      {weatherData && <Weather data={weatherData} />}
    </div>
  );
};

export default App;
