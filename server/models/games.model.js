// ---------------------------------------------------
// MODEL SETUP - Games
// ---------------------------------------------------

// 1) Importing External Libraries
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// 2) Creating Schema for Model (blueprint)
const GamesSchema = new mongoose.Schema(
	{
		gameName: {
			type: String,
			unique: true,
			minlength: [3, "The Games name must be at least 3 characters long"],
		},
		gamePhotoURL: {
			type: String,
		},
		gameRanking: {
			type: Number,
		},
		gameType: {
			type: String,
		},
		price_EntreJuegos: {
			type: Number,
		},
		url_EntreJuegos: {
			type: String,
		},
		price_drJuegos: {
			type: Number,
		},
		url_drJuegos: {
			type: String,
		},
		price_MoviePlay: {
			type: Number,
		},
		url_MoviePlay: {
			type: String,
		},
		price_UpDown: {
			type: Number,
		},
		url_UpDown: {
			type: String,
		},
		minPlayers: {
			type: Number,
		},
		maxPlayers: {
			type: Number,
		},
		minPlaytime: {
			type: Number,
		},
		maxPlaytime: {
			type: Number,
		},
		category: {
			type: Array,
		},
	},
	{ timestamps: true }
);

// 3) Apply the uniqueValidator plugin to GamesSchema.
GamesSchema.plugin(uniqueValidator, {
	message: "Error: The game already exist",
});

// 4) Creating Model using Schema
const GamesModel = mongoose.model("Games", GamesSchema);

// 5) Exporting Model
module.exports = GamesModel;
