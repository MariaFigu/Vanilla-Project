let currentTime = new Date();
let month = [
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
month = month[currentTime.getMonth()];

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let day = days[currentTime.getDay()];

let globalCelsius;
let globalFahreneit;

function showTemperature(response) {
  let city = response.data.name;
  let temp = Math.round(response.data.main.temp);
  let description = response.data.weather[0].description;

  console.log(response);

  globalCelsius = temp;
  globalFahreneit = Math.round((temp * 9) / 5 + 32);

  let humidity = response.data.main.humidity;
  let windSpeed = response.data.wind.speed;

  showDetails(city, temp, description, humidity, windSpeed);
}

function showDetails(city, temp, description, humidity, windSpeed) {
  let h2 = document.querySelector("h2");
  h2.innerHTML = city;

  let date = document.querySelector(".date");
  date.innerHTML =
    day +
    ", " +
    currentTime.getDate() +
    " " +
    month +
    " " +
    currentTime.getFullYear();

  let hour = document.querySelector(".hour");
  hour.innerHTML = currentTime.toLocaleTimeString();

  let degrees = document.querySelector(".temp");
  degrees.innerHTML = temp;

  let mood = document.querySelector(".mood");
  mood.innerHTML = description;

  let rain = document.querySelector("#chance-rain");
  rain.innerHTML = `Humidity: ${humidity}%`;

  let wind = document.querySelector("#wind-speed");
  wind.innerHTML = `Wind speed: ${windSpeed}`;
}

function currentTempCelsius(event) {
  event.preventDefault();

  let temp = document.querySelector(".temp");
  temp.innerHTML = globalCelsius;
}

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", currentTempCelsius);

function currentTempFahr(event) {
  event.preventDefault();

  let temp = document.querySelector(".temp");
  temp.innerHTML = globalFahreneit;
}

let fahreneit = document.querySelector("#fahreneit");
fahreneit.addEventListener("click", currentTempFahr);

function showCoords(position) {
  let apiKey = "c1523e5633a5a3610a4671a851484050";
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);
}

function showCity(city) {
  let apiKey = "c1523e5633a5a3610a4671a851484050";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);
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
