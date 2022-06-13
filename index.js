// const fetch = require('node-fetch');
const express = require('express');
const app= express();
const port= process.env.PORT || 3001;
const connectToMongo = require('./database/mongoose');


connectToMongo();

app.use(express.json());
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

    


  
app.listen(port,(err)=>{
    if (err) console.log(err);
    console.log("Server listening on PORT",port);
});