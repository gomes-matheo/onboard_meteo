//ASYNC FUNCTION FOR FETCHING EXTERNAL JSON FILE TO A JS OBJECT
async function fetchConfigFile() {
  try {
    //GET PROMISE AND WAIT FOR SERVER RESPONSE
    const response = await fetch("config/config.json");

    //IF HTTP STATUS RETURNS OK => CONVERT FETCHED JSON TO JS OBJECT
    if (response.status === 200) {
      console.log("Successfully received config.json informations");

      //GET PROMISE AND WAIT FOR JSON CONSTRUCTION
      const configBody = await response.json();
      console.log(configBody);
      return configBody;

      ///IF HTTPS STATUS RETURNS NOT FOUND
    } else if (response.status === 404) {
      console.log("config.json not found");
    } else {
    }
    console.log(response);
  } catch (error) {
    // FOR EXTERNAL OR UKNOWN ERRORS
    window.alert("A config.json error has occured");
    console.error(error);
  }
}

//ASYNC FUNCTION FOR FETCHING WEATHER API FROM "openweathermap.com"
async function fetchWeatherApi(town, latitude, longitude) {
  const mesureUnits = "metric";
  const lang = "fr"; //OR EN FOR ENGLISH
  const apiKey = "72b86c523ab4533f085efceb8ce41edf";
  let apiUrl;

  if ((!latitude && longitude === null) || latitude || longitude === null) {
    console.log("Latitude and longitude are defined");
    apiUrl =
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&appid=" +
      apiKey +
      "&units=" +
      mesureUnits +
      "&lang=" +
      lang;
  } else {
    console.log("No latitude or longitude found");
    apiUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      town +
      "&appid=" +
      apiKey +
      "&units=" +
      mesureUnits +
      "&lang=" +
      lang;
  }

  //+"&units=metric";   //METRIC DONT WORK ?

  console.log(apiUrl);
  try {
    //GET PROMISE AND WAIT FOR SERVER RESPONSE
    const weatherInfos = await fetch(apiUrl);

    //IF HTTP STATUS RETURNS OK => CONVERT FETCHED JSON TO JS OBJECT
    if (weatherInfos.status === 200) {
      console.log("Successfully received API informations");

      //GET PROMISE AND WAIT FOR JSON CONSTRUCTION
      const weatherData = await weatherInfos.json();
      console.log("Prepare return of weatherData");
      console.log(weatherData);
      return weatherData;

      ///IF HTTPS STATUS RETURNS NOT FOUND
    } else if (weatherInfos.status === 404) {
      console.log("API not found");
    } else {
    }
    console.log(weatherInfos);
  } catch (error) {
    // FOR EXTERNAL OR UKNOWN ERRORS
    window.alert("An unknown API error has occured");
    console.error(error);
  }
}

//REAL TIME CLOCK CONFIGURATION AND DISPLAY (from local, not using api)
function updateTime() {
  //REAL TIME DISPLAY (not using api)
  const currentDay = new Date();

  let currentHour = String(currentDay.getHours()).padStart(2, "0");
  let currentMinute = String(currentDay.getMinutes()).padStart(2, "0");
  let currentSecond = String(currentDay.getSeconds()).padStart(2, "0");

  const currentTime = currentHour + ":" + currentMinute + ":" + currentSecond;

  //DISPLAY TIME INFOS
  document.getElementById("timeInfo").innerHTML = currentTime;

  if (
    currentDay.currentHour === 0 &&
    currentMinute === 0 &&
    currentSecond === 0
  )
    currentDate();
}

//USER DATE FROM LOCAL
function currentDate() {
  const today = new Date();
  const day = String(today.getDay()).padStart(2, "0");
  const month = String(today.getMonth()).padStart(2, "0");
  const year = today.getFullYear();
  document.getElementById("todayDate").innerHTML =
    day + "/" + month + "/" + year;
}

//MAIN FUNCTION TO EXECUTE ALL HTML MODIFICATION, FETCH, ETC
async function main() {
  console.log("REFRESHED MAIN FUNCTION");

  //CONFIG FILE INFOS
  const jsonConfigMain = await fetchConfigFile();
  const town = jsonConfigMain.town;
  const latitude = jsonConfigMain.latitude_optional;
  const longitude = jsonConfigMain.longitude_optionnal;
  console.log("Successfully parsed config.json infos : " + town);

  //API ACCESS INFOS
  console.log("Testing API...");
  const weatherApiInfos = await fetchWeatherApi(town, latitude, longitude);

  //API WEATHER INFOS
  const weatherDesc = weatherApiInfos.weather[0].description;
  console.log("Weather is : " + weatherDesc);
  const weatherIcon = weatherApiInfos.weather[0].icon;
  console.log("Icon code is : " + weatherIcon);

  //API TEMPERATURE INFOS
  const temperature = weatherApiInfos.main.temp;
  console.log("Temperature is : " + temperature);

  //API FELT TEMPERATURE INFOS + WE NEED TO CONVERT KELVIN TO CELSIUS
  const temperatureFelt = weatherApiInfos.main.feels_like;
  console.log("Felt temperature is : " + temperatureFelt);

  //API HUMIDITY INFOS
  const humidity = weatherApiInfos.main.humidity;
  console.log(humidity + "%");

  //API WIND INFOS
  const windSpeed = weatherApiInfos.wind.speed;
  console.log("Wind speed is : " + windSpeed);

  //SET INFOS TO HTML BODY FROM IDS
  document.getElementById("TownInfo").innerHTML = town;
  currentDate();
  document.getElementById("MeteoInfo").innerHTML = weatherDesc;
  document.getElementById("WeatherIcon").src =
    "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
  setInterval(updateTime, 1000);
  document.getElementById("TemperatureInfo").innerHTML = temperature + "°C";
  document.getElementById("FeltTemperature").innerHTML = temperatureFelt + "°C";
  document.getElementById("HumidityInfos").innerHTML = humidity + "%";
  document.getElementById("WindSpeed").innerHTML =
    (windSpeed * 2.769).toFixed(2) + "Km/h";
}

//DEBUG
console.log("Hello World!");

//FIRST EXECUTION OF MAIN
main();

//AUTO REFRESH AFTER AN HOUR (after user page load)
setInterval(() => {
  console.log("refreshing API");
  main();
}, 60 * 60 * 1000); //60h * 60min * 1000ms
