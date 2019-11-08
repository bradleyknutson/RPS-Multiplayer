const firebaseConfig = {
    apiKey: "AIzaSyCATTO0FqQLMBgjgwcvXzX7PPs6dE0NRxc",
    authDomain: "rock-paper-scissors-eb5ec.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-eb5ec.firebaseio.com",
    projectId: "rock-paper-scissors-eb5ec",
    storageBucket: "rock-paper-scissors-eb5ec.appspot.com",
    messagingSenderId: "1049442637690",
    appId: "1:1049442637690:web:f7c59825fbab1d953fa8c3",
    measurementId: "G-R3GNPGWDS5"
  };

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  var database = firebase.database();

  $(document).ready(function () {
    
      
  });