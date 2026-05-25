window.AuthView = {
    init() {
        const choiceContainer = document.getElementById('auth-choice-container');
        const formContainer = document.getElementById('auth-form-container');
        
        const btnRegisterChoice = document.getElementById('auth-btn-register');
        const btnLoginChoice = document.getElementById('auth-toggle-login-btn');
        const btnGuest = document.getElementById('auth-guest-btn');
        
        const btnSubmit = document.getElementById('auth-submit-btn');
        const btnBack = document.getElementById('auth-back-btn');
        
        const title = document.getElementById('auth-title');
        
        let isLogin = false;

        this.showRegisterForm = () => {
            isLogin = false;
            title.textContent = "Créer un compte";
            btnSubmit.textContent = "CRÉER MON HÉROS";
            choiceContainer.classList.add('hidden');
            formContainer.classList.remove('hidden');
            document.getElementById('auth-email').focus();
        };

        // Show Register Form
        btnRegisterChoice.addEventListener('click', this.showRegisterForm);

        // Show Login Form
        btnLoginChoice.addEventListener('click', () => {
            isLogin = true;
            title.textContent = "Te revoilà !";
            btnSubmit.textContent = "SE CONNECTER";
            choiceContainer.classList.add('hidden');
            formContainer.classList.remove('hidden');
        });

        // Back to Choices
        btnBack.addEventListener('click', () => {
            formContainer.classList.add('hidden');
            choiceContainer.classList.remove('hidden');
        });

        // Submit Form
        btnSubmit.addEventListener('click', () => {
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;

            if (!email || !password) {
                App.showToast("Remplis tous les champs, héros !", "error");
                return;
            }

            // Mock Auth for now (Firebase integration point)
            App.state.currentUser = { uid: "user_123", email: email };
            localStorage.setItem('levelup_user', JSON.stringify(App.state.currentUser));
            Gamification.loadLocalState();
            
            App.navigate('dashboard');
            App.updateTopBar();
            App.showToast(`Bienvenue ${email.split('@')[0]} ! Ton aventure en ligne commence.`, "success");
        });

        // Guest Mode
        btnGuest.addEventListener('click', () => {
            App.state.currentUser = { uid: "guest", email: "Invité" };
            localStorage.setItem('levelup_user', JSON.stringify(App.state.currentUser));
            Gamification.loadLocalState();
            App.navigate('dashboard');
            App.updateTopBar();
            App.showToast("Mode Invité : Ta progression reste sur cet appareil.", "info");
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AuthView.init();
});
