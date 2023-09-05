// ---------------------------------------------------
// CONFIG SETUP - Database
// ---------------------------------------------------

// 1) Importing External Libraries (Moongose)
const mongoose = require("mongoose");

// 2) Initializing database
const db_name = "GamesManager_db";

// 2) Setting connection to Mongo DB using 'mongoose' instance
mongoose
	.connect(`mongodb://127.0.0.1/${db_name}`, {
		useNewUrlParser: true, // Avoids deprecation warnings -> enables new MongoDB connection string parser
		useUnifiedTopology: true, // Avoids connection errors -> enables new unified topology engine for MongoDB Node.js driver
	})
	.then(() => {
		console.log("Established a connection to:" + db_name + " with Mongo");
	})
	.catch((err) => {
		console.log("Something went wrong when connecting to the database", err);
	});
