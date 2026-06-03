import mysql from "mysql2";

const connection = mysql.createConnection({
    host: 'localhost',
    password: '',
    user: 'root',
    database: 'sms'
});

connection.connect((err) => {
    if (err) {
        console.error(err);
    }

    console.log("connected successfully");
});

export default connection;