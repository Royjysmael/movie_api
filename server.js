const http = require("http");
const fs = require("fs");
const url = require("url");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  const logMessage = `[${new Date().toISOString()}] ${req.url}\n`;

  fs.appendFile("log.txt", logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });

  let filePath = "index.html"; // default

  if (path === "/documentation") {
    filePath = "documentation.html";
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    }
  });
});

server.listen(8080, () => {
  console.log("Server is running at http://localhost:8080");
});
