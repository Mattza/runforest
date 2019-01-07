const functions = require('firebase-functions');
const firebase = require('firebase');
const firebaseApp = firebase.initializeApp({
  apiKey: "",
  authDomain: "smalamej.firebaseapp.com",
  databaseURL: "https://smalamej.firebaseio.com",
  projectId: "smalamej",
  storageBucket: "",
  messagingSenderId: "821130989840"
})

const db = firebaseApp.database();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {

  // firebase.auth().signInWithEmailAndPassword('asd@asd.com', 'abc123').then(user => {
    var runforestRef = firebase.database().ref('/');
    runforestRef.once('value', function(snapshot) {
      response.send("Hello from Firebase!" + JSON.stringify(snapshot.val()));
    });
  // })
 
 
});
