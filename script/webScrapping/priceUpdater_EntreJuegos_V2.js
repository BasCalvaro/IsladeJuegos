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

		const resultsList = await page.evaluate((game) => {
			let result = [];

			const nameElements = document.querySelectorAll(
				'h2[class="h3 product-title"] a'
			);

			console.log(nameElements);
			const priceElements = document.querySelectorAll('span[class="price"]');

			if (priceElements != null) {
				nameElements.forEach((nameElement, index) => {
					const title = nameElement.innerText;
					console.log(title);
					const price = priceElements[index].innerText;

					if (title.includes(game.gameName)) {
						const a = game.gameName.toLowerCase().trim();
						console.log(a);
						const b = title.toLowerCase().trim();
						console.log(b);
						const maxLength = Math.max(a.length, b.length);
						let shared = 0;

						for (let i = 0; i < maxLength; i++) {
							if (a[i] === b[i]) {
								shared++;
							}
						}

						const distance = shared / maxLength;

						if (title === game.gameName || distance >= 0.7) {
							result.push({
								index: index,
								title: title,
								price: price,
								url: nameElement.href,
							});
						}
					}
				});
			}

			return result[0];
		}, game);

		if (resultsList && resultsList.price !== null) {
			console.log(resultsList.price);
			const newPrice = resultsList.price.replace(/[^0-9]/g, "");
			const url = resultsList.url;

			if (newPrice) {
				updatePriceInDatabase(game._id, newPrice, url);
				console.log(
					`Precio y url actualizado para ${game.gameName}: ${newPrice}, ${url}`
				);
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

function updatePriceInDatabase(elementId, newPrice, url) {
	try {
		axios.put("http://localhost:8080/games/" + elementId, {
			price_EntreJuegos: newPrice,
			url_EntreJuegos: url,
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
