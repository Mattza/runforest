import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
  apiKey: '',
  authDomain: 'smalamej.firebaseapp.com',
  databaseURL: 'https://smalamej.firebaseio.com',
  projectId: 'smalamej',
  storageBucket: '',
  messagingSenderId: '821130989840'
})

// Export the database for components to use.
// If you want to get fancy, use mixins or provide / inject to avoid redundant imports.
export const db = firebaseApp.database()
export const firebase = firebaseApp
