const search = document.querySelector(".search-input");
const button = document.getElementById("search-button");

// Fonction pour obtenir les coordonnées de la ville
async function obtenirVille() {
  const inputSearch = document.getElementById("search-input").value;
  const url = `https://api-adresse.data.gouv.fr/search/?q=${inputSearch}&type=municipality&autocomplete=1`;
  if (inputSearch.length >= 3) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      return data.features.map((feature) => {
        return {
          city: feature.properties.city,
          postcode: feature.properties.postcode,
        };
      });
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      return []; // En cas d'erreur, renvoyer un tableau vide
    }
  } else {
    console.log("Requête API échouée");
  }
}

// Fonction pour afficher les suggestions
async function showSuggestions(inputValue) {
  const suggestionsData = await obtenirVille();
  const suggestionsContainer = document.getElementById("suggestions");
  suggestionsContainer.innerHTML = "";
  if (inputValue.length >= 3 && suggestionsData.length > 0) {
    // Filtrer les suggestions
    const filteredSuggestions = suggestionsData.filter((suggestion) =>
      suggestion.city.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    // Afficher les suggestions filtrées
    filteredSuggestions.forEach((suggestion) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.classList.add("suggestion-item");
      suggestionItem.textContent = suggestion.city + " " + suggestion.postcode;
      suggestionItem.addEventListener("click", () => {
        document.querySelector(".search-input").value = suggestion.city;
        suggestionsContainer.style.display = "none";
      });
      suggestionsContainer.appendChild(suggestionItem);
    });

    suggestionsContainer.style.display = "block";
  } else {
    suggestionsContainer.style.display = "none";
  }
}
// Fonction pour limiter le nombre de requêtes API
function debounce(callback, delay) {
  var timer;
  return function () {
    var args = arguments;
    var context = this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, delay);
  };
}
// Écouter les événements clavier
search.addEventListener(
  "keyup",
  debounce(function (e) {
    showSuggestions(e.target.value);
  }, 500)
);
// Écouter l'événement click
button.addEventListener("click", async () => {
  const inputSearch = document.getElementById("search-input").value;

  // Vérifier si le champ d'entrée n'est pas vide
  if (inputSearch.trim().length >= 3) {
    const coordonnees = await obtenirCoordonnees();

    // Vérifier si les coordonnées sont disponibles
    if (coordonnees.length > 0) {
      localStorage.setItem("coordonnees", JSON.stringify(coordonnees));
    }
    setTimeout(obtenirMeteo, 50);
    setTimeout(ajoueMarquer, 1000);
  } else {
    // Gérer le cas où le champ d'entrée est vide
    console.log("Le champ d'entrée est vide.");

    setTimeout(obtenirMeteo, 50);
    setTimeout(ajoueMarquer, 150);
  }
});

// Fonction pour obtenir les coordonnées de la ville
async function obtenirCoordonnees(response) {
  const inputSearch = document.getElementById("search-input").value;
  const url = `https://api-adresse.data.gouv.fr/search/?q=${inputSearch || response}&type=municipality&autocomplete=1`;
  if (inputSearch.length >= 3 || response.length > 0) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();

      if (data.features.length > 1) {
        const tabCoordonnees = [];
        for (let i = 0; i < data.features.length; i++) {
          tabCoordonnees.push({
            label: data.features[i].properties.label,
            x: data.features[i].geometry.coordinates[0],
            y: data.features[i].geometry.coordinates[1],
          });
        }
        if (!localStorage.getItem("coordonnees") && inputSearch != "" && response.length == 0) {
          console.log("je suis dans le if");
          localStorage.setItem("coordonnees", JSON.stringify(tabCoordonnees));
        }
        return tabCoordonnees;
      } else if (data.features.length === 1) {  // Ajout de cette condition
        const coordonnees = {
          label: data.features[0].properties.label,
          x: data.features[0].geometry.coordinates[0],
          y: data.features[0].geometry.coordinates[1],
        };

        localStorage.setItem("coordonnees", JSON.stringify(coordonnees));
        return [coordonnees];
      } else {
        return []; // Retourner un tableau vide si aucune coordonnée n'est trouvée
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      return []; // En cas d'erreur, renvoyer un tableau vide
    }
  } else {
    console.log("Requête API échouée");
    return [];
  }
}
