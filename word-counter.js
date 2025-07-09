document.addEventListener('DOMContentLoaded', () => {
    // --- Get All DOM Elements ---
    const textArea = document.getElementById('text-input-area');
    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');
    const paraCountEl = document.getElementById('para-count');

    // --- The main function that updates all counts ---
    const updateCounts = () => {
        const text = textArea.value;

        // 1. Count Characters
        const charCount = text.length;
        charCountEl.textContent = charCount;

        // 2. Count Words
        // We trim the text to remove leading/trailing spaces.
        // Then, we use a regular expression to find sequences of non-space characters.
        const words = text.trim().match(/\S+/g);
        const wordCount = words ? words.length : 0;
        wordCountEl.textContent = wordCount;

        // 3. Count Paragraphs
        // We trim the text and then split by one or more newline characters.
        // We filter out any empty strings that result from multiple newlines.
        const paragraphs = text.trim().split(/\n+/).filter(p => p.trim() !== '');
        const paraCount = paragraphs.length > 0 ? paragraphs.length : (text.trim() ? 1 : 0);
        paraCountEl.textContent = paraCount;
    };

    // --- Add the Event Listener ---
    // The 'input' event fires immediately whenever the user types, pastes, or deletes text.
    textArea.addEventListener('input', updateCounts);

    // Initial count in case the browser pre-fills the textarea
    updateCounts();
});