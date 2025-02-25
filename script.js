document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const welcomeScreen = document.getElementById('welcomeScreen');
    const startButton = document.getElementById('startButton');
    const card = document.getElementById('card');
    const cardImage = document.getElementById('cardImage');
    const shuffleButton = document.getElementById('shuffleButton');
    const cardCounter = document.getElementById('cardCounter');
    const cardSound = document.getElementById('cardSound');
    const soundControl = document.getElementById('soundControl');
    const soundIcon = document.getElementById('soundIcon');

    // Sound state
    let soundEnabled = true;
    
    // Sound control functionality
    soundControl.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        updateSoundIcon();
        
        // Test sound if enabled
        if (soundEnabled) {
            playCardSound();
        }
    });
    
    // Update sound icon based on state
    function updateSoundIcon() {
        if (soundEnabled) {
            soundIcon.innerHTML = `
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            `;
        } else {
            soundIcon.innerHTML = `
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
            `;
        }
    }
    
    // Play card sound
    function playCardSound() {
        if (soundEnabled) {
            // Reset the audio to the beginning
            cardSound.currentTime = 0;
            // Play the sound
            cardSound.play().catch(e => console.log("Audio play failed:", e));
        }
    }

    // Folders and image counts
    const folders = [
        { name: 'Image 1', count: 100 },
        { name: 'Image 2', count: 100 },
        { name: 'Image 3', count: 100 },
        { name: 'Image 4', count: 196 },
        { name: 'Image 5', count: 4 }
    ];
    
    // Calculate total cards
    const totalCards = folders.reduce((sum, folder) => sum + folder.count, 0);
    
    // Current state
    let currentFolder = 0; // Start with folder 'Image 1'
    let currentImage = 1; // Start with image '1.svg'
    let isFlipping = false;
    let cardsViewed = 0;
    let history = [];
    
    // Set initial card
    updateCardDisplay();
    
    // Update card counter
    function updateCardCounter() {
        cardCounter.textContent = `Kartu ${cardsViewed}/${totalCards}`;
    }
    
    // Update the card display
    function updateCardDisplay() {
        cardImage.src = `${folders[currentFolder].name}/${currentImage}.svg`;
        updateCardCounter();
    }
    
    // Get random card
    function getRandomCard() {
        // Save current card to history
        history.push({folder: currentFolder, image: currentImage});
        
        // Get new random card
        currentFolder = Math.floor(Math.random() * folders.length);
        const maxCount = folders[currentFolder].count;
        currentImage = Math.floor(Math.random() * maxCount) + 1;
        
        // Update viewed count (only count unique cards)
        const isNewCard = !history.some(card => 
            card.folder === currentFolder && card.image === currentImage
        );
        
        if (isNewCard) {
            cardsViewed++;
        }
        
        return `${folders[currentFolder].name}/${currentImage}.svg`;
    }
    
    // Create confetti effect
    function createConfetti() {
        const confettiCount = 50;
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#292F36'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.opacity = '1';
            document.body.appendChild(confetti);
            
            // Animate the confetti
            const animationDuration = Math.random() * 3 + 2;
            const animationDelay = Math.random() * 2;
            
            confetti.style.animation = `fall ${animationDuration}s linear ${animationDelay}s forwards`;
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, (animationDuration + animationDelay) * 1000);
        }
    }
    
    // Animation for confetti
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Welcome screen start button
    startButton.addEventListener('click', function() {
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transition = 'all 0.8s ease';
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            createConfetti();
            playCardSound(); // Play sound when game starts
        }, 800);
        
        // Update initial counter
        cardsViewed = 1; // Count the first card as viewed
        updateCardCounter();
    });
    
    // Shuffle button click event
    shuffleButton.addEventListener('click', function() {
        if (isFlipping) return;
        
        isFlipping = true;
        card.classList.add('flipped');
        playCardSound(); // Play sound when shuffling cards
        
        setTimeout(() => {
            // Change card while it's flipped
            cardImage.src = getRandomCard();
            updateCardCounter();
            
            // Wait and flip back
            setTimeout(() => {
                card.classList.remove('flipped');
                isFlipping = false;
            }, 400); // Half of the flip animation time
        }, 400); // Half of the flip animation time
    });
    
    // Allow clicking on card to flip it too
    card.addEventListener('click', function(event) {
        if (!isFlipping && !shuffleButton.contains(event.target)) {
            shuffleButton.click();
        }
    });
    
    // Make the page more interactive
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Subtle card movement based on mouse position
        if (!isFlipping) {
            card.style.transform = `rotateY(${mouseX * 5 - 2.5}deg) rotateX(${-mouseY * 5 + 2.5}deg)`;
        }
    });
    
    // Reset card position when mouse leaves
    document.addEventListener('mouseleave', function() {
        if (!isFlipping) {
            card.style.transform = 'rotateY(0deg) rotateX(0deg)';
        }
    });
    
    // Preload audio
    window.addEventListener('load', function() {
        cardSound.load();
    });
});
