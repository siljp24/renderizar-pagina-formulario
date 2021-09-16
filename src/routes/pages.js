const { Router } = require("express");
const { model } = require("mongoose");
const models = require('../api/models')
const middlewares = require('../middlewares')
const router = Router();

router.get("/sign-up", (req,res)=>{
    let errorMessage1
    let errorMessage2
    if (req.session.errorMessage){
        errorMessage1 = req.session.errorMessage
        delete req.session['errorMessage']
    }
    if(req.session.errorPassword){
        errorMessage2 = req.session.errorPassword
        delete req.session['errorPassword']
    }
    res.render("signUp.pug", {title: "Sign Up", errorMessage1, errorMessage2})
})

router.get("/sign-in", (req,res)=>{
    let errorMessage1
    let errorMessage2
    if(req.session.errorMessage1){
        errorMessage1 = req.session.errorMessage1
        delete req.session['errorMessage1']
    }
    if(req.session.errorMessage2){
        errorMessage2 = req.session.errorMessage2
        delete req.session['errorMessage2']
    }
    res.render("signIn.pug", {title: "Sign In", errorMessage1, errorMessage2})
})

router.get("/username", async (req,res)=>{   
    let userType = 0;
    let nombre
    let user
    let list = []
    let remove
    if(req.session.user){
        user = req.session.user
        nombre = req.session.user.username
        if(user.admin){
            userType = 2
            const allUsers = await models.user.find({})
            for(let i = 0; allUsers.length > i; i++){
                let name = ''
                name = allUsers[i]
                list.push(name)
            }
            if(req.session.message){
                remove = req.session.message
                delete req.session['message']
            }
        }else{
            userType = 1
        }   
    }else if(!req.session.user){
        return res.redirect('/pages/sign-in')
    }
    res.render("user.pug", {title: "Username", userType, nombre, list, remove})
})

router.get("/admin", (req,res)=>{
    res.render("admin.pug", {title: "Administrador"})
})

//MIDDLEWARES   

router.post('/create', async (req,res)=>{
    const {username, password1, password2} = req.body
    if(password1 !== password2){
        req.session.errorPassword = 'Contraseñas no iguales'
        return res.redirect('/pages/sign-up')
    }
    const existUser = await models.user.findOne({username})

    if(existUser){
        req.session.errorMessage = 'Username ya registrado'
        return res.redirect('/pages/sign-up')
    }
    const hash = await models.user.encriptar(password1)
    const user = models.user({username, password: hash})
    await user.save()

    res.redirect('/pages/sign-in')

})

router.post('/login', async(req,res)=>{
    const {username, password} = req.body
    const existUsername = await models.user.findOne({username})
    if(!existUsername){
        req.session.errorMessage1 = 'Username no registrado'
        return res.redirect('/pages/sign-in')
    }
    const isValid = await models.user.comparar(password, existUsername.password)
    if(!isValid){
        req.session.errorMessage2 = 'Username password incorrectos'
        return res.redirect('/pages/sign-in')
    }
    req.session.user= existUsername
    res.redirect('/pages/username')
    
})

router.get('/logout', (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }
        res.redirect('/pages/sign-in')
    })
})

router.post('/remove/:id', async (req,res)=>{
    const id = req.params
    console.log(id)
    const remove = await models.user.deleteOne({ _id: id.id})
    console.log(remove)
    if(remove){
        req.session.message= 'Username eliminado'
        console.log(req.session.message)
    }
    res.redirect('/pages/username')


})





module.exports = router;