
const express = require('express');
const bodyParser = require("body-parser");
var bcrypt = require('bcrypt');
const MongoClient = require("mongodb").MongoClient;
var config = require("./config.js")
const mongoOptions = {useNewUrlParser : true};          
var url = config.url;
var dbname = config.dbname;
var shortid = config.shortid;
const SALT_ROUND = config.SALT_ROUND;
var PORT1 = config.PORT1;
var collection = config.collection;
//Global variable for connection pool
var connectionPool;

const app = express();

app.use(bodyParser.json());                             //  this cmd tells the server how to read json
app.use(bodyParser.urlencoded({extended:true}));        //  The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object.

app.listen(PORT1,()=>{
    console.log("listening on: "+PORT1)
    //Connection Pool in MongoDB
    MongoClient.connect(url, mongoOptions,{
        poolSize: 10,
        db: {
          native_parser: false
        },
        server: {
          socketOptions: {
            connectTimeoutMS: 5000
          }
        },
        replSet: {},
        mongos: {}
      }, function(error, client) {
      if(error)
      console.log(error);
    
      let database = client.db(dbname);
      connectionPool = database.collection(collection);
      console.log("Connected to`" + dbname + "`!");
      })
 });

// Get All Profiles
app.get('/getAllProfiles', (req,res) => {                          
   connectionPool.find({}).toArray((dberr,result) => {            
          if (dberr) throw dberr;
           res.send(result)  
      })
    })   
   
// Get UserInfo By Username
app.get('/getUserInfoByUsername', (req,res) => {                                 
    connectionPool.find({username:req.body.username}).toArray((dberr,result) => {         
          if (dberr) throw dberr;
           res.send(result)  
      })
    })   

// Get UserInfo By Name
app.get('/getUserInfoByName', (req,res) => {                                
    connectionPool.find({name:req.body.name}).toArray((dberr,result) => {            
          if (dberr) throw dberr;
           res.send(result)  
      })
    })   

// Get UserInfo By Id
app.get('/getUserInfoById', (req,res) => {                               
    connectionPool.find({userid:req.body.userid}).toArray((dberr,result) => {            
          if (dberr) throw dberr;
           res.send(result)  
      })
    })   


//  Login
app.post('/loginUser',(req,res)=>{
     
                let hashedPassword = bcrypt.hashSync(req.body.password, SALT_ROUND)
                let hashedConpass = bcrypt.hashSync(req.body.confirmPassword, SALT_ROUND)
                           let newData = {
                               name :  req.body.name,
                               username : req.body.username,
                               password : hashedPassword,
                               confirmPassword : hashedConpass
                              }
                              connectionPool.insertOne(newData)
                              let message = 
                              {
                                text : "Data entered succesfully",
                                status : "200 OK"
                              }
                           res.send(message);
               })

               
//  Signup
 app.post('/signupUser',(req,res)=>{

                let hashedPassword = bcrypt.hashSync(req.body.password, SALT_ROUND)
                let hashedConpass = bcrypt.hashSync(req.body.confirmPassword, SALT_ROUND)
                           let newData = {
                               userid: shortid.generate(),
                               name :  req.body.name,
                               username : req.body.username,
                               password : hashedPassword,
                               confirmPassword : hashedConpass
                              }
                              connectionPool.insertOne(newData)
                              let message =
                              {
                                text : "Data entered succesfully",
                                status : "200 OK"
                              }
                           res.send(message);
               })

               
// Add Users
 app.post('/addMultipleData',(req,res,next)=>{
     
                let hashedPassword = bcrypt.hashSync(req.body.password, SALT_ROUND)
                let hashedConpass = bcrypt.hashSync(req.body.confirmPassword, SALT_ROUND)
                           let newData = {
                               userid: shortid.generate(),
                               name :  req.body.name,
                               username : req.body.username,
                               password : hashedPassword,
                               confirmPassword : hashedConpass
                              }
                              connectionPool.insertMany(newData)
                              let message =
                              {
                                text = "Data entered succesfully",
                                status = "200 OK"
                              }
                           res.send(message);
               })

