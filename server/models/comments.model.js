// ---------------------------------------------------
// MODEL SETUP - Comments
// ---------------------------------------------------

// 1) Importing External Libraries
const mongoose = require("mongoose");

// 2) Creating Schema for Model (blueprint)
const CommentsSchema = new mongoose.Schema(
	{
    gameID:{
      type: String,
    },
		commentAuthor: {
			type: String,
			required: [true, "Author is required"],
		},
		commentText: {
			type: String,
			required: [true, "Comment is required"],
		},

	},
	{ timestamps: true }
);

// 4) Creating Model using Schema
const CommentsModel = mongoose.model("Comments", CommentsSchema);

// 5) Exporting Model
module.exports = CommentsModel;
