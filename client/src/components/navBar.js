import React from "react";
import { Link } from "react-router-dom";
import { IconContext } from "react-icons";
import { GiIsland } from "react-icons/gi";

const NavBar = () => {
	// --------------------------------------------------
	// I) HOOKS AND VARIABLES
	// --------------------------------------------------

	// Destructuring Props

	// React Router Hooks - Params and Navigation

	// --------------------------------------------------
	// II) HANDLERS AND AUXILIAR FUNCTIONS
	// --------------------------------------------------

	// i) Handlers

	// ii) API Calls

	// --------------------------------------------------
	// III) JSX
	// --------------------------------------------------
	return (
		<nav className="navbar navbar-dark" style={{ background: "darkcyan" }}>
			<div className="container">
				<Link to="/" className="d-flex navbar-brand">
				<IconContext.Provider  value={{ size: "35" }}>
						<div><GiIsland className="mx-3"/></div>
					</IconContext.Provider>
					<h3 className="my-0">Isla de Juegos</h3>
				</Link>
				<div className="d-flex">
					{/* Link to LoginPage */}
					{/* <Link
							to="/newuser/"
							className="nav-link text-white fs-5 mx-2 "
						>
							Login
						</Link> */}

					{/* Button for Logout */}
					{/* <button
							className="nav-link text-white fs-5 mx-2"
						>
							Logout
						</button> */}
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
