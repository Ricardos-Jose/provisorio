import { Pool } from "pg";
// import mysql2 from "mysql2";

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"cookie_store",
    password:"password",
    port:5432
})

// const pool = mysql2.createPool({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"test",
//     port:3306
// });

// const promisePool = pool.promise();

export default pool;