const express =  require("express")
const session = require('express-session')
const path = require("path")
const pagesRoutes = require("./routes")


const server = express()

//settings
server.set('views',path.join(__dirname, "views"))
server.set("View engine", "pug")


//middlewares
server.use(express.urlencoded({extended: false}))
server.use(
    session({
        name: 'username-app',
        secret: 'loquesea',
        resave: false,
        saveUninitialized: false,
    })
)

//routes
server.use("/pages", pagesRoutes.pages)

//static folder
server.use(express.static(path.join(__dirname, "public")))

module.exports = server;