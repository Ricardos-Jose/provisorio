import Express from "express";
// import mysql2 from "mysql2";
import { Pool } from "pg";
const PORT=3000;

const app = Express();
app.use(Express.json());

// const pool = mysql2.createPool({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"test",
//     port:3306
// });

// const promisePool = pool.promise();
const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"cookie_store",
    password:"password",
    port:5432
})

app.get("/cookies",async(req,res)=>{
    const result = await pool.query("SELECT * FROM cookies");

    res.json({data:result.rows})
})

app.get("/cookies/:id",async(req,res)=>{
    const id =req.params.id;

    const result = await pool.query("SELECT * FROM cookies WHERE id=$1",[id]);

    res.json({data:result.rows[0]})
})


app.post("/cookies",(req,res)=>{
    const {sabor,preco} = req.body;
    
    const response = pool.query("INSERT INTO cookies(sabor,preco) VALUES($1,$2)",[sabor,preco])
    
    res.json({data:response})
})
app.put("/cookies/:id",(req,res)=>{
    const id =req.params.id;
    const {sabor,preco} = req.body;

    const response = pool.query("UPDATE cookies SET sabor=$1,preco=$2 WHERE id=$3",[sabor,preco, id])
    res.json({data:response})
})

app.delete("/cookies/:id",async(req,res)=>{
    const id =req.params.id;

    const response = await pool.query("DELETE FROM cookies WHERE id=$1",[id]);

    res.json({data:response})
})

app.listen(PORT,()=>{
    console.log(`Listening on http://localhost:${PORT}`)
})