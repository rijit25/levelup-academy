window.DashboardView = {
    render() {
        const username = App.state.currentUser?.email?.split('@')[0] || "Invité";
        document.getElementById('dash-username').textContent = username;
        
        const data = App.state.userData;
        if (data) {
            document.getElementById('dash-level').textContent = data.level;
            
            const requiredXP = data.level * 100;
            const progress = (data.xp / requiredXP) * 100;
            
            document.getElementById('dash-xp-bar').style.width = `${progress}%`;
            document.getElementById('dash-xp-text').textContent = data.xp;
        }
    }
};
