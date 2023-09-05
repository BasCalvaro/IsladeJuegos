// This component work as a manager for the path for our web
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import Main from "./views/main.js";
import NavBar from "./components/navBar.js";
import SearchMain from "./views/searchMain.js";
import GamesDetails from "./views/gamesDetails.js";

// **************************************************************************
// A) MAIN COMPONENT
// **************************************************************************

function App() {
	// --------------------------------------------------
	// I) HOOKS AND VARIABLES
	// --------------------------------------------------

	// --------------------------------------------------
	// II) JSX
	// --------------------------------------------------
	return (
		<div className="bg-secondary bg-opacity-50" style={{ height: "100vh" }}>
			<NavBar />
			<Routes>
				<Route path="/" element={<Main />} />
				<Route path="/search/:type" element={<SearchMain />} />
				<Route path="/details/:id" element={<GamesDetails />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</div>
	);
}
export default App;
