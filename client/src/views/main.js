// This component work as a our main manager of the views and states for our manager
import React from "react";
import { useNavigate } from "react-router-dom";

import { IconContext } from "react-icons";
import {
	GiIsland,
	GiPartyPopper,
	GiTabletopPlayers,
	GiPerspectiveDiceSixFacesRandom,
} from "react-icons/gi";
import { SiCoop } from "react-icons/si";
import { GrResources } from "react-icons/gr";
import { TbHexagons, TbCards } from "react-icons/tb";

import SearchBar from "../components/searchBar";

const Main = () => {
	// ---------------------------------------------
	// I) VARIABLES & HOOKS
	// ---------------------------------------------

	const navigate = useNavigate();

	// ---------------------------------------------
	// II) HANDLERS & AUX FUNCTIONS
	// ---------------------------------------------

	const handleSearchClick = (type) => {
		navigate(`/search/${type}`);
	};

	const createButton = (text, type, icon) => {
		return (
			<div className="col-md-3 col-sm-4 col-6">
				<button
					key={type}
					className="m-3 border text-middle justify-content-center rounded btn btn-sm-md btn-light"
					style={{
						minHeight: "120px",
						height: "85%",
						minWidth: "85%",
					}}
					onClick={() => handleSearchClick(type)}
				>
					<IconContext.Provider value={{ size: "50" }}>
						<div>{icon}</div>
					</IconContext.Provider>
					<div className="mt-3">{text}</div>
				</button>
			</div>
		);
	};

	// ---------------------------------------------
	// III) JSX
	// ---------------------------------------------

	return (
		<div>
			<SearchBar />
			<div className="container mt-5">
				<div className="row">
					{createButton("Todos", "all", <GiIsland />)}
					{createButton("Gestion de Recursos", "economic", <GrResources />)}
					{createButton("Construcción de Tablero", "building", <TbHexagons />)}
					{createButton("Juego de Cartas", "card game", <TbCards />)}
					{createButton("Juego Party", "party game", <GiPartyPopper />)}
					{createButton("Co-Op", "cooperative", <SiCoop />)}
					{createButton("2 Jugadores", "2players", <GiTabletopPlayers />)}
					{createButton("Otros", "others", <GiPerspectiveDiceSixFacesRandom />)}
				</div>
			</div>
		</div>
	);
};

export default Main;
