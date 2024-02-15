// Créer une carte centrée sur les coordonnées (latitude, longitude)
var map = L.map('mapid').setView([47.856944, 1.351389], 5);

// Ajouter une couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Créer un groupe de marqueurs avec Leaflet.markercluster
var markers = L.markerClusterGroup();

var coordonnees = JSON.parse(localStorage.getItem("coordonnees"));
// Ajouter des marqueurs à ce groupe
for (let j = 0; j < 4; j++) {
    markers.addLayer(L.marker([coordonnees[j].y, coordonnees[j].x]).bindPopup(coordonnees[j].label));
};

async function ajoueMarquer() {
    if (localStorage.getItem("coordonnees") != null) {
        var coordonnees = JSON.parse(localStorage.getItem("coordonnees"));
        coordonnees.forEach(coordinate => {
            // Vérifier si le marqueur existe déjà
            let existingMarker = markers.getLayers().find(marker => {
                return marker._latlng.lat === coordinate.y && marker._latlng.lng === coordinate.x;
            });
            if (!existingMarker) {
                markers.addLayer(L.marker([coordinate.y, coordinate.x]).bindPopup(coordinate.label));
            }
        });
    }
}

map.addLayer(markers);
