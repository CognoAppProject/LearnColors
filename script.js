const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'grey', 'brown', 'black'];
let currentLevel = 0;
let score = 10; // Fixed score of 10
let selectedColors = [];
const maxLevels = colors.length - 2; // Adjusted max levels

// Elements
const instructionModal = document.getElementById('instruction-modal');
const startGameBtn = document.getElementById('start-game-btn');
const colorButtonsContainer = document.querySelector('.colors-container');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer-display');
const nextLevelButton = document.getElementById('next-level');
const congratsMsg = document.getElementById('congrats-msg');

// Show instructions on load
window.onload = function() {
    instructionModal.style.display = "flex";
};

// Start game
startGameBtn.onclick = function() {
    instructionModal.style.display = "none";
    startNewLevel();
    startTimer(); // Start the timer when the game begins
};

// Start new level
function startNewLevel() {
    selectedColors = [];
    colorButtonsContainer.innerHTML = '';
    nextLevelButton.classList.add('hidden');
    congratsMsg.style.display = 'none'; // Hide the message when starting a new level

    if (currentLevel > maxLevels) {
        clearInterval(timer); // Stop the timer once the game is completed
        congratsMsg.style.display = 'block';
        congratsMsg.innerHTML = `
            🎉 Congratulations! You completed all levels.<br>
            Time: ${timerDisplay.textContent}<br>
            Score: ${score}
        `;

        // Submit result to Android
        if (window.Android && Android.submitResult) {
            Android.submitResult("Counting Game", score, timeElapsed);
            console.log("Result submitted to Android:", score, timeElapsed);
        }

        nextLevelButton.classList.add('hidden'); // Hide next button
        return;
    }

    const levelColors = colors.slice(0, currentLevel + 2);
    levelColors.forEach(color => {
        const button = document.createElement('button');
        button.classList.add('color-button');
        button.dataset.color = color;
        button.textContent = color.charAt(0).toUpperCase() + color.slice(1);
        button.addEventListener('click', () => selectColor(button, color));
        colorButtonsContainer.appendChild(button);
    });
}

// Handle color selection
function selectColor(button, color) {
    if (!selectedColors.includes(color)) {
        selectedColors.push(color);
        pronounceColor(color);
        button.style.backgroundColor = color;
        button.style.color = getContrastColor(color);
        updateScore();
        checkLevelCompletion();
    }
}

// Pronounce color name
function pronounceColor(color) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(color);
    synth.speak(utterance);
}

// Get contrast color (black/white) based on background color
function getContrastColor(color) {
    const colorsWithLightText = ['blue', 'green', 'purple', 'black'];
    return colorsWithLightText.includes(color) ? 'white' : 'black';
}

// Update score (fixed at 10)
function updateScore() {
    score = 10; // fixed score of 10
}

// Check if level is completed
function checkLevelCompletion() {
    if (selectedColors.length === currentLevel + 2) {
        if (currentLevel >= maxLevels) {
            // Display congrats message after final level
            congratsMsg.style.display = 'block';
            congratsMsg.innerHTML = `
                🎉 Congratulations! You completed all levels.<br>
            `;
            clearInterval(timer); // Stop the timer once the game is completed

            // Submit result to Android
            if (window.Android && Android.submitResult) {
                Android.submitResult("Learn Colors", score, timeElapsed);
                console.log("Result submitted to Android:", score, timeElapsed);
            }

            nextLevelButton.classList.add('hidden'); // Hide next button
        } else {
            nextLevelButton.classList.remove('hidden');
        }
    }
}

// Move to next level
nextLevelButton.addEventListener('click', () => {
    currentLevel++;
    startNewLevel();
});

// Timer function
let timer;
let timeElapsed = 0;

// Start Timer
function startTimer() {
    timer = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = `${timeElapsed} seconds`;
    }, 1000);
}
