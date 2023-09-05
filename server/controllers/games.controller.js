// ---------------------------------------------------
// CONTROLLER SETUP - Games
// ---------------------------------------------------

// 1) Importing External Libraries
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types; // Destructuring assignment to get ObjectId

// 2) Importing Model
const GamesModel = require("../models/games.model");

// 3) Exporting Controller functions
module.exports = {
	// 3.1) READ ALL ELEMENTS METHOD
	getAllGames: (req, res) => {
		GamesModel.find(
			{},
			{
				_id: true,
				gameName: true,
				gamePhotoURL: true,
				gameType: true,
				gameRanking: true,
				price_EntreJuegos: true,
				url_EntreJuegos:true,
				price_drJuegos: true,
				url_drJuegos:true,
				price_MoviePlay: true,
				url_MoviePlay:true,
				price_UpDown: true,
				url_UpDown:true,
				minPlayers: true,
				maxPlayers: true,
				minPlaytime: true,
				maxPlaytime: true,
				category: true,
			}
		)
			.then((games) => {
				res.json({ data: games });
			})
			.catch((error) => {
				res.status(500).json({ error: error });
			});
	},

	// 3.2) READ ONE ELEMENT METHOD
	getOneGames: (req, res) => {
		let id = req.params.id;
		if (!ObjectId.isValid(id))
			return res
				.status(400)
				.json({ message: "id doesn't match the expected format" });
		GamesModel.find({ _id: id })
			.then((games) => {
				res.json({ data: games });
			})
			.catch((error) => {
				res.status(500).json({ error: error });
			});
	},

	// 3.3) CREATE A NEW ELEMENT METHOD
	createGames: (req, res) => {
		let data = req.body;
		console.log(data);
		GamesModel.create(data)
			.then((games) => {
				res.json({ data: games });
			})
			.catch((error) => {
				if (error instanceof mongoose.Error.ValidationError) {
					let keys = Object.keys(error.errors);
					let error_dict = {};
					keys.map((key) => {
						error_dict[key] = error.errors[key].message;
					});
					res.status(500).json({ error: error_dict });
				} else {
					res.status(500).json({ error: error });
				}
			});
	},

	// 3.4) DELETE AN ELEMENT METHOD
	deleteGames: (req, res) => {
		let id = req.params.id;
		if (!ObjectId.isValid(id))
			return res
				.status(400)
				.json({ message: "id doesn't match the expected format" });
		GamesModel.deleteOne({ _id: id })
			.then(() => {
				res.json({ success: true });
			})
			.catch((error) => {
				res.status(500).json({ error: error });
			});
	},

	// 3.5) EDIT AN ELEMENT METHOD
	editGames: (req, res) => {
		let id = req.params.id;
		let data = req.body;
		const updateOptions = {
			new: true, // Return the updated document
			runValidators: true, // Enforce validation during update
		};
		if (!ObjectId.isValid(id))
			return res
				.status(400)
				.json({ message: "id doesn't match the expected format" });
		GamesModel.findByIdAndUpdate({ _id: id }, data, updateOptions)
			.then(() => {
				res.json({ success: true });
			})
			.catch((error) => {
				if (error instanceof mongoose.Error.ValidationError) {
					let keys = Object.keys(error.errors);
					let error_dict = {};
					keys.map((key) => {
						error_dict[key] = error.errors[key].message;
					});
					res.status(500).json({ error: error_dict });
				} else {
					res.status(500).json({ error: error });
				}
			});
	},
};
