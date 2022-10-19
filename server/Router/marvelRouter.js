import { Router } from 'express';
import { getCharacters, getComics, signUp, login, logOut, updateUserPhoto} from '../Controllers/marvelController.js';

const marvelRouter = Router();

marvelRouter.get('/characters',getCharacters);
marvelRouter.get('/comics', getComics);
marvelRouter.post('/signUp', signUp);
marvelRouter.post('/login', login);
marvelRouter.get('/signOut', logOut);
marvelRouter.post('/updateUserPhoto', updateUserPhoto)

export {marvelRouter};