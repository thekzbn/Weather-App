const apiKey = "3b65f1bc7b0de2d7df867b6f020ae01f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&q=";
const mainPage = "https://thekzbn.name.ng";
const searchBox = document.querySelector(".search-section input");
const searchBtn = document.querySelector(".search-section button");
const weatherSymbol = document.querySelector(".weather-symbol");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-toggle .material-symbols-outlined");

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

            // Set the weather data on the page
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp - 273.15) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = Math.round(data.wind.speed * 3.6) + " km/h";

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
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    themeIcon.textContent = newTheme === 'light' ? 'dark_mode' : 'light_mode';
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'light' ? 'dark_mode' : 'light_mode';
}

// Theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);

// Initialize theme on page load
loadTheme();

// Initialize with a default city or leave empty
// checkWeather("Lagos");