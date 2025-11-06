// ==================== VISUAL EFFECTS ====================

/**
 * Create explosion effect on click
 * @param {Object} e - Event object with clientX/clientY
 * @param {number} [particleCountOverride=1] - Number of particles to spawn
 */
function createExplosion(e, particleCountOverride = 1) {
    const particleCount = Math.max(1, particleCountOverride);
    const textDisplay = document.getElementById('textDisplay');
    
    // Bounce effect
    textDisplay.style.transform = 'scale(0.95)';
    setTimeout(() => {
        textDisplay.style.transform = 'scale(1)';
    }, 100);
    
    // Get click position
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);
    
    // Create Bahlil image particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Create image particle
        const img = document.createElement('img');
        img.src = 'bahlil.jpeg';
        img.style.width = Math.random() * 40 + 60 + 'px';
        img.style.height = 'auto';
        img.style.borderRadius = '10px';
        img.style.border = '2px solid #ff6b35';
        img.style.boxShadow = '0 0 10px rgba(255, 107, 53, 0.8)';
        particle.appendChild(img);
        
        particle.style.left = clientX + 'px';
        particle.style.top = clientY + 'px';
        
        document.body.appendChild(particle);
        
        // Calculate trajectory
        const angle = particleCount === 1 ? Math.random() * Math.PI * 2 : (Math.PI * 2 * i) / particleCount;
        const velocityBase = particleCount === 1 ? 180 : 300;
        const velocity = Math.random() * velocityBase + velocityBase;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = clientX;
        let posY = clientY;
        let opacity = 1;
        let rotation = 0;
        
        // Animate particle
        const animate = () => {
            posX += vx * 0.016;
            posY += vy * 0.016 + 200 * 0.016; // Gravity
            opacity -= 0.015;
            rotation += 5;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            particle.style.transform = `rotate(${rotation}deg)`;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

/**
 * Create massive explosion for high combos (Bahlil rain!)
 */
function createMassiveExplosion() {
    for (let i = 0; i < 200; i++) {
        setTimeout(() => {
            createExplosion({
                clientX: Math.random() * window.innerWidth,
                clientY: Math.random() * window.innerHeight
            }, 20);
        }, i * 10);
    }
}

/**
 * Create confetti effect
 */
function createConfetti() {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            document.body.appendChild(confetti);
            
            let posY = -10;
            let posX = parseFloat(confetti.style.left);
            let rotation = 0;
            const fallSpeed = Math.random() * 3 + 2;
            const sway = Math.random() * 2 - 1;
            
            const fall = () => {
                posY += fallSpeed;
                posX += sway;
                rotation += 5;
                
                confetti.style.top = posY + 'px';
                confetti.style.left = posX + 'px';
                confetti.style.transform = `rotate(${rotation}deg)`;
                
                if (posY < window.innerHeight) {
                    requestAnimationFrame(fall);
                } else {
                    confetti.remove();
                }
            };
            
            requestAnimationFrame(fall);
        }, i * 20);
    }
}

/**
 * Create fire confetti with emojis
 */
function createFireConfetti() {
    const fireEmojis = ['🔥', '💸', '💰', '🤑'];
    const confettiCount = 80;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.textContent = fireEmojis[Math.floor(Math.random() * fireEmojis.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-30px';
            
            document.body.appendChild(confetti);
            
            let posY = -30;
            let posX = parseFloat(confetti.style.left);
            let rotation = 0;
            const fallSpeed = Math.random() * 4 + 2;
            const sway = Math.random() * 3 - 1.5;
            
            const fall = () => {
                posY += fallSpeed;
                posX += sway;
                rotation += 8;
                
                confetti.style.top = posY + 'px';
                confetti.style.left = posX + 'px';
                confetti.style.transform = `rotate(${rotation}deg)`;
                
                if (posY < window.innerHeight) {
                    requestAnimationFrame(fall);
                } else {
                    confetti.remove();
                }
            };
            
            requestAnimationFrame(fall);
        }, i * 15);
    }
}

/**
 * Create floating background flames
 */
