import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ result }) => {
	// ---------------------------------------------
	// I) VARIABLES & HOOKS
	// ---------------------------------------------

	// ---------------------------------------------
	// II) HANDLERS & AUX FUNCTIONS
	// ---------------------------------------------

	// ---------------------------------------------
	// III) JSX
	// ---------------------------------------------

	return (
		<div>
			<Link
				to={`/details/${result._id}`}
				className="d-flex col-8 link-dark text-decoration-none"
			>
				<div className="m-2 col-2">
					<img
						src={result.gamePhotoURL}
						alt={result.gameName}
						height="64"
						className="my-2 border rounded"
					/>
				</div>
				<div className="my-3 mx-4 col-8">
					<h5>{result.gameName}</h5>
				</div>
				<div className="my-3 mx-4 col-8">
					<h5>
						$
						{Math.min(
							...[
								result.price_EntreJuego,
								result.price_drJuegos,
								result.price_MoviePlay,
								result.price_UpDown,
							].filter((price) => !isNaN(price))
						)}
					</h5>
				</div>
			</Link>
		</div>
	);
};

export default SearchResult;
