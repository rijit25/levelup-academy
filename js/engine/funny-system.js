window.FunnySystem = {
    messages: {
        timeout: [
            "Oups 😂 le cerveau était en pause café.",
            "Le temps s'est écoulé ! La calculatrice a fui 🏃‍♂️💨",
            "Trop lent ! Même une tortue aurait calculé plus vite 🐢",
            "Game Over! On se réveille la team ! ☕"
        ],
        wrong_math: [
            "Aïe ! Newton pleure dans sa tombe 😭",
            "Presque ! (Non, pas du tout en fait 😂)",
            "C'est créatif... mais c'est faux ❌",
            "La réponse a glissé ? 🍌",
            "Mission ratée... mais le boss tremble encore 👾"
        ],
        wrong_vocab: [
            "Molière vient de faire une crise cardiaque 🥖",
            "Shakespeare is crying right now 🎭",
            "Google Translate n'aurait pas fait pire 🤖",
            "C'est pas grave, on apprend de ses erreurs... enfin j'espère 😅"
        ],
        streak: [
            "Incroyable ! Ton cerveau fume 🔥",
            "Combo x{count} ! Tu es un génie caché ? 🧠",
            "On ne t'arrête plus ! 🚀"
        ]
    },

    getRandomMessage(category, replacements = {}) {
        const list = this.messages[category];
        if (!list || list.length === 0) return "Oups !";
        
        const randomIndex = Math.floor(Math.random() * list.length);
        let msg = list[randomIndex];

        for (const [key, value] of Object.entries(replacements)) {
            msg = msg.replace(`{${key}}`, value);
        }

        return msg;
    }
};
