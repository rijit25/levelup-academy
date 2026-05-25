window.GrammarAcademy = {
    currentLanguage: null,
    currentDifficulty: 'beginner',
    consecutiveCorrect: 0,
    currentQuestion: null,
    isWaitingForContinue: false,

    init() {
        window.startGrammarSession = (lang) => this.startSession(lang);
    },

    startSession(lang) {
        this.currentLanguage = lang;
        this.currentDifficulty = 'beginner';
        this.consecutiveCorrect = 0;
        this.isWaitingForContinue = false;
        
        App.navigate(lang === 'fr' ? 'french' : 'english');
        
        document.getElementById(`lang-${lang}-start`).classList.add('hidden');
        document.getElementById(`lang-${lang}-game`).classList.add('hidden');
        document.getElementById(`lang-${lang}-grammar`).classList.remove('hidden');
        
        SessionManager.startSession('grammar');
        this.nextQuestion();
    },

    nextQuestion() {
        if (!SessionManager.isActive) return;
        
        this.isWaitingForContinue = false;
        document.getElementById(`lang-${this.currentLanguage}-explanation-box`).classList.add('hidden');
        document.getElementById(`lang-${this.currentLanguage}-btn-continue`).classList.add('hidden');

        const dataBank = this.currentLanguage === 'fr' ? window.grammarFr : window.grammarEn;
        const questionsList = dataBank[this.currentDifficulty];
        
        const randIndex = Math.floor(Math.random() * questionsList.length);
        this.currentQuestion = questionsList[randIndex];
        
        document.getElementById(`lang-${this.currentLanguage}-grammar-q`).textContent = this.currentQuestion.question;
        
        const optionsContainer = document.getElementById(`lang-${this.currentLanguage}-grammar-options`);
        optionsContainer.innerHTML = '';
        
        const options = [...this.currentQuestion.options].sort(() => Math.random() - 0.5);
        
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-secondary';
            btn.textContent = opt;
            btn.onclick = (e) => this.checkAnswer(opt, btn);
            optionsContainer.appendChild(btn);
        });
        
        const diffBadge = document.getElementById(`lang-${this.currentLanguage}-grammar-diff`);
        diffBadge.textContent = this.currentDifficulty.toUpperCase();
        diffBadge.className = `diff-badge ${this.currentDifficulty}`;
        
        // Progress text showing consecutive correct
        document.getElementById(`lang-${this.currentLanguage}-streak-text`).textContent = `${this.consecutiveCorrect}/5 vers le niveau suivant`;
    },

    checkAnswer(selected, btnElement) {
        if (!SessionManager.isActive || this.isWaitingForContinue) return;
        this.isWaitingForContinue = true;

        const isCorrect = selected === this.currentQuestion.answer;
        
        // Disable all buttons and highlight
        const buttons = document.getElementById(`lang-${this.currentLanguage}-grammar-options`).children;
        for (let btn of buttons) {
            btn.disabled = true;
            if (btn.textContent === this.currentQuestion.answer) {
                btn.className = 'btn btn-primary'; // Highlight correct
            } else if (btn === btnElement && !isCorrect) {
                btn.className = 'btn btn-danger'; // Highlight wrong selected
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
            
            // Progression logic (changed to 5)
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
            
            // Downgrade logic if struggling
            if (this.currentDifficulty === 'expert') {
                this.currentDifficulty = 'intermediate';
            } else if (this.currentDifficulty === 'intermediate') {
                this.currentDifficulty = 'beginner';
            }

            App.showToast("Oups ! Lis l'explication. 💡", "error");
            
            const gameArea = document.getElementById(`lang-${this.currentLanguage}-grammar`);
            gameArea.style.animation = 'shake 0.5s';
            setTimeout(() => gameArea.style.animation = '', 500);
        }

        // Show Explanation Box
        this.showExplanation(isCorrect);
    },
    
    showExplanation(isCorrect) {
        const expBox = document.getElementById(`lang-${this.currentLanguage}-explanation-box`);
        const expTextFr = document.getElementById(`lang-${this.currentLanguage}-exp-fr`);
        const expTextAr = document.getElementById(`lang-${this.currentLanguage}-exp-ar`);
        const continueBtn = document.getElementById(`lang-${this.currentLanguage}-btn-continue`);
        
        // Update box style based on correctness
        if (isCorrect) {
            expBox.className = 'explanation-box success';
        } else {
            expBox.className = 'explanation-box error';
        }
        
        expTextFr.textContent = "🇫🇷 " + this.currentQuestion.expFr;
        expTextAr.textContent = "🇲🇦 " + this.currentQuestion.expAr;
        
        expBox.classList.remove('hidden');
        continueBtn.classList.remove('hidden');
        
        // Setup continue button
        continueBtn.onclick = () => {
            if (SessionManager.isActive) {
                this.nextQuestion();
            } else {
                // If session ended while reading explanation
                App.showToast("La session est terminée !", "info");
            }
        };
    }
};
