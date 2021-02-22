const db = require('../db/database');

class Users {
    mydb=new db.Database();
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

    insertUser(username, password, full_name, dni, callback) {
        let conn = this.mydb.getConnection();
        let sql = "INSERT INTO users(username,password,full_name,dni) " +
            "VALUES (?,?,?,?)"

        this.getNewId(function (newID) {
            conn.query(sql, [newID, username, password, full_name, dni], (err, results, fields) => {
                if (err) {
                    console.log("Error inserint dades");
                }
                else {
                    conn.end();
                    callback(results);
                }
            })
        });
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