document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('game-container');
    const progressDisplay = document.getElementById('progress');
    const restartBtn = document.getElementById('restart-btn');
    
    const dirtCount = 10;
    let cleanedCount = 0;
    
    // Create dirt spots
    function createDirtSpots() {
        // Clear existing dirt
        gameContainer.innerHTML = '';
        cleanedCount = 0;
        updateProgress();
        
        // Create new dirt spots
        for (let i = 0; i < dirtCount; i++) {
            const dirt = document.createElement('div');
            dirt.className = 'dirt';
            
            // Random position within container (accounting for dirt size)
            const maxX = gameContainer.offsetWidth - 40;
            const maxY = gameContainer.offsetHeight - 40;
            
            dirt.style.left = Math.random() * maxX + 'px';
            dirt.style.top = Math.random() * maxY + 'px';
            
            // Add click event to clean the dirt
            dirt.addEventListener('click', function() {
                cleanDirt(dirt);
            });
            
            gameContainer.appendChild(dirt);
        }
    }
    
    // Clean a dirt spot
    function cleanDirt(dirt) {
        dirt.style.transform = 'scale(0)';
        dirt.style.opacity = '0';
        
        // Remove after animation
        setTimeout(() => {
            dirt.remove();
            cleanedCount++;
            updateProgress();
            
            // Check if all dirt is cleaned
            if (cleanedCount === dirtCount) {
                setTimeout(() => {
                    alert('Congratulations! You cleaned everything!');
                }, 300);
            }
        }, 300);
    }
    
    // Update progress display
    function updateProgress() {
        const percentage = Math.round((cleanedCount / dirtCount) * 100);
        progressDisplay.textContent = `Progress: ${percentage}%`;
    }
    
    // Restart game
    restartBtn.addEventListener('click', createDirtSpots);
    
    // Initialize game
    createDirtSpots();
});