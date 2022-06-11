// const fetch = require('node-fetch');
const express = require('express');
const app= express();
const port= process.env.PORT || 3001;
const connectToMongo = require('./database/mongoose');
const Note = require('./database/schemas/note');

connectToMongo();

app.use(express.json());
app.use('/api/auth',require('./routes/auth'))

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);
    

app.get('/api/notes',async (req,res)=>{
    let data= await Note.find();
    res.json(data);
})

app.post("/api/createNote", async(req, res) => {
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

app.put('/api/update/:id',async (req,res)=>{
    try {
        let note = await Note.findByIdAndUpdate(req.params.id,{$set: req.body},{new:true});
        res.json(note);
    } catch (error) {
        res.status(404).send("Internal Server Error")
    }
})

app.delete('/api/deleteNote/:id',async (req,res)=>{  
    try {
        let note = await Note.deleteOne({_id:req.params.id});
        res.json(note);
    } catch (error) {
        res.status(404).send("Internal Server Error")
    }
})

  
app.listen(port,(err)=>{
    if (err) console.log(err);
    console.log("Server listening on PORT",port);
});