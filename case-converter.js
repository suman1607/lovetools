document.addEventListener('DOMContentLoaded', () => {
    // --- Get All DOM Elements ---
    const textArea = document.getElementById('text-input-area');
    const btnUpper = document.getElementById('btn-upper');
    const btnLower = document.getElementById('btn-lower');
    const btnSentence = document.getElementById('btn-sentence');
    const btnTitle = document.getElementById('btn-title');
    const btnClear = document.getElementById('btn-clear');

    // --- Event Listeners for each button ---

    // 1. UPPER CASE
    btnUpper.addEventListener('click', () => {
        textArea.value = textArea.value.toUpperCase();
    });

    // 2. lower case
    btnLower.addEventListener('click', () => {
        textArea.value = textArea.value.toLowerCase();
    });

    // 3. Sentence case
    btnSentence.addEventListener('click', () => {
        const text = textArea.value.toLowerCase();
        // Use a regular expression to find the start of sentences (after a period and space)
        // and capitalize the first letter.
        const sentenceCaseText = text.replace(/(^\s*\w|[\.\!\?]\s+\w)/g, (c) => c.toUpperCase());
        textArea.value = sentenceCaseText;
    });

    // 4. Title Case
    btnTitle.addEventListener('click', () => {
        const text = textArea.value.toLowerCase();
        // Use a regular expression to find the first letter of each word and capitalize it.
        const titleCaseText = text.replace(/\b\w/g, (c) => c.toUpperCase());
        textArea.value = titleCaseText;
    });

    // 5. Clear Text
    btnClear.addEventListener('click', () => {
        textArea.value = '';
    });
});