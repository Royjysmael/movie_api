const { userSchema } = require("./validation");
const express = require("express");
const morgan = require("morgan");

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static("public"));
app.use(morgan("common"));

mongoose.connect("mongodb://localhost:27017/movieAPI", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Welcome to Roy's Movie API!");
});

app.get("/movies", async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get("/movies/:title", async (req, res) => {
  await Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(404).send("Movie not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get("/genres/:genreName", async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie.Genre);
      } else {
        res.status(404).send("Genre not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get("/directors/:directorName", async (req, res) => {
  await Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie.Director);
      } else {
        res.status(404).send("Director not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.post("/users", async (req, res) => {
  // Validate user input
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .send(`Validation error: ${error.details[0].message}`);
  }

  // Check for existing user
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((newUser) => {
            res.status(201).json(newUser);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.put("/users/:username", async (req, res) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .send(`Validation error: ${error.details[0].message}`);
  }

  await Users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.post("/users", async (req, res) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .send(`Validation error: ${error.details[0].message}`);
  }

  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(`${req.body.Username} already exists`);
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((newUser) => res.status(201).json(newUser))
          .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.delete("/users/:username/movies/:movieId", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.username },
    { $pull: { FavoriteMovies: req.params.movieId } },
    { new: true }
  )
    .then((updatedUser) => {
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.delete("/users/:username", async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(404).send(req.params.username + " was not found");
      } else {
        res.status(200).send(req.params.username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${8080}`);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Uh Oh! It's Broken. Please try again later.");
});
