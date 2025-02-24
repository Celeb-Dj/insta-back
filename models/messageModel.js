const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const { type } = require("express/lib/response");

const messageSchema = new mongoose.Schema({
    name: { type:String, required:true, },
  email: { type:String, required:true },
  subject: { type:String, required:true},
  body: { type:String, required:true},
  messageDate : { type: Date,default:Date.now()},
})

const messageModel = mongoose.models.message_collections || mongoose.model("message_collections", messageSchema);

module.exports = messageModel;