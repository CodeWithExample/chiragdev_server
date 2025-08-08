const express = require('express')

const app = express()

app.get('/',(req,res)=>{
    res.json({
        status:200,
        message : "Successfuly server run"
    })
})

app.listen(8000,()=>{
    console.log('setver is run port 8000');
})