var conn = require('../../../utils/dao');
var ObjectID= require('mongodb').ObjectId; //Libreria para pasar los id 
const bcrypt = require('bcryptjs');

//Los id son binarios por lo tanto se necesita la libreria ObjectId

var _db;
class Sec{
    secColl=null;
    constructor(){
        this.initModel();
    }

    //Establecer la coleccion
    async initModel(){
        try{
            _db=await conn.getDB();
            this.secColl=await _db.collection("usuarios");
        }catch(ex){
            console.log(ex);
            process.exit(1);
        }
    }

    async createNewUser(email,password){
        try{
            let user={
                email:email,
                password:await bcrypt.hash(password,10),
                lastlogin:null,
                lastpasswordchang:null,
                passwordexpires:new Date().getTime()+(90*24*60*60*1000),
                oldpasswords:[],
                roles:["public"]
            }
            let result= await this.secColl.insertOne(user);
            console.log(result);
            return result;
        }
        catch(ex){
            console.log(ex);
            throw(ex);//función de lanzar una excepción. Función nativa de javascript
        }
    }
    async getByEmail(email){
        const filter={"email":email};
        return await this.secColl.findOne(filter);
    }
    async comparePassword(rawPassword,dbPassword){
        return await bcrypt.compare(rawPassword,dbPassword);
    }
}

module.exports=Sec;