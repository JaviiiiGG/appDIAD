const db = require('../db/database');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'paco';

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

    insertUser(username, password, full_name, dni, avatar, res) {
        let conn = this.mydb.getConnection();
        let sql = "INSERT INTO users(username,password,full_name,avatar) " +
            "VALUES (?,?,?,?)"

        conn.query(sql, [username, password, full_name, dni,avatar], (err, results, fields) => {
            if (err) {
                res.status(401).send({
                    ok:false,
                    error:"Error inserint dades"+err
                });
            }
            else {
                sql = "SELECT * FROM dni_profe where dni=?";
                let id = results["insertId"]
                conn.query(sql, [dni], (err, results, fields) => {
                    if (results.length <= 0) {
                        sql = "INSERT INTO alumne(id_alumne) VALUES (?)"
                        conn.query(sql, [dni], (err, results, fields) => {
                            if (err){
                                res.status(401).send({ok:false , error: "Error al insertar alumne"+err})
                            }
                            else{
                                let autToken = jwt.sign({
                                    id:id,
                                    username: req.body.username,
                                    role:"alumne"
                                }, accessTokenSecret)
                                res.status(200).send({ok:true , result: "Alumne insertat", token:autToken})
                            }
                        })
                    }
                    else {
                        sql = "INSERT INTO professor(id_profesor) VALUES (?)"
                        conn.query(sql, [dni], (err, results, fields) => {
                            if (err){
                                res.status(402).send({ok:false , error: "Error al insertar profesor", token:autToken})
                            }
                            else{
                                let autToken = jwt.sign({
                                    id:id,
                                    username: req.body.username,
                                    role:"profe"
                                }, accessTokenSecret)
                                res.status(200).send({ok:true , result: "Professor insertat", token:autToken})
                            }
                        })
                    }
                })
            }
        })
    }
    login(username, password, callback) {
        let conn = this.mydb.getConnection();
        let sql = "SELECT * FROM users " +
            "WHERE username=? and password=?";
        conn.query(sql, [username, password], (err, results, fields) => {
            if (err) {
                console.log(err);
            }
            else {
                conn.end();
                callback(results);
            }
        })
    }
    
}


module.exports = {
    Users: Users
}