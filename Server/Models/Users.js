const db = require('../db/database');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'paco';
const refreshTokenSecret = 'emilio';
const refreshTokens = [];
class Users {
    mydb = new db.Database();

    getNewId(callback) {
        let conn = this.mydb.getConnection();
        let sql = "SELECT max(id)+1 as newID from users";
        conn.query(sql, (err, results, fields) => {
            if (err) {
                console.log(err)
            }
            else {
                conn.end();
                callback(results[0].newID);
            }
        });
    }

    insertUser(username, password, full_name, dni, avatar, res, req) {
        let conn = this.mydb.getConnection();
        let sql = "INSERT INTO users(username,password,full_name,avatar) " +
            "VALUES (?,?,?,?)"

        conn.query(sql, [username, password, full_name, dni, avatar], (err, results) => {
            if (err) {
                res.status(401).send({
                    ok: false,
                    error: "Error inserint dades" + err
                });
            }
            else {
                sql = "SELECT * FROM dni_profe where dni=?";
                let id = results["insertId"]
                conn.query(sql, [dni], (err, results) => {
                    if (results.length <= 0) {
                        sql = "INSERT INTO alumne(id_alumne) VALUES (?)"
                        conn.query(sql, [id], (err, results) => {
                            if (err) {
                                res.status(401).send({ ok: false, error: "Error al insertar alumne" + err })
                            }
                            else {
                                let autToken = jwt.sign({
                                    id: id,
                                    username: req.body.username,
                                    role: "alumne"
                                }, accessTokenSecret, { expiresIn: '2h' })
                                const refreshToken = jwt.sign({
                                    id: id,
                                    username: username,
                                    role: "alumne"
                                }, refreshTokenSecret);
                                refreshTokens.push(refreshToken);
                                res.status(200).send({
                                    ok: true,
                                    token: autToken
                                });
                            }
                        })
                    }
                    else {
                        sql = "INSERT INTO professor(id_profesor) VALUES (?)"
                        conn.query(sql, [id], (err, results) => {
                            if (err) {
                                res.status(402).send({ ok: false, error: "Error al insertar profesor", token: autToken })
                            }
                            else {
                                let autToken = jwt.sign({
                                    id: id,
                                    username: req.body.username,
                                    role: "profe"
                                }, accessTokenSecret, { expiresIn: '2h' })
                                const refreshToken = jwt.sign({
                                    id: id,
                                    username: username,
                                    role: "profe"
                                }, refreshTokenSecret);
                                refreshTokens.push(refreshToken);
                                res.status(200).send({
                                    ok: true,
                                    token: autToken
                                });
                            }
                        })
                    }
                })
            }
        })
    }
    login(username, password, res, req) {
        let conn = this.mydb.getConnection();
        let sql = "SELECT * FROM users " +
            "WHERE username=? and password=?";
        conn.query(sql, [username, password], (err, results, fields) => {
            sql = "SELECT * FROM dni_profe where dni=?";
            let id = results[0].id
            conn.query(sql, [id], (err, results) => {
                if (results.length <= 0) {
                    let autToken = jwt.sign({
                        id: id,
                        username: req.body.username,
                        role: "alumne"
                    }, accessTokenSecret, { expiresIn: '2h' })
                    const refreshToken = jwt.sign({
                        id: id,
                        username: username,
                        role: "alumne"
                    }, refreshTokenSecret);
                    refreshTokens.push(refreshToken);
                    res.status(200).send({
                        ok: true,
                        token: autToken
                    });
                }
                else {
                    let autToken = jwt.sign({
                        id: id,
                        username: req.body.username,
                        role: "profe"
                    }, accessTokenSecret, { expiresIn: '2h' })
                    const refreshToken = jwt.sign({
                        id: id,
                        username: username,
                        role: "profe"
                    }, refreshTokenSecret);
                    refreshTokens.push(refreshToken);
                    res.status(200).send({
                        ok: true,
                        token: autToken
                    });
                }
            })
        })
    }
    getNotesFromUser(id, res, req) {
        let conn = this.mydb.getConnection();
        let sql = "SELECT nt.nota, nt.id_assig, ass.cod_assig, ass.nom_assig " +
            "FROM notes as nt, assignatura as ass" +
            "WHERE nt.id_alumne = ? and nt.id_assig = ass.id_assig " +
            "ORDER BY nt.id_assig";
        conn.query(sql, [id], (err, results) => {
            if (err) {
                res.status(401).send({
                    ok: false,
                    error: "Error agafant notes" + err
                });
            } else {
                var res = []
                results.forEach(rdp => {
                    res.push({
                        nota: rdp.nota,
                        nom_assig: rdp.nom_assig,
                        id_assig: rdp.id_assig,
                        cod_assig: rdp.cod_assig,
                        links: {
                            get: "GET https://localhost:5555/assignatura/" + rdp.id_assig
                        }
                    })
                })
            }
        });
    }
}




module.exports = {
    Users: Users
}