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
const authorizeAlumne=(req, res, next)=>{
    if(req.user.role == 'alumne'){

        next()
    } else {
        return res.sendStatus(403); 
    }
}

app.post('/login', (req, res) => {
    usr.login(req.body.username, req.body.password, res, req);
    
});
app.post('/register', (req, res) => {
    usr.insertUser(req.body.username, req.body.password, req.body.full_name, req.body.dni, req.body.avatar,res ,req);
});
app.get('/notes', authenticateJWT, (req, res) =>{
    usr.getNotesFromUser(req.headers.authorization, res, req)
})