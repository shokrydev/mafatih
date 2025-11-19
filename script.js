// Arabic keyboard mapping
// Format: 'englishKey': 'arabicCharacter'
async function loadArabicKeyMap() {
  const response = await fetch('eng2ar_numless.json');
  return await response.json(); // reassign with fetched data
}

const arabicKeyOrder = ['ء', 'آ','ا','أ','إ','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ظ','ط','ع','غ','ف','ق','ك','ل','م','ن','ه','ة','و','ؤ','ي','ى','ئ','لا']

// DOM elements
const textOutput = document.getElementById('textOutput');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const keyInfo = document.getElementById('keyInfo');
const keyGrid = document.getElementById('keyGrid');

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
    // Keyboard input, need keypress instead of keydown for lower and upper case sensitivety
    document.addEventListener('keypress', (event) => handleKeyPress(arabicKeyMap, event));

    // Copy button
    copyBtn.addEventListener('click', (event) => copyToClipboard(arabicKeyMap, event));

    // Clear button
    clearBtn.addEventListener('click', clearText);
}

// Handle key press
function handleKeyPress(arabicKeyMap, event) {
    event_key = event.key

    // Show current key info
    updateKeyInfo(arabicKeyMap, event_key)

    if (arabicKeyMap[event_key]) {
        event.preventDefault();
        textOutput.value += arabicKeyMap[event_key];
    }

    updateDisplay();
}

// Update key info display
function updateKeyInfo(arabicKeyMap, event_key) {
    const arabic = arabicKeyMap[event_key] || 'Not mapped';
    keyInfo.textContent = `Pressed: "${event_key}" → "${arabic}"`;
}

// Copy text to clipboard
function copyToClipboard() {
    if (textOutput.value.length === 0) {
        alert('No text to copy!');
        return;
    }

    navigator.clipboard.writeText(textOutput.value).then(() => {
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
    if (textOutput.value.length === 0) {
        return;
    }

    if (confirm('Are you sure you want to clear all text?')) {
        textOutput.value = '';
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
