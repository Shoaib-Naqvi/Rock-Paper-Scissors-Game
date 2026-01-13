
const choices =["rock", "paper", "scissors"];

const userChoice = document.getElementById("userChoice");
const computerChoice = document.getElementById("computerChoice");
const showResult = document.getElementById("result");
const playerScoreDisplay = document.getElementById("playerScore");
const computerScoreDisplay = document.getElementById("computerScore");
let playerScore = 0;
let computerScore = 0;
 

function playGame(playerChoice){
      const computerSelect = choices[Math.floor(Math.random() * 3)];
      let result = "";

      if (playerChoice === computerSelect){
          result = "It's a Tie!";
      } else {
        switch(playerChoice){
            case "rock":    
            result = (computerSelect === "scissors") ? "You Win!" : "You Lose!";
            break;
            case "paper":    
            result = (computerSelect === "rock") ? "You Win!" : "You Lose!";
            break;  
            case "scissors":    
            result = (computerSelect === "paper") ? "You Win!" : "You Lose!";
            break;

        }
     }
        
    userChoice.textContent = `PLAYER: ${playerChoice}`;
    computerChoice.textContent = `COMPUTER: ${computerSelect}`;
    showResult.textContent = result;

    showResult.classList.remove("greentext","redtext");
    
    if(result === "You Win!"){
        showResult.classList.add("greentext");
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
        
    } else if(result === "You Lose!"){
        showResult.classList.add("redtext");
        computerScore++;
        computerScoreDisplay.textContent = computerScore;
       
    } 
     
}
function Reset(){
    playerScore = 0;
    computerScore = 0;
    const updates = [
        [playerScoreDisplay, playerScore],
        [computerScoreDisplay, computerScore],
        [userChoice, "PLAYER:"],
        [computerChoice, "COMPUTER:"],
        [showResult, ""]
    ];

    updates.forEach(([el, val]) => {
        if (el) el.textContent = val;
    });

    if (showResult) {
        showResult.classList.remove("greentext", "redtext");
    }
}