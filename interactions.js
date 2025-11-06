// ==================== USER INTERACTIONS ====================

// Combo system variables
let comboCount = 0;
let lastClickTime = 0;
let comboTimeout;
const COMBO_WINDOW = 2000; // 2 seconds
const CHAOS_THRESHOLD = 15;

let comboChaosActive = false;
let vibrationInterval = null;

// Double tap detection
let lastTapTime = 0;
let tapCount = 0;
let isGlitching = false;

// Scroll variables
let lastScrollTime = 0;
let scrollCount = 0;
let scrollIntensity = 0;

// Swipe detection
let touchStartX = 0;
let touchStartY = 0;
let lastSwipeTime = 0;

const swipeMessages = [
    "can't swipe this bro",
    "nice try, still stuck here",
    "swipe won't help lol",
    "trying to escape? cute",
    "nope, you're trapped here"
];

const secretPhrases = [
    "okay fine, you found the secret",
    "double tapping? really?",
    "congrats, you're persistent",
    "this is the easter egg you wanted?",
    "not sure what you expected"
];

/**
 * Fire a burst of device vibration when supported
 */
function triggerVibrationBurst() {
    if (!('vibrate' in navigator)) return;
    try {
        navigator.vibrate([120, 35, 140, 35, 160]);
    } catch (err) {
        // ignore unsupported vibration calls
    }
}

/**
 * Start flashing screen + vibration chaos mode
 */
function startComboChaos() {
    if (comboChaosActive) {
        triggerVibrationBurst();
        return;
    }

    comboChaosActive = true;
    startFlashbangEffect();
    triggerVibrationBurst();

    if (!vibrationInterval && ('vibrate' in navigator)) {
        vibrationInterval = setInterval(triggerVibrationBurst, 400);
    }
}

/**
 * Stop chaos mode visuals and haptics
 */
function stopComboChaos() {
    if (!comboChaosActive) return;

    comboChaosActive = false;
    stopFlashbangEffect();

    if (vibrationInterval) {
        clearInterval(vibrationInterval);
        vibrationInterval = null;
    }

    if ('vibrate' in navigator) {
        try {
            navigator.vibrate(0);
        } catch (err) {
            // ignore unsupported vibration calls
        }
    }
}

/**
 * Update combo counter on rapid clicks
 */
function updateCombo() {
    const now = Date.now();
    
    if (now - lastClickTime < COMBO_WINDOW) {
        comboCount++;
        lastClickTime = now;
        
        if (comboCount >= 5) {
            showCombo();
            playSound('combo');
        }
        
        clearTimeout(comboTimeout);
        comboTimeout = setTimeout(() => {
            comboCount = 0;
            stopComboChaos();
        }, COMBO_WINDOW);
    } else {
        comboCount = 1;
        lastClickTime = now;
        
        comboTimeout = setTimeout(() => {
            comboCount = 0;
            stopComboChaos();
        }, COMBO_WINDOW);

        stopComboChaos();
    }

    if (comboCount >= CHAOS_THRESHOLD) {
        startComboChaos();
    } else if (comboChaosActive) {
        stopComboChaos();
    }
}

/**
 * Display combo counter
 */
function showCombo() {
    const comboCounter = document.getElementById('comboCounter');
    let comboHTML = '';
    
    if (comboCount >= 50) {
        // Show Bahlil image for 50+ combo
        comboHTML = `
            <img src="bahlil.jpeg" alt="BAHLIL MODE ACTIVATED" 
                 onerror="this.style.display='none'; this.parentElement.innerHTML='${comboCount} COMBO! 🔥<br><span style=\\'font-size: 1.5rem;\\'>INSANE!</span>';">
            <div style="margin-top: 20px; font-size: 2rem; text-shadow: 0 0 20px rgba(255, 107, 53, 0.8);">
                ${comboCount} COMBO! 🔥<br>
                <span style="font-size: 1.5rem;">AWAOWKAOWKAOAW</span>
            </div>
        `;
        createMassiveExplosion(); // Massive Bahlil rain!
    } else if (comboCount >= 20) {
        comboHTML = `${comboCount} COMBO!<br><span style="font-size: 1.5rem;">get a life bro</span>`;
    } else if (comboCount >= 10) {
        comboHTML = `${comboCount} COMBO!<br><span style="font-size: 1.5rem;">why tho?</span>`;
    } else {
        comboHTML = `${comboCount} COMBO!`;
    }
    
    comboCounter.innerHTML = comboHTML;
    comboCounter.classList.add('show');
    
    // Show longer for Bahlil image
    const displayTime = comboCount >= 50 ? 3000 : 1000;
    setTimeout(() => {
        comboCounter.classList.remove('show');
    }, displayTime);
}

