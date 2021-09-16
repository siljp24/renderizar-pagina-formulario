const models = require("../models")

const signUp = async(req, res)=>{
    const {username, password} = req.body

    // if(username.length === 0 || username.length ===0){
    //     return res.json({error: "complete todos los campos"})
    // }
    const existUsername = await models.user.findOne({username})
    if(existUsername){
        return res.json({error: "Username ya existe"})
    }
    const hash = await models.user.encriptar(password)
    const user = models.user({username, password: hash})
    await user.save()
    res.json(user)
    

}

const signIn = async (req,res)=>{
    const {username, password} = req.body
    const existUsername = await models.user.findOne({username})
    if(!existUsername){
        return res.json({error: "Email no registrado"})
    }
    const valido = await models.user.comparar(password, existUsername.password)
    if(!valido){
        return res.json({error: "username o contraseña incorrecta"})
    }
    res.json({existUsername})
}

module.exports = {
    signUp,
    signIn,
}