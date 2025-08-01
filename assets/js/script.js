const apiKey = "3b65f1bc7b0de2d7df867b6f020ae01f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?&q=";
const mainPage = "https://thekzbn.name.ng";
const searchBox = document.querySelector(".search-section input");
const searchBtn = document.querySelector(".search-section button");
const weatherSymbol = document.querySelector(".weather-symbol");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-toggle .material-symbols-outlined");
const tempToggle = document.querySelector(".temp-toggle");
const tempUnitDisplay = document.querySelector(".temp-unit");
const clockElement = document.getElementById("clock");

// Temperature unit state
let currentTempUnit = 'celsius'; // celsius, fahrenheit, kelvin
let currentTempValue = null; // Store the Kelvin value from API
let cityTimezone = null; // Store the timezone offset for the city

/**
 * Checks the weather for a given city.
 * @param {string} city - The city to check the weather for.
 * @returns {Promise<void>} - A promise that resolves when the weather is checked.
 */
async function checkWeather(city) {
    if (!city) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        return;
    }

    try {
        // Fetch the weather data from the API
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        // Check for easter egg
        if (city.toLowerCase() === "thekzbn" || city.toLowerCase() === "kingzingbossnoreos") {
            // Redirect the user to the main page
            window.location.href = mainPage;
            return;
        }

        // Handle errors
        if (response.status === 404) {
            // Show the error message
            document.querySelector(".error").style.display = "block";
            // Hide the weather data
            document.querySelector(".weather").style.display = "none";
        } else {
            // Get the weather data from the response
            const data = await response.json();

            // Log the data to the console
            console.log(data);

            // Store temperature in Kelvin for unit conversion
            currentTempValue = data.main.temp;
            
            // Store timezone offset (in seconds)
            cityTimezone = data.timezone;
            
            // Set the weather data on the page
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = formatTemperature(currentTempValue, currentTempUnit);
            
            // Basic weather details
            const feelsLikeElement = document.querySelector(".feels-like");
            feelsLikeElement.innerHTML = formatTemperature(data.main.feels_like, currentTempUnit);
            feelsLikeElement.dataset.kelvin = data.main.feels_like;
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = Math.round(data.wind.speed * 3.6) + " km/h";
            document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
            document.querySelector(".visibility").innerHTML = (data.visibility / 1000).toFixed(1) + " km";
            document.querySelector(".clouds").innerHTML = data.clouds.all + "%";
            
            // Sunrise and sunset times
            const sunrise = new Date((data.sys.sunrise + cityTimezone) * 1000);
            const sunset = new Date((data.sys.sunset + cityTimezone) * 1000);
            document.querySelector(".sunrise").innerHTML = sunrise.toLocaleTimeString('en-US', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit'
            });
            document.querySelector(".sunset").innerHTML = sunset.toLocaleTimeString('en-US', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Precipitation data (show only if present)
            const precipitationDiv = document.querySelector(".precipitation");
            const rainInfo = document.querySelector(".rain-info");
            const snowInfo = document.querySelector(".snow-info");
            
            let showPrecipitation = false;
            
            if (data.rain && data.rain["1h"]) {
                document.querySelector(".rain-volume").innerHTML = data.rain["1h"] + " mm";
                rainInfo.style.display = "flex";
                showPrecipitation = true;
            } else {
                rainInfo.style.display = "none";
            }
            
            if (data.snow && data.snow["1h"]) {
                document.querySelector(".snow-volume").innerHTML = data.snow["1h"] + " mm";
                snowInfo.style.display = "flex";
                showPrecipitation = true;
            } else {
                snowInfo.style.display = "none";
            }
            
            precipitationDiv.style.display = showPrecipitation ? "flex" : "none";
            
            // Update city time
            updateCityTime();
            
            // Fetch 5-day forecast
            fetchForecast(city);

            // Set the weather icon based on the weather
            switch (data.weather[0].main) {
                case "Clouds":
                    weatherSymbol.textContent = "cloud";
                    break;
                case "Clear":
                    weatherSymbol.textContent = "sunny";
                    break;
                case "Rain":
                    weatherSymbol.textContent = "rainy";
                    break;
                case "Drizzle":
                    weatherSymbol.textContent = "rainy";
                    break;
                case "Mist":
                case "Fog":
                case "Haze":
                    weatherSymbol.textContent = "foggy";
                    break;
                case "Snow":
                    weatherSymbol.textContent = "ac_unit";
                    break;
                case "Thunderstorm":
                    weatherSymbol.textContent = "thunderstorm";
                    break;
                default:
                    weatherSymbol.textContent = "sunny";
            }

            // Show the weather data on the page
            document.querySelector(".weather").style.display = "block";
            // Hide the error message
            document.querySelector(".error").style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    }
}

// Event listeners
searchBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        checkWeather(searchBox.value.trim());
    }
});

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value.trim());
});

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
        // Switch to dark theme
        document.documentElement.removeAttribute('data-theme');
        themeIcon.textContent = 'light_mode';
        localStorage.setItem('theme', 'dark');
    } else {
        // Switch to light theme
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.textContent = 'dark_mode';
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark theme if no saved preference
    const theme = savedTheme || 'dark';
    
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.textContent = 'dark_mode';
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.textContent = 'light_mode';
    }
}

// Theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);

