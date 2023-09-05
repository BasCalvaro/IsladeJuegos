// ---------------------------------------------------
// ROUTES SETUP - Comments
// ---------------------------------------------------

// 1) Importing Controller Methods
const {
	getAllComments,
	createComments,
} = require("../controllers/comments.controller");

// 2) Link Routes with Controller Methods
module.exports = (app) => {
	app.get("/comments/:id", getAllComments);
	app.post("/comments/:id", createComments);
};
