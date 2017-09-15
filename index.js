var fs = require("fs"),
    path = require("path"),
    Notes = require("./lib/Notes"),
    bodyParser = require("body-parser");

var config = JSON.parse(fs.readFileSync("config.json"));

console.log("Root Path: " + config.path);

var notes = new Notes(config.path);
notes.init();

var express = require("express");
var app = express();

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));

app.get("/api/all", (req, res) => res.send(notes.getData()));
app.get("/api/tags*", (req, res) => res.send(notes.getTags(req.params[0], req.query.tags)));
app.get("/api/categories*", (req, res) => res.send(notes.getCategories(req.params[0])));
app.get("/api/notes*", (req, res) => res.send(notes.getNotes(req.params[0], req.query.tags)));
app.get("/api/note/*", (req, res) => notes.getNote(req.params[0]).then((file) => res.send(file)));
app.put("/api/note/*", (req, res) => notes.updateNote(req.params[0], req.body).then((file) => res.send(file)));
app.get("/api/reload", (req, res) => notes.init().then(() => res.status(200).send("OK")).catch((e) => res.status(400)));

app.use(express.static("public"));

app.use("*", (req, res, next) => {
  if (req.params[0].endsWith(".md")) {
    res.sendFile(path.resolve(__dirname, "public", "index.html"))
  } else {
    next();
  }
});

app.use(express.static(config.path));

app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "public", "index.html")));

app.listen(9000, () => console.log("Example app listening on port 9000!"));
