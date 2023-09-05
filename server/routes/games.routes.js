// ---------------------------------------------------
// ROUTES SETUP - Games
// ---------------------------------------------------

// 1) Importing Controller Methods
const {
	getAllGames,
	getOneGames,
	createGames,
	deleteGames,
	editGames,
} = require("../controllers/games.controller");

// 2) Link Routes with Controller Methods
module.exports = (app) => {
	app.get("/search/", getAllGames);
	app.get("/details/:id", getOneGames);
	app.post("/games/new", createGames);
	app.delete("/games/:id", deleteGames);
	app.put("/games/:id", editGames);
};
