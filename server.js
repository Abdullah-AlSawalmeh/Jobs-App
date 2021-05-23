require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pg = require("pg");
const methodOverride = require("method-override");
const superagent = require("superagent");

const server = express();

server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride("_method"));
server.use(express.static("./public"));
server.set("view engine", "ejs");
const client = new pg.Client(process.env.DATABASE_URL);

const PORT = process.env.PORT || 3030;

server.get("/", mainHandler);
server.get("/search", searchHandlerGET);
server.get("/results", resultsHandlerGET);
server.get("/mylist", listjobsHandlerGET);
server.post("/mylist", listjobsHandlerGET);

function Job(data) {
  this.url = data.url;
  this.location = data.location;
  this.title = data.title;
  this.description = data.description;
  this.company = data.company;
}

function mainHandler(req, res) {
  let URL = `https://jobs.github.com/positions.json?location=usa`;
  superagent.get(URL).then((resutls) => {
    data = resutls.body;
    let dataObj = data.map((element) => new Job(element));
    res.render("homepage", { data: dataObj });
  });
}
function searchHandlerGET(req, res) {
  res.render("search");
}
function resultsHandlerGET(req, res) {
  let query = req.query.search_query;
  let URL = `https://jobs.github.com/positions.json?description=${query}&location=usa`;
  superagent.get(URL).then((resutls) => {
    data = resutls.body;
    let dataObj = data.map((element) => new Job(element));
    res.render("results", { data: dataObj });
  });
}

function listjobsHandlerGET(req, res) {}

client.connect().then(() => {
  server.listen(PORT, console.log(`Server is listining to PORT : ${PORT}`));
});
