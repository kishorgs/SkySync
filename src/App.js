import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { MdOutlineSearch } from "react-icons/md";
import { format } from "date-fns";
import { MagnifyingGlass } from "react-loader-spinner";

function App() {
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState("Celsius"); // Default to Celsius
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecast, setForecast] = useState([]);

  const [isloaded, setIsloaded] = useState(false);

  const apiKey = "f81666ccea9f4e1ca6061015240102";
  const baseUrl = "https://api.weatherapi.com/v1";

  useEffect(() => {
    axios
      .get("https://ipinfo.io?token=48e19ff93ce4c5", {
        params: { format: "jsonp" },
      })
      .then((response) => {
        // console.log(response.data.city);
        // setCity(response.data.city);
        searchWeather(response.data.city);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const searchWeather = (city) => {
    setIsloaded(false)
    Promise.all([
      axios.get(`${baseUrl}/current.json?q=${city}&key=${apiKey}&aqi=yes`),
      axios.get(
        `${baseUrl}/forecast.json?q=${city}&key=${apiKey}&aqi=yes&alerts=yes&days=5`
      ),
    ])
      .then((responses) => {
        const currentWeatherResponse = responses[0];
        const forecastResponse = responses[1];

        setCurrentWeather(currentWeatherResponse.data);

        setForecast(forecastResponse.data.forecast.forecastday);
        
        // Adding Some Delay for loading bar to appear
        setTimeout(()=>{
          setIsloaded(true);
        },1500)

      })
      .catch((error) => {
        setIsloaded(true);
        const errorData = error.response.data.error;

        if (errorData.code === 1006) {
          alert(errorData.message);
          
        }

        if (errorData.code === 1003) {
          alert("Please Enter a City/Country Name");
          
        }
      });
  };

  const toggleUnits = () => {
    setUnit((prevUnit) => (prevUnit === "Celsius" ? "Fahrenheit" : "Celsius"));
  };

  return (
    <>
      {isloaded ? (
        <>
          <div id="main-div">
            <div id="Main-container">
              <div id="container">
                <div id="select">
                  <div id="search">
                    <MdOutlineSearch fontSize={30} />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Search for the place..."
                      id="city-input"
                      autoComplete="off"
                    />
                    <button onClick={() => searchWeather(city)} id="search-btn">
                      Get weather
                    </button>
                  </div>
                  <div>
                    <select id="unitToggle" onChange={toggleUnits}>
                      <option value="metric">Celsius</option>
                      <option value="imperial">Fahrenheit</option>
                    </select>
                  </div>
                </div>
                
                <h2>Current Weather </h2>
                <div id="weather-div">
                  <img
                    className="weather-icon"
                    src={currentWeather.current.condition.icon}
                    alt="Weather Icon"
                  />
                  <h2>{currentWeather.location.name}</h2>
                  <br />
                  <p>
                    <span>Temperature</span>:{" "}
                    {unit === "Celsius"
                      ? currentWeather.current.temp_c
                      : currentWeather.current.temp_f}
                    &deg;
                  </p>

                  <p>
                    <span>Humidity</span>: {currentWeather.current.humidity}%
                  </p>
                  <p>
                    <span>Wind</span>: {currentWeather.current.wind_kph} kph,{" "}
                    {currentWeather.current.wind_degree}&deg;
                  </p>
                  <p>
                    <span>Description</span>:{" "}
                    {currentWeather.current.condition.text}
                  </p>
                </div>

                <h2>5-Days Weather Forecast</h2>
                <div id="Weekly-forecast">
                  {forecast.map((entry, index) => (
                    <div id="card" key={index}>
                      <img
                        className="weather-icon"
                        src={entry.day.condition.icon}
                        alt="Weather Icon"
                      />
                      <p>{format(entry.date, "MMM dd, yyyy")}</p>
                      <p>
                        <span>Average Temperature</span>:{" "}
                        {unit === "Celsius"
                          ? entry.day.avgtemp_c
                          : entry.day.avgtemp_f}
                        &deg;
                      </p>
                      <p>
                        <span>Description</span>: {entry.day.condition.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="loader">
          
        <MagnifyingGlass
          visible={true}
          height="200"
          width="200"
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
        <h2>Fetching Weather...</h2>

        
</div>
      )}
    </>
  );
}

export default App;