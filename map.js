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
for (let j = 0; j < 4; j++) {
  markers.addLayer(
    L.marker([coordonnees[j].y, coordonnees[j].x]).bindPopup(
      "Ville : " +
        coordonnees[j].label +
        "<br>" +
        "température : " +
        coordonnees[j].temperature +
        "Kelvin" +
        "<br>" +
        "humidité : " +
        coordonnees[j].humidity +
        "%" +
        "<br>" +
        "vent : " +
        coordonnees[j].wind +
        "km/h" +
        "<br>" +
        "pression : " +
        coordonnees[j].pressure +
        "hPa" +
        "<br>" +
        "latitude : " +
        coordonnees[j].y +
        "<br>" +
        "longitude : " +
        coordonnees[j].x
    )
  );
}

// Écouter l'événement DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
  const villeConue = [
    "Paris",
    "Lyon",
    "Marseille",
    "Toulouse",
    "Rennes",
    "Nantes",
  ];
  // Exécuter la fonction au chargement de la page
  // await ajoueMarquerVilleConnue(villeConue);

  await ajoueMarquerVilleConnue(villeConue);
});
async function ajoueMarquerVilleConnue(villes) {
  const tabCoordonneesVille = [];
  for (let i = 0; i < villes.length; i++) {
    const coordonnees = await obtenirCoordonnees(villes[i]);
    console.log(coordonnees);
    // Vérifiez que les coordonnées sont définies avant d'ajouter un marqueur
    if (coordonnees) {
      await markers.addLayer(L.marker([coordonnees.y, coordonnees.x]));
    }
  }
}

async function ajoueMarquer() {
  if (localStorage.getItem("coordonnees") != null) {
    var coordonnees = JSON.parse(localStorage.getItem("coordonnees"));
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
              coordinate.temp +
              "°C" +
              "<br>" +
              "humidité : " +
              coordinate.hum +
              "%" +
              "<br>" +
              "vent : " +
              coordinate.vent +
              "km/h" +
              "<br>" +
              "pression : " +
              coordinate.pres +
              "hPa" +
              "<br>" +
              "description : " +
              coordinate.desc +
              "<br>" +
              "icon : " +
              coordinate.icon +
              "<br>" +
              "date : " +
              coordinate.date +
              "<br>" +
              "heure : " +
              coordinate.heure +
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
