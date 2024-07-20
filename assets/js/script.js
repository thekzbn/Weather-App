const apiKey = "3b65f1bc7b0de2d7df867b6f020ae01f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weatherIcon")
/**
 * Checks the weather for a given city.
 * @param {string} city The city to check the weather for.
 * @returns {Promise<void>}
 */
async function checkWeather(city) {
    // Get the weather data from the API
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    // Handle errors
    if (response.status == 404) {
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
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "K" + " or " + Math.round(data.main.temp - 273) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/hr";

        // Set the weather icon based on the weather
        switch (data.weather[0].main) {
            case "Clouds":
                weatherIcon.src = "assets/images/clouds.png";
                break;
            case "Clear":
                weatherIcon.src = "assets/images/clear.png";
                break;
            case "Rain":
                weatherIcon.src = "assets/images/rain.png";
                break;
            case "Drizzle":
                weatherIcon.src = "assets/images/drizzle.png";
                break;
            case "Mist":
                weatherIcon.src = "assets/images/mist.png";
                break;
        }

        // Show the weather data on the page
        document.querySelector(".weather").style.display = "block";
        // Hide the error message
        document.querySelector(".error").style.display = "none";
    }


}



searchBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

checkWeather();