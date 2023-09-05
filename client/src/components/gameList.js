// This component work as a list that updates every game, no matters the status of it

import React, { useState } from "react";
import { Link } from "react-router-dom";

const GameList = (props) => {
	// ---------------------------------------------
	// I) VARIABLES & HOOKS
	// ---------------------------------------------

	const { games } = props;

	const itemsPerPage = 10; // Número de elementos por página
	const totalPages = Math.ceil(games.length / itemsPerPage);

	// Función para obtener los elementos de una página específica
	const getItemsForPage = (pageNumber) => {
		const startIndex = (pageNumber - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return games.slice(startIndex, endIndex);
	};

	const [currentPage, setCurrentPage] = useState(1);

	const canGoBack = currentPage > 1;
	const canGoForward = currentPage < totalPages;

	// ---------------------------------------------
	// II) HANDLERS & AUX FUNCTIONS
	// ---------------------------------------------
	const getImageWidth = (src) => {
		const img = new Image();
		img.src = src;
		console.log(img.width);
		return img.width;
	};

	const getImageHeight = (src) => {
		const img = new Image();
		img.src = src;
		console.log(img.height);
		return img.height;
	};

	// ---------------------------------------------
	// III) JSX
	// ---------------------------------------------

	return (
		<div style={{ width: "100%" }}>
			<div style={{ height: "88vh", overflowY: "scroll" }}>
				{getItemsForPage(currentPage) &&
					getItemsForPage(currentPage).map((game, index) => (
						<div
							key={index}
							className="rounded bg-light m-5 ps-5 pe-4 py-3 d-flex"
							style={{ minHeight: "260px" }}
						>
							<Link
								to={`/details/${game._id}`}
								className="col-6 link-dark text-decoration-none"
							>
								<div>
									<h5>{game.gameName}</h5>
								</div>
								<div className="mr-3">
									{console.log(game.gamePhotoURL.naturalWidth)}
									<img
										src={game.gamePhotoURL}
										alt={game.gameName}
										style={{
											height:
												getImageHeight(game.gamePhotoURL) >
												getImageWidth(game.gamePhotoURL)
													? "auto"
													: "128px",
											width:
												getImageWidth(game.gamePhotoURL) >
												getImageHeight(game.gamePhotoURL)
													? "auto"
													: "128px",
										}}
										className="my-2 border rounded"
									/>
								</div>
							</Link>

							<div className="col-6 py-3">
								<div className="d-flex py-3">
									<div className="col-7">Precio más bajo:</div>
									<div>
										${" "}
										{Math.min(
											...[
												game.price_EntreJuegos,
												game.price_drJuegos,
												game.price_MoviePlay,
												game.price_UpDown,
											].filter((price) => !isNaN(price))
										)
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
									</div>
								</div>
								{/* <p>Ranking: {game.gameRanking}</p> */}
								<div className="d-flex py-2">
									{" "}
									<div className="col-7">Numero de Jugadores: </div>
									<div>
										{game.minPlayers === game.maxPlayers
											? game.maxPlayers
											: game.minPlayers + " - " + game.maxPlayers}
									</div>
								</div>

								<div className="d-flex py-3">
									<div className="col-7">Tiempo de Juego: </div>
									<div>
										{game.minPlaytime === game.maxPlaytime
											? (game.maxPlaytime + " ")
											: (game.minPlaytime + " - " + game.maxPlaytime + " ")}
											min
									</div>
								</div>
							</div>
						</div>
					))}
			</div>
			<div className="d-flex justify-content-center pt-3">
				<nav aria-label="Page navigation example">
					<ul className="pagination">
						<li className={`page-item ${canGoBack ? "" : "disabled"}`}>
							<button
								className="page-link"
								aria-label="Previous"
								onClick={() => canGoBack && setCurrentPage(currentPage - 1)}
							>
								<span aria-hidden="true">&laquo;</span>
							</button>
						</li>
						{Array.from({ length: totalPages }, (_, i) => (
							<>
								<li
									key={i}
									onClick={() => setCurrentPage(i + 1)}
									className={currentPage === i + 1 ? "page-item active" : ""}
								>
									<button className="page-link">{i + 1}</button>
								</li>
							</>
						))}
						<li className={`page-item ${canGoForward ? "" : "disabled"}`}>
							<button
								className="page-link"
								aria-label="Next"
								onClick={() => canGoForward && setCurrentPage(currentPage + 1)}
							>
								<span aria-hidden="true">&raquo;</span>
							</button>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
};

export default GameList;
