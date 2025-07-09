document.addEventListener('DOMContentLoaded', () => {
    // --- Get All DOM Elements ---
    const decodedInput = document.getElementById('decoded-input');
    const encodedOutput = document.getElementById('encoded-output');
    const copyDecodedBtn = document.getElementById('copy-decoded-btn');
    const copyEncodedBtn = document.getElementById('copy-encoded-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // --- Encoding Logic (Decoded -> Encoded) ---
    const handleEncode = () => {
        const text = decodedInput.value;
        try {
            // encodeURIComponent() is the standard, built-in function for this.
            // It correctly handles all special characters, including spaces, &, =, etc.
            const encoded = encodeURIComponent(text);
            encodedOutput.value = encoded;
        } catch (error) {
            console.error("Encoding error:", error);
            encodedOutput.value = 'Error during encoding.';
        }
    };

    // --- Decoding Logic (Encoded -> Decoded) ---
    const handleDecode = () => {
        const encodedStr = encodedOutput.value;
        if (encodedStr.trim() === '') {
            decodedInput.value = '';
            return;
        }

        try {
            // decodeURIComponent() is the corresponding built-in decoding function.
            // It will throw an error if the input string is a malformed URI component.
            const decoded = decodeURIComponent(encodedStr);
            decodedInput.value = decoded;
        } catch (error) {
            console.error("Decoding error:", error);
            // This usually happens if the user enters an invalid sequence like `%G`
            decodedInput.value = 'Invalid URL-encoded string.';
        }
    };

    // --- Event Listeners ---
    decodedInput.addEventListener('input', handleEncode);
    encodedOutput.addEventListener('input', handleDecode);

    // --- Button Actions ---
    clearAllBtn.addEventListener('click', () => {
        decodedInput.value = '';
        encodedOutput.value = '';
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

    copyDecodedBtn.addEventListener('click', () => copyToClipboard(decodedInput, copyDecodedBtn));
    copyEncodedBtn.addEventListener('click', () => copyToClipboard(encodedOutput, copyEncodedBtn));
});