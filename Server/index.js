const express = require('express'); //npm install express --save
const bodyParser = require('body-parser'); //npm install body-parser --save

constrefreshTokens = [];
app.post('/login', (req, res) => {// llegim les dades de login que ens envia l'usuari
    const { username, password } = req.body;
    // compromvem que son correctes. DEuria ser a BBDD
    const user = users.find(u => {returnu.username === username && u.password === password });if(user) {// Creem el token de l'usuari. Caduca en 20 minutsconstaccessToken = jwt.sign({ username: user.username, role: user.role },   // dades queinclou el tokenaccessTokenSecret,                              // passwordper generar-lo{ expiresIn:'20m'}                            // caducitat);// creem altre token per a regenerar. No caducaconstrefreshToken = jwt.sign({ username: user.username, role: user.role },refreshTokenSecret);refreshTokens.push(refreshToken);// enviem el token d'accés i el de refrescres.json({accessToken,refreshToken});}else{res.send('Username o password incorrectes');}});