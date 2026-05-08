// Hybrid AI: Pollinations (free internet) + Offline fallback
const messagesDiv = document.getElementById('messages');
const welcomeDiv = document.querySelector('.welcome-message');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Offline knowledge base
const offlineAnswers = {
    "hello": "Hi! I’m your AI tutor. I can solve equations, explain science, and help with coding.",
    "hi": "Hello! How can I help?",
    "math": "I solve linear equations like 2x+3=7 → x=2. Try me!",
    "equation": "Example: 3x - 2 = 10 → x = 4",
    "pythagorean": "a² + b² = c². For 3,4,5 triangle: 9+16=25.",
    "gravity": "9.8 m/s² on Earth.",
    "photosynthesis": "Plants convert CO₂ + water → glucose + oxygen using sunlight.",
    "coding": "I explain if-else, loops, functions. Ask specifics.",
    "python": "Python is a language. Need syntax help?",
    "javascript": "JS runs in browsers. Use console.log() to print.",
    "solve": "Give me an equation like '2x+3=7' and I'll solve it."
};

function solveEquation(question) {
    const eqMatch = question.match(/([\d\.]+)?x?\s*([\+\-]\s*[\d\.]+)?\s*=\s*([\d\.]+)/i);
    if (eqMatch) {
        let a = parseFloat(eqMatch[1]) || 1;
        let b = parseFloat(eqMatch[2]?.replace(/\s/g, '')) || 0;
        let c = parseFloat(eqMatch[3]);
        let x = (c - b) / a;
        return `Solution: x = ${x}`;
    }
    return null;
}

function offlineReply(message) {
    let ans = solveEquation(message);
    if (ans) return ans;
    const lower = message.toLowerCase();
    for (let [key, value] of Object.entries(offlineAnswers)) {
        if (lower.includes(key)) return value;
    }
    return null;
}

userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    if (welcomeDiv) welcomeDiv.style.display = 'none';
    addMessage(message, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';
    sendBtn.disabled = true;
    const typingId = addTypingIndicator();

    try {
        // Try Pollinations (no API key, free)
        const response = await fetch('https://text.pollinations.ai/' + encodeURIComponent(message) + '?model=gpt-4o-mini');
        let reply = await response.text();
        
        // If response contains the deprecation warning or is too short, fallback to offline
        if (reply.includes("IMPORTANT NOTICE") || reply.includes("legacy text API") || reply.length < 20) {
            throw new Error("Pollinations warning, using offline fallback");
        }
        
        removeTypingIndicator(typingId);
        addMessage(reply, 'bot');
    } catch (err) {
        // Fallback to offline AI
        let fallbackReply = offlineReply(message);
        if (!fallbackReply) {
            fallbackReply = "I'm offline right now. I can solve equations like `2x+5=15` or answer basic science/coding questions. Try rephrasing!";
        }
        removeTypingIndicator(typingId);
        addMessage(fallbackReply + " (offline mode)", 'bot');
    }
    sendBtn.disabled = false;
    scrollToBottom();
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerHTML = `<div class="message-avatar">${sender === 'user' ? '👤' : '🤖'}</div><div class="message-content">${escapeHtml(text)}</div>`;
    messagesDiv.appendChild(div);
    scrollToBottom();
}

function addTypingIndicator() {
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'message bot';
    div.innerHTML = '<div class="message-avatar">🤖</div><div class="message-content"><span class="typing">●●●</span></div>';
    messagesDiv.appendChild(div);
    scrollToBottom();
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function scrollToBottom() {
    const container = document.querySelector('.chat-container');
    if (container) container.scrollTop = container.scrollHeight;
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Add typing animation style
const style = document.createElement('style');
style.textContent = `.typing { display: inline-block; animation: pulse 1.5s infinite; letter-spacing: 4px; font-size: 20px; } @keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }`;
document.head.appendChild(style);
