const express = require('express');
const app=express();
const cookieSession = require('cookie-session');
const passport=require('passport');
require('./passport');
const isLoggedIn=require('./Middleware/auth');
app.use(cookieSession({
    name:'facebook-auth-session',
    keys:['key1','key2']
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',isLoggedIn,(req,res,next)=>{
res.send(`Hello world ${req.user.displayName}`)
});

app.get('/logout',(req,res)=>{
   req.session=null;
   req.logout();
   res.redirect('/'); 
});
app.get('/auth/error',(req,res,next)=>{
    res.send('unknown error');
});
app.get('/auth/facebook',passport.authenticate('facebook'));
app.get('/auth/facebook/callback',passport.authenticate('facebook',
{failureRedirect:'/login'}),
function(req, res){
res.redirect('/');
});




app.listen(8000,()=>{
    console.log('Server corriendo en el puerto 8000');
});
