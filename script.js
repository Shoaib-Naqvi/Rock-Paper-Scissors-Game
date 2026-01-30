// Game State
const state = {
    coins: 500,
    playerScore: 0,
    computerScore: 0,
    playerAttempts: 6,
    aiAttempts: 6,
    history: [],
    isRoundActive: false,
    maxAttempts: 6
};
// Icons
const icons = {
    rock: `<svg viewBox="0 0 24 24" width="60" height="60"><path fill="#64748b" d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 18l-6-3.75V8.75L12 5l6 3.75v7.5L12 20z"/></svg>`,
    paper: `<svg viewBox="0 0 24 24" width="60" height="60"><path fill="#64748b" d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`,
    scissors: `<svg viewBox="0 0 24 24" width="60" height="60"><path fill="#64748b" d="M19 3c-1.1 0-2 .9-2 2 0 .28.06.54.16.78L14.41 11l-2.41-3.37c.62-.43 1-1.14 1-1.93 0-1.38-1.12-2.5-2.5-2.5-1.38 0-2.5 1.12-2.5 2.5 0 .79.41 1.5 1.03 1.93l2.42 3.38-2.42 3.38c-.62-.43-1.03-1.14-1.03-1.93 0-1.38 1.12-2.5 2.5-2.5 1.38 0 2.5 1.12 2.5 2.5 0 .79-.38 1.5-1 1.93L14.41 13l2.75 5.22c-.1-.24-.16-.5-.16-.78 0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2c-.37 0-.7-.11-1-.28l-3.1 1.63L12 14l-4.9 6.35-3.1-1.63c-.3.17-.63.28-1 .28-1.1 0-2-.9-2-2s.9-2 2-2c.28 0 .54.06.78.16L6.59 13l-2.75-5.22c.1.24.16.5.16.78 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.37 0 .7.11 1 .28l3.1-1.63L12 10l4.9-6.35 3.1 1.63c.3-.17.63-.28 1-.28 1.1 0 2-.9 2-2s-.9-2-2-2z"/></svg>`
};

const choices = ["rock", "paper", "scissors"];

