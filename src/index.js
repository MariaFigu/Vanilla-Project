function formatDate(timestamp) {
  let date = new Date(timestamp);

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  month = months[date.getMonth()];

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];

  return `${day}, ${date.getDate()} ${month} ${date.getFullYear()}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

let globalCelsius;
let globalFahreneit;
let realFeelCelsius;
let realFeelFahreneit;
let iconElement;

function showTemperature(response) {
  let city = response.data.name;
  let timestamp = response.data.dt;

  let iconElement = response.data.weather[0].icon;

  let temp = Math.round(response.data.main.temp);
  let description = response.data.weather[0].description;

  console.log(response);

  globalCelsius = temp;
  globalFahreneit = Math.round((temp * 9) / 5 + 32);

  let realFeel = Math.round(response.data.main.feels_like);
  realFeelCelsius = realFeel;
  realFeelFahreneit = Math.round((realFeel * 9) / 5 + 32);

  let humidity = response.data.main.humidity;
  let windSpeed = response.data.wind.speed;

  showDetails(
    city,
    timestamp,
    iconElement,
    temp,
    description,
    realFeel,
    humidity,
    windSpeed
  );
}

function showDetails(
  city,
  timestamp,
  iconElement,
  temp,
  description,
  realFeel,
  humidity,
  windSpeed
) {
  let h2 = document.querySelector("h2");
  h2.innerHTML = city;

  let date = document.querySelector(".date");
  date.innerHTML = formatDate(timestamp * 1000);

  let hour = document.querySelector(".hour");
  hour.innerHTML = "Last updated: " + formatHours(timestamp * 1000);

  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconElement}@2x.png`
  );

  let degrees = document.querySelector(".temp");
  degrees.innerHTML = temp;

  let mood = document.querySelector(".mood");
  mood.innerHTML = description;

  let feeling = document.querySelector("#real-feel");
  feeling.innerHTML = `<strong>Real Feel: </strong>${realFeel}°`;

  let rain = document.querySelector("#chance-rain");
  rain.innerHTML = `<strong>Humidity: </strong>${humidity}%`;

  let wind = document.querySelector("#wind-speed");
  wind.innerHTML = `<strong>Wind speed: </strong>${windSpeed}`;
}

function currentTempCelsius(event) {
  event.preventDefault();

  let temp = document.querySelector(".temp");
  temp.innerHTML = globalCelsius;

  let feeling = document.querySelector("#real-feel");
  feeling.innerHTML = `<strong>Real Feel: </strong>${realFeelCelsius}°`;
}

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", currentTempCelsius);

function currentTempFahr(event) {
  event.preventDefault();

  let temp = document.querySelector(".temp");
  temp.innerHTML = globalFahreneit;

  let feeling = document.querySelector("#real-feel");
  feeling.innerHTML = `<strong>Real Feel: </strong>${realFeelFahreneit}°`;
}

let fahreneit = document.querySelector("#fahreneit");
fahreneit.addEventListener("click", currentTempFahr);

function showCoords(position) {
  let apiKey = "c1523e5633a5a3610a4671a851484050";
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += ` 
      <div class="card-day border">
                <strong> ${formatHours(
                  forecast.dt * 1000
                )}</strong>  <img src= "http://openweathermap.org/img/wn/${
      forecast.weather[0].icon
    }.png" > <br />
                <small> <strong>${Math.round(
                  forecast.main.temp_max
                )}°</strong> /${Math.round(forecast.main.temp_min)}°</small>
              </div>`;
  }
}

function showCity(city) {
  let apiKey = "c1523e5633a5a3610a4671a851484050";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showCoords);
}

getCurrentPosition();
let currentCity = document.querySelector("#current-location");
currentCity.addEventListener("click", getCurrentPosition);

function searchCity(event) {
  event.preventDefault();
  let form = document.querySelector("#search-city");
  showCity(form.value);
}
let city = document.querySelector("#magnifier");
city.addEventListener("click", searchCity);
