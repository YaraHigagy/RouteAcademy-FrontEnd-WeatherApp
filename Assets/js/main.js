// Bg imgs array
var bgImgsList = [
    {
        bg: 'teal',
        url: 'painting-mountain-lake-with-mountain-background.jpg'
    },
    {
        bg: 'maroon',
        url: 'majestic-mountain-peak-tranquil-winter-landscape-generated-by-ai.jpg'
    },
    {
        bg: 'peach',
        url: 'geometric-vintage-retro-background-ai-generated-image.jpg'
    },
    {
        bg: 'purple',
        url: 'ultra-detailed-nebula-abstract-wallpaper-10.jpg'
    },
];
// Week days and months names
const days = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday","Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Select elements from HTML
// Search Location Section
var searchInput = document.querySelector('#searchInput');
var searchBtn = document.querySelector('#searchBtn');
var searchError = document.querySelector('#search-sec .costume-input .badge');

// Forecast Body Section
var forecastDays = document.querySelectorAll('.forecast-card .day');
var forecastDate = document.querySelector('.forecast-card .date');
var forecastLocation = document.querySelector('.forecast-card .location');
var forecastTempNums = document.querySelectorAll('.forecast-card .temperature>.temperature-num');
var forecastTempMinNums = document.querySelectorAll('.forecast-card .temperature>.temperature-min-num');
var forecastTempImgs = document.querySelectorAll('.forecast-card .temperature img');
var forecastSkyConditions = document.querySelectorAll('.forecast-card .sky-condition');
var forecastRain = document.querySelector('.forecast-card ul>li .rain');
var forecastWind = document.querySelector('.forecast-card ul>li .wind');
var forecastHumidity = document.querySelector('.forecast-card ul>li .humidity');

// Initialize global variables
var forecastList;
var locationObj;
var searchValue;
var localLat;
var localLong;

// Get the last location before reloading
getLocation();
if(localStorage.getItem("preserved-location")) {
    searchInput.value = localStorage.getItem("preserved-location");
    searchValue = localStorage.getItem("preserved-location");
}
(async function() {
    await getAllData(searchValue || 'cairo');
    if(localLat & localLong) {
        await getAllData();
    }
    if(searchValue) {
        await getAllData(searchValue);
    }
    updateForecastData();
})();

// Get searchInput results from user
searchInput.addEventListener('input', (e) => {
    if(e.target.value.length >= 3) {
        searchValue = e.target.value;
        (async function() {
            await getAllData(searchValue);
            updateForecastData();
            fromListToLocalStorage('preserved-location', searchValue);
        })();
    }
    if(e.target.value == 0) {
        searchError.classList.replace('d-block', 'd-none');
        fromListToLocalStorage('preserved-location', '');
    }
});
// searchBtn.addEventListener('click', () => searchValue);

// Getting API request
async function getAllData(location) {
    try {
        var response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=a9a89e17a89e494d9b9105657243103&q=${location? location : `${localLat},${localLong}`}&days=3`);
        var data = await response.json();
        forecastList = data.forecast.forecastday;
        locationObj = data.location.name;
        searchError.classList.replace('d-block', 'd-none');
    } catch(err) {
        searchError.classList.replace('d-none', 'd-block');
    }
}

// Update forecast-card data
function updateForecastData() {
    forecastLocation.innerText = locationObj;

    for(i = 0; i < forecastList.length; i++) {
        var dayWeekNum = new Date(forecastList[i].date).getDay();
        forecastDays[i].innerText = days[dayWeekNum];
        forecastTempImgs[i].src = forecastList[i].day.condition.icon;
        forecastSkyConditions[i].innerText = forecastList[i].day.condition.text;
        if(i > 0) {
            forecastTempNums[i-1].innerText = forecastList[i].day.maxtemp_c;
            forecastTempMinNums[i-1].innerText = forecastList[i].day.mintemp_c;
        }
    }

    var dayNum = new Date(forecastList[0].date).getDate();
    var monthNum = new Date(forecastList[0].date).getMonth();
    forecastDate.innerText = `${dayNum} ${months[monthNum]}`;

    forecastTempNums[0].innerText = forecastList[0].day.avgtemp_c;
    forecastRain.innerText = forecastList[0].day.daily_chance_of_rain;    
    forecastWind.innerText = forecastList[0].day.maxwind_kph;
    forecastHumidity.innerText = forecastList[0].day.avghumidity;
}

function fromListToLocalStorage(itemName, itemValue) {
    localStorage.setItem(`${itemName}`, itemValue);
}

function clearInputsValues() {
    searchInput.value = '';
}

// Get user's location to load it by default
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    localLat = position.coords.latitude.toFixed(2);
    localLong = position.coords.longitude.toFixed(2);
    return localLat, localLong;
}