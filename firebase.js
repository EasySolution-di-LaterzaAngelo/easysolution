// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCFti8gUPEgnTGuxd-tQWad3nmiEVhWMXQ',
  authDomain: 'easysolution-ecommerce.firebaseapp.com',
  projectId: 'easysolution-ecommerce',
  storageBucket: 'easysolution-ecommerce.appspot.com',
  messagingSenderId: '466517391428',
  appId: '1:466517391428:web:5cb1600e1737510e526411',
  measurementId: 'G-1V9PCBM003',
};

export const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

export const auth = getAuth(app);
auth.languageCode = 'it';

export const provider = new GoogleAuthProvider().setCustomParameters({
  prompt: 'select_account',
});

const db = app.firestore();
export const storage = getStorage(app);
export default db;