/**
 * Handle click/tap events with combo tracking
 */
function handleClick(e) {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime;
    
    // Update combo
    updateCombo();
    
    if (timeSinceLastTap > 500) {
        tapCount = 1;
        createExplosion(e);
        playSound('click');
    } 
    else if (timeSinceLastTap < 500 && tapCount === 1) {
        tapCount = 0;
        if (!isGlitching) {
            triggerGlitch();
        }
    }
    
    lastTapTime = now;
}

/**
 * Trigger glitch effect and show secret message
 */
function triggerGlitch() {
    const textDisplay = document.getElementById('textDisplay');
    const textElement = document.getElementById('text');
    
    isGlitching = true;
    textDisplay.classList.add('glitch');
    const randomSecret = secretPhrases[Math.floor(Math.random() * secretPhrases.length)];
    textElement.innerHTML = randomSecret + '<span class="cursor">|</span>';
    playSound('error');
    
    setTimeout(() => {
        textDisplay.classList.remove('glitch');
        isGlitching = false;
    }, 2000);
}

/**
 * Show swipe message
 */
function showSwipeMessage() {
    const swipeMessage = document.getElementById('swipeMessage');
    const randomMessage = swipeMessages[Math.floor(Math.random() * swipeMessages.length)];
    swipeMessage.textContent = randomMessage;
    swipeMessage.classList.add('show');
    
    setTimeout(() => {
        swipeMessage.classList.remove('show');
    }, 2000);
}

/**
 * Handle scroll effects (hijacking)
 */
function handleScrollEffect(delta) {
    const now = Date.now();
    if (now - lastScrollTime < 100) return;
    lastScrollTime = now;

    scrollCount++;
    scrollIntensity += Math.abs(delta) * 0.001;

    const textDisplay = document.getElementById('textDisplay');

    const effects = [
        () => {
            const scale = 1 + (scrollIntensity * 0.1);
            textDisplay.style.transform = `scale(${Math.min(scale, 1.3)})`;
            setTimeout(() => {
                textDisplay.style.transform = 'scale(1)';
            }, 200);
        },
        () => {
            if (scrollCount % 3 === 0) {
                showSwipeMessage();
                const swipeMessage = document.getElementById('swipeMessage');
                swipeMessage.textContent = "scrolling won't help lol";
                playSound('error');
            }
        }
    ];

    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    randomEffect();

    setTimeout(() => {
        scrollIntensity *= 0.9;
    }, 500);
}

// ==================== EVENT LISTENERS ====================

// Click/Tap events
const textDisplay = document.getElementById('textDisplay');
textDisplay.addEventListener('click', handleClick);
textDisplay.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleClick(e.changedTouches[0]);
});

// Scroll hijacking
window.addEventListener('wheel', function(e) {
    e.preventDefault();
    handleScrollEffect(e.deltaY);
}, { passive: false });

// Touch swipe detection
document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Handle scroll
    if (Math.abs(diffY) > 30) {
        handleScrollEffect(diffY);
    }

    // Handle swipe
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        const now = Date.now();
        if (now - lastSwipeTime > 1500) {
            lastSwipeTime = now;
            showSwipeMessage();
            playSound('error');
        }
    }
}, { passive: true });

document.addEventListener('touchend', function() {
    touchStartX = 0;
    touchStartY = 0;
}, { passive: true });

// Back button trap
window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
    return '';
});

// Screenshot detection
document.addEventListener('visibilitychange', function() {
    const screenshotOverlay = document.getElementById('screenshotOverlay');
    if (document.hidden) {
        screenshotOverlay.classList.add('show');
        playSound('error');
        setTimeout(() => {
            screenshotOverlay.classList.remove('show');
        }, 2000);
    }
});

// Copy attempt detection
document.addEventListener('copy', function(e) {
    e.preventDefault();
    const screenshotOverlay = document.getElementById('screenshotOverlay');
    screenshotOverlay.querySelector('h2').textContent = '📋 nice try copying';
    screenshotOverlay.querySelector('p').textContent = 'clipboard hijacked lol';
    screenshotOverlay.classList.add('show');
    playSound('error');
    setTimeout(() => {
        screenshotOverlay.classList.remove('show');
        screenshotOverlay.querySelector('h2').textContent = '📸 nice try lol';
        screenshotOverlay.querySelector('p').textContent = 'screenshotting won\'t help bro';
    }, 2000);
});
