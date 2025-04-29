document.addEventListener('DOMContentLoaded', function() {
    const gameArea = document.getElementById('game-area');
    const progressDisplay = document.getElementById('progress');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const levelDisplay = document.getElementById('level');
    const restartBtn = document.getElementById('restart-btn');
    
    // Game variables
    let level = 1;
    let score = 0;
    let timeLeft = 60;
    let gameInterval;
    let dirtCount = 10;
    let cleanedCount = 0;
    let specialDirtActive = false;
    let gameActive = false;
    
    // Dirt types with different properties
    const dirtTypes = [
        { className: 'dirt', points: 10, speed: 0, spawnChance: 0.7 },
        { className: 'dirt moving-dirt', points: 20, speed: 2, spawnChance: 0.2 },
        { className: 'dirt special-dirt', points: 50, speed: 0, spawnChance: 0.1 }
    ];
    
    // Initialize game
    function initGame() {
        level = 1;
        score = 0;
        timeLeft = 60;
        cleanedCount = 0;
        gameActive = true;
        
        updateDisplays();
        createDirtSpots();
        startTimer();
    }
    
    // Create dirt spots
    function createDirtSpots() {
        gameArea.innerHTML = '';
        cleanedCount = 0;
        
        // Calculate dirt count based on level
        dirtCount = 10 + (level * 2);
        
        for (let i = 0; i < dirtCount; i++) {
            createDirt();
        }
        
        updateDisplays();
    }
    
    // Create a single dirt spot
    function createDirt() {
        // Choose dirt type based on spawn chances
        const rand = Math.random();
        let cumulativeChance = 0;
        let selectedDirt;
        
        for (const dirt of dirtTypes) {
            cumulativeChance += dirt.spawnChance;
            if (rand <= cumulativeChance) {
                selectedDirt = dirt;
                break;
            }
        }
        
        const dirt = document.createElement('div');
        dirt.className = selectedDirt.className;
        
        // Random position within container
        const maxX = gameArea.offsetWidth - 40;
        const maxY = gameArea.offsetHeight - 40;
        
        let posX = Math.random() * maxX;
        let posY = Math.random() * maxY;
        
        dirt.style.left = posX + 'px';
        dirt.style.top = posY + 'px';
        
        // Add click event to clean the dirt
        dirt.addEventListener('click', function() {
            if (gameActive) cleanDirt(dirt, selectedDirt.points);
        });
        
        gameArea.appendChild(dirt);
        
        // If it's a moving dirt, make it move
        if (selectedDirt.speed > 0) {
            moveDirt(dirt, selectedDirt.speed, posX, posY, maxX, maxY);
        }
        
        // If it's special dirt, make it blink
        if (dirt.classList.contains('special-dirt')) {
            specialDirtActive = true;
            blinkDirt(dirt);
        }
    }
    
    // Make dirt move around
    function moveDirt(dirt, speed, startX, startY, maxX, maxY) {
        let x = startX;
        let y = startY;
        let xDirection = Math.random() > 0.5 ? 1 : -1;
        let yDirection = Math.random() > 0.5 ? 1 : -1;
        
        const moveInterval = setInterval(() => {
            if (!gameActive) {
                clearInterval(moveInterval);
                return;
            }
            
            x += speed * xDirection;
            y += speed * yDirection;
            
            // Bounce off walls
            if (x <= 0 || x >= maxX) xDirection *= -1;
            if (y <= 0 || y >= maxY) yDirection *= -1;
            
            dirt.style.left = x + 'px';
            dirt.style.top = y + 'px';
        }, 30);
    }
    
    // Make special dirt blink
    function blinkDirt(dirt) {
        let visible = true;
        const blinkInterval = setInterval(() => {
            if (!gameActive || !dirt.parentNode) {
                clearInterval(blinkInterval);
                return;
            }
            
            visible = !visible;
            dirt.style.opacity = visible ? '1' : '0';
        }, 500);
        
        // Special dirt disappears after 5 seconds
        setTimeout(() => {
            if (dirt.parentNode && !dirt.classList.contains('cleaned')) {
                dirt.remove();
                specialDirtActive = false;
            }
        }, 5000);
    }
    
    // Clean a dirt spot
    function cleanDirt(dirt, points) {
        if (dirt.classList.contains('cleaned')) return;
        
        dirt.classList.add('cleaned');
        dirt.style.transform = 'scale(1.5)';
        dirt.style.opacity = '0';
        
        // Add particles for effect
        createParticles(dirt);
        
        // Remove after animation
        setTimeout(() => {
            if (dirt.parentNode) {
                dirt.remove();
                cleanedCount++;
                score += points;
                
                // Bonus for cleaning all dirt quickly
                if (cleanedCount === dirtCount) {
                    const timeBonus = Math.floor(timeLeft * level);
                    score += timeBonus;
                    alert(`Perfect! Time bonus: +${timeBonus} points!`);
                    nextLevel();
                }
                
                updateDisplays();
            }
        }, 300);
    }
    
    // Create particles for visual effect
    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            // Random direction and speed
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            const xVel = Math.cos(angle) * speed;
            const yVel = Math.sin(angle) * speed;
            
            document.body.appendChild(particle);
            
            let posX = x;
            let posY = y;
            let opacity = 1;
            
            const animateParticle = () => {
                posX += xVel;
                posY += yVel;
                opacity -= 0.03;
                
                particle.style.left = posX + 'px';
                particle.style.top = posY + 'px';
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animateParticle);
        }
    }
    
    // Update all displays
    function updateDisplays() {
        const percentage = Math.round((cleanedCount / dirtCount) * 100);
        progressDisplay.textContent = `Progress: ${percentage}%`;
        scoreDisplay.textContent = `Score: ${score}`;
        timeDisplay.textContent = `Time: ${timeLeft}s`;
        levelDisplay.textContent = `Level: ${level}`;
    }
    
    // Start the game timer
    function startTimer() {
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            timeLeft--;
            updateDisplays();
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }
    
    // Move to next level
    function nextLevel() {
        level++;
        timeLeft = 60 - (level * 2); // Less time each level
        if (timeLeft < 10) timeLeft = 10; // Minimum 10 seconds
        cleanedCount = 0;
        createDirtSpots();
    }
    
    // End the game
    function endGame() {
        gameActive = false;
        clearInterval(gameInterval);
        alert(`Game Over! Final Score: ${score} (Level ${level})`);
    }
    
    // Restart game
    restartBtn.addEventListener('click', initGame);
    
    // Initialize game
    initGame();
});