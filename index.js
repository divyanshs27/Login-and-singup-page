const express = require('express');
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const dbname = "page";
const url ="mongodb+srv://divyansh:divyansh27@cluster0-gnnsr.mongodb.net/test";
const bcrypt = require("bcrypt");
//const SALT_ROUND = config.SALT_ROUND;
const mongoOptions = {useNewUrlParser : true};

const app = express();

//let ejs = require('ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname));    // this cmd allows external css files to be used
//app.set('view engine', 'ejs');
app.listen(3000,()=>{
    MongoClient.connect(url,mongoOptions,(error,client)=>{
    if(error) 
    throw(error);

    let database = client.db(dbname);
    let collection = database.collection("page1");
    console.log("Connected to`" + dbname + "`!");
    });
});

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/go2.html");
});
app.get('/login',(req,res)=>{
    res.sendFile(__dirname+"/login.html");
});
app.get('/REGISTER',(req,res)=>{
    res.sendFile(__dirname+"/REGISTER.html");
});
app.get('/login/about',(req,res)=>{
    res.sendFile(__dirname+"/about.html");
});

 app.post('/REGISTER',(req,res)=>{
     
 MongoClient.connect(url,(err,db)=>{
        if(err)
        throw(err);
        
        //bcrypt.genSalt(10, function(err, salt) {
           // bcrypt.hash("req.body.password1", salt, function(err, hash) {
                // Store hash in your password DB.
                let newData =
        {
            name:req.body.email1,
            username:req.body.username1,
            password: req.body.password1//hash
            
        }
       // console.log(hash)
        console.log(req.body.password1)
        let dbo = db.db("page");
        dbo.collection("page1").insertOne(newData);
           // });
        //});
    
})
    res.redirect("login.html")      // or use res.end()
})
app.post('/login',(req,res)=>{
    MongoClient.connect(url, (error, db) =>{
       if(error)
       throw(eror);
        var dbo=db.db("page");
         dbo.collection('page1').find({username : req.body.username11}).toArray((err,user)=>{
             if(err)throw err;
            if(!user[0])
            {console.log("user not found")
              res.status(404).send("user not found")
            }
            else
            {// bcrypt.compare(req.body.password11,user[0].password).then(function(result){
                
              //  console.log(result)
            //});
             var a= req.body.password11.localeCompare(user[0].password);
              console.log(user[0].password)
              console.log(req.body.password11)
              console.log(a)
              //res.sendStatus(a)
              res.redirect("about.html") 
              
            
            }
       
        })
        db.close();
    })
    
    })