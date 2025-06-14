const express = require("express");
const morgan = require("morgan");

const app = express();
const port = 8080;

app.use(express.static("public"));
app.use(morgan("common"));

const genres = [
  {
    name: "Action",
    description: "Fast-paced movies with lots of physical activity",
  },
  {
    name: "Adventure",
    description: "Exciting stories with exploration or travel",
  },
  { name: "Drama", description: "Serious storytelling with emotional themes" },
  { name: "Comedy", description: "Movies designed to make you laugh" },
  {
    name: "Thriller",
    description: "Suspenseful plots with twists and tension",
  },
];

const movies = [
  { title: "The Matrix", year: 1999 },
  { title: "Pulp Fiction", year: 1994 },
  { title: "Fight Club", year: 1999 },
  { title: "Back to the Future Part III", year: 1990 },
  { title: "Teenage Mutant Ninja Turtles", year: 1990 },
  { title: "The Sandlot", year: 1993 },
  { title: "Terminator 2 Judgment Day", year: 1991 },
  { title: "Independence Day", year: 1996 },
  { title: "Jurassic Park", year: 1993 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "The Fifth Element", year: 1997 },
  { title: "Adam's Family Values", year: 1993 },
  { title: "Space Jams", year: 1996 },
  { title: "The Lion King", year: 1994 },
  { title: "The Mighty Ducks", year: 1992 },
  { title: "Richie Rich", year: 1994 },
  { title: "The Flintstones", year: 1994 },
  { title: "Aladdin", year: 1992 },
  { title: "Toy Story", year: 1995 },
  { title: "Jumanji", year: 1995 },
];

const directors = [
  {
    name: "Lana & Lilly Wachowski",
    bio: "Directed The Matrix trilogy.",
    birthYear: 1965,
  },
  {
    name: "Quentin Tarantino",
    bio: "Known for stylized storytelling and nonlinear plots.",
    birthYear: 1963,
  },
  {
    name: "David Fincher",
    bio: "Directed Fight Club, Se7en, and Gone Girl.",
    birthYear: 1962,
  },
  {
    name: "Robert Zemeckis",
    bio: "Directed Back to the Future, Forrest Gump.",
    birthYear: 1952,
  },
  {
    name: "Steve Barron",
    bio: "Directed Teenage Mutant Ninja Turtles (1990).",
    birthYear: 1956,
  },
  {
    name: "David Mickey Evans",
    bio: "Known for directing The Sandlot.",
    birthYear: 1962,
  },
  {
    name: "James Cameron",
    bio: "Directed Terminator 2, Titanic, Avatar.",
    birthYear: 1954,
  },
  {
    name: "Roland Emmerich",
    bio: "Famous for Independence Day and disaster films.",
    birthYear: 1955,
  },
  {
    name: "Steven Spielberg",
    bio: "Legendary director of Jurassic Park and Saving Private Ryan.",
    birthYear: 1946,
  },
  {
    name: "Luc Besson",
    bio: "French director known for The Fifth Element.",
    birthYear: 1959,
  },
  {
    name: "Barry Sonnenfeld",
    bio: "Directed Addams Family Values, Men in Black.",
    birthYear: 1953,
  },
  { name: "Joe Pytka", bio: "Directed Space Jam (1996).", birthYear: 1938 },
  {
    name: "Roger Allers & Rob Minkoff",
    bio: "Co-directed The Lion King.",
    birthYear: 1953,
  },
  {
    name: "Stephen Herek",
    bio: "Directed The Mighty Ducks, Bill & Ted’s Excellent Adventure.",
    birthYear: 1958,
  },
  {
    name: "Donald Petrie",
    bio: "Directed Richie Rich and Miss Congeniality.",
    birthYear: 1954,
  },
  {
    name: "Brian Levant",
    bio: "Directed The Flintstones, Jingle All the Way.",
    birthYear: 1952,
  },
  {
    name: "Ron Clements & John Musker",
    bio: "Co-directed Aladdin, Moana, and more.",
    birthYear: 1953,
  },
  {
    name: "John Lasseter",
    bio: "Directed Toy Story, Cars, A Bug’s Life.",
    birthYear: 1957,
  },
  {
    name: "Joe Johnston",
    bio: "Directed Jumanji, The Rocketeer, and Captain America: The First Avenger.",
    birthYear: 1950,
  },
];

app.get("/", (req, res) => {
  res.send("Welcome to Roy's Movie API!");
});

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.get("/movies/:title", (req, res) => {
  const requestedTitle = req.params.title.toLowerCase();

  const movie = movies.find((m) => m.title.toLowerCase() === requestedTitle);

  if (movie) {
    res.json(movie);
  } else {
    console.log("Movie not found:", requestedTitle);
    res.status(404).send("Movie not found");
  }
});

app.get("/genres/:genreName", (req, res) => {
  const genreName = req.params.genreName.toLowerCase();
  const genre = genres.find((g) => g.name.toLowerCase() === genreName);

  if (genre) {
    res.json(genre);
  } else {
    res.status(404).send("Genre not found");
  }
});

app.get("/directors/:directorName", (req, res) => {
  const directorName = req.params.directorName.toLowerCase();
  const director = directors.find((d) => d.name.toLowerCase() === directorName);

  if (director) {
    res.json(director);
  } else {
    res.status(404).send("Director not found");
  }
});

app.post("/users", (req, res) => {
  res.send("New user registered");
});

app.put("/users/:username", (req, res) => {
  res.send(`Updated info for user: ${req.params.username}`);
});

app.post("/users/:username/movies/:movieId", (req, res) => {
  res.send(
    `Added movie ${req.params.movieId} to ${req.params.username}'s favorites`
  );
});

app.delete("/users/:username/movies/:movieId", (req, res) => {
  res.send(
    `Removed movie ${req.params.movieId} from ${req.params.username}'s favorites`
  );
});

app.delete("/users/:username", (req, res) => {
  res.send(`Deleted user: ${req.params.username}`);
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
