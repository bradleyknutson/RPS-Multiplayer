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
});


//display current player information
database.ref('players').on('value', function(snapshot){
    showPlayerInfo(snapshot);
    //Show join option only if there's an open spot
    if((!snapshot.child('playerOne').exists() || !snapshot.child('playerTwo').exists()) && playerNum !== 1 && playerNum !== 2){
        $('#playerJoin').show();
    }
    if(snapshot.child('playerOne').exists() && snapshot.child('playerTwo').exists()){
        if(!snapshot.child('playerOne/choice').exists()){
            $('#waiting').text('Waiting on Player One');
        }else if(!snapshot.child('playerTwo/choice').exists()){
            $('#waiting').text('Waiting on Player Two');
        }else{
            $('#waiting').text('');
            determineWinner(snapshot);
        }
        showPlayerChoice(snapshot);
    }
    
});


$(document.body).on('click', '.rps-choice', function(){
    var playerChoice = $(this).attr('value');
    if(playerNum === 1){
        database.ref('players/playerOne').update({
            choice: playerChoice
        });
    }else if(playerNum === 2){
        database.ref('players/playerTwo').update({
            choice: playerChoice
        });
    }
});


function showPlayerInfo(snapshot){
    //Show playerOne info
    $('#playerOneName').text(snapshot.child('playerOne/name').val());
    $('#playerOneWins').text(snapshot.child('playerOne/wins').val());
    $('#playerOneLosses').text(snapshot.child('playerOne/losses').val());
    //Show playerTwo info
    $('#playerTwoName').text(snapshot.child('playerTwo/name').val());
    $('#playerTwoWins').text(snapshot.child('playerTwo/wins').val());
    $('#playerTwoLosses').text(snapshot.child('playerTwo/losses').val());
}

//Builds the choice images for player
function showPlayerChoice(snapshot){
    if(playerNum === 1 && !snapshot.child('playerOne/choice').exists()){
        $('#choiceSection').html('<div class="row"><div class="col-lg-4"><img src="assets/images/rock.png" alt="" value="rock" class="rps-choice"></div><div class="col-lg-4"><img src="assets/images/paper.png" alt="" value="paper" class="rps-choice"></div><div class="col-lg-4"><img src="assets/images/scissors.png" alt="" value="scissors" class="rps-choice"></div></div>');
    }else if(playerNum === 2 && snapshot.child('playerOne/choice').exists() && !snapshot.child('playerTwo/choice').exists()){
        $('#choiceSection').html('<div class="row"><div class="col-lg-4"><img src="assets/images/rock.png" alt="" value="rock" class="rps-choice"></div><div class="col-lg-4"><img src="assets/images/paper.png" alt="" value="paper" class="rps-choice"></div><div class="col-lg-4"><img src="assets/images/scissors.png" alt="" value="scissors" class="rps-choice"></div></div>');
    }
}

function determineWinner(snapshot){
    var playerOneChoice = snapshot.child('playerOne/choice').val();
    var playerTwoChoice = snapshot.child('playerTwo/choice').val();
    var playerOneWins = snapshot.child('playerOne/wins').val() + 1;
    var playerTwoWins = snapshot.child('playerTwo/wins').val() + 1;
    var playerOneLosses = snapshot.child('playerOne/losses').val() + 1;
    var playerTwoLosses = snapshot.child('playerTwo/losses').val() + 1;

    database.ref('players/playerOne/choice').remove();
    database.ref('players/playerTwo/choice').remove();


    if( (playerOneChoice === 'rock' && playerTwoChoice === 'scissors') ||
        (playerOneChoice === 'paper' && playerTwoChoice === 'rock') ||
        (playerOneChoice === 'scissors' && playerTwoChoice === 'paper')){
            database.ref('players/playerOne').update({
                wins: playerOneWins
            });
            database.ref('players/playerTwo').update({
                losses: playerTwoLosses
            });
            $('#waiting').text('Player One Wins!');
    }else if(playerOneChoice === playerTwoChoice){
        $('#waiting').text("It's a tie!");
    }else{
        database.ref('players/playerTwo').update({
            wins: playerTwoWins
        });
        database.ref('players/playerOne').update({
            losses: playerOneLosses
        });
        $('#waiting').text('Player Two Wins!');
    }
    $('#choiceSection').empty();
    if(playerNum === 1){
        setTimeout(function(){
            $('#choiceSection').html('<div class="row"><div class="col-lg-4"><img src="assets/images/rock.png" alt="" value="rock" class="rps-choice"></div><div class="col-lg-4"><img src="assets/images/paper.png" alt="" value="paper" class="rps-choice"></div><div class="col-lg-4"><img src="assets/images/scissors.png" alt="" value="scissors" class="rps-choice"></div></div>');
        }, 1000 * 5);
    }
}

//This is a completely separate commit, on Master