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

		await page.goto(`https://www.updown.cl/`);

		console.log(game.gameName);

		await page.waitForSelector('input[name="phrase"]');
		await page.type('input[name="phrase"]', game.gameName);
		page.keyboard.press("Enter");

		await page.waitForNavigation({ waitUntil: "networkidle", timeout: 60000 }); // Esperar hasta 60 segundos

		const resultsList = await page.evaluate((game) => {
			let result = [];

			const nameElements = document.querySelectorAll(
				'h2[class="woocommerce-loop-product__title"] a'
			);

			console.log(nameElements);
			const priceElements = document.querySelectorAll(
				'span[class="woocommerce-Price-amount amount"] bdi'
			);

			if (priceElements != null) {
				nameElements.forEach((nameElement, index) => {
					const title = nameElement.innerText;
					console.log(title);
					const price = priceElements[index].innerText;
console.log(price)
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

		// await new Promise((resolve) => setTimeout(resolve, 5000));
		await browser.close();
	}

	console.log(newPrice);
}

function updatePriceInDatabase(elementId, newPrice, url) {
	try {
		axios.put("http://localhost:8080/games/" + elementId, {
			price_UpDown: newPrice,
			url_UpDown: url,
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
