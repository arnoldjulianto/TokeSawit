/* eslint-disable prettier/prettier */
import { firebase } from "firebase/app";
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDOxZxNR_XqNCbu-PJE03JNPTi2BaGrS8s",
    authDomain: "sms-verification-a2826.firebaseapp.com",
    projectId: "sms-verification-a2826",
    storageBucket: "sms-verification-a2826.appspot.com",
    messagingSenderId: "703954087988",
    appId: "1:703954087988:web:c84f70334cedcb40b89a61"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;