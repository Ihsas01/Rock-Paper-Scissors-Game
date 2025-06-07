const buttons = document.querySelectorAll(".buttons button");
const resultEl = document.getElementById("result");
const playerScoreEl = document.getElementById("user-score");
const computerScoreEl = document.getElementById("computer-score");
const streakEl = document.getElementById("user-streak");
const moveCountEl = document.getElementById("move-count");
const historyList = document.getElementById("history-list");
const leaderboardList = document.getElementById("leaderboard-list");
const resetBtn = document.querySelector(".reset-btn");
const difficultySelect = document.getElementById("difficulty");
const clickSound = document.getElementById("click-sound");
const winSound = document.getElementById("win-sound");
const loseSound = document.getElementById("lose-sound");

let playerScore = 0;
let computerScore = 0;
let winStreak = 0;
let moveCount = 0;
let lastPlayerMove = null;

const leaderboard = JSON.parse(localStorage.getItem("rpsLeaderboard")) || [];

function updateLeaderboard() {
    leaderboardList.innerHTML = "";
    leaderboard.sort((a, b) => b.score - a.score).slice(0, 5).forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `#${index + 1}: ${entry.score} points (Streak: ${entry.streak}, Difficulty: ${entry.difficulty})`;
        leaderboardList.appendChild(li);
    });
}

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        clickSound.play();
        const playerSelection = button.id;
        const computerSelection = computerPlay();
        const result = playRound(playerSelection, computerSelection);
        resultEl.textContent = result;
        moveCount++;
        moveCountEl.textContent = moveCount;
        addToHistory(`Move ${moveCount}: You chose ${playerSelection}, Computer chose ${computerSelection} - ${result}`);
        animateButton(button);
        if (result.includes("win")) {
            winSound.play();
            saveToLeaderboard();
        } else if (result.includes("lose")) {
            loseSound.play();
        }
        updateLeaderboard();
    });
});

resetBtn.addEventListener("click", () => {
    clickSound.play();
    playerScore = 0;
    computerScore = 0;
    winStreak = 0;
    moveCount = 0;
    lastPlayerMove = null;
    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;
    streakEl.textContent = winStreak;
    moveCountEl.textContent = moveCount;
    resultEl.textContent = "Enter the Cosmic Arena!";
    historyList.innerHTML = "";
    animateReset();
});

function computerPlay() {
    const choices = ["rock", "paper", "scissors"];
    const difficulty = difficultySelect.value;
    if (difficulty === "easy") {
        return choices[Math.floor(Math.random() * choices.length)];
    } else if (difficulty === "medium") {
        if (Math.random() < 0.3 && lastPlayerMove) {
            return counterMove(lastPlayerMove);
        }
        return choices[Math.floor(Math.random() * choices.length)];
    } else {
        if (Math.random() < 0.7 && lastPlayerMove) {
            return counterMove(lastPlayerMove);
        }
        return choices[Math.floor(Math.random() * choices.length)];
    }
}

function counterMove(playerMove) {
    if (playerMove === "rock") return "paper";
    if (playerMove === "paper") return "scissors";
    return "rock";
}

function playRound(playerSelection, computerSelection) {
    lastPlayerMove = playerSelection;
    if (playerSelection === computerSelection) {
        winStreak = 0;
        streakEl.textContent = winStreak;
        return `It's a tie! ${playerSelection} vs ${computerSelection}`;
    } else if (
        (playerSelection === "rock" && computerSelection === "scissors") ||
        (playerSelection === "paper" && computerSelection === "rock") ||
        (playerSelection === "scissors" && computerSelection === "paper")
    ) {
        playerScore++;
        winStreak++;
        playerScoreEl.textContent = playerScore;
        streakEl.textContent = winStreak;
        return `You win! ${playerSelection} beats ${computerSelection}`;
    } else {
        computerScore++;
        winStreak = 0;
        computerScoreEl.textContent = computerScore;
        streakEl.textContent = winStreak;
        return `You lose! ${computerSelection} beats ${playerSelection}`;
    }
}

function addToHistory(message) {
    const li = document.createElement("li");
    li.textContent = message;
    historyList.prepend(li);
    if (historyList.children.length > 10) {
        historyList.removeChild(...historyList.children);
    }
}

function saveToLeaderboard() {
    leaderboard.push({
        score: playerScore,
        streak: winStreak,
        difficulty: difficultySelect.value,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem("rpsLeaderboard", JSON.stringify(leaderboard));
}

function animateButton(button) {
    button.style.transform = "scale(0.85)";
    button.style.boxShadow = "0 0 40px rgba(33, 150, 243, 0.8)";
    setTimeout(() => {
        button.style.transform = "scale(1)";
        button.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.5)";
    }, 200);
}

function animateReset() {
    const container = document.querySelector(".container");
    container.style.transform = "scale(0.9)";
    container.style.opacity = "0.7";
    setTimeout(() => {
        container.style.transform = "scale(1)";
        container.style.opacity = "1";
    }, 250);
}

// Particle Animation
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.3;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.05;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = `rgba(33, 150, 243, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.size <= 0.2) {
            particles.splice(index, 1);
            particles.push(new Particle());
        }
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});