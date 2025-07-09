document.addEventListener('DOMContentLoaded', () => {
    // --- Get All DOM Elements ---
    const passwordOutput = document.getElementById('password-output');
    const copyBtn = document.getElementById('copy-password-btn');
    const generateBtn = document.getElementById('generate-password-btn');
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    
    const includeUppercase = document.getElementById('include-uppercase');
    const includeLowercase = document.getElementById('include-lowercase');
    const includeNumbers = document.getElementById('include-numbers');
    const includeSymbols = document.getElementById('include-symbols');

    // --- Character Sets ---
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    // --- The Core Generation Function ---
    const generatePassword = () => {
        const length = parseInt(lengthSlider.value, 10);
        let charPool = '';
        let password = '';

        // Build the character pool based on user settings
        if (includeUppercase.checked) charPool += upperChars;
        if (includeLowercase.checked) charPool += lowerChars;
        if (includeNumbers.checked) charPool += numberChars;
        if (includeSymbols.checked) charPool += symbolChars;
        
        // Validation: Ensure at least one character set is selected
        if (charPool === '') {
            passwordOutput.value = 'Select at least one option!';
            return;
        }

        // Generate the password
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charPool.length);
            password += charPool[randomIndex];
        }

        // Display the generated password
        passwordOutput.value = password;
    };

    // --- Event Listeners ---
    generateBtn.addEventListener('click', generatePassword);

    lengthSlider.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
    });

    copyBtn.addEventListener('click', () => {
        if (passwordOutput.value && !passwordOutput.value.includes('Select at least')) {
            navigator.clipboard.writeText(passwordOutput.value).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    });

    // --- Initial Generation on Page Load ---
    generatePassword();
});