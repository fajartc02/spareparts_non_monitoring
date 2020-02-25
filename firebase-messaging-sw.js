importScripts ('https://www.gstatic.com/firebasejs/6.3.3/firebase-app.js')
importScripts ('https://www.gstatic.com/firebasejs/6.3.3/firebase-messaging.js')

const firebaseConfig = {
  apiKey: "AIzaSyBvS8LKu7haXC-plLQ2hOWIiO6U99AF9lo",
  authDomain: "sparepartsmonitoring.firebaseapp.com",
  databaseURL: "https://sparepartsmonitoring.firebaseio.com",
  projectId: "sparepartsmonitoring",
  storageBucket: "gs://sparepartsmonitoring.appspot.com",
  messagingSenderId: "48640033559",
  appId: "1:48640033559:web:467c309f600e1167"
};

firebase.initializeApp({
  'messagingSenderId' : '48640033559'
})

const messaging = firebase.messaging()
// messaging.setBackgroundMessageHandler(function(payload) {
//   console.log('Masuk -sw.js')
//   var obj = JSON.parse(payload.data.notification)
//   var notificationTitle = obj.title
//   var notificationOptions = {
//     body: obj.body,
//     icon: obj.icon
//   }
//   return self.registration.showNotifications(notificationTitle, notificationOptions)
// })