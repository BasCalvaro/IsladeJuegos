// This component work as a our main manager of the views and states for our manager
import React, { useState, useEffect, useCallback } from "react";

import { IconContext } from "react-icons";
import { MdSearch } from "react-icons/md";

import axios from "axios";
import { useParams } from "react-router-dom";

import { baseURL } from "../config.js";
import GamesList from "../components/gameList.js";
import SearchFilters from "../components/searchFilters.js";

const SearchMain = () => {
	// ---------------------------------------------
	// I) VARIABLES & HOOKS
	// ---------------------------------------------

	const { type } = useParams();

	const [loading, setLoading] = useState(true);

	const [games, setGames] = useState([]);

	const [searchText, setSearchText] = useState("");

	const getAllGames = useCallback(async () => {
		axios.get(`${baseURL}/search/`).then((res) => {
			const filteredGames = res.data.data.filter(
				(game) =>
					!isNaN(game.price_EntreJuegos) ||
					!isNaN(game.price_drJuegos) ||
					!isNaN(game.price_MoviePlay) ||
					!isNaN(game.price_VuduGaming)
			);
			// console.log(filteredGames)
			setGames(filteredGames);
			setLoading(false);
		});
	}, [setLoading]);

	// console.log(games);

	useEffect(() => {
		if (loading) {
			getAllGames();
		}
	}, [loading, getAllGames]);

	// ---------------------------------------------
	// II) HANDLERS & AUX FUNCTIONS
	// ---------------------------------------------

	const handleSearchInputChange = (event) => {
		setSearchText(event.target.value);
	};

	const filteredGames = games.filter((game) =>
		game.gameName.toLowerCase().includes(searchText.toLowerCase())
	);

	// ---------------------------------------------
	// III) JSX
	// ---------------------------------------------

	return (
		<div className="d-flex" style={{ height: "94vh" }}>
			<div className="p-3 col-3 bg-light">
				<div className="justify-content-center">
					<div className="input-group mt-5 mb-5">
						<span className="input-group-text" id="basic-addon1">
							<IconContext.Provider value={{ size: "25" }}>
								<div>
									<MdSearch />
								</div>
							</IconContext.Provider>
						</span>
						<input
							type="text"
							className="form-control"
							value={searchText}
							onChange={handleSearchInputChange}
						/>
					</div>
				</div>
				<SearchFilters loading={loading} setLoading={setLoading} />
			</div>
			<div className="col-8">
				<div className="d-flex justify-content-center">
					{games && (
						<>
							{type === "all" ? (
								<GamesList
									games={filteredGames}
									setGames={setGames}
									loading={loading}
									setLoading={setLoading}
									type={type}
								/>
							) : type === "economic" ? (
								<GamesList
									games={games.filter((game) =>
										game.category.includes("Economic")
									)}
									setGames={setGames}
									loading={loading}
									setLoading={setLoading}
									type={type}
								/>
							) : type === "building" ? (
								<GamesList
									games={games.filter(
										(game) =>
											game.category.includes("City Building") ||
											game.category.includes("Territory Building")
									)}
									setGames={setGames}
									loading={loading}
									setLoading={setLoading}
									type={type}
								/>
							) : type === "card game" ? (
								<GamesList
									games={games.filter((game) =>
										game.category.includes("Card Game")
									)}
									setGames={setGames}
									loading={loading}
									setLoading={setLoading}
									type={type}
								/>
							) : type === "party game" ? (
								<GamesList
									games={games.filter((game) =>
										game.category.includes("Party Game")
									)}
									setGames={setGames}
									loading={loading}
									setLoading={setLoading}
									type={type}
								/>
							) : type === "cooperative" ? (
								<GamesList
									games={games.filter((game) =>
										game.category.includes("Cooperative Game")
									)}
									setGames={setGames}
									loading={loading}
									setLoading={setLoading}
									type={type}
								/>
							) : type === "2 players" ? (
								<GamesList
									games={games.filter((game) => game.maxPlayers === 2)}
									setGames={setGames}
									loading={loading}
									setLoading={setLoading}
									type={type}
								/>
							) : type === "others" ? (
								<GamesList
									games={games.filter(
										(game) =>
											!game.category.includes("Economic") &&
											!game.category.includes("Cooperative Game") &&
											!game.category.includes("Party Game") &&
											!game.category.includes("Card Game") &&
											!game.category.includes("City Building") &&
											!game.category.includes("Territory Building") &&
											game.maxPlayers !== 2
									)}
									setGames={setGames}
									loading={loading}
									setLoading={setLoading}
									type={type}
								/>
							) : (
								""
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default SearchMain;
