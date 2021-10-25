import {initializeApp} from 'firebase/app'
import {getDatabase} from 'firebase/database'

const config = {
  apiKey: "AIzaSyDP1obvME9yXwzrxRWpELYOXe9MbWbfSBs",
  authDomain: "perfect-playlist-procurement.firebaseapp.com",
  projectId: "perfect-playlist-procurement",
  storageBucket: "perfect-playlist-procurement.appspot.com",
  messagingSenderId: "516243540314",
  appId: "1:516243540314:web:ded031398a3c503e2dcb63"
};

const app = initializeApp(config)

const realtime = getDatabase(app)

export default realtime