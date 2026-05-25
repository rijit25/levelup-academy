window.SessionManager = {
    timer: null,
    timeTotal: 300, // 5 minutes in seconds
    timeLeft: 300,
    isActive: false,
    
    stats: {
        correct: 0,
        wrong: 0,
        xpEarned: 0,
        highestDifficultyReached: 'beginner'
    },

    startSession(moduleName) {
        this.isActive = true;
        this.timeLeft = this.timeTotal;
        this.stats = { correct: 0, wrong: 0, xpEarned: 0, highestDifficultyReached: 'beginner' };
        
        // Show Timer UI
        document.getElementById('global-timer-container').classList.remove('hidden');
        this.updateTimerUI();

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerUI();
            
            if (this.timeLeft <= 0) {
                this.endSession();
            }
        }, 1000);
    },

    updateTimerUI() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        document.getElementById('global-timer-text').textContent = formattedTime;
        
        const progress = (this.timeLeft / this.timeTotal) * 100;
        const bar = document.getElementById('global-timer-bar');
        bar.style.width = `${progress}%`;
        
        if (progress < 20) {
            bar.style.backgroundColor = 'var(--danger-color)';
        } else if (progress < 50) {
            bar.style.backgroundColor = 'var(--accent-color)';
        } else {
            bar.style.backgroundColor = 'var(--primary-color)';
        }
    },

    recordAnswer(isCorrect, xpAmount, currentDifficulty) {
        if (!this.isActive) return;
        
        if (isCorrect) {
            this.stats.correct++;
            this.stats.xpEarned += xpAmount;
            
            // Track highest difficulty
            const diffLevels = ['beginner', 'intermediate', 'expert'];
            if (diffLevels.indexOf(currentDifficulty) > diffLevels.indexOf(this.stats.highestDifficultyReached)) {
                this.stats.highestDifficultyReached = currentDifficulty;
            }
        } else {
            this.stats.wrong++;
        }
    },

    endSession() {
        clearInterval(this.timer);
        this.isActive = false;
        
        // Hide Timer UI
        document.getElementById('global-timer-container').classList.add('hidden');
        
        // Calculate Rank/Badge
        let rank = "Novice 🌱";
        let message = "C'est un bon début, continue à t'entraîner !";
        
        if (this.stats.highestDifficultyReached === 'expert' && this.stats.correct > 15) {
            rank = "Génie 🧠✨";
            message = "Incroyable ! Tu maîtrises le sujet à la perfection !";
        } else if (this.stats.highestDifficultyReached === 'intermediate' || this.stats.correct > 10) {
            rank = "Bon Élève 📚";
            message = "Très bien ! Tu progresses vite !";
        } else if (this.stats.correct === 0 && this.stats.wrong > 0) {
            rank = "Endormi 😴";
            message = "Réveille-toi ! La prochaine fois sera la bonne.";
        }
        
        // Render Results View
        document.getElementById('res-rank').textContent = rank;
        document.getElementById('res-message').textContent = message;
        document.getElementById('res-correct').textContent = this.stats.correct;
        document.getElementById('res-wrong').textContent = this.stats.wrong;
        document.getElementById('res-xp').textContent = `+${this.stats.xpEarned} XP`;
        
        // Check if guest to show promo
        const isGuest = App.state.currentUser && App.state.currentUser.uid === "guest";
        const promoBox = document.getElementById('guest-promo-box');
        if (isGuest) {
            promoBox.classList.remove('hidden');
        } else {
            promoBox.classList.add('hidden');
        }
        
        // Navigate to results
        App.navigate('results');
    }
};
