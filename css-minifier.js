document.addEventListener('DOMContentLoaded', () => {
    // --- Get DOM Elements ---
    const minifyBtn = document.getElementById('minify-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');

    // --- Initialize CodeMirror Editors ---
    const inputEditor = CodeMirror.fromTextArea(document.getElementById('css-input'), {
        mode: 'css',
        lineNumbers: true,
        lineWrapping: true,
        autofocus: true,
    });

    const outputEditor = CodeMirror.fromTextArea(document.getElementById('minified-output'), {
        mode: 'css',
        lineNumbers: false,
        lineWrapping: true,
        readOnly: true, // Make the output editor non-editable
    });

    // --- The Core Minification Function ---
    const minifyCSS = (css) => {
        let minified = css;
        
        // 1. Remove all comments (/* ... */)
        minified = minified.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        
        // 2. Remove newlines and tabs
        minified = minified.replace(/[\n\t]/g, '');
        
        // 3. Remove space around colons
        minified = minified.replace(/\s*:\s*/g, ':');
        
        // 4. Remove space around braces and semicolons
        minified = minified.replace(/\s*\{\s*/g, '{');
        minified = minified.replace(/\s*\}\s*/g, '}');
        minified = minified.replace(/\s*;\s*/g, ';');
        
        // 5. Remove space around commas
        minified = minified.replace(/\s*,\s*/g, ',');
        
        // 6. Remove multiple spaces, leaving only one
        minified = minified.replace(/ {2,}/g, ' ');
        
        // 7. Remove leading and trailing spaces from the whole string
        minified = minified.trim();

        // 8. Remove the last semicolon before a closing brace
        minified = minified.replace(/;}/g, '}');
        
        return minified;
    };

    // --- Button Event Listeners ---
    minifyBtn.addEventListener('click', () => {
        const originalCss = inputEditor.getValue();
        if (originalCss.trim() === '') return;
        
        const minifiedCss = minifyCSS(originalCss);
        outputEditor.setValue(minifiedCss);
    });

    clearBtn.addEventListener('click', () => {
        inputEditor.setValue('');
        outputEditor.setValue('');
        inputEditor.focus();
    });

    copyBtn.addEventListener('click', () => {
        const textToCopy = outputEditor.getValue();
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Could not copy text to clipboard.');
            });
        }
    });
});