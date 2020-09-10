import React, { useState } from 'react';

import './App.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const[newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password:'',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.GoogleAuthProvider();
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
  const handleFBLogin = () => {
    firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name:'',
        photo:'',
        email:'',
        error:'',
        success: false
      }
      setUser(signedOutUser)
    })
    .catch(err => {

    });
  }
  const handleBlur = (event) => {
    let isFormValid = true;
    if(event.target.name === 'email'){
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
      
    }
    if(event.target.name === 'password'){
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFormValid = isPasswordValid && passwordHasNumber;
    }
    if(isFormValid){
     const newUserInfo = {...user}
     newUserInfo[event.target.name] = event.target.value;
     setUser(newUserInfo);
    }
  }
  const handleSubmit = (event) => {
    // console.log(user.email, user.password)
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then( res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name);
      })
      .catch( error => {
        // Handle Errors here.
        // var errorCode = error.code;
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
       setUser(newUserInfo)
        
      });
    }

    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log('sign is user info', res.user)
        })
      .catch(function(error) {
        // Handle Errors here.
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
       setUser(newUserInfo);
      });
    }

    event.preventDefault();

  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
          displayName: name
        }).then(function() {
         console.log('user name updated successfully')
        }).catch(function(error) {
          console.log(error)
        });
      }

  return (
    <div className="App">
      {user.isSignedIn ? <button onClick={handleSignOut}>Sing out</button> :
        <button onClick={handleSignIn}>Sing in</button>
      }
      <br/>
      <button onClick={handleFBLogin}>Sign in using Feacbook</button>
      {
        user.isSignedIn && <div>
          <p> welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      
      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={ () => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New Usew Sign up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Your Name"/>}
        <br/>
      <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email address" required/>
      <br/>
      <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required/>
      <br/>
      <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      { user.success &&  <p style={{color: 'green'}}>User {newUser ? 'created' : 'Logged In'} successfully</p>}
    </div>
  );
}

export default App;
