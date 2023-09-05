const axios = require("axios");
const xml2js = require("xml2js");

const GameList = require("./gamesIDList");
const GamesModel = require("../../server/models/games.model");

async function fetchDataFromXmlApi(gameId) {
	try {
		const response = await axios.get(
			`https://api.geekdo.com/xmlapi2/thing?id=${gameId}`
		);
		const xmlData = response.data;

		const parser = new xml2js.Parser();
		const jsonData = await parser.parseStringPromise(xmlData);

		const item = jsonData.items.item[0];

			const names = item.name
				.filter((n) => {
					return n["$"].type === "primary";
				})
				.map((n) => n["$"].value);

			const image = jsonData.items.item[0].image[0];
			// console.log(image);
			const name = names.length > 0 ? names[0] : "Nombre no encontrado";
			// console.log(name);
			const minPlayers = jsonData.items.item[0].minplayers[0]["$"].value;
			// console.log(minPlayers);
			const maxPlayers = jsonData.items.item[0].maxplayers[0]["$"].value;
			// console.log(maxPlayers);
			const minPlaytime = jsonData.items.item[0].minplaytime[0]["$"].value;
			// console.log(minPlaytime);
			const maxPlaytime = jsonData.items.item[0].maxplaytime[0]["$"].value;
			// console.log(maxPlaytime);

			const category = jsonData.items.item[0].link
				.filter((link) => link["$"].type === "boardgamecategory")
				.map((link) => link["$"].value);

			// console.log(category);
		

		const gameData = {
			image,
			name,
			minPlayers,
			maxPlayers,
			minPlaytime,
			maxPlaytime,
			category,
		};

		console.log(gameData);
		// console.log(gameData.name);

		// Guarda gameData en MongoDB o realiza cualquier otra acción necesaria.
		saveDataToMongoDB(gameData);
	} catch (error) {
		console.error(`Error fetching data for game ID ${gameId} from API:`, error);
	}
}

// Iterar sobre el array y llamar a fetchDataFromXmlApi para cada ID de juego.
// for (const gameId of GameList) {
// 	fetchDataFromXmlApi(gameId);
// }

fetchDataFromXmlApi(224517);

async function saveDataToMongoDB(data) {
	try {
		// Buscar un juego existente con el mismo nombre
		const existingGame = await GamesModel.findOne({ gameName: data.name }).exec();
		console.log(data.name);
		console.log(existingGame);

		if (existingGame) {
			// Si se encuentra un juego existente, actualiza los campos relevantes
			existingGame.gamePhotoURL = data.image;
			existingGame.minPlayers = data.minPlayers;
			existingGame.maxPlayers = data.maxPlayers;
			existingGame.minPlaytime = data.minPlaytime;
			existingGame.maxPlaytime = data.maxPlaytime;
			existingGame.category = data.category;

			// Realiza una solicitud PUT para actualizar el juego existente
			await axios.put(`http://localhost:8080/games/${existingGame._id}`, {
				category: data.category,
			});

			console.log(`Juego actualizado en MongoDB: ${data.name}`);
		} else {
			// Si no se encuentra un juego existente, crea uno nuevo con una solicitud POST
			await axios.post(`http://localhost:8080/games/new`, {
				gameName: data.name,
				gamePhotoURL: data.image,
				minPlayers: data.minPlayers,
				maxPlayers: data.maxPlayers,
				minPlaytime: data.minPlaytime,
				maxPlaytime: data.maxPlaytime,
				category: data.category,
			});
			console.log(`Nuevo juego guardado en MongoDB: ${data.name}`);
		}

		console.log("Datos guardados o actualizados en MongoDB");
	} catch (error) {
		console.error("Error al guardar o actualizar datos en MongoDB", error);
	}
}

fetchDataFromXmlApi().then((data) => {
	saveDataToMongoDB(data);
});
