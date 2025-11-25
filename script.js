// Arabic keyboard mapping
// Format: 'englishKey': 'arabicCharacter'
async function loadArabicKeyMap() {
  const response = await fetch('eng2ar_numless.json');
  return await response.json(); // reassign with fetched data
}

const arabicKeyOrder = ['ء', 'آ','ا','أ','إ','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ظ','ط','ع','غ','ف','ق','ك','ل','م','ن','ه','ة','و','ؤ','ي','ى','ئ']
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

    // Fill reverse mapping with possible multiple english characters for one arabic character
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


    function clickedKey(event){
        const keyItem = event.currentTarget;

        keyItem.classList.add('key-clicked');

        
        click2press_event = {
            key: keyItem.getElementsByClassName("eng-key")[0].innerHTML[0],
            preventDefault: () => {}
        }
        handleKeyPress(arabicKeyMap, click2press_event)

        setTimeout(() => {
            keyItem.classList.remove('key-clicked');
        }, 100);
    }

    // Turn reverse mapping into keyboard grid items
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


// Setup event listeners
function setupEventListeners(arabicKeyMap) {
    // Keyboard input, need keypress instead of keydown for lower and upper case sensitivety
    document.addEventListener('keypress', event => handleKeyPress(arabicKeyMap, event));

    // Copy button
    copyBtn.addEventListener('click', event => copyToClipboard(arabicKeyMap, event));

    // Clear button
    clearBtn.addEventListener('click', clearText);
}

// Handle key press
function handleKeyPress(arabicKeyMap, event) {
    const event_key = event.key;

    // Show current key info
    updateKeyInfo(arabicKeyMap, event_key);

    if (arabicKeyMap[event_key]) {
        event.preventDefault();

        let caret_position = textOutput.selectionStart;
        let caret_position_end = textOutput.selectionEnd;

        // swap if selection is backwards
        if(caret_position > caret_position_end){
            const placeholder = caret_position_end;
            caret_position_end = caret_position;
            caret_position = placeholder;
        }

        // Replace selected text with arabic character or inert at caret position
        textOutput.value = textOutput.value.slice(0, caret_position) + arabicKeyMap[event_key] + textOutput.value.slice(caret_position_end);

        // Move caret forward after inserting character
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