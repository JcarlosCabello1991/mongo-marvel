import mongoose from 'mongoose'

function connect(){
  return mongoose.connect("mongodb://localhost:27017/marvel",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

export{connect};