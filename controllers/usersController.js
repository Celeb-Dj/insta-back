const usersModel = require("../models/usersModel");
const bcryptjs = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
// const { cloudinary } = require("../config/cloudinary.config")
// const uploadModel = require("../models/uploadModel")
// const { sendMail } = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const { generateCode } = require("../utils/generator");
const { forgotpasswordmail } = require("../utils/mailer");
const tokenModel = require("../models/tokenModel");


// import { v2 as cloudinary } from 'cloudinary';
// import { required } from 'nodemon/lib/config';

cloudinary.config({
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const registerUsers = (req, res) => {
  res.render("registerUsers")
}

const landingpage = (req, res) => {
  res.send([
    { name: "devnonso", age: 22 },
    { name: "exhibit", age: 20 },
    { name: "obasi", age: 19 },
  ]);
};

const uploadchat = (req, res) => {
  console.log(req.body);
  let chat = new usersModel(req.body)
}

const registerUser = async (req, res, next) => {
  let email = req.body.email;
  try {
    await usersModel.find({ email: email }).then((result) => {
      if (result.length > 0) {
        res
          .status(409)
          .send({ message: "Email already exists.", status: false });
      } else {
        // let userData = {
        //   firstName: req.body.firstname
        // }

        let form = new usersModel(req.body);
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
                message: "We are Loading your Account, wait a few mins",
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

const fileupload = async (req, res) => {
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

    // const profileimage = await usersModel.findOneAndUpdate(
    //   { email: email },
    //   { $set: { profile: myimage } },
    //   { new: true }
    // )
    // if (!profileimage) {
    //   res.status(405).send({ message: "unable to update profile", status: false })
    // }

    // return res.status(200).send({ message: "upload successful", status: true, myimage })

    // cloudinary.uploader.upload(myfile, (err, result) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     const myImagelink = result.secure_url
    //     res.send({
    //       message: "Image upload successful",
    //       status: true, myImagelink
    //     })
    //   }
  } catch (error) {
    console.log(error)
  }
  // { public_id: "olympic_flag" },
  // function (error, result) { console.log(result); });
}

const signin = async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  let username = req.body.username;
  // let secret = secret;
  let firstname = req.body.firstname
  try {
    await usersModel.find({ email: email }).then((result) => {
      if (result.length === 0) {
        res.status(404).send({ message: "You don't have an account with us", status: false })
      } else {
        bcryptjs.compare(password, result[0].password).then((result2) => {
          console.log(result2)
          console.log(password);
          console.log(username);
          
          if (result2) {
            const token = jsonWebToken.sign({ email }, "secretkey", { expiresIn: 90 })
            console.log(token)
            res.status(200).send({ message: "Welcome" + result[0].firstname, status: true, token })
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
      let firstname = result.firstname
      res.status(200).send({ message: "congrats", status: true, email: email })
      console.log(result)

    }
  })
}

const studentcomment = (req, res) => {
  // res.render("comment")
  // console.log(Comment);
  console.log(req.body, "body");
}


const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);
    const OTP = generateCode();

    const user = await usersModel.findOne({ email: email });
    console.log(user, OTP);
    if (!user) {
      return res.status(404).send({ message: "User not found", status: false });
    }
    const forgotPassword = await tokenModel.create({ email: email, OTP: OTP });
    console.log(forgotPassword);
    if (!forgotPassword) {
      return res.status(500).send({
        message: "Error generating OTP. Please try again",
        status: false,
      });
    }
    const username = user.username;
    await forgotpasswordmail(email, username, OTP);
    res
      .status(200)
      .send({ message: "Check your mail for OTP", status: true, OTP: OTP });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const resetPassword = async (req, res, next) => {
  try {
    const { OTP, password } = req.body;
    const findOTP = await tokenModel.findOne({ OTP: OTP });
    console.log(findOTP);
    if (!findOTP) {
      return res.status(404).send({ message: "OTP not found. Try again" });
    }
    let hashedPassword = await bcryptjs.hash(password, 10);
    const Email = findOTP.email;
    console.log(Email);
    const update = await usersModel.updateOne(
      { email: Email },
      { $set: { password: hashedPassword } }
    );
    if (!update.acknowledged) {
      return res
        .status(500)
        .send({ message: "Error updating password. Try again" });
    }
    await tokenModel.deleteOne({ _id: findOTP._id });
    return res
      .status(200)
      .send({ message: "Password updated successfully", status: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// const registerUser = (req, res) => {
//   console.log(req.boy);
// };

module.exports = { landingpage, registerUser, registerUsers, signin, geTdashboard, fileupload, uploadchat, studentcomment, forgotPassword, resetPassword };
