const apiKey = "3b65f1bc7b0de2d7df867b6f020ae01f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const mainPage = "https://thekzbn.name.ng";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weatherIcon");
const errorEl = document.querySelector(".error");
const weatherEl = document.querySelector(".weather");
const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle.querySelector("span");

async function checkWeather(city) {
  if (!city) return;

  if (city === "KingZIngBossNoreos") {
    window.location.href = mainPage;
    return;
  }

  try {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
    if (response.status === 404) {
      errorEl.style.display = "block";
      weatherEl.style.display = "none";
      return;
    }

    const data = await response.json();

    document.querySelector(".city").textContent = data.name;
    const tempK = Math.round(data.main.temp);
    const tempC = Math.round(data.main.temp - 273.15);
    document.querySelector(".temp").textContent = `${tempK}K or ${tempC}°C`;
    document.querySelector(".humidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.querySelector(".wind").textContent = `Wind: ${data.wind.speed}km/hr`;

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
      default:
        weatherIcon.src = "assets/images/unknown.png";
        break;
    }

    weatherEl.style.display = "block";
    errorEl.style.display = "none";
  } catch (err) {
    errorEl.style.display = "block";
    weatherEl.style.display = "none";
  }
}

searchBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") checkWeather(searchBox.value.trim());
});
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value.trim());
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  icon.textContent = document.body.classList.contains("dark") ? "dark_mode" : "light_mode";
});
