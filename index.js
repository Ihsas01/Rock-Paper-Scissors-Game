const buttons = document.querySelectorAll(".buttons button");
const resultEl = document.getElementById("result");
const playerScoreEl = document.getElementById("user-score");
const computerScoreEl = document.getElementById("computer-score");
const historyList = document.getElementById("history-list");
const resetBtn = document.getElementById("reset");

let playerScore = 0;
let computerScore = 0;

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const playerSelection = button.id;
        const computerSelection = computerPlay();
        const result = playRound(playerSelection, computerSelection);
        resultEl.textContent = result;
        addToHistory(`You chose ${playerSelection}, Computer chose ${computerSelection}: ${result}`);
        animateButton(button);
    });
});

resetBtn.addEventListener("click", () => {
    playerScore = 0;
    computerScore = 0;
    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;
    resultEl.textContent = "Let's Play!";
    historyList.innerHTML = "";
});

function computerPlay() {
    const choices = ["rock", "paper", "scissors"];
    const randomChoice = Math.floor(Math.random() * choices.length);
    return choices[randomChoice];
}

function playRound(playerSelection, computerSelection) {
    if (playerSelection === computerSelection) {
        return "It's a tie!";
    } else if (
        (playerSelection === "rock" && computerSelection === "scissors") ||
        (playerSelection === "paper" && computerSelection === "rock") ||
        (playerSelection === "scissors" && computerSelection === "paper")
    ) {
        playerScore++;
        playerScoreEl.textContent = playerScore;
        return `You win! ${playerSelection} beats ${computerSelection}`;
    } else {
        computerScore++;
        computerScoreEl.textContent = computerScore;
        return `You lose! ${computerSelection} beats ${playerSelection}`;
    }
}

function addToHistory(message) {
    const li = document.createElement("li");
    li.textContent = message;
    historyList.prepend(li);
    if (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
    }
}

function animateButton(button) {
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
        button.style.transform = "scale(1)";
    }, 100);
}