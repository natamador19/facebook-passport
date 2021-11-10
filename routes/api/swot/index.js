var express = require('express');
const Swot = require('./swot.dao');
var router=express.Router();
var SwotDao= require('./swot.dao');
var swot=new SwotDao();


router.get('/all', async(req, res,next)=>{
try{
const allSwotEntries=await Swot.getAll(req.user._id);
return res.status(200).json(allSwotEntries);
}catch(ex){
console.log(ex);
return res.status(500).json({msg:"Error al procesar la petición"});
}

});

router.get('/facet/:page/:items/:text',async(req, res, next)=>{
try{
    let {page,items,text}=req.params;
    page=parseInt(page) ||1;
    items=parseInt(items)||10;
    const swots=await Swot.getByFacet(text,page,items);
    return res.status(200).json(swots);
}catch(ex){
    console.log(ex);
return res.status(500).json({msg:"Error al procesar la petición"});
}
});


router.get('/byid/:id',async(req,res,next)=>{
    try{
        const {id}=req.params;
        const oneSwotEntry=await Swot.getById(id);
        return res.status(200).json(oneSwotEntry);
    }catch(ex){
        console.log(ex);
        return res.status(500).json({msg:"Error al proceso la petición"});

    }
});

router.get('/bytype/:type', async(req, res,next)=>{
    try{
        const{type}=req.params;
        const swots=await Swot.getByType(type, req.user._id);
        return res.status(200).json(swots);
    }catch(ex){
        console.log(ex)
        return res.status(500).json({msg:"Error al procesar la petición"});

    }
});

router.get('/bymeta/:meta',async(req,res,next)=>{
    try{
        const {meta}=req.params;
    const swots=await Swot.getByMetaKey(meta, req.user._id);
    return res.status(200).json(swots);
    }catch(ex){
        console.log(ex)
        return res.status(500).json({msg:"Error al procesar la petición"});
    }
});

router.get('/byrelevancerange/:lower/:upper/:extremes',async(req,res,next)=>{
    try{
        const {lower,upper,extremes}=req.params;
        const filter=(parseint(extremes)>0)?
        {
            swotRelevance:{
                "$gte":parseFloat(lower),
                "$lte":parseFloat(upper)
            }
        }:{
            swotRelevance:{
                "$gt":parseFloat(lower),
                "$lt":parseFloat(upper)
            }
        };
        const swots = await swot.getWithFilterAndProjection(filter,{});
        return res.status(200).json(swots);
    }catch(ex){
        console.log(ex)
        return res.status(500).json({msg:"Error al procesar la petición"}); 
    }
});

router.post('/new', async(req,res,next)=>{
try{
const{
    swotType,
    swotDesc,
    swotMeta
}=req.body;
const swotMetaArray=swotMeta.split('|');
const result=await Swot.addNew(swotType,swotDesc,swotMetaArray,req.user._id);
console.log(result);
res.status(200).json({msg:"Agregado Sastifactoriamente"});
}catch(ex){
    console.log(ex);
    return res.status(500).json({msg:"Error al procesar la petición"});
}

});

router.put('/update/:id',async(req,res,next)=>{
try{
const {id}=req.params;
const {swotMetaKey}=req.body;
const result=await Swot.addMetaToSwot(swotMetaKey,id);
console.log(result);
res.status(200).json({"msg":"Modificado OK"});

}catch(ex){
console.log(ex);
return res.status(500).json({msg:"Error al procesar petición"});
}

});

router.delete('/delete/:id',async(req,res,next)=>{
    try{
        const {id}=req.params;
        const result=await Swot.deleteById(id);
        console.log(result);
        return res.status(200).json({"msg":"Eliminado correctamente"});

    }catch(ex){
console.log(ex);
return res.status(500).json({msg:"Error al procesar petición"});

    }
});

router.get('/fix',async(req,res,next)=>{
    try{
        let swots=await Swot.getWithFilterAndProjection(
            {},
            {_id:1,swotRelevance:1}
        );
        swots.map(async(o)=>{
            await Swot.updateRelevanceRandom(o._id);
        });
        return res.status(200).json(swots);
    }catch(ex){
        console.log(ex);
        return res.status(500).json({msg:"Error al procesar petición"});
    }
});

module.exports=router;