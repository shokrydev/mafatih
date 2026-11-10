// Latin key → Arabic character
const arabicKeyMap = {
    'e': 'ء',
    '2': 'ء',
    'a': 'ا',
    'L': 'آ',
    'A': 'أ',
    'I': 'إ',
    'b': 'ب',
    't': 'ت',
    'F': 'ث',
    'j': 'ج',
    'H': 'ح',
    '7': 'ح',
    'x': 'خ',
    '5': 'خ',
    'd': 'د',
    'D': 'ذ',
    'r': 'ر',
    'z': 'ز',
    's': 'س',
    'c': 'ش',
    '4': 'ش',
    'S': 'ص',
    'Z': 'ض',
    'v': 'ظ',
    'T': 'ط',
    '3': 'ع',
    'g': 'غ',
    '8': 'غ',
    'f': 'ف',
    'q': 'ق',
    '9': 'ق',
    'k': 'ك',
    'l': 'ل',
    'm': 'م',
    'n': 'ن',
    'h': 'ه',
    'o': 'ة',
    'u': 'و',
    'U': 'ؤ',
    'i': 'ي',
    'Y': 'ى',
    'E': 'ئ',

    '?': '؟',
    ',': '،',
    ';': '؛'
};

// Letter keys in Arabic alphabet order
const arabicKeyOrder = ['ء', 'آ', 'ا', 'أ', 'إ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ظ', 'ط', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'ة', 'و', 'ؤ', 'ي', 'ى', 'ئ'];
// Letters whose Latin key is not obvious, shown in the accent colour
const highlightedKeys = ['ث', 'خ', 'ذ', 'ش', 'ض', 'ظ', 'غ', 'ة'];
const numeralKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const punctuationKeys = ['،', '؛', '؟'];

// DOM elements
const textOutput = document.getElementById('textOutput');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const keyInfo = document.getElementById('keyInfo');
const keyboard = document.getElementById('keyboard');
const keyGrid = document.getElementById('keyGrid');
const utilityGrid = document.getElementById('utilityGrid');

// Typed character (or 'Backspace') → on-screen key, to animate it on physical key presses
const keyItems = {};
// Physical key (event.code) → on-screen key it currently holds down
const heldKeys = {};

// Capitals get a shift symbol, 's' and 'S' are hard to tell apart on a small label
function keyName(latinKey) {
    return /[A-Z]/.test(latinKey) ? '⇧' + latinKey : latinKey;
}

// All Latin keys that produce the given Arabic character, e.g. 'e/2'
function latinKeysFor(arabicChar) {
    return Object.keys(arabicKeyMap)
        .filter(key => arabicKeyMap[key] === arabicChar)
        // Object.keys lists digit keys first, show the letter first instead
        .sort((a, b) => /\d/.test(a) - /\d/.test(b))
        .map(keyName)
        .join('/');
}

function addKey(grid, { id, label, latin, className, onClick }) {
    const keyItem = document.createElement('div');
    keyItem.className = className ? `key-item ${className}` : 'key-item';
    keyItem.innerHTML = `<span class="key-label">${label}</span>`
        + (latin ? `<span class="latin-key">${latin}</span>` : '');
    keyItem.addEventListener('click', () => {
        animatePress(keyItem);
        onClick();
    });

    keyItems[id] = keyItem;
    grid.appendChild(keyItem);
}

function addCharacterKey(grid, char, options = {}) {
    const latin = latinKeysFor(char);
    addKey(grid, {
        id: char,
        label: char,
        latin,
        onClick: () => {
            insertText(char);
            if (latin) {
                keyInfo.textContent = `${latin} → ${char}`;
            }
        },
        ...options
    });
}

// Build the on-screen keyboard
function displayKeyMapping() {
    for (const arKey of arabicKeyOrder) {
        addCharacterKey(keyGrid, arKey, { className: highlightedKeys.includes(arKey) ? 'highlight' : '' });
    }

    for (const numeral of numeralKeys) {
        // Most digits are mapped to letters, so the Latin hint would be misleading here
        addCharacterKey(utilityGrid, numeral, { latin: '', className: 'numeral-key' });
    }
    for (const punctuation of punctuationKeys) {
        addCharacterKey(utilityGrid, punctuation);
    }

    addCharacterKey(utilityGrid, ' ', { label: 'Space', className: 'function-key space-key' });
    addCharacterKey(utilityGrid, '\n', { label: 'Enter', className: 'function-key wide-key' });
    addKey(utilityGrid, { id: 'Backspace', label: '⌫', className: 'function-key wide-key backspace-key', onClick: backspace });
}

