import express from 'express'
import { marvelRouter } from './Router/marvelRouter.js';
import { PORT } from './config/config.js';
import cors from 'cors'
import { connect } from './db/connectDB.js';

const app = express();

app.use(cors());
app.use(express.json({limit:'50mb'}));
app.use(marvelRouter)

connect().then(async function onServerInit(){
  console.log("Connected to DB");
})

app.listen(PORT, () => console.log(`Sever listening on PORT ${PORT}`))