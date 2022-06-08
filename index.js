// const fetch = require('node-fetch');
const express = require('express');
const app= express();
const port= 3001;
const connectToMongo = require('./modules/mongoose');
const Note = require('./schemas/note');

connectToMongo();

app.use(express.json());

app.get('/api/notes',async (req,res)=>{
    let data= await Note.find();
    res.json(data);
})

app.post("/api/createNote", async(req, res) => {
    let result = await Note.insertMany(req.body);
    if(result===[])
    {
        res.send("An error Occured");
    }
    res.json(result);
});

app.put('/api/update/:id',async (req,res)=>{
    let note = await Note.findById(req.params.id);
    if(!note){
        res.status(404).send("not found");
    }

    note = await Note.findByIdAndUpdate(req.params.id,{$set: req.body},{new:true});
    res.json(note);
})

  
app.listen(port,(err)=>{
    if (err) console.log(err);
    console.log("Server listening on PORT",port);
});