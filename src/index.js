const server = require("./server.js")
require("./database.js")

server.listen(4500, ()=>{
    console.log("Servidor escuchando en puerto:", 4500)
})