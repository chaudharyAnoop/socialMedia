
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDTH8dvQznTaJRnl8NbZHPfMIMWLplKZvo",
  authDomain: "my-project-f3fb8.firebaseapp.com",
  projectId: "my-project-f3fb8",
  storageBucket: "my-project-f3fb8.firebasestorage.app",
  messagingSenderId: "880241752809",
  appId: "1:880241752809:web:0306aaf550a9f8ee388e78",
  measurementId: "G-HL1P162Q1J"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/background_notification.png' ,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