const elements = {
    // Navigation
    homeLink: document.getElementById('homeLink'),
    historyLink: document.getElementById('historyLink'),
    navPlayBtn: document.getElementById('navPlayBtn'),
    startGameBtn: document.getElementById('startGameBtn'),

    // Pages
    landingPage: document.getElementById('landingPage'),
    gamePage: document.getElementById('gamePage'),
    historyModal: document.getElementById('historyModal'),
    gameOverModal: document.getElementById('gameOverModal'),

    // Stats
    coinCount: document.getElementById('coinCount'),
    playerScore: document.getElementById('playerScore'),
    computerScore: document.getElementById('computerScore'),
    playerAttempts: document.getElementById('playerAttempts'),
    aiAttempts: document.getElementById('aiAttempts'),
    playerPower: document.getElementById('playerPower'),
    aiPower: document.getElementById('aiPower'),

    // Battle Area
    choicesContainer: document.querySelector('.choices-container'),
    choiceCards: document.querySelectorAll('.choice-card'),
    battleGround: document.getElementById('battleGround'),
    playerPick: document.getElementById('playerPick'),
    computerPick: document.getElementById('computerPick'),
    battleResult: document.getElementById('battleResult'),

    // Buttons & Modals
    resetGameBtn: document.getElementById('resetGameBtn'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    closeGameOverBtn: document.getElementById('closeGameOverBtn'),
    closeHistoryBtn: document.getElementById('closeHistoryBtn'),
    historyList: document.getElementById('historyList'),
    modalTitle: document.getElementById('modalTitle'),
    modalMessage: document.getElementById('modalMessage'),
    finalPlayerScore: document.getElementById('finalPlayerScore'),
    finalAiScore: document.getElementById('finalAiScore')
};

function init() {
    setupEventListeners();
    loadHistory();
}

function setupEventListeners() {
    elements.startGameBtn.addEventListener('click', () => switchPage('game'));
    elements.navPlayBtn.addEventListener('click', () => switchPage('game'));
    elements.homeLink.addEventListener('click', () => switchPage('landing'));

    elements.historyLink.addEventListener('click', () => elements.historyModal.classList.remove('hidden'));
    elements.closeHistoryBtn.addEventListener('click', () => elements.historyModal.classList.add('hidden'));
    // Logic
    elements.choiceCards.forEach(card => {
        card.addEventListener('click', () => {
            if (state.isRoundActive) return;
            handlePlayerChoice(card.dataset.choice);
        });
    });

    elements.resetGameBtn.addEventListener('click', resetSession);
    elements.playAgainBtn.addEventListener('click', resetSession);
    elements.closeGameOverBtn.addEventListener('click', () => {
        elements.gameOverModal.classList.add('hidden');
        resetSession();
        switchPage('landing');
    });
}

function switchPage(page) {
    elements.landingPage.classList.remove('active');
    elements.gamePage.classList.remove('active');

    if (page === 'game') {
        elements.gamePage.classList.add('active');
    } else {
        elements.landingPage.classList.add('active');
    }
}

async function handlePlayerChoice(choice) {
    state.isRoundActive = true;
    // Show battle
    elements.choicesContainer.classList.add('hidden');
    elements.battleGround.classList.remove('hidden');

    elements.playerPick.innerHTML = `${icons[choice]}<span>Player</span>`;
    elements.computerPick.innerHTML = `<div class="thinking-loader">...</div><span>AI Thinking</span>`;
    elements.battleResult.textContent = "";

    // Think Delay(300-600ms)
    const delay = Math.floor(Math.random() * 300) + 300;
    await new Promise(resolve => setTimeout(resolve, delay));

    const aiChoice = choices[Math.floor(Math.random() * 3)];
    elements.computerPick.innerHTML = `${icons[aiChoice]}<span>Computer</span>`;

    determineResult(choice, aiChoice);
}

function determineResult(player, ai) {
    let result = "";
    let resultClass = "";

    if (player === ai) {
        result = "DRAW";
        resultClass = "draw-text";
    } else if (
        (player === 'rock' && ai === 'scissors') ||
        (player === 'paper' && ai === 'rock') ||
        (player === 'scissors' && ai === 'paper')
    ) {
        result = "YOU WIN!";
        resultClass = "win-text";
        state.playerScore++;
    } else {
        result = "YOU LOSE";
        resultClass = "lose-text";
        state.computerScore++;
    }

    // Attempts(Power)
    state.playerAttempts--;
    state.aiAttempts--;

    updateUI(result, resultClass);
    checkGameOver();
}

function updateUI(result, resultClass) {
    elements.battleResult.textContent = result;
    elements.battleResult.className = `battle-result-text ${resultClass}`;
    //coins
    elements.playerScore.textContent = state.playerScore;
    elements.computerScore.textContent = state.computerScore;
    elements.coinCount.textContent = state.coins;

    elements.playerAttempts.textContent = state.playerAttempts;
    elements.aiAttempts.textContent = state.aiAttempts;

    const powerPercent = (state.playerAttempts / state.maxAttempts) * 100;
    elements.playerPower.style.width = `${powerPercent}%`;
    elements.aiPower.style.width = `${powerPercent}%`;

    // Return selection
    setTimeout(() => {
        if (state.playerAttempts > 0) {
            elements.battleGround.classList.add('hidden');
            elements.choicesContainer.classList.remove('hidden');
            state.isRoundActive = false;
        }
    }, 1500);
}

function checkGameOver() {
    if (state.playerAttempts === 0) {
        setTimeout(() => {
            const scoreDiff = Math.abs(state.playerScore - state.computerScore);
            let coinBonus = 0;

            if (state.playerScore > state.computerScore) {
                coinBonus = scoreDiff >= 2 ? 50 : 25;
            } else if (state.playerScore < state.computerScore) {
                coinBonus = scoreDiff >= 2 ? -50 : -25;
            }

            state.coins += coinBonus;
            const finalResult = state.playerScore > state.computerScore ? "VICTORY!" : (state.playerScore < state.computerScore ? "DEFEAT" : "TIE GAME");
            showGameOver(finalResult, coinBonus);
            saveHistory(finalResult);
        }, 1600);
    }
}

function showGameOver(result, coinBonus) {
    elements.modalTitle.textContent = result;

    let bonusText = "";
    if (coinBonus > 0) {
        bonusText = ` You earned ${coinBonus} coins!`;
    } else if (coinBonus < 0) {
        bonusText = ` You lost ${Math.abs(coinBonus)} coins.`;
    }

    elements.modalMessage.textContent = (result === "VICTORY!" ? "Eagle eyes! You dominated the machine." : "Better luck next time. AI is tough!") + bonusText;
    elements.finalPlayerScore.textContent = state.playerScore;
    elements.finalAiScore.textContent = state.computerScore;
    elements.coinCount.textContent = state.coins;
    elements.gameOverModal.classList.remove('hidden');
}

function saveHistory(result) {
    const entry = {
        date: new Date().toLocaleDateString(),
        score: `${state.playerScore} - ${state.computerScore}`,
        result: result
    };
    state.history.unshift(entry);
    localStorage.setItem('rps_history', JSON.stringify(state.history.slice(0, 10)));
    renderHistory();
}

function loadHistory() {
    const saved = localStorage.getItem('rps_history');
    if (saved) {
        state.history = JSON.parse(saved);
        renderHistory();
    }
}

function renderHistory() {
    if (state.history.length === 0) {
        elements.historyList.innerHTML = '<p class="empty-msg">No games recorded yet.</p>';
        return;
    }

    elements.historyList.innerHTML = state.history.map(item => `
        <div class="history-item">
            <span>${item.date}</span>
            <span>${item.score}</span>
            <span class="${item.result.includes('VIC') ? 'win-badge' : 'lose-badge'}">${item.result}</span>
        </div>
    `).join('');
}

function resetSession() {
    state.playerScore = 0;
    state.computerScore = 0;
    state.playerAttempts = state.maxAttempts;
    state.aiAttempts = state.maxAttempts;
    state.isRoundActive = false;

    elements.playerScore.textContent = "0";
    elements.computerScore.textContent = "0";
    elements.playerAttempts.textContent = state.maxAttempts;
    elements.aiAttempts.textContent = state.maxAttempts;
    elements.playerPower.style.width = "100%";
    elements.aiPower.style.width = "100%";

    elements.gameOverModal.classList.add('hidden');
    elements.battleGround.classList.add('hidden');
    elements.choicesContainer.classList.remove('hidden');
    switchPage('game');
}

init();
