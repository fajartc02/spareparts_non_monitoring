import firebase from 'firebase/app';
import 'firebase/messaging'
import 'firebase/database';
// import 'firebase/firebase-functions' 

const firebaseConfig = {
  apiKey: "AIzaSyBvS8LKu7haXC-plLQ2hOWIiO6U99AF9lo",
  authDomain: "sparepartsmonitoring.firebaseapp.com",
  databaseURL: "https://sparepartsmonitoring.firebaseio.com",
  projectId: "sparepartsmonitoring",
  storageBucket: "gs://sparepartsmonitoring.appspot.com",
  messagingSenderId: "48640033559",
  appId: "1:48640033559:web:467c309f600e1167"
};

const app = firebase.initializeApp(firebaseConfig)

let db = app.database()

let messaging = app.messaging()

// messaging.usePublicVapidKey('BPIZ5jHdecSsSTeF_-k62AiVbg57kuhv-Rrw4RTaps7jSwJl5vhY-r0TIHhuc3Y4vcYhqPIqZs-OlvhdSMEpBvo')


// Notification.requestPermission().then((permission) => {
//   if (permission === 'granted') {
//     console.log('Notification permission granted.');
//     // TODO(developer): Retrieve an Instance ID token for use with FCM.
//     // ...
//     // messaging.onTokenRefresh(() => {
//       messaging.getToken().then((currentToken) => {
//         if (currentToken) {
//           console.log(currentToken);
//           localStorage.setItem('tokenMessage', currentToken)
//           // sendTokenToServer(currentToken);
//           // updateUIForPushEnabled(currentToken);
//         } else {
//           // Show permission request.
//           console.log('No Instance ID token available. Request permission to generate one.');
//           // Show permission UI.
//           // updateUIForPushPermissionRequired();
//           // setTokenSentToServer(false);
//         }
//       }).catch((err) => {
//         console.log('An error occurred while retrieving token. ', err);
//         // showToken('Error retrieving Instance ID token. ', err);
//         // setTokenSentToServer(false);
//       });
//     // })
//   } else {
//     console.log('Unable to get permission to notify.');
//   }
// });

export default db