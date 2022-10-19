import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  thumbNailSrc:{
    type:String,    
    required:true,
  }
})

const characterModel = new mongoose.model("character", characterSchema);

export {characterModel}