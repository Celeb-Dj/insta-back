const adminModel = require("../models/adminModel");
const bcryptjs = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
// const { cloudinary } = require("../config/cloudinary.config")
// const uploadModel = require("../models/uploadModel")
// const { sendMail } = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const messageModel = require("../models/messageModel");

// import { v2 as cloudinary } from 'cloudinary';
// import { required } from 'nodemon/lib/config';

cloudinary.config({
    cloud_name: process.env.CLOUND_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const gadminsignup = (req, res) => {
    res.render("signup")
}

const glandingpage = (req, res) => {
    res.send([
        { name: "devnonso", age: 22 },
        { name: "exhibit", age: 20 },
        { name: "obasi", age: 19 },
        { level: "Admin", name: "Dan", age: "30" }
    ]);
};

// const uploadchat = (req, res) => {
//   console.log(req.body);
//   let chat = new usersModel(req.body)
// }

const registeradmin = async (req, res, next) => {
    let email = req.body.email;
    try {
        await adminModel.find({ email: email }).then((result) => {
            if (result.length > 0) {
                res
                    .status(409)
                    .send({ message: "Email already exists.", status: false });
            } else {
                // let userData = {
                //   firstName: req.body.firstname
                // }

                let form = new adminModel(req.body);
                form
                    .save()
                    .then((result1) => {
                        console.log(result1);
                        console.log(req.body);
                        console.log("your data has saved to database");
                        // sendMail(email); //This function carries our user email as params.
                        res
                            .status(201)
                            .send({
                                message: "Account has been created successfully",
                                status: true,

                            });

                        // console.log(req.body);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    } catch (error) {
        next(error);
    }
};

// const signin = (req, res)=>{
//   usersModel.find({email:req.body.email, password:req.body.password}, (err,result)=>{
//     if(err){
//       console.log(err);
//     }else{
//       console.log(result);
//     }
//   })
// }

const uploadimage = async (req, res) => {
    let myfile = req.body.myfile
    const email = req.body
    console.log(myfile);
    try {
        const result = await cloudinary.uploader.upload(myfile)
        console.log(result);
        const myImagelink = result.secure_url
        if (!result) {
            res.send({ message: "an error occurred ", status: false, myImagelink })
        }
        return res.send({ message: "image upload successful ", status: true, myImagelink })
        console.log(myImagelink);
    } catch (error) {
        console.log(error)
    }
    // { public_id: "olympic_flag" },
    // function (error, result) { console.log(result); });
}

const adminlogin = async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    // let secret = secret;
    let username = req.body.username
    try {
        await adminModel.find({ email: email }).then((result) => {
            if (result.length === 0) {
                res.status(404).send({ message: "You don't have an account with us", status: false })
            } else {
                bcryptjs.compare(password, result[0].password).then((result2) => {
                    console.log(result2)
                    console.log(password);
                    if (result2) {
                        const token = jsonWebToken.sign({ email }, "secretkey", { expiresIn: 90 })
                        console.log(token)
                        res.status(200).send({ message: "Welcome" + result[0].username, status: true, token })
                        res.send.body
                    } else {
                        res.status(401).send({ message: "Invalid password", status: false })
                    }
                })
            }
        }).catch((error) => {
            console.log(error)
            res.status(500).send({ message: "Sign in failed", status: false })
        })
    } catch (error) {
        return next(error)
    }
}

const geTdashboard = (req, res) => {
    let token = req.headers.authorization.split(" ")[1]
    console.log(token, "token")
    jwt.verify(token, "secretkey", (error, result) => {
        if (error) {
            console.log(error, "error");
            res.status(401).send({ message: "you can never make it ", status: false })
            //  return next(error)
        } else {
            let email = result.email
            res.status(200).send({ message: "congrats", status: true, email: email })
            console.log(result)

        }
    })
}
const uploadchat = async (req, res) => {
    let email = req.body.email;
    try {
        await messageModel.find({ email: email }).then((result) => {
            if (result.length < 0) {
                res
                    .status(409)
                    .send({ message: "Email don't exists.", status: false });
            } else {
                // let userData = {
                //   firstName: req.body.firstname
                // }

                let form = new messageModel(req.body);
                form
                    .save()
                    .then((result1) => {
                        console.log(result1);
                        console.log(req.body);
                        console.log("your data has saved to database");
                       // sendMail(email); //This function carries our user email as params.
                        res
                            .status(201)
                            .send({
                                message: "message has been created successfully",
                                status: true,

                            });

                        // console.log(req.body);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    } catch (error) {
        console.log(error);
    }
}
const uploadchats = (req, res) => {
    // res.send("comment")
   // res.send(Comment)
}
// const registerUser = (req, res) => {
//   console.log(req.boy);
// };

module.exports = { glandingpage, registeradmin, gadminsignup, adminlogin, geTdashboard, uploadimage, uploadchat, uploadchats };
