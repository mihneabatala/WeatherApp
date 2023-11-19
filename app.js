const APIKEY='';
const weatherCity = document.querySelector('.weather-city');
const inputText = document.querySelector('#search');
const mainDegrees = document.querySelector('.degrees');
const imgInfo = document.querySelector('.icon');
const dayInfo = document.querySelector('.day-info');
const littleCity = document.querySelector('.city-name');
const max_min_feels_like =document.querySelector('.max-min-feels-like');
const Humidity = document.querySelector('.h-percent');
const cloudiness = document.querySelector('.c-percent');
const windness = document.querySelector('.w-percent');
const Sunrise = document.querySelector('.sunrise-data');
const Sunset = document.querySelector('.sunset-data');


function fetchWeather(city){
    
    fetch("https://api.openweathermap.org/data/2.5/weather?q="
        + city +
        "&units=metric&appid="
        + APIKEY)
        .then((response) => {
            if(!response.ok){
                throw new Error('Misspelled city !');
            }
            return response.json();
        })
        .then((data) => {
            displayWeather(data);
        })
        .catch((error) =>{
            alert(error.message);
        })
}
function changeWeather(name) {
    
    const backgroundImageUrl = "https://source.unsplash.com/random/1920x1080/?" + name;

    return new Promise((resolve, reject) =>{
        const img = new Image();
        img.src = backgroundImageUrl;
        img.onload = () =>{
            document.body.style.backgroundImage = `url('${backgroundImageUrl}')`;
            resolve();
        }
    });
    
}

async function displayWeather(data){
    const {name} = data;

    await changeWeather(name);

    const {icon, description} = data.weather[0];
    const {temp, temp_min, temp_max, feels_like, humidity} = data.main;
    const {speed} = data.wind;
    const {clouds} = data;
    const {sunrise, sunset} = data.sys;
    const {timezone}= data;
    weatherCity.innerHTML = "Weather in " + name;
    mainDegrees.innerHTML = Math.floor(temp).toString() + '°C';
    imgInfo.src = "https://openweathermap.org/img/wn/" + icon +"@2x.png";
    
    let arr = description.split(" ")
    
    for(let i=0;i<arr.length;i++){
        arr[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
    }
    
    let modifDescription = arr.join(" ");

    dayInfo.innerHTML = modifDescription;
    littleCity.innerHTML = name[0].toUpperCase() + name.slice(1);
    max_min_feels_like.innerHTML = Math.floor(temp_max) + "° / " + Math.floor(temp_min) + "° Feels like " + Math.floor(feels_like) + "°";
    Humidity.innerHTML = humidity+"%";
    cloudiness.innerHTML = clouds.all+ "%";
    windness.innerHTML = Math.floor(speed*3.6) + " km/h";

    const sunrise_date = new Date((sunrise+timezone) * 1000);
    const sunset_date = new Date((sunset+timezone) * 1000);

    const dateTimeFormat = new Intl.DateTimeFormat('en-Uk', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'UTC', 
    });

    const formattedSunrise = dateTimeFormat.format(sunrise_date);
    const formattedSunset = dateTimeFormat.format(sunset_date);

    Sunrise.innerHTML = formattedSunrise;
    Sunset.innerHTML = formattedSunset;

    
}

function searchCity(){
    if(inputText.value == ''){
        alert('Search for a city !');
    }
    else{
        fetchWeather(inputText.value);
        inputText.value = '';
    }
}

inputText.addEventListener('keyup', (event) =>{
    if(event.key == 'Enter'){
        searchCity();
    }
})

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showCurrentWeather);
    } else {
        alert("Geolocation is not supported by this browser.");
    }

function showCurrentWeather(position) {
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + position.coords.latitude +'&lon=' + position.coords.longitude +'&units=metric&appid='
    + APIKEY)
        .then((response) => {
            if(!response.ok){
                throw new Error("Can't get location!");
            }
            return response.json();
        })
        .then((data) => {
            displayWeather(data);
        })
        .catch((error) =>{
            console.log(error.message);
        })
    }

