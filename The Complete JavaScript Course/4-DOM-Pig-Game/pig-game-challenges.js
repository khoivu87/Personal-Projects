/*
Three challenges:
1) If current user rolls two 6 faces in a row, he/she will lose all scores. After that, next player will play
2) Add an input field so player can choose the winning score
   If no winning score -> default: 100, else -> entered value
   Add a button to set winningScore = entered value
   Modify the new game button -> game only starts if new game btn is clicked
3) Add one more dice to the game -> two dices in total. Change how the game is played.
*/

var scores, roundScore, activePlayer, isPlaying, lastDice1, lastDice2, winningScore;

// Set default current and global scores, hide the dice
init();

// Click on new button to start the game
/*document.querySelector('.btn-new').addEventListener('click', init)*/
document.querySelector('.btn-new').addEventListener('click', function() {
    resetValues();
    freeSetScores();
    isPlaying = true;
    winningScore = 100;
    
    console.log("Let the game begins");
});

// Action when click on the roll dice button
document.querySelector('.btn-roll').addEventListener('click', function() {
    if(isPlaying) {
        // Once the dice is rolled, you can't set score
        blockSetScore();

        // Create a dice with random number from 1 -> 6
        var dice1 = Math.floor(Math.random() * 6) + 1;
        var dice2 = Math.floor(Math.random() * 6) + 1;

        // Update the dice in UI with respective image
        var diceDOM1 = document.getElementById('dice-1');
        var diceDOM2 = document.getElementById('dice-2');

        diceDOM1.style.display = 'block';
        diceDOM2.style.display = 'block';

        diceDOM1.src = 'dice-' + dice1 + '.png';
        diceDOM2.src = 'dice-' + dice2 + '.png';

        // Update roundScore with dice value and assign to current score of active player
        roundScore += dice1;

        console.log("Dice 1: " + dice1);
        console.log("Dice 2: " + dice2);
        console.log("Last dice 1: " + lastDice1);
        console.log("Last dice 2: " + lastDice2);

        if((lastDice1 === 6 && dice1 === 6) || (lastDice2 === 6 && dice2 === 6) ||
           (lastDice1 === 6 && dice2 === 6) || (lastDice2 === 6 && dice1 === 6)) {
            document.getElementById('score-' + activePlayer).textContent = '0';
            scores[activePlayer] = 0;
            document.getElementById('current-' + activePlayer).textContent = '0';
            roundScore = 0;
            nextPlayer();
        }else if(dice1 !== 1 || dice2 !== 1) {
            // Active player keeps rolling until he/ she get a number 1
            roundScore += dice1 + dice2;
            document.getElementById('current-' + activePlayer).textContent = roundScore;
        }else {
            nextPlayer();
        }

        // Add value to lastDice to compare on next roll
        lastDice1 = dice1;
        lastDice2 = dice2;
    }else {
        alert("Click on NEW GAME to begin!");
    }
});

// Action when click on the hold button
document.querySelector('.btn-hold').addEventListener('click', function() {
    if(isPlaying) {
        // Add round score to global score
        scores[activePlayer] += roundScore;
        document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

        console.log("Current winning score: " + winningScore);

        // If current player reaches winningScore -> winner -> not -> next player's move
        if(scores[activePlayer] >= winningScore) {
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
    }else {
        alert("Click on NEW GAME to begin!");
    }
});

// Action when click on the score button
document.querySelector('.btn-score').addEventListener('click', function() {
    if(isPlaying) {
        // Final score entered from the field
        var enteredValue = document.getElementById('final-score').value;

        // If enteredValue is null, empty, text, blah blah blah -> 100, else = enteredValue
        if(enteredValue) {
            winningScore = enteredValue;
        }else {
            // TO DO: need a loop here, if no score entered, keep asking
            document.getElementById("final-score").value = 100;
        }

        console.log("Score to win: " + winningScore);

        // Once a score is set, block user from changing it
        blockSetScore();
    }else {
        alert("Click on NEW GAME to begin!");
    }
});

// Function to initiate the game
function init() {
    resetValues();
    blockSetScore();
}

// Function to switch to next player's move
function nextPlayer() {
    // If current player is player 1 -> switch to player 2 and vice versa
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;

    roundScore = 0;
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    // Update UI
/*    if(activePlayer === 0) {
        document.querySelector('.player-0-panel').classList.remove('active');
        document.querySelector('.player-1-panel').classList.add('active');
    }else {
        document.querySelector('.player-0-panel').classList.add('active');
        document.querySelector('.player-1-panel').classList.remove('active');
    }*/

    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';

    //Toggle means if it's there -> remove, if it's NOT there -> add
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
}

// Function to reset all scores
function resetValues() {
    scores = [0,0];
    roundScore = 0;
    activePlayer = 0;
    lastDice1 = 0;
    lastDice2 = 0;
    winningScore = "";

    // Hide the dice before game starts
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';

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

// Function to set final score
function setFinalScore() {

}

// Function to disable user input on final-score field
function blockSetScore() {
    document.querySelector('.final-score').disabled = true;
    document.getElementById('final-score').value = winningScore;
}

function freeSetScores() {
    document.querySelector('.final-score').disabled = false;
    document.getElementById('final-score').value = "";
}