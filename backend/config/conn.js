import mysql from "mysql2/promise";

const connection = mysql.createPool({
    host: 'localhost',
    password: '',
    user: 'root',
    database: 'sms'
});

const verifyConnection = async () => {
    try {
        const conn = await connection.getConnection();
        console.log('connected successfully');
        conn.release()
    } catch (err) {
        console.error(err);
    }
}

verifyConnection();
export default connection;