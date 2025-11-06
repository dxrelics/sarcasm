// ==================== MAIN LOGIC ====================

const phrases = [
    "oh wow, you actually scanned this?",
    "congrats, you found my secret message",
    "yes, this is literally just a website",
    "surprised? me too",
    "thanks for wasting your data on this",
    "plot twist: there's nothing here",
    "you expected something cool, didn't you?",
    "literally nothing special here",
    "this took 5 minutes to make btw",
    "still here? impressive dedication"
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 80;
const deletingSpeed = 40;
const pauseEnd = 2000;
const pauseStart = 500;

let achievementUnlocked = false;

const textElement = document.getElementById('text');
const preloader = document.getElementById('preloader');
const textContainer = document.getElementById('textDisplay');
let bounceTimeout;

/**
 * Quick bounce animation ketika frase selesai
 */
function triggerTextBounce() {
    if (!textContainer) return;
    textContainer.classList.remove('text-bounce');
    void textContainer.offsetWidth; // force reflow biar animasi restart
    textContainer.classList.add('text-bounce');
    
    clearTimeout(bounceTimeout);
    bounceTimeout = setTimeout(() => {
        textContainer.classList.remove('text-bounce');
    }, 600);
}

/**
 * Hide the troll preloader after load
 */
window.addEventListener('load', () => {
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hide');
        }
    }, 3000);
});

/**
 * Typing animation effect
 */
function type() {
    const currentPhrase = phrases[currentPhraseIndex];
    
    if (isDeleting) {
        textElement.innerHTML = currentPhrase.substring(0, currentCharIndex - 1) + '<span class="cursor">|</span>';
        currentCharIndex--;
        typingSpeed = deletingSpeed;
    } else {
        textElement.innerHTML = currentPhrase.substring(0, currentCharIndex + 1) + '<span class="cursor">|</span>';
        currentCharIndex++;
        typingSpeed = 80;
    }

    if (!isDeleting && currentCharIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = pauseEnd;
        triggerTextBounce();
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typingSpeed = pauseStart;
    }

    setTimeout(type, typingSpeed);
}

/**
 * Update visitor counter with in-memory storage
 */
function updateVisitorCount() {
    const visitorCountEl = document.getElementById('visitorCount');
    
    // Use localStorage (note: consider replacing with server-side storage)
    let count = Math.floor(Math.random() * 100) + 1;
    const stored = localStorage.getItem('visitorCount');
    if (stored) {
        count = parseInt(stored) + 1;
    }
    localStorage.setItem('visitorCount', count);
    
    const sarcasticMessages = [
        `visitor #${count} • why are you here again?`,
        `visitor #${count} • nothing changed btw`,
        `visitor #${count} • still just text bro`,
        `visitor #${count} • impressive dedication`,
        `visitor #${count} • you must be really bored`
    ];
    
    const randomMessage = sarcasticMessages[Math.floor(Math.random() * sarcasticMessages.length)];
    visitorCountEl.textContent = randomMessage;
}

/**
 * Show location toast with IP detection
 */
function showLocationToast() {
    const locationToast = document.getElementById('locationToast');
    
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const city = data.city || 'Unknown';
            const country = data.country_name || 'Unknown';
            
            const messages = [
                `📍 ${city}? what you doing here lol`,
                `yo ${city} squad checking in`,
                `${city} gang wasting time huh?`,
                `someone from ${city} actually scanned this`,
                `${city} represent! ...but why tho`
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            locationToast.innerHTML = `<strong>${randomMessage}</strong>`;
            locationToast.classList.add('show');
            
            setTimeout(() => {
                locationToast.classList.remove('show');
            }, 5000);
        })
        .catch(() => {
            locationToast.innerHTML = `<strong>📍 nice try hiding your location</strong>`;
            locationToast.classList.add('show');
            setTimeout(() => {
                locationToast.classList.remove('show');
            }, 3000);
        });
}

/**
 * Show achievement popup
 */
function showAchievement() {
    const achievementPopup = document.getElementById('achievementPopup');
    const dedicationText = document.getElementById('dedicationText');
    
    playSound('achievement');
    createConfetti();
    setTimeout(() => {
        achievementPopup.classList.add('show');
        dedicationText.style.display = 'block';
    }, 500);
}

/**
 * Close achievement popup
 */
function closeAchievement() {
    const achievementPopup = document.getElementById('achievementPopup');
    achievementPopup.classList.remove('show');
}

/**
 * Show shake/dana popup
 */
function showShakePopup() {
    const shakePopup = document.getElementById('shakePopup');
    shakePopup.classList.add('show');
    playSound('achievement');
}

/**
 * Close shake/dana popup
 */
function closePopup() {
    const shakePopup = document.getElementById('shakePopup');
    shakePopup.classList.remove('show');
}

// ==================== INITIALIZATION ====================

// Start typing animation
setTimeout(type, 1000);

// Update visitor count
updateVisitorCount();

// Show location toast after 3 seconds
setTimeout(showLocationToast, 3000);

// Achievement timer (30 seconds)
setTimeout(() => {
    if (!achievementUnlocked) {
        achievementUnlocked = true;
        showAchievement();
    }
}, 30000);

// DANA popup timer (60 seconds)
setTimeout(() => {
    startSarcasmMatrixRain(9000);
    triggerEarthquake(3000);
    setTimeout(() => {
        showShakePopup();
    }, 600);
}, 60000);
