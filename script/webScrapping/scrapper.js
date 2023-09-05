import { chromium } from "playwright";
import axios from "axios";

async function getOneGame() {
	try {
		const response = await axios.get(`http://localhost:8080/search/`);
		return response;
	} catch (error) {
		console.error("Error fetching data");
		return [];
	}
}

async function getResults(query) {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	await page.goto("https://www.entrejuegos.cl/");

	await page.waitForSelector('input[name="s"]');
	await page.type('input[name="s"]', query);
	page.keyboard.press("Enter");

	await page.waitForNavigation({ waitUntil: "networkidle" });

	const resultsList = await page.evaluate((query) => {
		let result = [];

		const nameElements = document.querySelectorAll(
			'h2[class="h3 product-title"] a'
		);
		const priceElements = document.querySelectorAll('span[class="price"]');

		nameElements.forEach((nameElement, index) => {
			const title = nameElement.innerText;
			const price = priceElements[index].innerText;

			if (title.includes(query)) {				
				result.push({
					index: index,
					title: title,
					price: price,
					url: nameElement.href,
				});
			} 
		});
		return result;
	}, query);

	const price = await page.evaluate(() => {
		const priceElement = document.querySelector('span[class="price"]');
		return priceElement ? priceElement.innerText : null;
	});

	console.log(resultsList[0]);
	console.log(price);
	await browser.close();
}

// getResults("Food Chain Magnate");

getOneGame().then((response) => {
	const games = response.data;
	console.log(games.data[9].gameName);
	getResults(games.data[9].gameName);
});
