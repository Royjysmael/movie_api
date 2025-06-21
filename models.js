const mongoose = require("mongoose");

// Movie Schema
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: Date,
    Death: Date,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

// User Schema
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

// Create models
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

// Export models
module.exports.Movie = Movie;
module.exports.User = User;
