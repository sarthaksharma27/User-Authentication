const express = require('express');
const app = express();
const port = 3000;
const path = require("path");
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'login',
    password: 'xxxxxx'
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/home', (req, res) => {
   res.render("home.ejs");
});

//Registeration
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const id = uuidv4();
    const q = 'INSERT INTO detail (id, username, email, password) VALUES (?, ?, ?, ?)';
    
    connection.query(q, [id, username, email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error inserting data into the database");
        }
        res.redirect('/home');
    });
});


// Login
app.post('/success', (req, res) => {
    const { email: REmail, password: RPassword } = req.body;
    const q = `SELECT * FROM detail WHERE email='${REmail}'`; 

    connection.query(q, (err, results) => {
        if (err) {
            console.error(err);
            res.send("Some error in DB");
            return;
        }

        if (results.length === 0) {
            res.send("User not found");
        } else {
            const user = results[0]; //email is unique

            if (RPassword !== user.password) {
                res.send("Wrong password");
            } else {
                res.render("new.ejs");
            }
        }
    });
});

app.listen(port, () => {
    console.log(`app listening on port ${port}!`);
});
