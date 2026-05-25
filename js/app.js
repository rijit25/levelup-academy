// Core application logic and routing

const App = {
    state: {
        currentUser: null,
        userData: {
            xp: 0,
            coins: 0,
            streak: 0,
            level: 1
        }
    },

    init() {
        console.log("🚀 LevelUp Academy Initializing...");

        // Load persisted user if any
        const savedUser = localStorage.getItem('levelup_user');
        if (savedUser) {
            try {
                this.state.currentUser = JSON.parse(savedUser);
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
        
        // Setup Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget.getAttribute('data-target');
                this.navigate(target);
            });
        });

        // Register Service Worker for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
            .then(() => console.log("Service Worker Registered"))
            .catch(err => console.log("Service Worker Failed", err));
        }

        // Setup Profile Button
        document.getElementById('profile-btn').addEventListener('click', () => {
            if (this.state.currentUser && this.state.currentUser.uid === "guest") {
                this.showToast("Crée un compte pour sauvegarder en ligne !", "warning");
                this.navigate('auth');
                if (window.AuthView && typeof window.AuthView.showRegisterForm === 'function') {
                    window.AuthView.showRegisterForm();
                }
            } else if (this.state.currentUser) {
                // Go to settings
                document.getElementById('settings-email').textContent = `Connecté en tant que : ${this.state.currentUser.email}`;
                this.navigate('settings');
            }
        });

        // Initialize modules
        if (window.Gamification) Gamification.init();
        if (window.MathArena) MathArena.init();
        if (window.LanguageAcademy) LanguageAcademy.init();
        if (window.GrammarAcademy) GrammarAcademy.init();
        if (window.ScienceAcademy) ScienceAcademy.init();
        if (window.ColoringZone) ColoringZone.init();

        // Check auth status
        setTimeout(() => {
            if (!this.state.currentUser) {
                this.navigate('auth');
            } else {
                this.navigate('dashboard');
                this.updateTopBar();
            }
        }, 500);
    },

    navigate(viewId) {
        // If a session is active and user navigates away, end it
        if (window.SessionManager && window.SessionManager.isActive && viewId !== 'results') {
            SessionManager.endSession();
        }

        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(`view-${viewId}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.getAttribute('data-target') === viewId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (viewId === 'auth') {
            document.getElementById('top-bar').classList.add('hidden');
            document.getElementById('bottom-nav').classList.add('hidden');
        } else {
            document.getElementById('top-bar').classList.remove('hidden');
            document.getElementById('bottom-nav').classList.remove('hidden');
        }

        this.triggerViewLogic(viewId);
    },

    triggerViewLogic(viewId) {
        switch(viewId) {
            case 'dashboard':
                if (window.DashboardView) DashboardView.render();
                break;
            case 'math':
                if (window.MathArena) MathArena.reset();
                break;
            case 'french':
                document.getElementById('lang-fr-start').classList.remove('hidden');
                document.getElementById('lang-fr-game').classList.add('hidden');
                document.getElementById('lang-fr-grammar').classList.add('hidden');
                break;
            case 'english':
                document.getElementById('lang-en-start').classList.remove('hidden');
                document.getElementById('lang-en-game').classList.add('hidden');
                document.getElementById('lang-en-grammar').classList.add('hidden');
                break;
            case 'science':
                if (window.ScienceAcademy) ScienceAcademy.reset();
                break;
            case 'coloring':
                if (window.ColoringZone) {
                    App.showToast("Détends-toi dans la Zone Zen ! 🎨", "success");
                }
                break;
            case 'leaderboard':
                document.getElementById('lb-your-xp').textContent = this.state.userData.xp;
                break;
        }
    },

    updateTopBar() {
        if (!this.state.userData) return;
        document.getElementById('streak-count').textContent = this.state.userData.streak || 0;
        document.getElementById('coin-count').textContent = this.state.userData.coins || 0;
        document.getElementById('xp-count').textContent = this.state.userData.xp || 0;
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    logout() {
        this.state.currentUser = null;
        localStorage.removeItem('levelup_user');
        Gamification.saveLocalState();
        this.showToast("Déconnecté avec succès", "info");
        this.navigate('auth');
    },

    resetProgress() {
        if(confirm("Es-tu sûr de vouloir effacer TOUTE ta progression ?")) {
            localStorage.removeItem('levelup_progress');
            localStorage.removeItem('levelup_user');
            this.state.currentUser = null;
            Gamification.loadLocalState(); // will reset to 0
            this.updateTopBar();
            this.showToast("Progression réinitialisée.", "warning");
            this.navigate('auth');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