// Temperature conversion functions
function formatTemperature(kelvin, unit) {
    if (!kelvin) return '';
    
    let temp, symbol;
    
    switch(unit) {
        case 'fahrenheit':
            temp = Math.round((kelvin - 273.15) * 9/5 + 32);
            symbol = '°F';
            break;
        case 'kelvin':
            temp = Math.round(kelvin);
            symbol = 'K';
            break;
        case 'celsius':
        default:
            temp = Math.round(kelvin - 273.15);
            symbol = '°C';
            break;
    }
    
    return temp + symbol;
}

// Temperature unit toggle functionality
function toggleTempUnit() {
    const units = ['celsius', 'fahrenheit', 'kelvin'];
    const symbols = ['°C', '°F', 'K'];
    
    const currentIndex = units.indexOf(currentTempUnit);
    const nextIndex = (currentIndex + 1) % units.length;
    
    currentTempUnit = units[nextIndex];
    tempUnitDisplay.textContent = symbols[nextIndex];
    
    // Update temperature display if we have weather data
    if (currentTempValue) {
        document.querySelector(".temp").innerHTML = formatTemperature(currentTempValue, currentTempUnit);
        // Also update feels like temperature if available
        const feelsLikeElement = document.querySelector(".feels-like");
        if (feelsLikeElement && feelsLikeElement.dataset.kelvin) {
            feelsLikeElement.innerHTML = formatTemperature(parseFloat(feelsLikeElement.dataset.kelvin), currentTempUnit);
        }
        // Update forecast temperatures
        updateForecastTemperatures();
    }
    
    // Save preference
    localStorage.setItem('tempUnit', currentTempUnit);
}

// Load saved temperature unit
function loadTempUnit() {
    const savedUnit = localStorage.getItem('tempUnit') || 'celsius';
    const symbols = { celsius: '°C', fahrenheit: '°F', kelvin: 'K' };
    
    currentTempUnit = savedUnit;
    tempUnitDisplay.textContent = symbols[savedUnit];
}

// Clock functionality
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    clockElement.textContent = timeString;
}

// City time functionality
function updateCityTime() {
    if (!cityTimezone) return;
    
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const cityTime = new Date(utc + (cityTimezone * 1000));
    
    const timeString = cityTime.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const dateString = cityTime.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
    
    document.querySelector(".city-time").textContent = `${dateString}, ${timeString}`;
}

// Initialize clock and update every second
function startClock() {
    updateClock();
    setInterval(() => {
        updateClock();
        updateCityTime(); // Also update city time every second
    }, 1000);
}

// Event listeners
tempToggle.addEventListener('click', toggleTempUnit);

// Fetch 5-day forecast
async function fetchForecast(city) {
    try {
        const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
        if (response.ok) {
            const data = await response.json();
            displayForecast(data);
        }
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

// Display 5-day forecast
function displayForecast(data) {
    const forecastContainer = document.querySelector(".forecast-container");
    forecastContainer.innerHTML = "";
    
    // Get daily forecasts (one per day at 12:00 PM when available)
    const dailyForecasts = [];
    const seenDates = new Set();
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toDateString();
        
        if (!seenDates.has(dateString) && dailyForecasts.length < 5) {
            dailyForecasts.push(item);
            seenDates.add(dateString);
        }
    });
    
    dailyForecasts.forEach(forecast => {
        const forecastItem = document.createElement("div");
        forecastItem.className = "forecast-item";
        
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const weatherIcon = getWeatherSymbol(forecast.weather[0].main);
        const highTemp = formatTemperature(forecast.main.temp_max, currentTempUnit);
        const lowTemp = formatTemperature(forecast.main.temp_min, currentTempUnit);
        
        forecastItem.innerHTML = `
            <div class="forecast-date">${dayName}<br>${monthDay}</div>
            <span class="material-symbols-outlined forecast-icon">${weatherIcon}</span>
            <div class="forecast-temps">
                <div class="forecast-high" data-kelvin="${forecast.main.temp_max}">${highTemp}</div>
                <div class="forecast-low" data-kelvin="${forecast.main.temp_min}">${lowTemp}</div>
            </div>
            <div class="forecast-desc">${forecast.weather[0].description}</div>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

// Get weather symbol for forecast
function getWeatherSymbol(weather) {
    switch(weather) {
        case "Clouds": return "cloud";
        case "Clear": return "sunny";
        case "Rain": return "rainy";
        case "Drizzle": return "rainy";
        case "Mist":
        case "Fog":
        case "Haze": return "foggy";
        case "Snow": return "ac_unit";
        case "Thunderstorm": return "thunderstorm";
        default: return "sunny";
    }
}

// Update forecast temperatures when unit changes
function updateForecastTemperatures() {
    document.querySelectorAll(".forecast-high").forEach(element => {
        if (element.dataset.kelvin) {
            element.innerHTML = formatTemperature(parseFloat(element.dataset.kelvin), currentTempUnit);
        }
    });
    
    document.querySelectorAll(".forecast-low").forEach(element => {
        if (element.dataset.kelvin) {
            element.innerHTML = formatTemperature(parseFloat(element.dataset.kelvin), currentTempUnit);
        }
    });
}

// Initialize everything on page load
loadTheme();
loadTempUnit();
startClock();

// Initialize with a default city or leave empty
// checkWeather("Lagos");
