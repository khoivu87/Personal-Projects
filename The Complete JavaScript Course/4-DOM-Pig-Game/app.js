/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, isPlaying;

// Start the game with default values
init();

// Action when click on the roll dice button
document.querySelector('.btn-roll').addEventListener('click', function() {
    if(isPlaying) {
        // Create a dice with random number from 1 -> 6
        var dice = Math.floor(Math.random() * 6) + 1;

        // Update the dice in UI with respective image
        var diceDOM = document.querySelector('.dice');
        diceDOM.style.display = 'block';
        diceDOM.src = 'dice-' + dice + '.png';

        // Update roundScore with dice value and assign to current score of active player
        roundScore += dice;

        // Active player keeps rolling until he/ she get a number 1
        if(dice !== 1) {
            document.getElementById('current-' + activePlayer).textContent = roundScore;
        }else {
            nextPlayer();
        }
        //console.log('Current player: ' + (activePlayer + 1));
    }
});

// Action when click on the hold button
document.querySelector('.btn-hold').addEventListener('click', function() {
    if(isPlaying) {
        // Add round score to global score
        scores[activePlayer] += roundScore;
        document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

        // If current player reaches 100 -> winner -> not -> next player's move
        if(scores[activePlayer] >= 20) {
            // Change the player name to Winner!
            document.getElementById('name-' + activePlayer).textContent = 'Winner!';

            // Update UI to winner style
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');

            // Set game status to false
            isPlaying = false;
        }else {
            nextPlayer();
        }
    }
});

// Action when click on the new game button
document.querySelector('.btn-new').addEventListener('click', init)

// Function to initiate the game
function init() {
    scores = [0,0];
    roundScore = 0;
    activePlayer = 0;
    isPlaying = true;

    // Hide the dice before game starts
    document.querySelector('.dice').style.display = 'none';

    // Set the scores to 0
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    // Set text back to player name
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';

    // Remove winner style
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');

    // Set the active player back to player 1 by default
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
}

// Function to switch to next player's move
function nextPlayer() {
    // If current player is player 1 -> switch to player 2 and vice versa
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;

    roundScore = 0;
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    // Update UI
    if(activePlayer === 0) {
        document.querySelector('.player-0-panel').classList.remove('active');
        document.querySelector('.player-1-panel').classList.add('active');
    }else {
        document.querySelector('.player-0-panel').classList.add('active');
        document.querySelector('.player-1-panel').classList.remove('active');
    }

    // Toggle means if it's there -> remove, if it's NOT there -> add
    //document.querySelector('.player-0-panel').classList.toggle('active');
    //document.querySelector('.player-1-panel').classList.toggle('active');
}
