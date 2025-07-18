const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const directorSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Bio: String,
  Birth: Date,
  Death: Date,
});

const actorSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Bio: String,
  Birth: Date,
  Death: Date,
});

const movieSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: { type: mongoose.Schema.Types.ObjectId, ref: "Director" },
  Actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" }],
  ImagePath: String,
  Featured: Boolean,
});

const userSchema = new mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.Password);
};

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const Movie = mongoose.model("Movie", movieSchema);
const User = mongoose.model("User", userSchema);
const Director = mongoose.model("Director", directorSchema);
const Actor = mongoose.model("Actor", actorSchema);

module.exports = { Movie, User, Director, Actor };
