import React, { useEffect, useState } from "react";
import "./App.css";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: [{ description: string }];
  wind: { speed: number };
}

const App: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handleFetchWeather = () => {
    if (location.trim() !== "") {
      fetchWeather(location);
    } else {
      setError("Please enter a valid location name.");
    }
  };

  const fetchWeather = async (city: string) => {
    try {
      setLoading(true); // Start loading when fetching
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6acb560ad6709f76ba33db801bb7aaa8&units=metric`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      setWeather(data);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        setError("Location access denied. Please allow location access.");
        setLoading(false);
      }
    );
  }, []);

  const fetchWeatherByCoordinates = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6acb560ad6709f76ba33db801bb7aaa8&units=metric`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      setWeather(data);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>☀️ Weather App 🌦️</h1>
      <input
        type="text"
        value={location}
        onChange={handleLocationChange}
        placeholder="Enter city name"
      />
      <button onClick={handleFetchWeather}>Get Weather</button>
      {loading && <p>Loading weather data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weather && (
        <div className="card">
          <h2>Weather in {weather.name}</h2>
          <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
          <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
          <p><strong>Condition:</strong> {weather.weather[0].description}</p>
          <p><strong>Wind Speed:</strong> {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default App;
