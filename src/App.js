import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
     firebase.auth().signInWithPopup(provider)
     .then(res => {
       const {displayName, photoURL, email} = res.user;
       const signedInUser = {
         isSignedIn: true,
         name: displayName,
         email: email,
         photoURL: photoURL
        }
        setUser(signedInUser);
       console.log(displayName, photoURL, email);
     })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    }) 
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name:'',
        photo:'',
        email:''
      }
      setUser(signedOutUser)
    })
    .catch(err => {

    })
  }


  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sing out</button> :
        <button onClick={handleSignIn}>Sing in</button>
      }

      {
        user.isSignedIn && <div>
          <p> welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      
    </div>
  );
}

export default App;
