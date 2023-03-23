//let forecastAPIKey = "cefe35c460e97cd8334d1bdfbaf225e7";

$.ajax({

    url: "https://api.openbrewerydb.org/breweries?by_city=san_diego&per_page=3",

    method: 'GET',
}).then(function (response) {
    console.log('Ajax Reponse \n--breweryapi-----------');
    console.log(response);
    //  return response.json();

})
//     .then(function (data) {
//         //display data
//         var docArray = data.response.docs;
//         for (var i = 0; i < docArray.length; i++) {
//             var listitem = document.createElement("li");
//             listitem.textContent = docArray[i].description;
//             listE1.appendChild(listitem);

//         }

//         // } .catch(function(error())
//         // {
//         //     console.log(error);

//     }
//     );





// $.ajax({

//     url: "https://pro.openweathermap.org/data/2.5/forecast/climate?q={city name}&appid=cefe35c460e97cd8334d1bdfbaf225e7",

//     method: 'GET',
// }).then(function (response) {
//     console.log('weatherapi');
//     console.log(response);
// });

