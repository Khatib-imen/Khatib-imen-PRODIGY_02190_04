import axios from 'axios';

const API_KEY = '98b92edd5fce22af27c018eb9ea1cd1e'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

export const fetchWeatherByLocation = async (location) => {
  try {
    const response = await axios.get(`${BASE_URL}weather?q=${location}&appid=${API_KEY}&units=metric`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`API Error: ${error.response.data.message}`);
      throw new Error(error.response.data.message);
    } else {
      console.error(`Network Error: ${error.message}`);
      throw new Error('Network Error');
    }
  }
};

export const fetchWeatherByCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`API Error: ${error.response.data.message}`);
      throw new Error(error.response.data.message);
    } else {
      console.error(`Network Error: ${error.message}`);
      throw new Error('Network Error');
    }
  }
};
