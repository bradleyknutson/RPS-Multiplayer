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


var database = firebase.database();

var userKey;
var playerNum;

//Upon connection, push a value to connectionsRef in order to generate a random key and use that to modify the userKey variable.
//userKey becomes unique to the session running the game and thus different tabs can be used for different users.
//Upon disconnect the user is removed from the connectionsRef
database.ref('.info/connected').on('value', function(snapshot){
    if(snapshot.val()){
        var user = database.ref('connections').push(true);
        userKey = user.getKey();
        user.onDisconnect().remove();
    }
})


//Upon entering a name in the input field, sets name equal to the value of it and sets the input to blank again.  Checks if the database has a player one and
//if not will update accordingly, same for player two.  Sets both players to erase upon disconnect so another user can fill the spot.
$('#nameInputSubmit').click(function(event){
    event.preventDefault();
    var name = $('#nameInput').val().trim();
    $("#nameInput").val('');
    database.ref('players').once('value', function(snapshot){
        if(!snapshot.child('playerOne').exists()){
            playerNum = 1;
            database.ref('players/playerOne').set({
                name: name,
                wins: 0,
                losses: 0,
                key: userKey
            })
            database.ref('players/playerOne').onDisconnect().remove();
        }else if(!snapshot.child('playerTwo').exists()){
            playerNum = 2;
            database.ref('players/playerTwo').set({
                name: name,
                wins: 0,
                losses: 0,
                key: userKey
            })
            database.ref('players/playerTwo').onDisconnect().remove();
        }
    })
    $('#playerJoin').hide();
})


//display current player information
database.ref('players').on('value', function(snapshot){
    //Show join option only if there's an open spot
    if((!snapshot.child('playerOne').exists() || !snapshot.child('playerTwo').exists()) && playerNum !== 1 && playerNum !== 2){
        $('#playerJoin').show();
    }
    //Show playerOne info
    $('#playerOneName').text(snapshot.child('playerOne/name').val());
    $('#playerOneWins').text(snapshot.child('playerOne/wins').val());
    $('#playerOneLosses').text(snapshot.child('playerOne/losses').val());
    //Show playerTwo info
    $('#playerTwoName').text(snapshot.child('playerTwo/name').val());
    $('#playerTwoWins').text(snapshot.child('playerTwo/wins').val());
    $('#playerTwoLosses').text(snapshot.child('playerTwo/losses').val());
})

