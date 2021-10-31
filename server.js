const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require("cors")
const knex = require('knex');


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

const app = express();
app.use(bodyParser.json())
app.use(cors())


// database
const db = knex({
    // connect to your own database here:
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'postgres',
      password : 'Nh9@280800',
      database : 'smart_brain_db'
    }
});


app.get('/', (request, response) => {
    response.send("Ok")
})

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleImageurl(req, res) })

app.post('/signin', async (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

app.post('/register', async (req, res) => { register.handleRegister(req, res, db, bcrypt) })


app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})