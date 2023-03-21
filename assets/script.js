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

    // Functions
    function currentQueryURL() {
        // Weather API URL
        var currentURL = `https://api.openweathermap.org/data/2.5/weather?`;

        // API Key
        var APIKey = { "APPID": "55c7242f8bf237f063bd07fa75719af2" };

        // Search term
        APIKey.q = searchCity
            .val()
            .trim();

        // Generate URL
        return currentURL + $.param(APIKey);
    }

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
        cityDate.text(`${city} (${todayDate.format("MM/DD/YYY")})`);
        cityDate.append(cityIcon.attr("src", weatherIconURL).attr("alt", `${weatherIconDescrip}`).attr("title", `${weatherIconDescrip}`));
        cityTemp.text(`Temperature: ${tempF.toFixed(2)} ℉`);
        cityWind.text(`Wind Speed: ${response.wind.speed} MPH`);
        cityHumidity.text(`Humidity: ${response.main.humidty}%`);

    }

    // Store search history
    function storeSearch(searchedCity) {
        localStorage.setItem("city" + localStorage.length, searchedCity);
    }

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
    }

    // Event Listeners
    searchBtn.on("click", function (event) {
        event.preventDefault();
        let searchTerm = $("#city").val()
        storeSearch(searchTerm);
        displaySearch();

        let queryURL = currentQueryURL();


    })

    

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
        qurl = `https://api.openweathermap.org/data/2.5/weather?appid=55c7242f8bf237f063bd07fa75719&q=Detroit`;
    } else {
        qurl = `https://api.openweathermap.org/data/2.5/weather?appid=55c7242f8bf237f063bd07fa75719&q=${lastCity}`;
    }
    $.ajax({
        url: qurl,
        method: "GET"
    })
        .then(findCurrentWeather);
});
