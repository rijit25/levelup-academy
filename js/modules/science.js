window.ScienceAcademy = {
    currentDifficulty: 'beginner',
    consecutiveCorrect: 0,
    currentQuestion: null,
    isWaitingForContinue: false,

    init() {
        // Initialization if needed
    },

    startSession() {
        this.currentDifficulty = 'beginner';
        this.consecutiveCorrect = 0;
        this.isWaitingForContinue = false;
        
        App.navigate('science');
        
        SessionManager.startSession('science');
        this.nextQuestion();
    },

    nextQuestion() {
        if (!SessionManager.isActive) return;
        
        this.isWaitingForContinue = false;
        document.getElementById('science-explanation-box').classList.add('hidden');
        document.getElementById('science-btn-continue').classList.add('hidden');

        const dataBank = window.scienceData;
        const questionsList = dataBank[this.currentDifficulty];
        
        const randIndex = Math.floor(Math.random() * questionsList.length);
        this.currentQuestion = questionsList[randIndex];
        
        document.getElementById('science-q').textContent = this.currentQuestion.question;
        
        const optionsContainer = document.getElementById('science-options');
        optionsContainer.innerHTML = '';
        
        const options = [...this.currentQuestion.options].sort(() => Math.random() - 0.5);
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-secondary';
            btn.textContent = opt;
            btn.onclick = (e) => this.checkAnswer(opt, btn);
            optionsContainer.appendChild(btn);
        });
        
        const diffBadge = document.getElementById('science-diff');
        diffBadge.textContent = this.currentDifficulty.toUpperCase();
        diffBadge.className = `diff-badge ${this.currentDifficulty}`;
        
        document.getElementById('science-streak-text').textContent = `${this.consecutiveCorrect}/5 vers le niveau suivant`;
    },

    checkAnswer(selected, btnElement) {
        if (!SessionManager.isActive || this.isWaitingForContinue) return;
        this.isWaitingForContinue = true;

        const isCorrect = selected === this.currentQuestion.answer;
        
        const buttons = document.getElementById('science-options').children;
        for (let btn of buttons) {
            btn.disabled = true;
            if (btn.textContent === this.currentQuestion.answer) {
                btn.className = 'btn btn-primary';
            } else if (btn === btnElement && !isCorrect) {
                btn.className = 'btn btn-danger';
            } else {
                btn.style.opacity = '0.5';
            }
        }

        if (isCorrect) {
            this.consecutiveCorrect++;
            let xp = this.currentDifficulty === 'expert' ? 30 : (this.currentDifficulty === 'intermediate' ? 20 : 10);
            
            Gamification.addXP(xp);
            Gamification.incrementStreak();
            SessionManager.recordAnswer(true, xp, this.currentDifficulty);
            
            if (this.consecutiveCorrect >= 5) {
                if (this.currentDifficulty === 'beginner') {
                    this.currentDifficulty = 'intermediate';
                    this.consecutiveCorrect = 0;
                    App.showToast("Niveau Intermédiaire débloqué !", "success");
                } else if (this.currentDifficulty === 'intermediate') {
                    this.currentDifficulty = 'expert';
                    this.consecutiveCorrect = 0;
                    App.showToast("Niveau EXPERT débloqué 🔥", "success");
                }
            }
            App.showToast("Bien joué ! 🎉", "success");
        } else {
            this.consecutiveCorrect = 0;
            Gamification.resetStreak();
            SessionManager.recordAnswer(false, 0, this.currentDifficulty);
            
            if (this.currentDifficulty === 'expert') {
                this.currentDifficulty = 'intermediate';
            } else if (this.currentDifficulty === 'intermediate') {
                this.currentDifficulty = 'beginner';
            }

            App.showToast("Oups ! Lis l'explication. 💡", "error");
            
            const gameArea = document.getElementById('view-science');
            gameArea.style.animation = 'shake 0.5s';
            setTimeout(() => gameArea.style.animation = '', 500);
        }

        this.showExplanation(isCorrect);
    },
    
    showExplanation(isCorrect) {
        const expBox = document.getElementById('science-explanation-box');
        const expTextFr = document.getElementById('science-exp-fr');
        const expTextAr = document.getElementById('science-exp-ar');
        const continueBtn = document.getElementById('science-btn-continue');
        
        if (isCorrect) {
            expBox.className = 'explanation-box success';
        } else {
            expBox.className = 'explanation-box error';
        }
        
        expTextFr.textContent = "🇫🇷 " + this.currentQuestion.expFr;
        expTextAr.textContent = "🇲🇦 " + this.currentQuestion.expAr;
        
        expBox.classList.remove('hidden');
        continueBtn.classList.remove('hidden');
        
        continueBtn.onclick = () => {
            if (SessionManager.isActive) {
                this.nextQuestion();
            } else {
                App.showToast("La session est terminée !", "info");
            }
        };
    }
};
