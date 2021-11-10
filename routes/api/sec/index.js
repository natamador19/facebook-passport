const express=require("express");
let router = express.Router();
const jwt = require("jsonwebtoken");
let secModelClass=new require('./sec.model.js');
let secModel=new secModelClass();
const mailSender = require('../../../utils/mailer');

router.get('/passrecovery',async(req,res,next)=>{
    mailSender(
        "ny_amadorc@unicah.edu",
        "Test de Envió  de Correo",
        '<h1>Esto es una prueba de correo</h1><p> Clic aquí para setear contraseña <a href="http://localhost:3000/recovery">Click Me</></p>',

    );
    res.status(200).json({msg:"Email Sent!!"});
});

router.post('/login',async(req,res,next)=>{
try{
    const {email,pswd}=req.body;
    let userLogged=await secModel.getByEmail(email);
    if(userLogged){
        const isPaswdOk=await secModel.comparePassword(pswd, userLogged.password);
        if(isPaswdOk){
            delete userLogged.password;
            delete userLogged.oldpasswords;
            delete userLogged.lastlogin;
            delete userLogged.lastpasswordchang;
            delete userLogged.passwordexpires;
            let payload={
                jwt:jwt.sign(
                    {email:userLogged.email,
                    _id:userLogged._id,
                    roles:userLogged.roles},
                    process.env.JWT_SECRET,
                    {expiresIn:'1d'}
                ),
                user:userLogged
            };
            return res.status(200).json(payload);
        }
    }

    console.log({email,userLogged});
    return res.status(400).json({msg:"Credenciales no válidas"});
}catch(ex){
    console.log(ex);
    res.status(500).json({"msg":"Error"});
}
});

router.post('/signin',async(req,res,next)=>{
    try{
        const {email,pswd}=req.body;
        let userAdded=secModel.createNewUser(email,pswd);
        delete userAdded.password;
        console.log(userAdded);
        res.status(200).json({"msg":"Usuario creado sastifactoriamente"});

    }catch{
        res.status(500).json({"msg":"Error"});
    }
    });

    module.exports=router;