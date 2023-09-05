import React, { useState } from "react";
import axios from "axios";

import { baseURL } from "../config.js";
import SearchResult from "./searchResults";

import { IconContext } from "react-icons";
import { MdSearch } from "react-icons/md";

const SearchBar = () => {
	// ---------------------------------------------
	// I) VARIABLES & HOOKS
	// ---------------------------------------------
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [showResults, setShowResults] = useState(false);
	// ---------------------------------------------
	// II) HANDLERS & AUX FUNCTIONS
	// ---------------------------------------------

	const handleInputChange = (event) => {
		const newQuery = event.target.value;
		setQuery(newQuery);

		// Realiza la búsqueda en tiempo real
		if (newQuery.trim() !== "") {
			axios
				.get(`${baseURL}/search?q=${newQuery}`)
				.then((res) => {
					const filteredGames = res.data.data.filter(
						(game) =>
							!isNaN(game.price_EntreJuegos) ||
							!isNaN(game.price_drJuegos) ||
							!isNaN(game.price_MoviePlay) ||
							!isNaN(game.price_VuduGaming)
					);
					setResults(filteredGames);
					setShowResults(true);
				})
				.catch((error) => {
					console.error("Error de búsqueda:", error);
				});
		} else {
			// Si la consulta está vacía, oculta los resultados
			setShowResults(false);
		}
	};

	const filteredGames = results.filter((game) =>
		game.gameName.toLowerCase().includes(query.toLowerCase())
	);

	// ---------------------------------------------
	// III) JSX
	// ---------------------------------------------
	return (
		<div>
			<div className="d-flex justify-content-center">
				<div className="input-group mt-5 w-50">
					<button className="input-group-text" id="basic-addon1">
						<IconContext.Provider value={{ size: "25" }}>
							<div>
								<MdSearch />
							</div>
						</IconContext.Provider>
					</button>
					<input
						type="text"
						className="form-control"
						aria-describedby="basic-addon1"
						value={query}
						onChange={handleInputChange}
					/>
				</div>
			</div>
			{showResults && (
				<div className="position-absolute start-50 translate-middle-x bg-light w-50">
					{console.log(filteredGames)}
					{filteredGames.map((result, index) => (
						<SearchResult key={index} result={result} />
					))}
				</div>
			)}
		</div>
	);
};

export default SearchBar;
