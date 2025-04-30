document.addEventListener('DOMContentLoaded', function() {
    const gameArea = document.getElementById('game-area');
    const progressDisplay = document.getElementById('progress');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const levelDisplay = document.getElementById('level');
    const restartBtn = document.getElementById('restart-btn');
    

    let level = 1;
    let score = 0;
    let timeLeft = 60;
    let gameInterval;
    let dirtCount = 10;
    let cleanedCount = 0;
    let specialDirtActive = false;
    let gameActive = false;
    

    const dirtTypes = [
        { className: 'dirt', points: 10, speed: 0, spawnChance: 0.7 },
        { className: 'dirt moving-dirt', points: 20, speed: 2, spawnChance: 0.2 },
        { className: 'dirt special-dirt', points: 50, speed: 0, spawnChance: 0.1 }
    ];
    
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
    
    function createDirtSpots() {
        gameArea.innerHTML = '';
        cleanedCount = 0;
        
        dirtCount = 10 + (level * 2);
        
        for (let i = 0; i < dirtCount; i++) {
            createDirt();
        }
        
        updateDisplays();
    }
    
    function createDirt() {
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
        
        const maxX = gameArea.offsetWidth - 40;
        const maxY = gameArea.offsetHeight - 40;
        
        let posX = Math.random() * maxX;
        let posY = Math.random() * maxY;
        
        dirt.style.left = posX + 'px';
        dirt.style.top = posY + 'px';
        
        dirt.addEventListener('click', function() {
            if (gameActive) cleanDirt(dirt, selectedDirt.points);
        });
        
        gameArea.appendChild(dirt);
        
        if (selectedDirt.speed > 0) {
            moveDirt(dirt, selectedDirt.speed, posX, posY, maxX, maxY);
        }
        
        if (dirt.classList.contains('special-dirt')) {
            specialDirtActive = true;
            blinkDirt(dirt);
        }
    }
    
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
            
            if (x <= 0 || x >= maxX) xDirection *= -1;
            if (y <= 0 || y >= maxY) yDirection *= -1;
            
            dirt.style.left = x + 'px';
            dirt.style.top = y + 'px';
        }, 30);
    }
    
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
        
        setTimeout(() => {
            if (dirt.parentNode && !dirt.classList.contains('cleaned')) {
                dirt.remove();
                specialDirtActive = false;
            }
        }, 5000);
    }
    
    function cleanDirt(dirt, points) {
        if (dirt.classList.contains('cleaned')) return;
        
        dirt.classList.add('cleaned');
        dirt.style.transform = 'scale(1.5)';
        dirt.style.opacity = '0';
        
        createParticles(dirt);
        
        setTimeout(() => {
            if (dirt.parentNode) {
                dirt.remove();
                cleanedCount++;
                score += points;
                
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
    
    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
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
    
    function updateDisplays() {
        const percentage = Math.round((cleanedCount / dirtCount) * 100);
        progressDisplay.textContent = `Progress: ${percentage}%`;
        scoreDisplay.textContent = `Score: ${score}`;
        timeDisplay.textContent = `Time: ${timeLeft}s`;
        levelDisplay.textContent = `Level: ${level}`;
    }
    
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
    
    function nextLevel() {
        level++;
        timeLeft = 60 - (level * 2); 
        if (timeLeft < 10) timeLeft = 10; 
        cleanedCount = 0;
        createDirtSpots();
    }
    

    function endGame() {
        gameActive = false;
        clearInterval(gameInterval);
        alert(`Game Over! Final Score: ${score} (Level ${level})`);
    }
    

    restartBtn.addEventListener('click', initGame);
    

    initGame();
});