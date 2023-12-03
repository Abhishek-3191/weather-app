// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css"
// import { useEffect, useState } from "react";
// import './App.css';

// function App() {


//   const apiKey = "f56f24967aaf51182d1d4df628297c6d"
//   const [inputCity, setInputCity] = useState("")
//   const [data, setData] = useState({})


//   const getWetherDetails = (cityName) => {
//     if (!cityName) return
//     const apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey
//     axios.get(apiURL).then((res) => {
//       console.log("response", res.data)
//       setData(res.data)
//     }).catch((err) => {
//       console.log("err", err)
//     })
//   }

//   const handleChangeInput = (e) => {
//     console.log("value", e.target.value)
//     setInputCity(e.target.value)
//   }

//   const handleSearch = () => {
//     getWetherDetails(inputCity)
//   }


//   return (
//     <div className="col-md-12">
//       <div className="wetherBg">
//         <h1 className="heading">Weather App</h1>

//         <div className="d-grid gap-3 col-4 mt-4">
//           <input type="text" className="form-control"
//             value={inputCity}
//             onChange={handleChangeInput} />
//           <button className="btn btn-primary" type="button"
//             onClick={handleSearch}
//           >Search</button>
//         </div>
//       </div>

//       {Object.keys(data).length > 0 &&
//         <div className="col-md-12 text-center mt-5">

//           <div className="shadow rounded wetherResultBox">
//             <img className="weathorIcon"
//               src="https://i.pinimg.com/originals/77/0b/80/770b805d5c99c7931366c2e84e88f251.png" />

//             <h5 className="weathorCity">
//               {data?.name}
//             </h5>
//             <h6 className="weathorTemp">{((data?.main?.temp) - 273.15).toFixed(2)}°C</h6>
//           </div>
//         </div>
//       }

//     </div>
//   );
// }

// export default App;

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import './App.css';

function App() {
  const apiKey = "f56f24967aaf51182d1d4df628297c6d";
  const [inputCity, setInputCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const getCurrentWeather = (cityName) => {
    if (!cityName) return;

    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    axios.get(currentWeatherURL).then((res) => {
      console.log("Current weather response", res.data);
      setCurrentWeather(res.data);
    }).catch((err) => {
      console.log("Error fetching current weather", err);
    });
  };

  const getForecast = (cityName) => {
    if (!cityName) return;

    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
    axios.get(forecastURL).then((res) => {
      console.log("Forecast response", res.data);
      setForecast(res.data.list);
    }).catch((err) => {
      console.log("Error fetching forecast", err);
    });
  };

  const handleChangeInput = (e) => {
    setInputCity(e.target.value);
  };

  const filterDailyForecasts = (forecastList) => {
    const dailyForecasts = [];

    // Filter the forecast data to get only one entry per day
    forecastList.forEach((forecastItem) => {
      const date = new Date(forecastItem.dt * 1000).toLocaleDateString();

      if (!dailyForecasts.find((item) => item.date === date)) {
        dailyForecasts.push({
          date,
          temperature: ((forecastItem.main.temp) - 273.15).toFixed(2),
          humidity: forecastItem.main.humidity,
          windSpeed: forecastItem.wind.speed
        });
      }
    });

    return dailyForecasts;
  };

  const handleSearch = () => {
    getCurrentWeather(inputCity);
    getForecast(inputCity);
  };

  const getCurrentLocationWeather = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Error getting current location:", error);
        setLoading(false);
      }
    );
  };

  const getWeatherByCoordinates = (latitude, longitude) => {
    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    axios.get(currentWeatherURL).then((res) => {
      console.log("Current weather response", res.data);
      setCurrentWeather(res.data);
      setLoading(false);
    }).catch((err) => {
      console.log("Error fetching current weather", err);
      setLoading(false);
    });
  };

  useEffect(() => {
    getCurrentLocationWeather();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
//   <div className="container-fluid weather-container">
//   <div className="weatherBg">
//     <h1 className="heading">Weather App</h1>

//     <div className="row justify-content-center mt-4">
//       <div className="col-sm-8 col-md-6 col-lg-4">
//         <div className="input-group">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Enter city..."
//             value={inputCity}
//             onChange={handleChangeInput}
//           />
//           <button
//             className="btn btn-primary"
//             type="button"
//             onClick={handleSearch}
//           >
//             Search
//           </button>
//         </div>
//       </div>
//     </div>

//     {Object.keys(currentWeather).length > 0 && (
//       <div className="col-md-12 text-center mt-5">
//         <div className="shadow rounded weatherResultBox">
//           <img
//             className="weatherIcon img-fluid"
//             src="https://i.pinimg.com/originals/77/0b/80/770b805d5c99c7931366c2e84e88f251.png"
//             alt="Weather Icon"
//           />
//           <h5 className="weatherCity">{currentWeather?.name}</h5>
//           <h6 className="weatherTemp">
//             {((currentWeather?.main?.temp) - 273.15).toFixed(2)}°C
//           </h6>
//           <p>Humidity: {currentWeather?.main?.humidity}%</p>
//           <p>Wind Speed: {currentWeather?.wind?.speed} m/s</p>
//         </div>
//       </div>
//     )}

//     {forecast.length > 0 && (
//       <div className="col-md-12 text-center mt-5">
//         <h3>Next Week</h3>
//         <div className="d-flex justify-content-between">
//           {filterDailyForecasts(forecast).map((forecastItem) => (
//             <div key={forecastItem.date} className="shadow rounded forecastBox">
//               <p>{forecastItem.date}</p>
//               <p>{forecastItem.temperature}°C</p>
//               <p>Humidity: {forecastItem.humidity}%</p>
//               <p>Wind Speed: {forecastItem.windSpeed} m/s</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     )}
//   </div>
// </div>
// );
<div className="container-fluid weather-container">
<div className="weatherBg">
  <h1 className="heading">Weather App</h1>

  <div className="row justify-content-center mt-4">
    <div className="col-sm-8 col-md-6 col-lg-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter city..."
          value={inputCity}
          onChange={handleChangeInput}
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  </div>

  {loading ? (
    <p>Loading...</p>
  ) : (
    <>
      {Object.keys(currentWeather).length > 0 && (
        <div className="col-md-12 text-center mt-5">
          <div className="shadow rounded weatherResultBox">
            
          <img
            className="weatherIcon img-fluid"
            src="https://i.pinimg.com/originals/77/0b/80/770b805d5c99c7931366c2e84e88f251.png"
            alt="Weather Icon"
          />
          <h5 className="weatherCity">{currentWeather?.name}</h5>
          <h6 className="weatherTemp">
            {((currentWeather?.main?.temp) - 273.15).toFixed(2)}°C
          </h6>
          <p>Humidity: {currentWeather?.main?.humidity}%</p>
          <p>Wind Speed: {currentWeather?.wind?.speed} m/s</p>
          
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="col-md-12 text-center mt-5">
          <h3>Next Week</h3>
          <div className="d-flex justify-content-between">
           
          {filterDailyForecasts(forecast).map((forecastItem) => (
              <div key={forecastItem.date} className="shadow rounded forecastBox">
                <p>{forecastItem.date}</p>
                <p>{forecastItem.temperature}°C</p>
                <p>Humidity: {forecastItem.humidity}%</p>
                <p>Wind Speed: {forecastItem.windSpeed} m/s</p>
              </div>
            ))}
          
          </div>
        </div>
      )}
    </>
  )}
</div>
</div>

// {forecast.length > 0 && (
//         <div className="col-md-12 text-center mt-5">
//           <h3>Next Week</h3>
//           <div className="d-flex justify-content-between">
           
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
  );
}

export default App;