function setupEventListeners() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', event => releaseKey(event.code));
    // No keyup arrives for keys that are still down when the window loses focus
    window.addEventListener('blur', () => Object.keys(heldKeys).forEach(releaseKey));
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearText);

    // Keep the caret in the text area while clicking on-screen keys
    keyboard.addEventListener('mousedown', event => event.preventDefault());

    // On touch screens, tapping on-screen keys must not open the system keyboard on top of them.
    // Tapping the text area itself brings the system keyboard back.
    keyboard.addEventListener('pointerdown', event => {
        if (event.pointerType === 'touch') {
            textOutput.inputMode = 'none';
        }
    });
    textOutput.addEventListener('pointerdown', () => {
        if (textOutput.inputMode === 'none') {
            textOutput.inputMode = '';
            // The tap focuses the text area again, which is what opens the keyboard
            textOutput.blur();
        }
    });
}

// Replace the selection (or insert at the caret) in the text area
function insertText(text) {
    textOutput.focus();
    // execCommand keeps the browser's undo history and scrolls the caret into view
    if (!document.execCommand('insertText', false, text)) {
        textOutput.setRangeText(text, textOutput.selectionStart, textOutput.selectionEnd, 'end');
    }
}

function backspace() {
    textOutput.focus();
    if (!document.execCommand('delete')) {
        const end = textOutput.selectionEnd;
        let start = textOutput.selectionStart;
        if (start === end && start > 0) {
            start -= 1;
        }
        textOutput.setRangeText('', start, end, 'end');
    }
}

// Handle physical key presses
function handleKeyDown(event) {
    const key = event.key;

    // Leave shortcuts and IME input alone
    if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) {
        return;
    }

    // Enter and Space activate a focused button
    if (event.target.closest('button') && (key === 'Enter' || key === ' ')) {
        return;
    }

    // Ignore keys that do not edit the text (Shift, arrows, F-keys...)
    const typesCharacter = key.length === 1;
    if (!typesCharacter && key !== 'Backspace' && key !== 'Enter') {
        return;
    }

    // Typing anywhere on the page goes to the text area
    textOutput.focus();

    const arabic = arabicKeyMap[key];
    holdKey(event.code, keyItems[arabic || (key === 'Enter' ? '\n' : key)]);

    if (arabic) {
        event.preventDefault();
        insertText(arabic);
        keyInfo.textContent = `${keyName(key)} → ${arabic}`;
    } else if (typesCharacter && key !== ' ') {
        // Unmapped keys are typed as they are by the browser
        keyInfo.textContent = `${key} → not mapped`;
    }
}

// Keep the on-screen key down for as long as the physical key is held
// (not every typed character has an on-screen key)
function holdKey(code, keyItem) {
    releaseKey(code);
    if (keyItem) {
        keyItem.classList.add('key-clicked');
        heldKeys[code] = keyItem;
    }
}

function releaseKey(code) {
    heldKeys[code]?.classList.remove('key-clicked');
    delete heldKeys[code];
}

// Short press animation for clicks and taps
function animatePress(keyItem) {
    keyItem.classList.add('key-clicked');
    setTimeout(() => keyItem.classList.remove('key-clicked'), 100);
}

// Copy text to clipboard
async function copyToClipboard() {
    if (textOutput.value.length === 0) {
        keyInfo.textContent = 'Nothing to copy yet';
        return;
    }

    try {
        await navigator.clipboard.writeText(textOutput.value);
    } catch {
        keyInfo.textContent = 'Could not copy the text';
        return;
    }

    // Show feedback
    copyBtn.textContent = 'Copied!';
    copyBtn.classList.add('copied');
    setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('copied');
    }, 2000);
}

// Clear all text
function clearText() {
    if (textOutput.value.length === 0) {
        return;
    }

    if (confirm('Are you sure you want to clear all text?')) {
        textOutput.value = '';
        keyInfo.textContent = 'Text cleared';
        textOutput.focus();
    }
}

displayKeyMapping();
setupEventListeners();
