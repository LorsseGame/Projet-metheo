const cleApi = "3684c9633e398e13e4e29c9443a78574"; // Remplacez par votre propre clé API
async function obtenirMeteo(ville) {
  try {
    // Récupération des coordonnées actualisées du local storage
    var coordonnees = JSON.parse(localStorage.getItem("coordonnees"));
    const tabResponseApi = [];
    if(ville != undefined){
      for (let i = 0; i < ville.length; i++) {
        if (ville != undefined) {
          var lat = ville[i].y;
          var lon = ville[i].x;
        }
        
        // Requête à l'API
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${cleApi}`;
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        // Ajouter les informations météorologiques à l'objet existant dans le tableau coordonnees
        const meteoData = await response.json();
  
        tabResponseApi.push(meteoData);
      }
    }else{
      for (let i = 0; i < coordonnees.length; i++) {
        if (ville == undefined) {
          var lat = coordonnees[i].y;
          var lon = coordonnees[i].x;
        }
        // Requête à l'API
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${cleApi}`;
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        // Ajouter les informations météorologiques à l'objet existant dans le tableau coordonnees
        const meteoData = await response.json();
        coordonnees[i].temperature = meteoData.main.temp;
        coordonnees[i].humidity = meteoData.main.humidity;
        coordonnees[i].wind = meteoData.wind.speed;
        coordonnees[i].pressure = meteoData.main.pressure;
        coordonnees[i].desc = meteoData.weather[0].main;
  
        tabResponseApi.push(meteoData);
      }
    }
    // Mettre à jour le tableau coordonnees dans le localStorage
    if(ville == undefined){
      localStorage.setItem("coordonnees", JSON.stringify(coordonnees));
      console.log(coordonnees)
      affichageMeteo(tabResponseApi[0]);
    }else{  
      return tabResponseApi;
    }

  } catch (error) {
    console.error("Erreur lors de la requête :", error);
  }
}

function affichageMeteo(response) {
  var paragraph = document.getElementById("p-info");
  var caard = document.getElementById("caard-meteo");
  var dateNow = new Date();
  paragraph.style.display = "none";

  // Affichez l'élément avec une animation d'opacité
  caard.style.opacity = "0"; // Commencez par une opacité de 0
  caard.style.display = "block"; // Assurez-vous que l'élément est affiché

  // Utilisez setTimeout pour déclencher l'animation après un court délai
  setTimeout(function () {
    caard.style.opacity = "1"; // Changez l'opacité à 1 après le délai
  }, 50);
  document.getElementById("ville-caard").innerText = response.name;
  document.getElementById("date-caard").innerText =
    dateNow.toLocaleDateString();
  document.getElementById(
    "img-weather"
  ).src = `http://openweathermap.org/img/wn/${response.weather[0].icon}.png`;
  var temp = response.main.temp - 273.15;
  var temp = temp.toString();
  var index = temp.indexOf(".");
  var temp = temp.slice(0, index + 2);
  document.getElementById("temperature-caard").innerText = `${temp}°C`;
  document.getElementById("weather-caard").innerText = response.weather[0].main;
  document.getElementById("p-wind-caard").innerText =
    "Vent : " + response.wind.speed + " km/h";
  document.getElementById("p-precipitation-caard").innerText =
    "Précipitations : " + response.main.pressure + " hpa";
  document.getElementById("p-humidity-caard").innerText =
    "Humidité : " + response.main.humidity + " %";
}
