const { check, validationResult } = require("express-validator");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Models = require("./models.js");
const passport = require("passport");
require("./passport");

const Movies = Models.Movie;
const Users = Models.User;

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(morgan("common"));
const cors = require("cors");

app.use(cors());

let auth = require("./auth")(app);

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movies = await Movies.find()
        .select("-_id -__v")
        .populate("Director", "-_id -__v")
        .populate("Actors", "-_id -__v");

      res.status(200).json(movies);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

mongoose.connect(
  "mongodb+srv://royj:jandru003@royflixdb.cwdk0od.mongodb.net/movieAPI?retryWrites=true&w=majority&appName=RoyFlixDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.get("/", (req, res) => {
  res.send("Welcome to Roy's Movie API!");
});

app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movie = await Movies.findOne({ Title: req.params.title })
        .select("-_id -__v")
        .populate("Director", "-_id -__v")
        .populate("Actors", "-_id -__v");

      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(404).send("Movie not found");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

app.get(
  "/genres/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movie = await Movies.findOne({
        "Genre.Name": req.params.genreName,
      });
      if (movie) {
        res.status(200).json(movie.Genre);
      } else {
        res.status(404).send("Genre not found");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

app.get(
  "/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const movie = await Movies.findOne({
        "Director.Name": req.params.directorName,
      });
      if (movie) {
        res.status(200).json(movie.Director);
      } else {
        res.status(404).send("Director not found");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const users = await Users.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).send("Error: " + err);
    }
  }
);

app.get(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Prevent users from accessing other users' info
    if (req.user.Username !== req.params.username) {
      return res.status(403).send("Access denied");
    }

    try {
      const user = await Users.findOne({
        Username: req.params.username,
      }).select("-Password -__v");

      if (!user) {
        return res.status(404).send("User not found");
      }

      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non-alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const hashedPassword = Users.hashPassword(req.body.Password);

    try {
      const existingUser = await Users.findOne({ Username: req.body.Username });

      if (existingUser) {
        return res.status(400).send(req.body.Username + " already exists");
      }

      const newUser = await Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    }
  }
);

app.put(
  "/users/:username",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non-alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Email", "Email does not appear to be valid").isEmail(),
    check("Birthday", "Birthday must be a valid date").optional().isISO8601(),
  ],
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const updateData = {
        Username: req.body.Username,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      };

      if (req.body.Password) {
        updateData.Password = await bcrypt.hash(req.body.Password, 10);
      }

      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.username },
        { $set: updateData },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

app.post(
  "/users/:username/movies/:movieId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.username) {
      return res.status(403).send("Access denied");
    }

    try {
      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.username },
        { $addToSet: { FavoriteMovies: req.params.movieId } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).send("Error: " + err);
    }
  }
);

app.delete(
  "/users/:username/movies/:movieId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.username) {
      return res.status(403).send("Access denied");
    }

    try {
      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.username },
        { $pull: { FavoriteMovies: req.params.movieId } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).send("Error: " + err);
    }
  }
);

// Delete user
app.delete(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.username) {
      return res.status(403).send("Access denied");
    }

    try {
      const deletedUser = await Users.findOneAndDelete({
        Username: req.params.username,
      });

      if (!deletedUser) {
        return res.status(404).send("User not found");
      }

      res.status(200).send(`User ${req.params.username} was deleted.`);
    } catch (err) {
      res.status(500).send("Error: " + err);
    }
  }
);

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Uh Oh! It's Broken. Please try again later.");
});
