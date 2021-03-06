const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const image = require("./controllers/image");
const profile = require("./controllers/profile");
const auth = require("./middlewares/authorization");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = knex({
   // connect to your own database here:
   client: "pg",
   connection: process.env.POSTGRES_URI,
});

/*
// database
const db = knex({
   // connect to your own database here:
   client: "pg",
   connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
         rejectUnauthorized: false,
      },
   },
});

db.select("*")
   .from("users")
   .then((data) => {
      console.log(data);
   });
*/

app.get("/", (request, response) => {
   response.send("it's working.");
});

app.get("/profile/:id", auth.requireAuth, (req, res) => {
   profile.handleProfile(req, res, db);
});

app.post("/profile/:id", auth.requireAuth, (req, res) => {
   profile.update(req, res, db);
});

app.put("/image", auth.requireAuth, (req, res) => {
   image.handleImage(req, res, db);
});

app.post("/imageurl", auth.requireAuth, (req, res) => {
   image.handleImageurl(req, res);
});

app.post("/signin", signin.signinAuthentication(db, bcrypt));

app.post("/register", async (req, res) => {
   register.handleRegister(req, res, db, bcrypt);
});

// app.listen(process.env.PORT || 3000, () => {
//    console.log(`app is running on port ${process.env.PORT}`);
// });
app.listen(3000, () => {
   console.log(`app is running on port 3000`);
});
