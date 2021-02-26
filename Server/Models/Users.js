const db = require('../db/database');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'paco';
const refreshTokenSecret = 'emilio';
const refreshTokens = [];
class Users {
    mydb = new db.Database();

    insertUser(username, password, full_name, dni, avatar, res, req) {
        let conn = this.mydb.getConnection();
        let sql = "INSERT INTO users(username,password,full_name,avatar) " +
            "VALUES (?,?,?,?)"

        conn.query(sql, [username, password, full_name, dni, avatar], (err, results) => {
            if (err) {
                res.status(400).send({
                    ok: false,
                    error: "Error inserint dades"
                });
            }
            else {
                sql = "SELECT * FROM dni_profe where dni=?";
                let id = results["insertId"]
                conn.query(sql, [dni], (err, resu) => {
                    if (resu.length != 0) {
                        sql = "INSERT INTO professor(id_profesor) VALUES (?)"
                        conn.query(sql, [id], (err, results) => {
                            if (err) {
                                res.status(400).send({ 
                                    ok: false, 
                                    error: "Error al insertar profesor", 
                                    token: autToken 
                                })
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
                    else {
                        
                        sql = "INSERT INTO alumne(id_alumne) VALUES (?)"
                        conn.query(sql, [id], (err, results) => {
                            if (err) {
                                res.status(400).send({ 
                                    ok: false, 
                                    error: "Error al insertar alumne" 
                                })
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
                })
            }
        })
    }
    login(username, password, res, req) {
        let conn = this.mydb.getConnection();
        let sql = "SELECT * FROM users " +
            "WHERE username=? and password=?";
        conn.query(sql, [username, password], (err, results, fields) => {
            sql = "SELECT * FROM professor where id_professor=?";
            let id = results[0].id
            conn.query(sql, [id], (err, resu) => {
                if (resu.length != 0) {
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
        })
    }
    getNotesFromUser(id, role, res) {
        if (role == "alumne") {
            let conn = this.mydb.getConnection();
            let sql = "SELECT nt.nota, nt.id_assig, ass.cod_assig, ass.nom_assig " +
                " FROM notes as nt, assignatura as ass " +
                " WHERE nt.id_alumne = ? and nt.id_assig = ass.id_assig " +
                " ORDER BY nt.id_assig ";
            conn.query(sql, [id], (err, results) => {
                if (err) {
                    res.status(404).send({
                        ok: false,
                        error: "Error agafant notes"
                    });
                } else {
                    var resu = []
                    results.forEach(r => {
                        resu.push({
                            nota: r.nota,
                            nom_assig: r.nom_assig,
                            id_assig: r.id_assig,
                            cod_assig: r.cod_assig,
                            links: {
                                get: "GET https://localhost:5555/assignatura/" + r.id_assig
                            }
                        })
                    })
                    res.status(200).send({ resu })
                }
            })
        }
        else {
            res.status(403).send({
                ok: false,
                error: "Error rol incorrecte"
            });
        }
    }
    getAssigFromId(id, res) {
        let conn = this.mydb.getConnection();
        let sql = "SELECT * FROM assignatura WHERE id_assig = ?"
        conn.query(sql, [id], (err, results) => {
            if (err) {
                res.status(404).send({
                    ok: false,
                    error: "Error agafant assignatura"
                });
            }
            else {
                console.log(results)
                res.status(200).send({ results })
            }

        })
    }
    getNotesFromId(idAlumne, idAssig, role, res) {
        if (role == "alumne") {
            let conn = this.mydb.getConnection();
            let sql = "SELECT nt.nota, nt.id_assig, ass.cod_assig, ass.nom_assig " +
                "FROM notes as nt, assignatura as ass " +
                "WHERE nt.id_alumne = ? AND nt.id_assig = ass.id_assig AND ass.id_assig = ? "
            conn.query(sql, [idAlumne, idAssig], (err, results) => {
                if (err) {
                    res.status(404).send({
                        ok: false,
                        error: "Error agafant notes"
                    });
                } else {
                    var resu = []
                    results.forEach(r => {
                        resu.push({
                            nota: r.nota,
                            nom_assig: r.nom_assig,
                            id_assig: r.id_assig,
                            cod_assig: r.cod_assig,
                            links: {
                                get: "GET https://localhost:5555/assignatura/" + r.id_assig
                            }
                        })
                    })
                    if (resu.length != 0) {
                        res.status(200).send({ resu })
                    }
                    else {
                        res.status(404).send({
                            ok: false,
                            error: "El alumne no esta matricular d'aquesta assignatura"
                        })
                    }

                }
            });
        }
        else {
            res.status(403).send({
                ok: false,
                error: "Error rol incorrecte"
            });
        }
    }
    getModulsFromProfe(id, role, res) {
        if (role == "profe") {
            let conn = this.mydb.getConnection();
            let sql = "SELECT ass.* " +
                "FROM assignatura as ass, notes as nt " +
                "WHERE nt.id_profe = ? " +
                "AND nt.id_assig = ass.id_assig"
            conn.query(sql, [id], (err, results) => {
                if (err) {
                    res.status(404).send({
                        ok: false,
                        error: "Error agafant moduls"
                    });
                } else {
                    var resu = []
                    results.forEach(r => {
                        resu.push({
                            id_assig: r.id_assig,
                            cod_assig: r.cod_assig,
                            nom_assig: r.nom_assig,
                            modul: r.modul,
                            curs: r.curs,
                            hores: r.hores
                        })
                    })
                    res.status(200).send({ resu })
                }
            })
        }
        else {
            res.status(403).send({
                ok: false,
                error: "Error rol incorrecte"
            });
        }
    }
    getModulsFromId(idProfe, idAssig, role, res) {
        if(role=="profe"){
            let conn = this.mydb.getConnection();
            let sql = "SELECT nt.id_alumne, alu.full_name, nt.id_assig, ass.cod_assig, nt.nota " +
                "FROM notes as nt, assignatura as ass, users as alu " +
                "WHERE nt.id_alumne = alu.id " +
                "AND nt.id_profe = ? " +
                "AND nt.id_assig = ? " +
                "AND nt.id_assig = ass.id_assig "
            conn.query(sql, [idProfe,idAssig], (err, results) => {
                if (err) {
                    res.status(404).send({
                        ok: false,
                        error: "Error obtenint el modul"
                    });
                }
                else {
                    var resu = []
                    results.forEach(r=>{
                        r.links={
                            assig: "GET https://localhost:5555/assignatura/" + r.id_assig,
                            alumne: "GET https://localhost:5555/alumne/" + r.id_alumne,
                            nota: "PUT https://localhost:5555/moduls/" + r.id_assig + "/"+r.id_alumne
                        }
                        resu.push(r)
                    })

                    res.status(200).send({ resu })
                }

            })
        }
        else {
            res.status(403).send({
                ok: false,
                error: "Error rol incorrecte"
            });
        }
    }
    setNotaAlumne(nota,idProfe,idAssig,idAlumne,role,res){
        if(role=="profe"){
            let conn = this.mydb.getConnection();
            let sql = "UPDATE notes SET nota = ? "+
            "WHERE id_alumne = ? "+
            "AND id_assig = ? "+
            "AND id_profe = ?"
            conn.query(sql, [nota, idAlumne, idAssig, idProfe], (err)=>{
                if(err){
                    res.status(400).send({
                        ok: false
                    });
                }
                res.status(200).send({
                    ok: true
                });
            })
        }
        else {
            res.status(403).send({
                ok: false,
                error: "Error rol incorrecte"
            });
        }
    }
}




module.exports = {
    Users: Users
}