import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBgSl-rGjm4HK4KWPT8iqqLuX58SjZsFfg",
  authDomain: "mongo-marvel.firebaseapp.com",
  projectId: "mongo-marvel",
  storageBucket: "mongo-marvel.appspot.com",
  messagingSenderId: "980169205924",
  appId: "1:980169205924:web:885614f81988d5ebcb9e31"
}

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export{app, auth}