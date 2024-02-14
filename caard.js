// const cleApi = "3684c9633e398e13e4e29c9443a78574"; // Remplacez par votre propre clé API
// // const villeRecherchee = "Paris";

// async function obtenirMeteo() {
//   const url = `https://api.openweathermap.org/data/2.5/weather?lat=48.866667&lon=2.333333&appid=${cleApi}`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Erreur HTTP : ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("Données météo reçues :");
//     console.log(`Température : ${data.main.temp}°C`);
//     console.log(`Conditions : ${data.weather[0].description}`);
//   } catch (error) {
//     console.error("Erreur lors de la requête :", error);
//   }
// }

// // Appel de la fonction pour obtenir les données météo
// obtenirMeteo();