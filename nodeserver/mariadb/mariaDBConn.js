const mariadb = require('mariadb');
const vals = require('./consts.js');

const pool = mariadb.createPool({
    host: vals.DBHost, port:vals.DBPort,
    user: vals.DBUser, password: vals.DBPass,
    database: vals.DBName,
    connectionLimit: vals.connectionLimit
});

async function GetUserList(){
    let conn, rows;
    try{
        //await이 없으면 비동기식통신 시도
        conn = await pool.getConnection();
        conn.query('USE nodejs_db;');
        rows = await conn.query('SELECT * FROM guestbook;');
    }
    catch(err){
        throw err;
    }
    finally{
        if (conn) conn.end();
        return rows;
    }
}

async function InsertGuestbook(email, title, content) {
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.query('INSERT INTO guestbook(email, title, content) VALUES(?, ?, ?)', [email, title, content]);
        return res;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = {
    getUserList: GetUserList,
    insertGuestbook: InsertGuestbook
}