import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import axios from "axios";
import { baseURL } from "../config.js";

import CommentsForm from "../components/commentsForm.js";
import CommentsList from "../components/commentsList.js";

const DetailsPage = () => {
	// ---------------------------------------------
	// I) VARIABLES & HOOKS
	// ---------------------------------------------

	const [loading, setLoading] = useState(true);

	const [games, setGame] = useState({});
	const params = useParams();

	// ---------------------------------------------
	// II) HANDLERS & AUX FUNCTIONS
	// ---------------------------------------------

	useEffect(() => {
		axios
			.get(`${baseURL}/details/` + params.id)
			.then((res) => {
				setGame({ ...res.data });
			})
			.catch((err) => {
				console.log(err);
			});
	}, [params.id]);

	// ---------------------------------------------
	// III) JSX
	// ---------------------------------------------
	return (
		<div className="p-3">
			{games.data &&
				games.data.map((game, index) => (
					<div key={index}>
						<div className="d-flex">
							<div className="d-flex col-8 bg-light rounded p-3 mb-5 bg-opacity-50">
								<div className="col-5 text-center">
									<img
										src={game.gamePhotoURL}
										alt={game.gameName}
										width="256"
										className="border me-3 rounded"
									/>
								</div>

								<div className="col-7 bg-light rounded p-3">
									<h1>{game.gameName}</h1>
									<div className="py-3 fw-semibold">
										Ranking: {game.gameRanking}
									</div>

									<div className="d-flex py-2">
										<div className="col-7 fw-semibold">
											Numero de Jugadores:
										</div>
										<div>
											{game.minPlayers === game.maxPlayers
												? game.maxPlayers
												: game.minPlayers + " - " + game.maxPlayers}
										</div>
									</div>

									<div className="d-flex py-3">
										<div className="col-7 fw-semibold">Tiempo de Juego: </div>
										<div>
											{game.minPlaytime === game.maxPlaytime
												? game.maxPlaytime + " "
												: game.minPlaytime + " - " + game.maxPlaytime + " "}
											min
										</div>
									</div>
								</div>
							</div>

							<div className="col-4 ps-5">
								<div>
									{game.price_EntreJuegos ? (
										<Link to={`${game.url_EntreJuegos}`}>
											<button className="btn btn-light p-3 mb-2 col-12">
												<div className="fw-semibold pb-1">EntreJuegos:</div>
												<h2>
													$
													{game.price_EntreJuegos
														.toString()
														.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
												</h2>
											</button>
										</Link>
									) : (
										""
									)}
								</div>
								<div>
									{game.price_drJuegos ? (
										<Link to={`${game.url_drJuegos}`}>
											<button className="btn btn-light p-3 mb-2 col-12">
												<div className="fw-semibold pb-1">DrJuegos:</div>
												<h2>
													$
													{game.price_drJuegos
														.toString()
														.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
												</h2>
											</button>
										</Link>
									) : (
										""
									)}
								</div>
								<div>
									{game.price_MoviePlay ? (
										<Link to={`${game.url_MoviePlay}`}>
											<button className="btn btn-light p-3 mb-2 col-12">
												<div className="fw-semibold pb-1">MoviePlay:</div>
												<h2>
													$
													{game.price_MoviePlay
														.toString()
														.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
												</h2>
											</button>
										</Link>
									) : (
										""
									)}
								</div>
								<div>
									{game.price_UpDown ? (
										<Link to={`${game.url_UpDown}`}>
											<button className="btn btn-light p-3 mb-2 col-12">
												<div className="fw-semibold pb-1">UpDown:</div>
												<h2>
													$
													{game.price_UpDown
														.toString()
														.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
												</h2>
											</button>
										</Link>
									) : (
										""
									)}
								</div>
							</div>
						</div>
						<h3 className="px-3 pb-2">Comentarios</h3>
						<div className="col-12 bg-light bg-opacity-50 rounded p-3">
							<CommentsForm loading={loading} setLoading={setLoading} />
						</div>
						<div
							className="col-12 bg-light bg-opacity-50 rounded p-3 mt-2"
							style={{ minHeight: "35vh", overflowY: "scroll" }}
						>
							<CommentsList loading={loading} setLoading={setLoading} />
						</div>
					</div>
				))}
		</div>
	);
};

export default DetailsPage;
