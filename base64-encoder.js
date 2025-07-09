document.addEventListener('DOMContentLoaded', () => {
    // --- Get All DOM Elements ---
    const textInput = document.getElementById('text-input');
    const base64Output = document.getElementById('base64-output');
    const copyTextBtn = document.getElementById('copy-text-btn');
    const copyBase64Btn = document.getElementById('copy-base64-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // --- Encoding Logic (Text -> Base64) ---
    const handleEncode = () => {
        const text = textInput.value;
        try {
            // btoa() is the built-in browser function for Base64 encoding.
            // It can throw an error for non-latin characters, so we handle that.
            const encoded = btoa(unescape(encodeURIComponent(text)));
            base64Output.value = encoded;
        } catch (error) {
            console.error("Encoding error:", error);
            // In case of an error (like with emojis), clear the output.
            base64Output.value = 'Invalid input for Base64 encoding.';
        }
    };

    // --- Decoding Logic (Base64 -> Text) ---
    const handleDecode = () => {
        const base64Str = base64Output.value;
        if (base64Str.trim() === '') {
            textInput.value = '';
            return;
        }

        try {
            // atob() is the built-in browser function for decoding.
            // It throws an error if the string is not valid Base64.
            const decoded = decodeURIComponent(escape(atob(base64Str)));
            textInput.value = decoded;
        } catch (error) {
            console.error("Decoding error:", error);
            textInput.value = 'Invalid Base64 string.';
        }
    };

    // --- Event Listeners ---
    textInput.addEventListener('input', handleEncode);
    base64Output.addEventListener('input', handleDecode);

    // --- Button Actions ---
    clearAllBtn.addEventListener('click', () => {
        textInput.value = '';
        base64Output.value = '';
    });

    const copyToClipboard = (element, button) => {
        if (element.value) {
            navigator.clipboard.writeText(element.value).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Could not copy text to clipboard.');
            });
        }
    };

    copyTextBtn.addEventListener('click', () => copyToClipboard(textInput, copyTextBtn));
    copyBase64Btn.addEventListener('click', () => copyToClipboard(base64Output, copyBase64Btn));
});