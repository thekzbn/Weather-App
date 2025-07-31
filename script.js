const apiKey = "3b65f1bc7b0de2d7df867b6f020ae01f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&q=";
const mainPage = "https://thekzbn.name.ng";
const searchBox = document.querySelector(".search-section input");
const searchBtn = document.querySelector(".search-section button");
const weatherIcon = document.querySelector(".weatherIcon");

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
                    weatherIcon.src = "https://weather.thekzbn.name.ng/assets/images/clouds.png";
                    break;
                case "Clear":
                    weatherIcon.src = "https://weather.thekzbn.name.ng/assets/images/clear.png";
                    break;
                case "Rain":
                    weatherIcon.src = "https://weather.thekzbn.name.ng/assets/images/rain.png";
                    break;
                case "Drizzle":
                    weatherIcon.src = "https://weather.thekzbn.name.ng/assets/images/drizzle.png";
                    break;
                case "Mist":
                case "Fog":
                case "Haze":
                    weatherIcon.src = "https://weather.thekzbn.name.ng/assets/images/mist.png";
                    break;
                case "Snow":
                    weatherIcon.src = "https://weather.thekzbn.name.ng/assets/images/snow.png";
                    break;
                case "Thunderstorm":
                    weatherIcon.src = "https://weather.thekzbn.name.ng/assets/images/thunderstorm.png";
                    break;
                default:
                    weatherIcon.src = "https://weather.thekzbn.name.ng/assets/images/clear.png";
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

// Initialize with a default city or leave empty
// checkWeather("Lagos");