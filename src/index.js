const express = require('express')
require('dotenv').config()
require('./lib/db')
const cors = require('cors')
const cookieparser = require('cookie-parser')

const authRoutes = require('./routes/authRoute')
const messageRoutes = require('./routes/messageRoute')
const { app, server} = require("./lib/socket")
require('dotenv').config()


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const PORT = process.env.PORT


app.use(cookieparser())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }));
  
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)

})