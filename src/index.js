const express = require('express')
require('dotenv').config()
require('./lib/db')
const cors = require('cors')
const cookieparser = require('cookie-parser')
const path = require('path')

const authRoutes = require('./routes/authRoute')
const messageRoutes = require('./routes/messageRoute')
const { app, server} = require("./lib/socket")
require('dotenv').config()


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const PORT = process.env.PORT
const __dirname = path.resolve();

app.use(cookieparser())
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    }
    ))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

if(process.env.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    }
    );
}

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)

})