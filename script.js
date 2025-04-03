const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'grey', 'brown', 'black'];
let currentLevel = 0;
let score = 0;
let selectedColors = [];
const maxLevels = colors.length - 2; // ✅ Fix: Adjusted max levels

// Elements
const instructionModal = document.getElementById('instruction-modal');
const startGameBtn = document.getElementById('start-game-btn');
const colorButtonsContainer = document.querySelector('.colors-container');
const scoreDisplay = document.getElementById('score');
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
};

// Start new level
function startNewLevel() {
    selectedColors = [];
    colorButtonsContainer.innerHTML = '';
    nextLevelButton.classList.add('hidden');
    congratsMsg.style.display = 'none'; // ✅ Hide the message when starting a new level

    if (currentLevel > maxLevels) {
        congratsMsg.style.display = 'block'; // ✅ Show Congrats Message
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

// Update score
function updateScore() {
    score += 10;
    scoreDisplay.textContent = score;
}

// Check if level is completed
function checkLevelCompletion() {
    if (selectedColors.length === currentLevel + 2) {
        if (currentLevel >= maxLevels) {
            congratsMsg.style.display = 'block'; // ✅ Display Congrats Message at last level
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
