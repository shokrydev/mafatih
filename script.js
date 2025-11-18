// Arabic keyboard mapping
// Format: 'englishKey': 'arabicCharacter'
async function loadArabicKeyMap() {
  const response = await fetch('eng2ar.json');
  return await response.json(); // reassign with fetched data
}

const arabicAlphabetOrder2 = ['ء', 'آ', 'أ', 'ؤ', 'ا', 'ب', 'ة', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'لا', 'م', 'ن', 'ه', 'و', 'ي', 'ى', 'ئ', 'إ'];
const arabicKeyOrder = ["ء", "آ","ا","أ","إ","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ظ","ط","ع","غ","ف","ق","ك","ل","م","ن","ه","ة","و","ؤ","ي","ى","ئ","لا"]

// DOM elements
const textOutput = document.getElementById('textOutput');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const keyInfo = document.getElementById('keyInfo');
const keyGrid = document.getElementById('keyGrid');

// Current text content
let currentText = '';

// Display all keyboard mappings
function displayKeyMapping(arabicKeyMap) {
    keyGrid.innerHTML = '';

    for (const [engKey, arKey] of Object.entries(arabicKeyMap)) {
        // Skip Backspace and other function keys in keyboard display
        if (!arabicKeyOrder.includes(arKey)) {
            continue;
        }

        const keyItem = document.createElement('div');
        keyItem.className = 'key-item';
        keyItem.innerHTML = `
            <span class="ar-key">${arKey}</span>
            <span class="eng-key">${engKey}</span>
        `;
        keyGrid.appendChild(keyItem);
    }
}

// Setup event listeners
function setupEventListeners(arabicKeyMap) {
    // Keyboard input
    document.addEventListener('keydown', (event) => handleKeyPress(arabicKeyMap, event));

    // Copy button
    copyBtn.addEventListener('click', (event) => copyToClipboard(arabicKeyMap, event));

    // Clear button
    clearBtn.addEventListener('click', clearText);
}

// Handle key press
function handleKeyPress(arabicKeyMap, event) {
    const key = event.key; //.toLowerCase();

    // Show current key info
    updateKeyInfo(arabicKeyMap, key, event.key);

    // Handle special keys
    if (key === 'backspace' || key === 'Backspace') {
        event.preventDefault();
        if (currentText.length > 0) {
            currentText = currentText.slice(0, -1);
        }
    } else if (key === 'enter' || key === 'Enter') {
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
function updateKeyInfo(arabicKeyMap, key, displayKey) {
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

// Initialize the app
async function init() {
    const arabicKeyMap = await loadArabicKeyMap();
    displayKeyMapping(arabicKeyMap);
    setupEventListeners(arabicKeyMap);
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', init);
