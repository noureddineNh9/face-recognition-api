const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const image = require("./controllers/image");
const profile = require("./controllers/profile");

const app = express();
app.use(bodyParser.json());
app.use(cors());

/*
const db = knex({
   // connect to your own database here:
   client: "pg",
   connection: {
      user: "postgres",
      host: "localhost",
      database: "smartbraindb",
      password: "Eddine21",
      port: 5432,
   },
});

*/

// database
const db = knex({
   // connect to your own database here:
   client: "pg",
   connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true,
   },
});

db.select("*")
   .from("users")
   .then((data) => {
      console.log(data);
   });

app.get("/", (request, response) => {
   response.send("it's working.");
});

app.get("/profile/:id", (req, res) => {
   profile.handleProfile(req, res, db);
});

app.put("/image", (req, res) => {
   image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
   image.handleImageurl(req, res);
});

app.post("/signin", async (req, res) => {
   signin.handleSignin(req, res, db, bcrypt);
});

app.post("/register", async (req, res) => {
   register.handleRegister(req, res, db, bcrypt);
});

app.listen(process.env.PORT || 3000, () => {
   console.log(`app is running on port ${process.env.PORT}`);
});
