import fetch from 'node-fetch'
import md5 from 'md5'
import dotenv from 'dotenv'
import {characterModel} from '../models/character-model.js'
import {comicModel} from '../models/comic-model.js'
import {auth} from '../firebase/firebase.js'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import {signOut} from 'firebase/auth'
import cloudinaryAuth from '../utils/cloudinary.js'

dotenv.config();

//Get characters
async function getCharacters(req, res, next){

  try{
    //First we must to check if our database is empty, if not we return directly the characters founded(line: 12 and 39)
    const characters = await characterModel.find({}).lean().exec();

    if(characters.length == 0){
      let charactersArray = [];
      //In this case we will make an API call and the just save the api call result on the Mongo Data Base
      const hash = md5(`1000${process.env.PRIVATE_API_KEY}${process.env.PUBLIC_API_KEY}`);
      const response = await fetch(`https://gateway.marvel.com:443/v1/public/characters?ts=1000&apikey=${process.env.PUBLIC_API_KEY}&hash=${hash}`);
      const data = await response.json();

      //Now we are going to save the result con the Mongo Data Base
      const results = data.data.results;

      results.map(result => {
        const {name, thumbnail} = result;
        const thumbNailSrc = thumbnailUrlBuild(thumbnail);
        const character = characterModel.create({
          name,
          thumbNailSrc,
        })
        charactersArray.push({name:name, thumbNailSrc:thumbNailSrc})
      })

      //We response to the Front-End to serve the results
      res.status(200);
      res.send(charactersArray);
    } else {
      res.status(200);
      res.send(characters);
    }  
  }catch(error){
    next(error);
  }
  
}

//Get Comincs
async function getComics(req, res, next){

  try{
  //First we must to check if our database is empty, if not we return directly the characters founded(line: 51 and 62)
    const comics = await comicModel.find({}).lean().exec();

    if(comics.length == 0){
      let comicsArray = [];

      //In this case we will make an API call and the just save the api call result on the Mongo Data Base
      const hash = md5(`1000${process.env.PRIVATE_API_KEY}${process.env.PUBLIC_API_KEY}`);
      const response = await fetch(`https://gateway.marvel.com:443/v1/public/comics?ts=1000&apikey=${process.env.PUBLIC_API_KEY}&hash=${hash}`);
      const data = await response.json();

      //Now we are going to save the result con the Mongo Data Base
      const results = data.data.results;

      results.map(result => {
        const {title, isbn, series, thumbnail} = result;
        const thumbNailSrc = thumbnailUrlBuild(thumbnail);
        const comic = comicModel.create({
          title,
          isbn,
          series,
          thumbNailSrc,
        })
        comicsArray.push({title:title, isbn:isbn, series:series, thumbNailSrc:thumbNailSrc});
      })

      //We response to the Front-End to serve the results
      res.status(200)
      res.send(comicsArray);
    }else{
      res.status(200);
      res.send(comics);
    }
  }catch(error){
    next(error)
  }
  
}

async function signUp(req, res, next){
  const {userName, password} = req.body;
  //Ahora hay que darle estos datos a firebase para que compruebe si esta todo correcto
  createUserWithEmailAndPassword(auth, userName, password)
  .then((userCredential) => {
    res.send({userName: userCredential._tokenResponse.email})
  })
  .catch(error => {
    res.send({error:error.message})
  })
}

async function login(req, res, netx){
  const {userName, password} = req.body;

  signInWithEmailAndPassword(auth, userName, password)
  .then((userCredential) => {
    res.send({userName: userCredential._tokenResponse.email})
  })
  .catch((error) => {
    res.send({error: error})
  })
}

async function logOut(req, res, next){
  signOut(auth).then(()=>{
    res.send({logOut: true})
  })
  .catch(error => {
    next(error)
  })
}

function thumbnailUrlBuild(thumbnail) {
  const path = thumbnail?.path;
  const extension = thumbnail?.extension;

  return `${path}.${extension}`;
}

async function updateUserPhoto(req, res, next){
  const {url} = req.body

  const {secure_url} = await cloudinaryAuth.uploader.upload(`data:image/png;base64,${url}`, {
    upload_preset: 'photos'
  },function(_error, result) {
    // let result1 = result.secure_url;
    return result;
  }); 

  console.log(secure_url);
  // cloudinary.v2.uploader
  // .upload(`data:image/*;base64,${url}`)
  // .then(result=>res.send(result));

  //Aqui la guardamos en la base de datos en un campo profilePhotoUser
  res.send({url:secure_url})

}


export {getCharacters, getComics, signUp, logOut, login, updateUserPhoto}