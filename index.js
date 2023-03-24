const express = require('express')
const cors = require('cors')
const confidEnv = require("dotenv").config()
const indexRouter = require("./routes/index")
var bodyParser = require('body-parser');

const app = express()


// router.get('/',(req,res)=>{
// res.send("this is api data ")
// })
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api",indexRouter)


app.use(express.static('public')); 
app.use('/uploads', express.static('uploads'));


app.post('/a2pi/u',function(req,res){
    res.json({"body":req.body})
})

app.listen("8000",function(){
    console.log("running app")
})

module.exports = app