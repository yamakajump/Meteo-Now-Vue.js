// Fonction pour gérer la validation lorsque la touche Entrée est enfoncée
$('#cityInput').keypress(function(event) {
    // Vérifier si la touche Entrée est enfoncée (code 13)
    if (event.which === 13) {
        // Appeler la fonction de validation
        validateCity();
    }
});

// Gestionnaire d'événement pour le clic sur le bouton "Valider"
$('#submitBtn').click(function() {
    // Appeler la fonction de validation
    validateCity();
});

// Fonction de validation de la ville
function validateCity() {
    var city = $('#cityInput').val();
    var currentWeatherUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=ee07e2bf337034f905cde0bdedae3db8';
    var forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=ee07e2bf337034f905cde0bdedae3db8';

    // Requête pour la météo actuelle
    $.ajax({
        url: currentWeatherUrl,
        type: 'GET',
        success: function(currentData) {
            // Afficher la météo actuelle
            displayCurrentWeather(currentData);

            // Requête pour les prévisions à 5 jours
            $.ajax({
                url: forecastUrl,
                type: 'GET',
                success: function(forecastData) {
                    // Afficher les prévisions sur 5 jours
                    displayForecastWeather(forecastData);
                },
                error: function() {
                    console.log('Erreur lors de la récupération des prévisions météo à 5 jours');
                }
            });
        },
        error: function() {
            var weatherInfo = $('#weatherInfo');
            weatherInfo.empty(); // Clear previous weather info

            var errorMessage = $('<p>').text('Ville inconnue');
            weatherInfo.append(errorMessage);
        }
    });
}

function displayCurrentWeather(data) {
    console.log(data);
    var weatherInfo = $('#weatherInfo');
    weatherInfo.empty(); // Clear previous weather info

    var cityName = $('<h2>').text(data.name + ' (' + data.sys.country + ')');
    weatherInfo.append(cityName);

    var weatherIcon = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
    weatherInfo.append(weatherIcon);

    var temperature = $('<p>').text('Température : ' + Math.round(data.main.temp - 273.15) + '°C');
    weatherInfo.append(temperature);

    var wind = $('<p>').text('Vent : ' + data.wind.speed + ' m/s');
    weatherInfo.append(wind);

    var humidity = $('<p>').text('Humidité : ' + data.main.humidity + ' %');
    weatherInfo.append(humidity);

    var pressure = $('<p>').text('Pression : ' + data.main.pressure + ' hPa');
    weatherInfo.append(pressure);
}

function displayForecastWeather(data) {
    console.log(data);
    var weatherInfo = $('#weatherInfo');

    // Afficher les prévisions pour les 5 prochains jours
    for (var i = 0; i < data.list.length; i += 8) { // Sélectionner une prévision par jour (toutes les 8 prévisions)
        var forecast = data.list[i];
        var forecastDate = new Date(forecast.dt * 1000); // Convertir la date Unix en millisecondes
        var forecastDay = forecastDate.toLocaleDateString('fr-FR', { weekday: 'long' });

        var forecastIcon = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + forecast.weather[0].icon + '.png');
        var forecastMinMaxTemp = $('<p>').text('Min: ' + Math.round(forecast.main.temp_min - 273.15) + '°C / Max: ' + Math.round(forecast.main.temp_max - 273.15) + '°C');

        var forecastInfo = $('<div>').addClass('forecast-info');
        forecastInfo.append($('<p>').text(forecastDay));
        forecastInfo.append(forecastIcon);
        forecastInfo.append(forecastMinMaxTemp);

        weatherInfo.append(forecastInfo);
    }
}
