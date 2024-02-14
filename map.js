        // Créer une carte centrée sur les coordonnées (latitude, longitude)
        var map = L.map('mapid').setView([48.856944, 2.351389], 13);

        // Ajouter une couche de tuiles OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Créer un groupe de marqueurs avec Leaflet.markercluster
        var markers = L.markerClusterGroup();

        // Ajouter des marqueurs à ce groupe
        markers.addLayer(L.marker([48.856944, 2.351389]).bindPopup('Ceci est un marqueur !'));
        markers.addLayer(L.marker([48.8583, 2.2945]).bindPopup('Un autre marqueur !'));

        // Ajouter le groupe de marqueurs à la carte
        map.addLayer(markers);