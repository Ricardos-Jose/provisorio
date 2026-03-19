import Express from "express";

import cookie from "./cookies/cookies.js";
const PORT=3000;

const app = Express();
app.use(Express.json());

app.use("/cookies",cookie)

app.listen(PORT,()=>{
    console.log(`Listening on http://localhost:${PORT}`)
})