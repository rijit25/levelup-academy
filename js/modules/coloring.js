window.ColoringZone = {
    selectedColor: '#ff0000',

    init() {
        const colors = ['#ff0000', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0', '#e91e63', '#ffffff', '#000000', '#795548'];
        const palette = document.getElementById('color-palette');
        
        if(palette) {
            colors.forEach(color => {
                const btn = document.createElement('div');
                btn.className = 'color-swatch';
                btn.style.backgroundColor = color;
                if(color === this.selectedColor) btn.classList.add('selected');
                
                btn.onclick = () => {
                    document.querySelectorAll('.color-swatch').forEach(el => el.classList.remove('selected'));
                    btn.classList.add('selected');
                    this.selectedColor = color;
                };
                
                palette.appendChild(btn);
            });
        }

        // Add event listeners to all SVG paths inside the coloring SVG
        const paths = document.querySelectorAll('#zen-svg path, #zen-svg polygon, #zen-svg circle');
        paths.forEach(path => {
            path.addEventListener('click', (e) => {
                e.target.setAttribute('fill', this.selectedColor);
            });
            // Initial style
            path.setAttribute('fill', '#f5f5f5');
            path.setAttribute('stroke', '#333');
            path.setAttribute('stroke-width', '2');
            path.style.cursor = 'pointer';
        });
    },

    start() {
        App.navigate('coloring');
        App.showToast("Détends-toi dans la Zone Zen ! 🎨", "success");
    }
};
