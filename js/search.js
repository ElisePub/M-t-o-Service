$(document).ready(function () {
        var request;
        var requestForecast; // Requests stored in a variable

        $("#search-city").on("click", function () {

                if (request && request.readystate != 4) {
                        request.abort(); // abort previews request if she's still running
                }

                if (requestForecast && requestForecast.readystate != 4) {
                        requestForecast.abort(); // abort previews request if she's still running
                }

                city = $('#input-city').val();
                if (city != "") {
                        $('#error-panel').hide();
                        request = $.ajax({
                                type: "GET",
                                url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + ",fr&appid=ee07e2bf337034f905cde0bdedae3db8",
                                dataType: 'json',
                                success: function (json) {
                                        const long = json.coord.lon.toString();
                                        const lat = json.coord.lat.toString();
                                        //show results
                                        $('#result-table').show();
                                        $('#details').show();

                                        // Hide details fields
                                        $('#tr-min-temp').hide();
                                        $('#tr-max-temp').hide();
                                        $('#tr-max-temp').hide();
                                        $('#tr-pression').hide();
                                        $('#tr-niv-mer').hide();
                                        $('#tr-humidite').hide();
                                        $('#tr-vent').hide();
                                        $('#tr-ressenti').hide();

                                        $('#title').text('Résultat pour la ville de ' + city.charAt(0).toUpperCase() + city.slice(1))

                                        if (json.weather[0].main && json.weather[0].icon) {
                                                icon_link = "https://openweathermap.org/img/w/" + json.weather[0].icon + ".png";
                                                $("#icon").attr("src", icon_link);
                                                $('#situation').text(json.weather[0].main);
                                        } else {
                                                $('#situation').text("N/A");
                                        }
                                        if (json.main.temp) {
                                                let temperature = Math.round(json.main.temp - 273, 15)
                                                $('#temp').text(temperature.toString() + "°C");
                                        } else {
                                                $('#temp').text("N/A");
                                        }

                                        $("#btn-develop").on("click", function () {
                                                $("#details").hide();
                                                if (json.main.temp_min) {
                                                        let temperature = Math.round(json.main.temp_min - 273, 15)
                                                        $('#tr-min-temp').show();
                                                        $('#min-temp').text(temperature + "°C");
                                                }
                                                if (json.main.temp_max) {
                                                        let temperature = Math.round(json.main.temp_max - 273, 15)
                                                        $('#tr-max-temp').show();
                                                        $('#max-temp').text(temperature + "°C");
                                                }
                                                if (json.main.feels_like) {
                                                        let temperature = Math.round(json.main.feels_like - 273, 15)
                                                        $('#tr-ressenti').show();
                                                        $('#ressenti').text(temperature + "°C");
                                                }
                                                if (json.main.pressure) {
                                                        $('#tr-pression').show();
                                                        $('#pression').text(json.main.pressure + " hPa");
                                                }
                                                if (json.main.sea_level) {
                                                        $('#tr-niv-mer').show();
                                                        $('#niv-mer').text(json.main.sea_level + "m");
                                                }
                                                if (json.main.humidity) {
                                                        $('#tr-humidite').show();
                                                        $('#humidite').text(json.main.humidity + "%");
                                                }
                                                if (json.wind.speed) {
                                                        $('#tr-vent').show();
                                                        $('#vent').text(json.wind.speed + " km/h");
                                                }
                                        });
                                        showForecastData(lat, long);

                                },
                                error: function () {
                                        $('#result-table').hide();
                                        $('#forecast').hide();
                                        $('#error-panel').show();
                                        $('#error-panel').text('Aucune donnée trouvée pour cette zone')
                                }
                        });

                } else {
                        $('#result-table').hide();
                        $('#forecast').hide();
                        $('#error-panel').show();
                        $('#error-panel').text('champs vide')
                }


        });

        var showForecastData = function (lat, long) {
                requestForecast = $.ajax({
                        type: "GET",
                        url: "https://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lat + "&lon=" + long + "&cnt=5&appid=ee07e2bf337034f905cde0bdedae3db8",
                        dataType: 'json',
                        success: function (json) {
                                console.log(json);
                                $('#forecast-card').empty();
                                $('#forecast').show();
                                // Obtenir la date actuelle
                                var dateActuelle = new Date();
                                // Variable pour stocker les 5 prochains jours
                                var jour;

                                for (day in json.list) {
                                        // Ajouter un jour pour obtenir le jour suivant
                                        dateActuelle.setDate(dateActuelle.getDate() + 1);
                                        jour = dateActuelle.toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' });
                                        tempmin = Math.round(json.list[day].temp.min - 273,15);
                                        tempmax = Math.round(json.list[day].temp.max - 273,15);
                                        situation = json.list[day].weather[0].main
                                        icon = json.list[day].weather[0].icon
                                        icon_link = "https://openweathermap.org/img/w/" + icon + ".png";
                                        createCardComponent(jour, tempmin, tempmax, situation, icon_link);
                                }
                        },
                        error: function () {
                                $('#result-table').hide();
                                $('#forecast').hide();
                                $('#error-panel').show();
                                $('#error-panel').text('Aucune donnée provisionnelle trouvée pour cette zone')
                        }
                });
        }

        var createCardComponent = function (day, tempmin, tempmax, situation, icon_src) {
                // Création de l'élément avec les classes et les attributs
                var cardElement = $('<div>').addClass('card content square-card');
                var cardBody = $('<div>').addClass('card-body');
                var cardTitle = $('<div>').addClass('card-title pt-4');
                var dateHeader = $('<h5>').attr('id', 'date').text(day);
                var hrElement = $('<hr>');
                var contentContainer = $('<div>').addClass('d-flex align-items-center');
                var tempForecast = $('<p>').attr('id', 'temp-forecast').addClass('vertical-align, middle, mb-0').text(tempmax + '/' + tempmin + '°C');
                var iconImage = $('<img>').attr('id', 'icon').attr('src', icon_src);
                var situationForecast = $('<p>').attr('id', 'situation-forecast').text(situation);

                // Assemblage des éléments
                cardTitle.append(dateHeader, hrElement);
                contentContainer.append(tempForecast, iconImage);
                cardBody.append(cardTitle, contentContainer, situationForecast);
                cardElement.append(cardBody);

                // Ajout de l'élément au DOM
                $('#forecast-card').append(cardElement);
        }
})