// Edit UserDetails By Username
app.put('/editUserDetailsByUsername', (req, res) => {

  let newhashedPassword = bcrypt.hashSync(req.body.newpassword, SALT_ROUND)
  let newhashedConpass = bcrypt.hashSync(req.body.newconfirmPassword, SALT_ROUND)
    connectionPool.findOneAndUpdate({username: req.body.username},      // username from the test.html form
    {  
        $set: {
        name :  req.body.newname,
        username : req.body.newusername,
        password : newhashedPassword,
        confirmPassword : newhashedConpass
       }
     },(dberr, result) => {
       if (dberr) console.log(dberr);
        //console.log(result);
        let message = { }
        if(result.lastErrorObject.updatedExisting)
        {
            message.text = "User "+req.body.username+" updated succesfully"
            message.status = "200 OK"
        }
        else
        {
          message.text = "Could not update userinfo "
          message.status = "406 Not Acceptable"  
        }
        res.send(message);
      })
    })

// Edit UserDetails By Id
app.put('/editUserDetailsById', (req, res) => {

  let newhashedPassword = bcrypt.hashSync(req.body.newpassword, SALT_ROUND)
  let newhashedConpass = bcrypt.hashSync(req.body.newconfirmPassword, SALT_ROUND)
    connectionPool.findOneAndUpdate({userid: req.body.userid},      // username from the test.html form
    {  
        $set: {
        userid: req.body.userid,
        name :  req.body.newname,
        username : req.body.newusername,
        password : newhashedPassword,
        confirmPassword : newhashedConpass
       }
     },(dberr, result) => {
       if (dberr) console.log(dberr);
        //console.log(result);
        let message = { }
        if(result.lastErrorObject.updatedExisting)
        {
          message.text = "User "+req.body.username+" updated succesfully"
          message.status = "200 OK"
        }
        else
        {
            message.text = "Could not update userinfo "
            message.status = "406 Not Acceptable"
        }
        res.send(message);
      })
    })


// Edit All Users
app.put('/editAllUsers', (req, res) => {

  let newhashedPassword = bcrypt.hashSync(req.body.newpassword, SALT_ROUND)
  let newhashedConpass = bcrypt.hashSync(req.body.newconfirmPassword, SALT_ROUND)
    connectionPool.findOneAndUpdate({username: req.body.newusername1},      // username from the test.html form
    {  
        $set: {
        name :  req.body.newname,
        username : req.body.newusername1,
        password : newhashedPassword,
        confirmPassword : newhashedConpass
       }
     },(dberr, result) => {
       if (dberr) console.log(dberr);
        //console.log(result);
        let message = { }
        if(result.lastErrorObject.updatedExisting)
        {
          message.text = "Users data updated succesfully"
          message.status = "200 OK"
        }
        else
        {
            message.text = "Users not found"
            message.status = "406 Not Acceptable"  
        }
        res.send(message);
      })
    })


//  Remove User By Username
app.delete('/deleteUserInfoByUsername', (req, res) => {

    connectionPool.findOneAndDelete({username: req.body.username}, (err, result) => {
      if (err)    console.log(err)
    //   console.log(result);
      let message = { }
      if(result.value == null)
      {
          message.text = "User "+req.body.username+" does not exist"
          message.status = "410 Gone"
      }
      else
      {
        message.text = "User "+req.body.username+" deleted succesfully"
        message.status = "200 OK"
      }
      res.send(message)
    })
  })


// Remove User By Id
app.delete('/deleteUserInfoById', (req, res) => {

    connectionPool.findOneAndDelete({userid: req.body.userid}, (err, result) => {
      if (err)    console.log(err)
    //   console.log(result);
      let message = { }
      if(result.value == null)
      {
          message.text = "User with id "+req.body.userid+" does not exist"
          message.status = "410 Gone"
      }
      else
      {
        message.text = "User "+req.body.username+" deleted succesfully"
        message.status = "200 OK"
      }
      res.send(message)
    })
  })

//  Remove All Users                                                          // needs tweaking
app.delete('/deleteAllProfiles', (req, res) => {

    connectionPool.deleteMany({username: req.body.username}, (err, result) => {
      if (err)    console.log(err)
    //   console.log(result);
      let message = { }
      if(result.value == null)
      {
          message.text = "No existing users"
          message.status = "410 Gone"
      }
      else
      {
          message.text = "All users deleted successfully"
          message.status = "200 OK"
      }
      res.send(message)
    })
  })