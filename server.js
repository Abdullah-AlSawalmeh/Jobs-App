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
// const client = new pg.Client(process.env.DATABASE_URL);
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const PORT = process.env.PORT || 3030;

server.get("/", mainHandler);
server.get("/search", searchHandlerGET);
server.get("/results", resultsHandlerGET);
server.get("/mylist", listjobsHandlerGET);
server.post("/mylist", listjobsHandlerPOST);
server.get("/mylist/:id", listjobsHandlerIdGET);
server.put("/mylist/:id", listjobsHandlerIdPUT);
server.delete("/mylist/:id", listjobsHandlerIdDELETE);

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

function listjobsHandlerGET(req, res) {
  let SQL = `SELECT * FROM jobs;`;
  client.query(SQL).then((results) => {
    res.render("mylist", { data: results.rows });
  });
}
function listjobsHandlerPOST(req, res) {
  //   console.log("sdf");
  const { title, url, description, company, location } = req.body;
  //   console.log(title, url, description, company, location);
  let SQL = `INSERT INTO jobs (title,url,description,company,location) VALUES ($1,$2,$3,$4,$5);`;
  let safeValues = [title, url, description, company, location];
  client.query(SQL, safeValues).then(() => {
    res.redirect("/mylist");
  });
}
function listjobsHandlerIdGET(req, res) {
  //   console.log("hlo");
  let URLparamas = req.params.id;
  //   console.log(URLparamas);
  let SQL = `SELECT * FROM jobs WHERE id=$1;`;
  let safeValues = [URLparamas];
  client.query(SQL, safeValues).then((results) => {
    // res.redirect(`/mylist/${URLparamas}`, { data: results.rows[0] });
    res.render(`details`, { data: results.rows[0] });
  });
}
function listjobsHandlerIdPUT(req, res) {
  const { title, url, description, company, location } = req.body;
  let URLparamas = req.params.id;
  let SQL = `UPDATE jobs SET title=$1, url=$2, description=$3, company=$4, location=$5 WHERE id=$6;`;
  let safeValues = [title, url, description, company, location, URLparamas];
  client.query(SQL, safeValues).then((results) => {
    res.redirect(`/mylist/${URLparamas}`);
    // res.render(`details`, { data: results.rows[0] });
  });
}
function listjobsHandlerIdDELETE(req, res) {
  let URLparamas = req.params.id;
  let SQL = `DELETE FROM jobs WHERE id=$1;`;
  let safeValues = [URLparamas];
  client.query(SQL, safeValues).then(() => {
    res.redirect(`/mylist`);
    // res.render(`details`, { data: results.rows[0] });
  });
}

client.connect().then(() => {
  server.listen(PORT, console.log(`Server is listining to PORT : ${PORT}`));
});
