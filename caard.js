const cleApi = "3684c9633e398e13e4e29c9443a78574"; // Remplacez par votre propre clé API

async function obtenirMeteo() {
    // Récupération des coordonnées actualisées du local storage
    var coordonnees = JSON.parse(localStorage.getItem("coordonnees"));
    var lat = coordonnees[0].y;
    var lon = coordonnees[0].x;
    var paragraph = document.getElementById("p-info");
    var caard = document.getElementById("caard-meteo");
    var dateNow = new Date();

    // Requête à l'API
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${cleApi}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        console.log(coordonnees[0].label);
        console.log(`Température : ${data.main.temp}°C`);
        console.log(`Conditions : ${data.weather[0].description}`);
        paragraph.style.display = "none";
        caard.style.display = "block";
        document.getElementById("ville-caard").innerText = coordonnees[0].label;
        document.getElementById("date-caard").innerText = dateNow.toLocaleDateString()
        document.getElementById("img-weather").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        document.getElementById("temperature-caard").innerText = `${data.main.temp}°C`;
        document.getElementById("weather-caard").innerText = data.weather[0].description;
        document.getElementById("icon-wind-caard").src = "images/wain.svg";
        document.getElementById("p-wind-caard").innerText = "Vent : " + data.wind.speed + " km/h";
        document.getElementById("icon-humidity-caard").src = "images/humidity.svg";
        document.getElementById("p-humidity-caard").innerText = "Humidité : " + data.main.humidity + " %";
        document.getElementById("icon-precipitation-caard").src = "images/rain.svg";
        document.getElementById("p-precipitation-caard").innerText = "Précipitations : " + data.rain + " mm";
        document.getElementById("p-pressure-caard").innerText = "Pression : " + data.main.pressure + " hPa";


    } catch (error) {
        console.error("Erreur lors de la requête :", error);
    }
}


