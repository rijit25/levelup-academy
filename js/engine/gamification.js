window.Gamification = {
    init() {
        console.log("Gamification Engine initialized.");
    },

    addXP(amount) {
        if (!App.state.userData) return;
        App.state.userData.xp += amount;
        this.checkLevelUp();
        App.updateTopBar();
        App.showToast(`+${amount} XP!`, 'success');
        this.saveState();
    },

    addCoins(amount) {
        if (!App.state.userData) return;
        App.state.userData.coins += amount;
        App.updateTopBar();
        App.showToast(`+${amount} 💎`, 'info');
        this.saveState();
    },

    incrementStreak() {
        if (!App.state.userData) return;
        App.state.userData.streak += 1;
        App.updateTopBar();
        
        if (App.state.userData.streak % 5 === 0) {
            const msg = FunnySystem.getRandomMessage('streak', { count: App.state.userData.streak });
            App.showToast(msg, 'warning');
            this.addCoins(10); // Bonus for streak
        }
        this.saveState();
    },

    resetStreak() {
        if (!App.state.userData) return;
        App.state.userData.streak = 0;
        App.updateTopBar();
        this.saveState();
    },

    checkLevelUp() {
        // Simple formula: Next Level = Current Level * 100 XP
        const requiredXP = App.state.userData.level * 100;
        if (App.state.userData.xp >= requiredXP) {
            App.state.userData.level += 1;
            App.state.userData.xp -= requiredXP;
            App.showToast(`Level UP! Tu es niveau ${App.state.userData.level} 🎉`, 'success');
            // Play level up sound/animation
        }
    },

    saveState() {
        // If firebase is active, save to firestore
        if (window.FirebaseService && FirebaseService.isReady && App.state.currentUser) {
            FirebaseService.saveUserData(App.state.currentUser.uid, App.state.userData);
        } else {
            // Fallback to local storage for offline/testing
            try {
                localStorage.setItem('lu_userData', JSON.stringify(App.state.userData));
            } catch(e) { console.warn('LocalStorage blocked', e); }
        }
    },

    loadLocalState() {
        const saved = localStorage.getItem('lu_userData');
        if (saved) {
            try {
                App.state.userData = JSON.parse(saved);
                App.updateTopBar();
            } catch (e) {
                console.error("Error loading local state", e);
            }
        }
    }
};
