const express = require("express");
const router = express.Router();
const {landingpage,registerUser, registerUsers, signin,geTdashboard, fileupload, uploadchat, studentcomment, forgotPassword, resetPassword} = require("../controllers/usersController")
const { registerUserValidationSchema, signinValidationSchema, uploadchatValidationSchema, fileuploadValidationSchema } = require("../middleware/usersValidatr")
const { validate } = require("../middleware/validae")

router.get("/",landingpage)
router.get("/dashboard", geTdashboard)
router.post("/signup",registerUser)
router.get("/signup",registerUsers)
router.post('/signin', signin)
router.post('/upload', fileupload)
router.post('/chat', uploadchat)
router.post("/comment", studentcomment)
router.post("/reset", forgotPassword)
router.post("/change", resetPassword)



module.exports = router;