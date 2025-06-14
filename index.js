const express = require("express");
const morgan = require("morgan");

const app = express();
const port = 8080;

app.use(express.static("public"));
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.send("Welcome to Roy's Movie API!");
});

app.get("/movies", (req, res) => {
  res.json([
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
  ]);
});
app.get("/error", (req, res) => {
  throw new Error("Intentional test error");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${8080}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Uh Oh! It's Broken. Please try again later.");
});
