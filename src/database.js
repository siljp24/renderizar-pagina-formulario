const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/actividad")
    .then(()=>{
        console.log("DB conectada")
    })
    .catch((err)=>{
        console.log("err")
    })