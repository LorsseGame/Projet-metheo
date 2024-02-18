// Créer une carte centrée sur les coordonnées (latitude, longitude)
var map = L.map("mapid").setView([47.856944, 1.351389], 5);

// Ajouter une couche de tuiles OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Créer un groupe de marqueurs avec Leaflet.markercluster
var markers = L.markerClusterGroup();

var coordonnees = JSON.parse(localStorage.getItem("coordonnees"));
// Ajouter des marqueurs à ce groupe
// for (let j = 0; j < 4; j++) {
//   markers.addLayer(
//     L.marker([coordonnees[j].y, coordonnees[j].x]).bindPopup(
//       "Ville : " +
//         coordonnees[j].label +
//         "<br>" +
//         "température : " +
//         coordonnees[j].temperature +
//         "Kelvin" +
//         "<br>" +
//         "humidité : " +
//         coordonnees[j].humidity +
//         "%" +
//         "<br>" +
//         "vent : " +
//         coordonnees[j].wind +
//         "km/h" +
//         "<br>" +
//         "pression : " +
//         coordonnees[j].pressure +
//         "hPa" +
//         "<br>" +
//         "latitude : " +
//         coordonnees[j].y +
//         "<br>" +
//         "longitude : " +
//         coordonnees[j].x
//     )
//   );
// }

// Écouter l'événement DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
  const villeConue = [
    "paris",
    "lyon",
    "marseille",
    "toulouse",
    "rennes",
    "nantes",
  ];

  const tabVilleMarker = [];
  for (let i = 0; i < villeConue.length; i++) {
    const ville = await obtenirCoordonnees(villeConue[i]);
    for (let j = 0; j < ville.length; j++) {
      tabVilleMarker.push({
        label: ville[j].label,
        x: ville[j].x,
        y: ville[j].y,
      });  
    }
  }
  const resultMetheo = await obtenirMeteo(tabVilleMarker);

  // Exécuter la fonction au chargement de la page
  await ajoueMarquerVilleConnue(tabVilleMarker);

});

async function ajoueMarquerVilleConnue(villes) {
  const tabStackPopup= [];
  const clusterMarkers = L.markerClusterGroup();
  for (let i = 0; i < villes.length; i++) {
    const VilleCoordonees = await obtenirCoordonnees(villes[i].label);
    const resultMetheo = await obtenirMeteo(VilleCoordonees);

    tabStackPopup.push({
      label: VilleCoordonees[0].label,
      temp: resultMetheo[0].main.temp,
      hum: resultMetheo[0].main.humidity,
      vent: resultMetheo[0].wind.speed,
      pres: resultMetheo[0].main.pressure,
      desc: resultMetheo[0].weather[0].main,
      icon: resultMetheo[0].weather[0].icon,
      y: VilleCoordonees[0].y,
      x: VilleCoordonees[0].x,
    });

    // Vérifiez que les coordonnées sont définies avant d'ajouter un marqueur
    if (VilleCoordonees && tabStackPopup.length > 0) {
  const marker =   L.marker([tabStackPopup[i].y, tabStackPopup[i].x]).bindPopup(
      "Ville : " +
      tabStackPopup[i].label +
        "<br>" +
        "température : " +
        tabStackPopup[i].temp +
        "°C" +
        "<br>" +
        "humidité : " +
        tabStackPopup[i].hum +
        "%" +
        "<br>" +
        "vent : " +
        tabStackPopup[i].vent +
        "km/h" +
        "<br>" +
        "pression : " +
        tabStackPopup[i].pres +
        "hPa" +
        "<br>" +
        "description : " +
        tabStackPopup[i].desc +
        "<br>" +
        "icon : " +
        tabStackPopup[i].icon +
        "<br>" +
        "latitude : " +
        tabStackPopup[i].y +
        "<br>" +
        "longitude : " +
        tabStackPopup[i].x
    );
    clusterMarkers.addLayer(marker);
    }
  }
  map.addLayer(clusterMarkers);
}

async function ajoueMarquer() {
  if (localStorage.getItem("coordonnees") != null) {
    var coordonnees = JSON.parse(localStorage.getItem("coordonnees"));
    console.log(coordonnees);
    coordonnees.forEach((coordinate) => {
      // Vérifier si le marqueur existe déjà
      let existingMarker = markers.getLayers().find((marker) => {
        return (
          marker._latlng.lat === coordinate.y &&
          marker._latlng.lng === coordinate.x
        );
      });
      if (!existingMarker) {
        markers.addLayer(
          L.marker([coordinate.y, coordinate.x]).bindPopup(
            "Ville : " +
              coordinate.label +
              "<br>" +
              "température : " +
              coordinate.temperature +
              "°C" +
              "<br>" +
              "humidité : " +
              coordinate.humidity +
              "%" +
              "<br>" +
              "vent : " +
              coordinate.wind +
              "km/h" +
              "<br>" +
              "pression : " +
              coordinate.pressure +
              "hPa" +
              "<br>" +
              "description : " +
              coordinate.desc +
              "<br>" +
              "latitude : " +
              coordinate.y +
              "<br>" +
              "longitude : " +
              coordinate.x
          )
        );
      }
    });
  }
}

map.addLayer(markers);
