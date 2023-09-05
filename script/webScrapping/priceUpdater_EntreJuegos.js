import { chromium } from "playwright";
import axios from "axios";

// ---------------------------------------------
// I) VARIABLES & HOOKS
// ---------------------------------------------

async function getAllGames() {
	try {
		const response = await axios.get(`http://localhost:8080/search/`);
		const gamesList = response.data;
		return gamesList;
	} catch (error) {
		console.error("Error fetching data");
		return [];
	}
}

// ---------------------------------------------
// II) HANDLERS & AUX FUNCTIONS
// ---------------------------------------------
async function updatePricesInDatabase(games) {
	for (const game of games) {
		const browser = await chromium.launch();
		const page = await browser.newPage();

		await page.goto("https://www.entrejuegos.cl/");

		console.log(game.gameName);

		await page.waitForSelector('input[name="s"]');
		await page.type('input[name="s"]', game.gameName);
		page.keyboard.press("Enter");

		await page.waitForNavigation({ waitUntil: "networkidle" });

		const price = await page.evaluate(() => {
			const priceElement = document.querySelector('span[class="price"]');
			return priceElement ? priceElement.innerText : null;
		});

		console.log(price);

		if (price !== null) {
			const newPrice = price.replace(/[^0-9]/g, "");

			if (newPrice) {
				updatePriceInDatabase(game._id, newPrice);
				console.log(`Precio actualizado para ${game.gameName}: ${newPrice}`);
			} else {
				console.log(`Precio no encontrado para ${game.gameName}`);
			}
		} else {
			console.log(`Precio no encontrado para ${game.gameName}`);
		}

		await new Promise((resolve) => setTimeout(resolve, 5000));
		await browser.close();
	}

	console.log(newPrice);
}

function updatePriceInDatabase(elementId, newPrice) {
	try {
		axios.put("http://localhost:8080/games/" + elementId, {
			price_EntreJuegos: newPrice,
		});
	} catch (error) {
		console.error(error);
	}
	console.log(
		`Actualizando precio en la base de datos para ID ${elementId} a ${newPrice}`
	);
}

getAllGames().then((response) => {
	const games = response.data;

	updatePricesInDatabase(games).then(() => {
		console.log("Proceso completado.");
	});
});
