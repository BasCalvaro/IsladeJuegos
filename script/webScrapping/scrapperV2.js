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

	await page.goto("https://www.drjuegos.cl/");

	await page.waitForSelector('input[name="s"]');
	await page.type('input[name="s"]', query);
	page.keyboard.press("Enter");

	await page.waitForNavigation({ waitUntil: "networkidle" });

	const referenceTerm = query;

	const resultsList = await page.evaluate(
		(referenceTerm, similarity, editDistance) => {
			let result = [];

			const nameElements = document.querySelectorAll(
				'h5[class="product-name"] a'
			);
			const priceElements = document.querySelectorAll(
				'span[class="price product-price"]'
			);

			nameElements.forEach((nameElement, index) => {
				const title = nameElement.innerText;
				const price = priceElements[index].innerText;

				result.push({
					index: index,
					title: title,
					price: price,
					url: nameElement.href,
				});
			});

			const findMostSimilarTitle = (referenceTerm, titles) => {
				let mostSimilarTitle = null;
				let highestSimilarity = 0;

				titles.forEach((titleInfo) => {
					const title = titleInfo.title;
					const similarityScore = similarity(referenceTerm, title);

					if (similarityScore > highestSimilarity) {
						highestSimilarity = similarityScore;
						mostSimilarTitle = title;
					}
				});

				return mostSimilarTitle;
			};

			const mostSimilarTitle = findMostSimilarTitle(
				referenceTerm,
				result.map((item) => item.title)
			);
			console.log(mostSimilarTitle);
			return result;
		},
		referenceTerm,
		similarity,
		editDistance
	);

	const price = await page.evaluate(() => {
		const priceElement = document.querySelector(
			'span[class="price product-price"]'
		);
		return priceElement ? priceElement.innerText : null;
	});

	console.log(resultsList);
	console.log(price);
	await browser.close();
}

// getResults("Food Chain Magnate");

getOneGame().then((response) => {
	const games = response.data;
	console.log(games.data[9].gameName);
	getResults(games.data[9].gameName);
});

function similarity(s1, s2) {
	var longer = s1;
	var shorter = s2;
	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}
	var longerLength = longer.length;
	if (longerLength == 0) {
		return 1.0;
	}
	return (
		(longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
	);
}

function editDistance(s1, s2) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	var costs = new Array();
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0) costs[j] = j;
			else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (s1.charAt(i - 1) != s2.charAt(j - 1))
						newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0) costs[s2.length] = lastValue;
	}
	return costs[s2.length];
}
