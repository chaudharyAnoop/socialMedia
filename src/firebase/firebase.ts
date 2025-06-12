import { initializeApp } from 'firebase/app';
import { getMessaging, getToken,onMessage} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDTH8dvQznTaJRnl8NbZHPfMIMWLplKZvo",

  authDomain: "my-project-f3fb8.firebaseapp.com",

  projectId: "my-project-f3fb8",

  storageBucket: "my-project-f3fb8.firebasestorage.app",

  messagingSenderId: "880241752809",

  appId: "1:880241752809:web:0306aaf550a9f8ee388e78",

  measurementId: "G-HL1P162Q1J"
};


const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);


const VAPID_KEY = 'BLvNuY9Y68_bC0ZVee7U4A7hUPKokV5X4nZWWMsQXui3l-kybkYAWjGEvq4iyGmIey_0UP9WPxQ1f09Cs4EGZu8';

let token : string | undefined; 
export const requestNotificationPermission = async (): Promise<void> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission not granted.');
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (token) {
      console.log(' FCM Token:', token);
      // snedNotification().psot(token , 
     
    } else {
      console.warn(' No FCM registration token available.');
    }
  } catch (error) {
    console.error(' Error getting FCM token:', error);
  }
};

export const onFirebaseMessage = () =>
    new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        console.log(' Message received in foreground:', payload);
        resolve(payload);
      });
    });

export { token } ;
