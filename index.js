const express=require('express');
const cors=require('cors')
const { connection } = require('./config/db');
const { hostrouter}=require("./routes/hostroute");
const {propertyrouter}=require("./routes/propertyroute");
const {guestrouter}=require("./routes/guestroute");
const {bookingrouter}=require("./routes/bookingroute")
const app=express();
require('dotenv').config()
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.json("welcome")
})

app.use("/host",hostrouter);
app.use("/property",propertyrouter);
app.use("/guest",guestrouter);
app.use("/booking",bookingrouter);

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log(`Server is running on port ${process.env.port}`)
        console.log("Connected to database")
    } catch (error) {
        console.log(error);
        console.log("Error While Connecting to Databse")
    }
})