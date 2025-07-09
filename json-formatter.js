document.addEventListener('DOMContentLoaded', () => {
    // --- Get DOM Elements ---
    const jsonInput = document.getElementById('json-input');
    const formatBtn = document.getElementById('format-btn');
    const clearBtn = document.getElementById('clear-btn');
    const errorBox = document.getElementById('error-message-box');

    // --- Initialize the CodeMirror Editor ---
    // This turns our simple textarea into a full-featured code editor.
    const editor = CodeMirror.fromTextArea(jsonInput, {
        mode: { name: "javascript", json: true }, // Use the JavaScript mode with JSON support
        lineNumbers: true, // Show line numbers
        lineWrapping: true, // Wrap long lines
        autofocus: true,
    });

    // --- Format Button Logic ---
    formatBtn.addEventListener('click', () => {
        const unformattedJson = editor.getValue();
        
        // Hide the error box before trying again
        errorBox.hidden = true;

        if (unformattedJson.trim() === '') {
            return; // Do nothing if the editor is empty
        }
        
        try {
            // 1. Parse the JSON string into a JavaScript object.
            const jsonObj = JSON.parse(unformattedJson);
            
            // 2. Stringify the object with an indent of 2 spaces for pretty-printing.
            const formattedJson = JSON.stringify(jsonObj, null, 2);
            
            // 3. Update the editor's content with the formatted JSON.
            editor.setValue(formattedJson);

        } catch (error) {
            // If JSON.parse() fails, it throws an error. We catch it here.
            console.error("Invalid JSON:", error);
            
            // Display a user-friendly error message.
            errorBox.textContent = `Invalid JSON: ${error.message}`;
            errorBox.hidden = false;
        }
    });

    // --- Clear Button Logic ---
    clearBtn.addEventListener('click', () => {
        editor.setValue(''); // Clear the editor content
        errorBox.hidden = true; // Hide any existing errors
        editor.focus(); // Put the cursor back in the editor
    });
});