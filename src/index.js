//API key is redacted here. Enter your own to test. 
const apiKey = 'xxxxxx'
//Morning, Day and Night Mode Function

function change_background() {
  let day = new Date();
  let now = day.getHours();

  if (now > 5 && now < 18) {
    document.body.className = "day";
  } else {
    document.body.className = "night";
  }
}

change_background();

//Time formatting function
function formatDate(timestamp) {
  let now = new Date(timestamp);
  let dayIndex = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = dayIndex[now.getDay()];
  let hour = now.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hour}:${minutes}`;
}
//Search functions

function search(city) {
  let units = `metric`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemp);
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);

  function handleSubmit(event) {
    event.preventDefault();
    let searchInput = document.querySelector("#city-input");
    let city = searchInput.value;
    search(city);
  }

  let searchForm = document.querySelector(`#city-search`);
  searchForm.addEventListener("submit", handleSubmit);
}
//Locate Me button functions
function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = `metric`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemp);
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}
function findLocation() {
  navigator.geolocation.getCurrentPosition(showPosition);
}
let locateMeButton = document.querySelector(`#locate-me-button`);
locateMeButton.addEventListener("click", findLocation);
search("Vernazza");
//Weather display functions
function showTemp(response) {
  let currentTemp = Math.round(response.data.main.temp);
  celsiusTemperature = Math.round(response.data.main.temp);
  let tempDisplay = document.querySelector(`#temp-display`);
  tempDisplay.innerHTML = `${currentTemp}`;
  let currentCity = response.data.name;
  let currentCountry = response.data.sys.country;
  let currentCityDisplay = document.querySelector(`#city-name`);
  currentCityDisplay.innerHTML = `${currentCity}, ${currentCountry}`;
  let conditionDisplay = document.querySelector(`#conditions`);

  conditionDisplay.innerHTML = response.data.weather[0].description;
  let windDisplay = document.querySelector("#wind-speed");
  windDisplay.innerHTML = Math.round(response.data.wind.speed);
  let currentTime = new Date(response.data.dt * 1000);
  let currentTimeDisplay = document.querySelector("#current-time");
  let formattedTime = formatDate(currentTime);
  currentTimeDisplay.innerHTML = `Last updated ${formattedTime}`;
  let iconDisplay = document.querySelector("#icon-element");
  iconDisplay.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconDisplay.setAttribute("alt", response.data.weather[0].description);
}

function displayForecast(response) {
  let forecast = null;
  let forecastDisplay = document.querySelector("#hourly-forecast-display");
  forecastDisplay.innerHTML = null;
  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastDisplay.innerHTML += ` <div class="card col-sm-2"><h5 class="forecast-day">${formatDate(
      forecast.dt * 1000
    )}</h5> <img class= "card-img" src="https://openweathermap.org/img/wn/${
      forecast.weather[0].icon
    }@2x.png" alt=${forecast.description}/><h6>${Math.round(
      forecast.main.temp
    )}°C | ${Math.round((forecast.main.temp * 9) / 5 + 32)}°F</h6></div>`;
  }
}

//Temperature conversion functions

function displayFahrenheitTemp(event) {
  let tempDisplay = document.querySelector("#temp-display");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;

  tempDisplay.innerHTML = Math.round(fahrenheitTemperature);
  celsiusConvert.classList.remove("active");
  fahrenheitConvert.classList.add("active");
}
function displayCelsiusTemp(event) {
  let tempDisplay = document.querySelector("#temp-display");

  tempDisplay.innerHTML = Math.round(celsiusTemperature);
  celsiusConvert.classList.add("active");
  fahrenheitConvert.classList.remove("active");
}
let celsiusTemperature = null;
let celsiusConvert = document.querySelector("#cels-convert");
celsiusConvert.addEventListener("click", displayCelsiusTemp);
let fahrenheitConvert = document.querySelector("#fahr-convert");
fahrenheitConvert.addEventListener("click", displayFahrenheitTemp);
