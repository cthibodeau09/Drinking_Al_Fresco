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
});
