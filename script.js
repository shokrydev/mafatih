// Arabic keyboard mapping
// Format: 'englishKey': 'arabicCharacter'
async function loadArabicKeyMap() {
  const response = await fetch('eng2ar_numless.json');
  return await response.json(); // reassign with fetched data
}

const arabicKeyOrder = ['ء', 'آ','ا','أ','إ','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ظ','ط','ع','غ','ف','ق','ك','ل','م','ن','ه','ة','و','ؤ','ي','ى','ئ','لا']
let ar2buttonDict = {}

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
        // Only include arabic characters in the displayed key grid
        if (!arabicKeyOrder.includes(arKey)) {
            continue;
        }

        if (!ar2buttonDict[arKey]){
            ar2buttonDict[arKey] = engKey;
        } else {
            ar2buttonDict[arKey] += '/' + engKey;
        }
    }

    for (const [index, arKey] of Object.entries(arabicKeyOrder)) {

        const keyItem = document.createElement('div');
        keyItem.className = 'key-item';
        keyItem.onclick = clickedKey
        keyItem.innerHTML = `
            <span class="ar-key">${arKey}</span>
            <span class="eng-key">${ar2buttonDict[arKey]}</span>
        `;
        ar2buttonDict[arKey] = keyItem;
        keyGrid.appendChild(keyItem);
    }
}

function clickedKey(event){
    console.log(event);
    keyItem = event.currentTarget;

    keyItem.classList.add('key-clicked');

    setTimeout(() => {
        keyItem.classList.remove('key-clicked');
    }, 100);
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
    event_key = event.key;

    // Show current key info
    updateKeyInfo(arabicKeyMap, event_key);

    if (arabicKeyMap[event_key]) {
        event.preventDefault();

        caret_position = textOutput.selectionStart;
        caret_position_end = textOutput.selectionEnd;

        if(caret_position > caret_position_end){
            // If text is selected, remove it first
            //textOutput.value = textOutput.value.slice(0, caret_position) + textOutput.value.slice(textOutput.selectionEnd);
            placeholder = caret_position_end;
            caret_position_end = caret_position;
            caret_position = placeholder;
        }

        // Insert Arabic character at cursor position
        if(textOutput.value.length == caret_position){
            textOutput.value += arabicKeyMap[event_key];
        } else if(0 == caret_position){
            textOutput.value = arabicKeyMap[event_key] + textOutput.value;
        } else {
            textOutput.value = textOutput.value.slice(0, caret_position) + arabicKeyMap[event_key] + textOutput.value.slice(caret_position_end);
        }

        textOutput.selectionStart = caret_position + 1;
        textOutput.selectionEnd = caret_position + 1;
    }
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
        copyBtn.textContent = 'Copied it !';
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