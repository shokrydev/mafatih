// Arabic keyboard mapping
// Format: 'englishKey': 'arabicCharacter'
const arabicKeyMap = {
    // Top row
    'q': 'ض',
    'w': 'ص',
    'e': 'ث',
    'r': 'ق',
    't': 'ف',
    'y': 'غ',
    'u': 'ع',
    'i': 'ه',
    'o': 'خ',
    'p': 'ح',
    '[': 'ج',
    ']': 'د',

    // Middle row
    'a': 'ش',
    's': 'س',
    'd': 'ي',
    'f': 'ب',
    'g': 'ل',
    'h': 'ا',
    'j': 'ت',
    'k': 'ن',
    'l': 'م',
    ';': 'ك',
    "'": 'ط',

    // Bottom row
    'z': 'ئ',
    'x': 'ء',
    'c': 'ؤ',
    'v': 'ر',
    'b': 'لا',
    'n': 'ى',
    'm': 'ة',
    ',': 'و',
    '.': 'ز',
    '/': '؟',

    // Numbers
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
    '0': '٠',

    // Special keys
    ' ': ' ',
    'Enter': '\n',
    'Backspace': 'Backspace',
};

// DOM elements
const textOutput = document.getElementById('textOutput');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const keyInfo = document.getElementById('keyInfo');
const keyGrid = document.getElementById('keyGrid');

// Current text content
let currentText = '';

// Initialize the app
function init() {
    displayKeyMapping();
    setupEventListeners();
}

// Display all keyboard mappings
function displayKeyMapping() {
    keyGrid.innerHTML = '';

    for (const [key, arabic] of Object.entries(arabicKeyMap)) {
        // Skip Backspace for display (it's a function key)
        if (key === 'Backspace' || key === 'Enter') {
            continue;
        }

        const keyItem = document.createElement('div');
        keyItem.className = 'key-item';
        keyItem.innerHTML = `
            <span class="key-name">${key}</span>
            <span class="arabic-letter">${arabic}</span>
        `;
        keyGrid.appendChild(keyItem);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Keyboard input
    document.addEventListener('keydown', handleKeyPress);

    // Copy button
    copyBtn.addEventListener('click', copyToClipboard);

    // Clear button
    clearBtn.addEventListener('click', clearText);
}

// Handle key press
function handleKeyPress(event) {
    const key = event.key.toLowerCase();

    // Show current key info
    updateKeyInfo(key, event.key);

    // Handle special keys
    if (key === 'backspace') {
        event.preventDefault();
        if (currentText.length > 0) {
            currentText = currentText.slice(0, -1);
        }
    } else if (key === 'enter') {
        event.preventDefault();
        currentText += '\n';
    } else if (key === ' ') {
        event.preventDefault();
        currentText += ' ';
    } else if (arabicKeyMap[key]) {
        event.preventDefault();
        currentText += arabicKeyMap[key];
    }

    updateDisplay();
}

// Update the text display
function updateDisplay() {
    textOutput.value = currentText;
}

// Update key info display
function updateKeyInfo(key, displayKey) {
    const arabic = arabicKeyMap[key] || arabicKeyMap[displayKey] || 'Not mapped';
    const arabicDisplay = arabic === 'Backspace' ? '← Delete' : arabic === '\n' ? '↵ Enter' : arabic;
    keyInfo.textContent = `Pressed: "${displayKey}" → "${arabicDisplay}"`;
}

// Copy text to clipboard
function copyToClipboard() {
    if (currentText.length === 0) {
        alert('No text to copy!');
        return;
    }

    navigator.clipboard.writeText(currentText).then(() => {
        // Show feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        alert('Failed to copy text');
    });
}

// Clear all text
function clearText() {
    if (currentText.length === 0) {
        return;
    }

    if (confirm('Are you sure you want to clear all text?')) {
        currentText = '';
        updateDisplay();
        keyInfo.textContent = 'Text cleared. Start typing!';
    }
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', init);
