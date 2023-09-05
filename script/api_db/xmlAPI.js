const axios = require("axios");
const xml2js = require("xml2js");

const GameList = require("./gamesIDList");

async function fetchDataFromXmlApi(gameId) {
	try {
		const response = await axios.get(
			`https://api.geekdo.com/xmlapi2/thing?id=${gameId}&stats=1`
		);
		const xmlData = response.data;

		const parser = new xml2js.Parser();
		const jsonData = await parser.parseStringPromise(xmlData);

		const names = jsonData.items.item[0].name
			.filter((n) => {
				return n["$"].type === "primary";
			})
			.map((n) => n["$"].value);

		const image = jsonData.items.item[0].image[0];
		const name = names.length > 0 ? names[0] : "Nombre no encontrado";
		const minPlayers = jsonData.items.item[0].minplayers[0]["$"].value;
		const maxPlayers = jsonData.items.item[0].maxplayers[0]["$"].value;
		const minPlaytime = jsonData.items.item[0].minplaytime[0]["$"].value;
		const maxPlaytime = jsonData.items.item[0].maxplaytime[0]["$"].value;

		const category = jsonData.items.item[0].link
			.filter((link) => link["$"].type === "boardgamecategory")
			.map((link) => link["$"].value);

		const ranking = jsonData.items.item[0].statistics[0].ratings[0].ranks[0].rank
			.filter((rank) => rank["$"].friendlyname === "Board Game Rank")
			.map((rank) => rank["$"].value);

		const gameData = {
			image,
			name,
			minPlayers,
			maxPlayers,
			minPlaytime,
			maxPlaytime,
			category,
			ranking,
		};

		console.log(gameData);

		// Guarda gameData en MongoDB o realiza cualquier otra acción necesaria.
		saveDataToMongoDB(gameData);
	} catch (error) {
		console.error(`Error fetching data for game ID ${gameId} from API:`, error);
	}
}

// Iterar sobre el array y llamar a fetchDataFromXmlApi para cada ID de juego.
async function fetchGamesWithDelay() {
  for (const gameId of GameList) {
    await fetchDataFromXmlApi(gameId);
    // Agrega un retraso de 5 segundos (5000 ms) antes de la siguiente búsqueda.
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

fetchGamesWithDelay().then(() => {
  console.log("Todas las búsquedas completadas.");
});

// fetchDataFromXmlApi(224517);

async function saveDataToMongoDB(data) {
	try {
		await axios
		
			.post(`http://localhost:8080/games/new`, {
				gameName: data.name,
				gamePhotoURL: data.image,
				minPlayers: data.minPlayers,
				maxPlayers: data.maxPlayers,
				minPlaytime: data.minPlaytime,
				maxPlaytime: data.maxPlaytime,
				category: data.category,
				gameRanking: data.ranking
			})
			.then((res) => {
				console.log(res);
			});
		console.log("Datos guardados en MongoDB");
	} catch (error) {
		console.error("Error al guardar datos en MongoDB", error);
	}
}

fetchDataFromXmlApi().then((data) => {
	saveDataToMongoDB(data);
});
