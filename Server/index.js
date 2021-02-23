const express = require('express');
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const Users = require('./Models/Users');

var usr = new Users.Users
const PORT = 5555;


const accessTokenSecret = 'paco';
let app = express();
app.use(bodyParser.json());
https.createServer({
    key: fs.readFileSync('./Certificados/Qualificacions.key'),
    cert: fs.readFileSync('./Certificados/Qualificacions.crt')
}, app).listen(PORT, function () {
    console.log("Servidor HTTPS escoltant al port" + PORT + "...");
});

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.post('/login', (req, res) => {
    usr.login(req.body.username, req.body.password, (resposta) => {
        if (resposta) {
            let autToken = jwt.sign({
                username: req.body.username,
                password: req.body.password
            }, accessTokenSecret)
            res.status(200).json({autToken});
        } else {
            res.status(400).send({ ok: false, msg: "El usuario o password es incorrecto" });
        }
    });
    
});
app.post('/register', (req, res) => {
    usr.insertUser(req.body.username, req.body.password, req.body.full_name, req.body.dni, req.body.avatar,res);
});