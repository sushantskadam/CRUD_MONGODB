const express = require("express");
const mongoose = require("mongoose");
const PORT = 8899;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs')
//db connection
const db = "mongodb://localhost:27017/mongocrud";
//for validation
// const bodyParser = require('body-parser')
// const urlencodedParser = bodyParser.urlencoded({ extended: false })
// const { check, validationResult } = require('express-validator')

const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("mongo db connected");
  } catch (err) {
    console.log(err.message);
  }
};
connectDB();
//end
const catModel = require("./db/categorySchema");
//routes
app.get("/", (req, res) => {
    res.render('form')
  });

app.post("/insertcategory", (req, res) => {
  let cname = req.body.cname;
  let email = req.body.email;
  //insert data
  
            let ins = new catModel({ cname: cname, email: email });
  
            ins.save((err) => {
              if (err) {
                res.send("Already Added"+err.message);
              }
              else{
                  res.send("Category Added");
              }
            });
        
 
});

app.get('/getcategory',(req,res)=>{
    catModel.find({},(err,data)=>{
        if(err) throw err;
        else{res.send(data);}
    })
})
app.delete("/delcategory/:id",(req,res)=>{
    let id=req.params.id;
    catModel.deleteOne({_id:id},(err)=>{
        if(err) throw err;
        else{res.send("Category Deleted")}
    })
})

app.put("/updatecategory/:id",(req,res)=>{
    let id = req.params.id;
    let cname=req.body.cname;
    let email = req.body.email;
    catModel.updateOne({_id:id},{$set:{cname:cname,email:email}},(err)=>{
        if(err) throw err;
        else{res.send("Category Updated")}
    })
})
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Running on ${PORT}`);
});
