import { Router } from "express";
import pool from "../db/db.js";
const cookie = Router();

cookie.get("/",async(req,res)=>{
    const result = await pool.query("SELECT * FROM cookies");
    
    res.json({data:result.rows})
})

cookie.get("/:id",async(req,res)=>{
    const id =req.params.id;

    if(isNaN(id) || id<=0){
        res.json({error:"Bad request, id must be an integer greater than 0"}).status(400)
    }

    const result = await pool.query("SELECT * FROM cookies WHERE id=$1",[id]);

    if(result.rows ==false){
        res.sendStatus(404);
    }

    res.json({data:result.rows[0]})
})


cookie.post("/",(req,res)=>{
    const {sabor,preco} = req.body;
    
    const response = pool.query("INSERT INTO cookies(sabor,preco) VALUES($1,$2)",[sabor,preco])
    
    res.json({data:{sabor,preco}})
})
cookie.put("/:id",async(req,res)=>{
    const id =req.params.id;

    if(isNaN(id) || id<=0){
        res.json({error:"Bad request, id must be an integer greater than 0"}).status(400)
    }

    const {sabor,preco} = req.body;

    if(!sabor || !preco){
        res.json({error:"Bad request, there must exist an flavor and an price"}).status(400)
    }

    const response = await pool.query("UPDATE cookies SET sabor=$1,preco=$2 WHERE id=$3",[sabor,preco, id])

    res.json({data:{sabor,preco}})
})

cookie.delete("/:id",async(req,res)=>{
    const id =req.params.id;

    if(isNaN(id) || id<=0){
        res.json({error:"Bad request, id must be an integer greater than 0"}).status(400)
    }
    
    const response = await pool.query("DELETE FROM cookies WHERE id=$1",[id]);

    res.json({data:response})
})

export default cookie;