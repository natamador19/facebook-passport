const isLoggedIn=(req,res,next)=>{
    if(req.user){
    next();
    console.log(req.user);
}else{
    res.status(401).send('No estas logueado');
}}

module.exports=isLoggedIn;