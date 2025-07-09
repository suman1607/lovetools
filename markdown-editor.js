document.addEventListener('DOMContentLoaded', () => {
    // --- Get DOM Elements ---
    const markdownInput = document.getElementById('markdown-input');
    const htmlPreview = document.getElementById('html-preview');

    // --- The Main Conversion Function ---
    const convertMarkdown = () => {
        const markdownText = markdownInput.value;
        // Use the marked() function provided by the library
        const htmlText = marked.parse(markdownText);
        // Set the innerHTML of the preview panel
        htmlPreview.innerHTML = htmlText;
    };

    // --- Add Event Listener ---
    // The 'input' event ensures this runs every time the user types,
    // pastes, or deletes text, providing a live preview.
    markdownInput.addEventListener('input', convertMarkdown);

    // --- Initial Conversion ---
    // Run the function once on page load to render the default placeholder text.
    convertMarkdown();
});