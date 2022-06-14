const express = require('express');
const router = express.Router();
const Note = require('../database/schemas/note');


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

router.use(allowCrossDomain);

router.get('/getnotes',async (req,res)=>{
    let data= await Note.find();
    res.json(data);
})

router.post("/createNote", async(req, res) => {
    try{let result = await Note.insertMany(req.body);
    if(result===[])
    {
        res.send("An error Occured");
    }
    res.json(result);
    }catch(err){
        res.send("Internal Server Error")
    }
});

router.put('/update/:id',async (req,res)=>{
    try {
        let note = await Note.findByIdAndUpdate(req.params.id,{$set: req.body},{new:true});
        res.json(note);
    } catch (error) {
        res.status(404).send("Internal Server Error")
    }
})

router.delete('/deleteNote/:id',async (req,res)=>{  
    try {
        let note = await Note.deleteOne({_id:req.params.id});
        res.json(note);
    } catch (error) {
        res.status(404).send("Internal Server Error")
    }
})

module.exports = router;
