window.MathArena = {
    isPlaying: false,
    timer: null,
    timeLeft: 10,
    currentCombo: 0,
    correctAnswer: 0,

    init() {
        this.startBtn = document.getElementById('math-start-btn');
        this.gameArea = document.getElementById('math-game-area');
        this.startArea = document.getElementById('math-start-area');
        this.options = document.querySelectorAll('.math-option');

        this.startBtn.addEventListener('click', () => this.startGame());
        
        this.options.forEach(btn => {
            btn.addEventListener('click', (e) => this.checkAnswer(parseInt(e.target.textContent)));
        });
    },

    reset() {
        this.isPlaying = false;
        clearInterval(this.timer);
        this.startArea.classList.remove('hidden');
        this.gameArea.classList.add('hidden');
        this.currentCombo = 0;
        document.getElementById('math-combo').textContent = "0";
    },

    startGame() {
        this.isPlaying = true;
        this.startArea.classList.add('hidden');
        this.gameArea.classList.remove('hidden');
        this.currentCombo = 0;
        document.getElementById('math-combo').textContent = "0";
        SessionManager.startSession('math');
        this.nextQuestion();
    },

    nextQuestion() {
        if (!SessionManager.isActive) return; // Stop if 5-min session ended

        // Moroccan middle school typical mental math (multiplication table 1-12)
        const a = Math.floor(Math.random() * 11) + 2; // 2 to 12
        const b = Math.floor(Math.random() * 11) + 2; // 2 to 12
        
        this.correctAnswer = a * b;
        document.getElementById('math-question').textContent = `${a} x ${b}`;

        // Generate options
        let answers = [this.correctAnswer];
        while (answers.length < 4) {
            // Generate plausible wrong answers
            let offset = Math.floor(Math.random() * 10) - 5;
            if (offset === 0) offset = 1;
            let wrong = this.correctAnswer + offset;
            if (!answers.includes(wrong) && wrong > 0) {
                answers.push(wrong);
            }
        }

        // Shuffle
        answers.sort(() => Math.random() - 0.5);

        this.options.forEach((btn, index) => {
            btn.textContent = answers[index];
            btn.classList.remove('btn-primary', 'btn-danger');
            btn.classList.add('btn-secondary');
        });

        this.startTimer();
    },

    startTimer() {
        clearInterval(this.timer);
        this.timeLeft = 10; // 10 seconds per question
        document.getElementById('math-timer').textContent = this.timeLeft;

        this.timer = setInterval(() => {
            if (!SessionManager.isActive) {
                clearInterval(this.timer);
                return;
            }

            this.timeLeft--;
            document.getElementById('math-timer').textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleTimeout();
            }
        }, 1000);
    },

    checkAnswer(answer) {
        clearInterval(this.timer);
        if (!SessionManager.isActive) return;
        
        if (answer === this.correctAnswer) {
            // Correct
            this.currentCombo++;
            document.getElementById('math-combo').textContent = this.currentCombo;
            
            // Calculate XP (Base 10 + combo bonus + speed bonus)
            let xpEarned = 10 + (this.currentCombo * 2) + this.timeLeft;
            Gamification.addXP(xpEarned);
            SessionManager.recordAnswer(true, xpEarned, 'intermediate');

            
            if (this.currentCombo > 0 && this.currentCombo % 3 === 0) {
                Gamification.incrementStreak();
            }

            // Visual feedback
            this.gameArea.style.transform = 'scale(1.05)';
            setTimeout(() => this.gameArea.style.transform = 'scale(1)', 150);

            setTimeout(() => this.nextQuestion(), 500);
            
        } else {
            // Wrong
            Gamification.resetStreak();
            this.currentCombo = 0;
            document.getElementById('math-combo').textContent = "0";
            SessionManager.recordAnswer(false, 0, 'intermediate');
            
            App.showToast(FunnySystem.getRandomMessage('wrong_math'), 'error');
            
            // Shake effect
            this.gameArea.style.animation = 'shake 0.5s';
            setTimeout(() => {
                this.gameArea.style.animation = '';
                this.nextQuestion();
            }, 500);
        }
    },

    handleTimeout() {
        if (!SessionManager.isActive) return;

        this.currentCombo = 0;
        document.getElementById('math-combo').textContent = "0";
        Gamification.resetStreak();
        SessionManager.recordAnswer(false, 0, 'intermediate');
        App.showToast(FunnySystem.getRandomMessage('timeout'), 'error');
        
        // Move to next question instead of stopping the game
        setTimeout(() => this.nextQuestion(), 1500);
    }
};

// Add CSS shake animation to main css via js for encapsulation or assume it's there
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}`;
document.head.appendChild(style);
