require('dotenv').config();
const express = require("express");
const cors = require("cors");
const pg = require("pg");
const methodOverride = require("method-override");

const server= express()

server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method'));
server.use(express.static('./public'));
server.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);

const PORT = process.env.PORT || 3030;


server.get('/' , mainHandler)



function mainHandler(req,res) {
    res.send('Hello')
}

client.connect().then(()=> {
    server.listen(PORT,console.log(`Server is listining to PORT : ${PORT}`))
})