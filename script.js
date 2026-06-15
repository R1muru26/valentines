// ── Floating hearts ───────────────────────────────────────────
const bg = document.getElementById('heartsBg');
const heartEmojis = ['❤️','🩷','💕','💗','💖','💝','🌸','✨'];

function spawnHeart() {
    const el = document.createElement('span');
    el.className = 'heart-float';
    el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    const dur = 6 + Math.random() * 8;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = Math.random() * -dur + 's';
    el.style.fontSize = (0.8 + Math.random() * 1.0) + 'rem';
    bg.appendChild(el);
    setTimeout(() => el.remove(), (dur + 1) * 1000);
}

setInterval(spawnHeart, 700);
for (let i = 0; i < 10; i++) spawnHeart();

// ── Game logic ───────────────────────────────────────────────
const messages = [
    "Are you sure? 🥺",
    "Are you really sure? 😢",
    "Are you REALLY really sure? 💔",
    "Please don't break my heart 💔",
    "Why would you do this to me? 😭",
    "Come on, just say yes! 😭",
    "I'll be so sad if you keep clicking... 🥲",
    "You wouldn't hurt me like this, right? 🥺",
    "I'm giving you one more chance...",
    "Okay, this is getting ridiculous. 🙈",
    "Fine. I'll just cry then. 😭",
    "Are you seriously still clicking No?? 💀",
    "My heart is literally breaking rn 💔",
    "PLEASE 🥺🥺🥺",
    "I made this whole page for you...",
    "You know you want to say yes 😏",
    "Just. Click. Yes. 😤",
    "I'm not giving up btw 😤",
    "We can do this all day 🙃",
    "okay fine you win... jk SAY YES 😭"
];

let msgIdx = 0;
let clickCount = 0;
let yesClicked = false;
let yesFontSize = 1.1; // in rem
let yesPaddingVertical = 13; // in px
let yesPaddingHorizontal = 36; // in px

function showLove() {
    yesClicked = true;
    document.getElementById('message').innerText = "Yay!!! ❤️ You're the best!";
    document.getElementById('waitingGif').style.display = 'none';
    document.getElementById('sadGif').style.display = 'none';
    document.getElementById('happyGif').style.display = 'block';
    document.getElementById('noBtn').style.display = 'none';
    for (let i = 0; i < 10; i++) setTimeout(spawnHeart, i * 100);
    
    // Reset Yes button to normal size just in case it grew
    const yesButton = document.getElementById("yesBtn");
    yesButton.style.fontSize = "1.1rem";
    yesButton.style.padding = "13px 36px";
}

function moveNo() {
    if (yesClicked) return;

    clickCount++;
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');

    // Always move to body so it can go anywhere
    if (noBtn.parentElement !== document.body) document.body.appendChild(noBtn);
    noBtn.style.position = 'fixed';
    noBtn.style.zIndex   = '1000';
    noBtn.style.transition = 'none';

    // Phase 1 (clicks 1-3): normal teleport
    // Phase 2 (clicks 4-6): shrink the button
    // Phase 3 (clicks 7-9): also rotate + shrink more
    // Phase 4 (clicks 10-12): tiny and spinning
    // Phase 5 (13+): nearly invisible + micro

    if (clickCount >= 4 && clickCount < 7) {
        const s = Math.max(0.7, 1 - (clickCount - 3) * 0.1);
        noBtn.style.transform = `scale(${s})`;
        noBtn.style.opacity = '0.85';
    } else if (clickCount >= 7 && clickCount < 10) {
        const s = Math.max(0.45, 0.7 - (clickCount - 6) * 0.1);
        noBtn.style.transform = `scale(${s}) rotate(${Math.random()*30 - 15}deg)`;
        noBtn.style.opacity = '0.7';
    } else if (clickCount >= 10 && clickCount < 13) {
        const s = Math.max(0.3, 0.45 - (clickCount - 9) * 0.07);
        noBtn.style.transform = `scale(${s}) rotate(${Math.random()*60 - 30}deg)`;
        noBtn.style.opacity = '0.5';
    } else if (clickCount >= 13) {
        noBtn.style.transform = `scale(0.22) rotate(${Math.random()*90 - 45}deg)`;
        noBtn.style.opacity = '0.25';
        noBtn.style.filter = 'blur(1.5px)';
    }

    // Move to random position — faster escape at higher click counts
    const margin = 20;
    const maxX = window.innerWidth  - noBtn.offsetWidth  - margin;
    const maxY = window.innerHeight - noBtn.offsetHeight - margin;

    // After click 5, also dodge the cursor if we can track it
    let newX = Math.max(margin, Math.floor(Math.random() * maxX));
    let newY = Math.max(margin, Math.floor(Math.random() * maxY));

    // Keep it away from where it currently is
    if (clickCount > 3) {
        const cx = parseInt(noBtn.style.left) || window.innerWidth / 2;
        const cy = parseInt(noBtn.style.top)  || window.innerHeight / 2;
        // Retry once if too close
        if (Math.abs(newX - cx) < 150 && Math.abs(newY - cy) < 150) {
            newX = Math.max(margin, Math.floor(Math.random() * maxX));
            newY = Math.max(margin, Math.floor(Math.random() * maxY));
        }
    }

    noBtn.style.left = newX + 'px';
    noBtn.style.top  = newY + 'px';

    // Update message
    document.getElementById('message').innerText = messages[msgIdx % messages.length];
    msgIdx++;

    // GIFs
    document.getElementById('waitingGif').style.display = 'none';
    document.getElementById('happyGif').style.display   = 'none';
    document.getElementById('sadGif').style.display     = 'block';
    
    // Add logic to make the YES button bigger!
    yesFontSize += 0.3;
    yesPaddingVertical += 3;
    yesPaddingHorizontal += 8;
    yesBtn.style.fontSize = `${yesFontSize}rem`;
    yesBtn.style.padding = `${yesPaddingVertical}px ${yesPaddingHorizontal}px`;
}

// Phase 5+: also dodge on mousemove
document.addEventListener('mousemove', (e) => {
    if (yesClicked || clickCount < 8) return;
    const noBtn = document.getElementById('noBtn');
    if (!noBtn || noBtn.style.display === 'none') return;

    const bx = parseInt(noBtn.style.left) + noBtn.offsetWidth  / 2;
    const by = parseInt(noBtn.style.top)  + noBtn.offsetHeight / 2;
    const dist = Math.hypot(e.clientX - bx, e.clientY - by);

    if (dist < 120) {
        const maxX = window.innerWidth  - noBtn.offsetWidth  - 20;
        const maxY = window.innerHeight - noBtn.offsetHeight - 20;
        noBtn.style.left = Math.max(10, Math.floor(Math.random() * maxX)) + 'px';
        noBtn.style.top  = Math.max(10, Math.floor(Math.random() * maxY)) + 'px';
    }
});
