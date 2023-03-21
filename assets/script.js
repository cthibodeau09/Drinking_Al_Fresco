$(document).ready(function () {
    const searchBtn = $("#searchBtn");
    const clearBtn = $("#clearBtn");
    let searchCity = $("#city");



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
