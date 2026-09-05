require("dotenv").config();

const express = require("express")

const authRoutes = require ("./src/routes/auth.routes")


const app = require ("./src/app")


const connectDB = require("./src/db/db")


connectDB();

app.use(express.json());

app.use ("/api/auth",authRoutes);


app.listen (3000, ()=> {

    console.log ("server is running on port 3000")
})