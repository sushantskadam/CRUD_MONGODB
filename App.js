const express = require("express");
const mongoose = require("mongoose");
const PORT = 8899;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
//db connection
// const db = "mongodb://localhost:27017/mongocrud";
const db = "mongodb://localhost:27017/relationship";

//for validation
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const { check, validationResult } = require("express-validator");


const methodOverride = require('method-override')// for DELETE and PUT
app.use(methodOverride('_method'))


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
const prodModel = require('./db/productSchema')
const colorModel= require('./db/colSchema')
//routes
app.get("/insertform", (req, res) => {
  res.render("form");
});

app.post(
  "/insertdata",
  urlencodedParser,
  [
    check("cname", "Enter Valid Name")
      .exists()
      .matches(/^[a-zA-Z ]{2,100}$/),
    check("email", "Email is Not Valid")
      // .isEmail()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .normalizeEmail(),
    check("mobile", "Enter Valid Mobile No")
      //  .isMobilePhone()
      .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/),
    check("password", "Enter Valid Password").matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    ),
    //   check("cpassword", "Password Dont Match")
    //   .matches("password"),
    check("cpassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password does not match");
      }
      return true;
    }),
  ],
  (req, res) => {
    let cname = req.body.cname;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let password = req.body.password;
    //insert data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())
      const alert = errors.array();
      res.render("form", {
        alert,
      });
    } else {
      let ins = new catModel({
        cname: cname,
        email: email,
        mobile: mobile,
        password: password,
      });

      ins.save((err) => {
        if (err) {
          res.send("Already Added " + err.message);
        } else {
          res.send("Category Added");
        }
      });
    }
  }
);

app.get("/", (req, res) => {
  catModel.find({}, (err, data) => {
    if (err) throw err;
    else {
        res.render("home", {data});
    //   res.send(data);
    }
  });
});
app.get("/getproducts", (req, res) => {
  prodModel.find()
  .populate(["category_id","color_id"])
  .then(product=>{
    console.log(product)
    res.send("Data Fetched")
  })
  // prodModel.find({}, (err, data) => {
  //   if (err) throw err;
  //   else {
  //       res.send(data);
  //   //   res.send(data);
  //   }
  // });
});

app.delete("/deldata/:id", (req, res) => {
  let id = req.params.id;
  catModel.deleteOne({ _id: id }, (err) => {
    if (err) throw err;
    else {
    //   res.send("Record Deleted");
      res.redirect('/')
    }
  });
});

app.get('/updata/:id',(req,res)=>{
    const id=req.params.id
    catModel.find({ _id: id }, (err, data) => {
        if (err) throw err;
        else {
            res.render('updateform',{data,id})
        //   res.send(data);
        }
      });
    
  })

app.put("/updatedata/:id", (req, res) => {
  let id = req.params.id;
  let cname = req.body.cname;
  let email = req.body.email;
  let mobile = req.body.mobile;
  let password = req.body.password;
  catModel.updateOne(
    { _id: id },
    {
      $set: { cname: cname, email: email, mobile: mobile, password: password },
    },
    (err) => {
      if (err) throw err;
      else {
        res.redirect('/')
        // res.send("Category Updated");
      }
    }
  );
});
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Running on ${PORT}`);
});
