const express = require('express');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require("cors")
const mysql = require('mysql')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

const app = express();
app.use(bodyParser.json())
app.use(cors())

// database 
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Nh9@280800",
    database: 'smart_brain_db'
})
con.connect((err) => {
    if (err) {
        return console.error('error: ' + err.message);
      }
    
      console.log('Connected to the MySQL server.');
})
//.........

var users = [];

async function getAllUser(){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users";
        con.query(sql, (err, result) => {
            if (err) {
                throw err;
            }
            const data = JSON.parse(JSON.stringify(result));
            try {
                resolve(data);
            } catch (error) {
                reject("failed to load data");
            }
        })
    })
}

async function getUser(email){
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users";
        con.query(sql, (err, result) => {
            if (err) {
                throw err;
    
            }
            const data = JSON.parse(JSON.stringify(result));
            var result = null;

            try { 
                data.some(user => {
                    if(user.email === email){
                        result = user
                        return true;
                    }
                })               
                resolve(result)
            } catch (error) {
                reject("error");
            }
        })
    })

}

app.get('/', (request, response) => {
    response.send("Ok")
})

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, con) })

app.put('/image', (req, res) => { image.handleImage(req, res, con) })

app.post('/imageurl', (req, res) => { image.handleImageurl(req, res) })

app.post('/signin', async (req, res) => { signin.handleSignin(req, res, con, bcrypt, getUser) })

app.post('/register', async (req, res) => { register.handleRegister(req, res, con, bcrypt, getUser) })



app.listen(process.env.PORT || 4000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})