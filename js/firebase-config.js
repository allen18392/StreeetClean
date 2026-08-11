/* ==========================================================================
   StreetClean — Firebase config

   Paste your team's config object from:
   Firebase console -> Project settings -> Your apps -> (</>) web app

   Only ONE person needs to create the project; everyone on the team
   uses the same config values here.
   ========================================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyCxKpvlp0QpAhcBuqHWIPaHzEUdUp1qGQY",
  authDomain: "streetclean-bda54.firebaseapp.com",
  projectId: "streetclean-bda54",
  storageBucket: "streetclean-bda54.appspot.com",
  messagingSenderId: "443391008611",
  appId: "1:443391008611:web:4095ddf58c54a0795b7d56",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();
