window.LanguageAcademy = {
    currentLanguage: null,
    currentWord: null,
    options: [],
    
    init() {
        // Expose a method to start a language session
        window.startLanguageSession = (lang) => this.startSession(lang);
    },

    startSession(lang) {
        this.currentLanguage = lang;
        App.navigate(lang === 'fr' ? 'french' : 'english');
        
        // Hide start screen, show game
        document.getElementById(`lang-${lang}-start`).classList.add('hidden');
        document.getElementById(`lang-${lang}-game`).classList.remove('hidden');
        
        this.nextWord();
    },

    nextWord() {
        const wordsList = this.currentLanguage === 'fr' ? window.wordsFr : window.wordsEn;
        
        // Pick a random word
        const wordIndex = Math.floor(Math.random() * wordsList.length);
        this.currentWord = wordsList[wordIndex];
        
        // Update UI
        document.getElementById(`lang-${this.currentLanguage}-word`).textContent = this.currentWord.word;
        
        // Generate options (1 correct, 3 wrong)
        this.options = [this.currentWord.translation];
        while(this.options.length < 4) {
            const randomWrong = wordsList[Math.floor(Math.random() * wordsList.length)].translation;
            if (!this.options.includes(randomWrong)) {
                this.options.push(randomWrong);
            }
        }
        
        // Shuffle
        this.options.sort(() => Math.random() - 0.5);
        
        // Render buttons
        const optionsContainer = document.getElementById(`lang-${this.currentLanguage}-options`);
        optionsContainer.innerHTML = '';
        
        this.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-secondary';
            btn.textContent = opt;
            btn.onclick = () => this.checkAnswer(opt);
            optionsContainer.appendChild(btn);
        });
    },

    checkAnswer(selected) {
        if (selected === this.currentWord.translation) {
            Gamification.addXP(15);
            Gamification.incrementStreak();
            
            const gameArea = document.getElementById(`lang-${this.currentLanguage}-game`);
            gameArea.style.transform = 'scale(1.05)';
            setTimeout(() => gameArea.style.transform = 'scale(1)', 150);
            
            this.nextWord();
        } else {
            Gamification.resetStreak();
            App.showToast(FunnySystem.getRandomMessage('wrong_vocab'), 'error');
            
            const gameArea = document.getElementById(`lang-${this.currentLanguage}-game`);
            gameArea.style.animation = 'shake 0.5s';
            setTimeout(() => {
                gameArea.style.animation = '';
            }, 500);
        }
    }
};
