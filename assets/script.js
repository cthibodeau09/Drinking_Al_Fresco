$(document).ready(function () {
    // Search Variables
    const searchBtn = $("#searchBtn");
    const clearBtn = $("#clearBtn");
    let searchCity = $("#city");
    let searchHistory = $("#search-history");
    var city = "";

    // Current Variables
    const cityDate = $("#city-date");
    const cityIcon = $("#city-icon");
    const cityTemp = $("#city-temp");
    const cityWind = $("#city-wind");
    const cityHumidity = $("#city-humidity");

    // Date
    const todayDate = dayjs();

    // ***Functions***

    // Find current weather
    function currentQueryURL() {
        // OpenWeather API URL
        var currentURL = `https://api.openweathermap.org/data/2.5/weather?`;

        // OpenWeather API Key
        var APIKey = { "APPID": "f3e794b6f19299364c3a368c93f4e895" };

        // Search term
        APIKey.q = searchCity
            .val()
            .trim();

        // Generate URL
        return currentURL + $.param(APIKey);
    };

    // OpenBrewery DB API 
    let breweryURL = `https://api.openbrewerydb.org/breweries?by_city`;

    // Generate page content based on API response
    function findCurrentWeather(response) {

        // Weather icon details
        let weatherIcon = response.weather[0].icon;
        let weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
        let weatherIconDescrip = response.weather[0].description;
        // Convert temp to Fahrenheit
        let tempF = (response.main.temp - 273.15) * 1.80 + 32;
        // City name
        city = response.name;
        // Current weather details
        cityDate.text(`${city} (${todayDate.format("MM/DD/YYYY")})`);
        cityDate.append(cityIcon.attr("src", weatherIconURL).attr("alt", `${weatherIconDescrip}`).attr("title", `${weatherIconDescrip}`));
        cityTemp.text(`Temperature: ${tempF.toFixed(2)} ℉`);
        cityWind.text(`Wind Speed: ${response.wind.speed} MPH`);
        cityHumidity.text(`Humidity: ${response.main.humidity}%`);

        // 2 Day Forecast
        let currentLat = response.coord.lat;
        let currentLong = response.coord.lon;
        // Brewery Info
        let forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentLat}&lon=${currentLong}&exclude=current,minutely,hourly&appid=f3e794b6f19299364c3a368c93f4e895`;
        let breweryCityURL = `${breweryURL}=${city}`;

        // AJAX for current 2-day forecast
        $.ajax({
            url: forecastURL,
            method: "GET"
        })
            .then(function (response) {
                $(".day").each(function (day) {
                    var day = day + 1;
                    $(this).html("");
                    // Forecast date
                    let dayStatus = dayjs.unix(response.daily[day].dt).format("MM/DD/YYYY");
                    // Weather icon details
                    let forecastIcon = response.daily[day].weather[0].icon;
                    let forecastIconURL = `https://openweathermap.org/img/wn/${forecastIcon}.png`;
                    let forecastIconDescrip = response.daily[day].weather[0].description;
                    // Temperature - converted to Fahrenheit
                    let forecastTempF = ((response.daily[day].temp.day - 273.15) * 1.80 + 32).toFixed(2);
                    // Wind Speed
                    let forecastWind = response.daily[day].wind_speed;
                    // Humidity
                    let forecastHumidity = response.daily[day].humidity;
                    // Fill out forecast
                    let newDiv = $("<div>").attr("class", "day-body");
                    let newDate = $("<h5>").attr("class", "day-date has-text-weight-bold is-underlined").text(dayStatus);
                    let newIcon = $("<p>").attr("class", "day-icon").html("<img class='weather-icon' src=" + forecastIconURL + " />");
                    let newTemp = $("<p>").attr("class", "day-temp").text(`Temperature: ` + forecastTempF + `℉`);
                    let newWind = $("<p>").attr("class", "day-wind").text(`Wind Speed: ` + forecastWind + `MPH`);
                    let newHumidity = $("<p>").attr("class", "day-humidity").text(`Humidity: ` + forecastHumidity + `%`);

                    newDiv.append(newDate, newIcon, newTemp, newWind, newHumidity);

                    $(this).append(newDiv);
                });
            })
        $.ajax({
            url: breweryCityURL,
            method: "GET"
        })
            .then(function (response) {
                $(".brewery").each(function (brewery) {
                    var brewery = brewery + 1;
                    $(this).html("");
                    console.log(brewery, response[brewery]);
                    let brewDiv = $("<div>").attr("class", "brew-body");
                    let brewName = $("<h5>").attr("class", "brew-name has-text-weight-bold is-underlined").text(response[brewery].name);
                    let brewAddress = $("<p>").attr("class", "brew-address").text(`Address: ` + response[brewery].street);
                    let brewPhone = $("<p>").attr("class", "brew-phone").text(`Phone #: ` + response[brewery].phone);
                    let brewType = $("<p>").attr("class", "brew-type").text(` Brewery Type: ` + response[brewery].brewery_type);
                    let brewURL = $("<href>").attr("class", "brew-url").text(`Website: ` + response[brewery].website_url);

                    brewDiv.append(brewName, brewAddress, brewPhone, brewType, brewURL);

                    $(this).append(brewDiv);
                })
            })

    };

    // Store search history
    function storeSearch(searchedCity) {
        localStorage.setItem("city" + localStorage.length, searchedCity);
    };

    // Add searched cities to searched display
    let storedSearchList = "";
    function displaySearch() {
        searchHistory.empty();
        // Create a button for each searched city
        for (var i = 0; i < localStorage.length; i++) {
            storedSearchList = localStorage.getItem("city" + i);
            let searchHistoryBtn = $("<button>").text(storedSearchList).addClass("btn button-search").attr("type", "submit");
            searchHistory.append(searchHistoryBtn);
        }
    };

    // Event Listeners
    searchBtn.on("click", function (event) {
        event.preventDefault();
        let searchTerm = $("#city").val()
        storeSearch(searchTerm);
        displaySearch();

        let queryURL = currentQueryURL();

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(findCurrentWeather);
    });

    $(document).on("click", ".button-search", function () {
        let prevCity = $(this).text();
        storeSearch(prevCity);
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?appid=f3e794b6f19299364c3a368c93f4e895&q=${prevCity}`,
            method: "GET"
        })
            .then(findCurrentWeather);
    });

    // Clear previous searches
    clearBtn.on("click", function () {
        localStorage.clear();
        searchHistory.empty();
        location.reload();
    });

    // Load default city or last search item
    displaySearch();
    let lastCity = localStorage.getItem("city" + (localStorage.length - 1));
    let qurl = "";
    if (localStorage.length === 0) {
        qurl = `https://api.openweathermap.org/data/2.5/weather?appid=f3e794b6f19299364c3a368c93f4e895&q=Detroit`;
    } else {
        qurl = `https://api.openweathermap.org/data/2.5/weather?appid=f3e794b6f19299364c3a368c93f4e895&q=${lastCity}`;
    }
    $.ajax({
        url: qurl,
        method: "GET"
    })
        .then(findCurrentWeather);
});
