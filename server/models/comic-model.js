import mongoose, { mongo } from "mongoose";

const comicSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  isbn:{
    type:String,
  },
  series:{
    name:{
      type:String,
    }
  },
  thumbNailSrc:{
    type:String,
    required:true,
  }
})

const comicModel = new mongoose.model("comic", comicSchema);

export{comicModel}