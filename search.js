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
      return data.features.map((feature) => feature.properties.city);
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
  console.log(suggestionsData);
  const suggestionsContainer = document.getElementById("suggestions");
  suggestionsContainer.innerHTML = "";

  if (inputValue.length >= 3 && suggestionsData.length > 0) {
    const filteredSuggestions = suggestionsData.filter((suggestion) =>
      suggestion.toLowerCase().startsWith(inputValue.toLowerCase())
    );

    // Afficher les suggestions filtrées
    filteredSuggestions.forEach((suggestion) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.classList.add("suggestion-item");
      suggestionItem.textContent = suggestion;
      suggestionItem.addEventListener("click", () => {
        document.querySelector(".search-input").value = suggestion;
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

button.addEventListener("click", () => {
  obtenirCoordonnees();
});

async function obtenirCoordonnees() {
  const inputSearch = document.getElementById("search-input").value;
  const url = `https://api-adresse.data.gouv.fr/search/?q=${inputSearch}&type=municipality&autocomplete=1`;
  if (inputSearch.length >= 3) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();

      console.log("il y a :" + data.features.length)
      if (data.features.length > 1) {
        const tabCoordonnees = [];

        for (let i = 0; i < data.features.length; i++) {
          tabCoordonnees.push({
            label: data.features[i].properties.label,
            x: data.features[i].geometry.coordinates[0],
            y: data.features[i].geometry.coordinates[1],
          });
        }
        console.log(tabCoordonnees);
      }else{
        const coordonnees = {
          x: data.features[0].geometry.coordinates[0],
          y: data.features[0].geometry.coordinates[1],
        };
        console.log("passage dans le else");
      console.log(localStorage.setItem("coordonnees", JSON.stringify(coordonnees)));
      }


    } catch (error) {
      console.error("Erreur lors de la requête :", error);
    }
  } else {
    console.log("Requête API échouée");
  }
}
