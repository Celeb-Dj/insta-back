const express = require("express")
const router = express.Router()
const{ glandingpage, gadminsignup, registeradmin, uploadchats, adminlogin, uploadimage, geTdashboard, uploadchat} = require('../controllers/adminController')

const { resgisteradminValidationSchema, loginValidationSchema, uploadchatValidationSchema, fileuploadValidationSchema } = require("../middleware/usersValidatr")
const { validate } = require("../middleware/validae")
// const { adminvalidation } = require("../middleware/adminvalidation")
// const { uploadchat } = require("../controllers/adminController")

router.get('/', glandingpage);
router.get("/dashboard", geTdashboard);
router.get("/signup", gadminsignup);
// router.get('/verify', verifytoken);
router.post('/signup', registeradmin);
router.post('/login', adminlogin);
router.post('/upload', uploadimage);
router.post("/comment", uploadchat)
router.get("/comments", uploadchats)


module.exports = router;