function createBackgroundFlames() {
    setInterval(() => {
        const flame = document.createElement('div');
        flame.className = 'flame-particle';
        flame.textContent = '🔥';
        flame.style.fontSize = Math.random() * 20 + 10 + 'px';
        flame.style.left = Math.random() * window.innerWidth + 'px';
        flame.style.bottom = '-30px';
        
        document.body.appendChild(flame);
        
        let posY = -30;
        let opacity = 0.6;
        const riseSpeed = Math.random() * 2 + 1;
        
        const rise = () => {
            posY += riseSpeed;
            opacity -= 0.01;
            
            flame.style.bottom = posY + 'px';
            flame.style.opacity = opacity;
            
            if (opacity > 0 && posY < window.innerHeight) {
                requestAnimationFrame(rise);
            } else {
                flame.remove();
            }
        };
        
        requestAnimationFrame(rise);
    }, 500);
}

// Start background flames immediately
createBackgroundFlames();

// ==================== FLASHBANG EFFECT ====================
let flashbangOverlay = null;
let flashbangCleanup = null;

/**
 * Start intense screen flashing overlay
 */
function startFlashbangEffect() {
    if (!flashbangOverlay) {
        flashbangOverlay = document.createElement('div');
        flashbangOverlay.className = 'flashbang-overlay';
        document.body.appendChild(flashbangOverlay);
    }

    flashbangOverlay.classList.add('show');

    if (flashbangCleanup) {
        clearTimeout(flashbangCleanup);
        flashbangCleanup = null;
    }
}

/**
 * Stop the flashing overlay and clean up
 */
function stopFlashbangEffect() {
    if (!flashbangOverlay) return;

    flashbangOverlay.classList.remove('show');

    if (flashbangCleanup) {
        clearTimeout(flashbangCleanup);
    }

    flashbangCleanup = setTimeout(() => {
        if (flashbangOverlay && !flashbangOverlay.classList.contains('show')) {
            flashbangOverlay.remove();
            flashbangOverlay = null;
        }
    }, 200);
}

// ==================== TEXT RAIN & EARTHQUAKE ====================
const sarcasmRainPhrases = [
    'masih betah ya?',
    'keluar sana napa',
    'buat apa sih',
    'ini serius? wkwk',
    'udah 1 menit bro',
    'pulang gih',
    'masih nunggu hadiah?',
    'ketahuan gabut',
    'gue liatin nih',
    'legend wasting time'
];

let sarcasmRainInterval = null;
let matrixRainInterval = null;
let rainTimeoutHandle = null;

function spawnSarcasmDrop() {
    const drop = document.createElement('div');
    drop.className = 'text-rain-item sarcasm';
    drop.textContent = sarcasmRainPhrases[Math.floor(Math.random() * sarcasmRainPhrases.length)];
    drop.style.left = Math.random() * 100 + 'vw';
    drop.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
    document.body.appendChild(drop);
    drop.addEventListener('animationend', () => drop.remove());
}

function spawnMatrixDrop() {
    const drop = document.createElement('div');
    drop.className = 'text-rain-item matrix';
    const length = Math.floor(Math.random() * 8) + 4;
    let text = '';
    const chars = '01<>#$';
    for (let i = 0; i < length; i++) {
        text += chars[Math.floor(Math.random() * chars.length)];
    }
    drop.textContent = text;
    drop.style.left = Math.random() * 100 + 'vw';
    drop.style.animationDuration = (Math.random() * 2 + 5) + 's';
    drop.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    document.body.appendChild(drop);
    drop.addEventListener('animationend', () => drop.remove());
}

function startSarcasmMatrixRain(duration = 8000) {
    if (rainTimeoutHandle) {
        clearTimeout(rainTimeoutHandle);
        rainTimeoutHandle = null;
    }

    if (!sarcasmRainInterval) {
        spawnSarcasmDrop();
        sarcasmRainInterval = setInterval(spawnSarcasmDrop, 420);
    }

    if (!matrixRainInterval) {
        spawnMatrixDrop();
        matrixRainInterval = setInterval(spawnMatrixDrop, 280);
    }

    rainTimeoutHandle = setTimeout(stopSarcasmMatrixRain, duration);
}

function stopSarcasmMatrixRain() {
    if (sarcasmRainInterval) {
        clearInterval(sarcasmRainInterval);
        sarcasmRainInterval = null;
    }
    if (matrixRainInterval) {
        clearInterval(matrixRainInterval);
        matrixRainInterval = null;
    }
    const leftovers = document.querySelectorAll('.text-rain-item');
    leftovers.forEach(node => {
        node.style.opacity = '0';
        setTimeout(() => node.remove(), 300);
    });
}

function triggerEarthquake(duration = 2000) {
    document.body.classList.add('earthquake');
    setTimeout(() => {
        document.body.classList.remove('earthquake');
    }, duration);
}
