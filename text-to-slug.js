document.addEventListener('DOMContentLoaded', () => {
    // --- Get All DOM Elements ---
    const textInputArea = document.getElementById('text-input-area');
    const slugOutput = document.getElementById('slug-output');
    const copyBtn = document.getElementById('copy-btn');

    // --- The Core Slug Generation Function ---
    const generateSlug = (text) => {
        // 1. Convert to string, trim whitespace, and make lowercase
        let slug = String(text).trim().toLowerCase();
        
        // 2. Remove accents and other diacritics
        const from = "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż";
        const to   = "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz";
        for (let i = 0, l = from.length; i < l; i++) {
            slug = slug.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        // 3. Remove all characters that are not a-z, 0-9, or hyphen
        slug = slug.replace(/[^a-z0-9 -]/g, '')
                   // 4. Replace one or more spaces or hyphens with a single hyphen
                   .replace(/[\s-]+/g, '-')
                   // 5. Trim leading/trailing hyphens
                   .replace(/^-+|-+$/g, '');

        return slug;
    };

    // --- Event Listener for real-time conversion ---
    textInputArea.addEventListener('input', () => {
        const inputText = textInputArea.value;
        slugOutput.value = generateSlug(inputText);
    });

    // --- Event Listener for the Copy Button ---
    copyBtn.addEventListener('click', () => {
        // Check if there is text to copy
        if (slugOutput.value) {
            navigator.clipboard.writeText(slugOutput.value).then(() => {
                // Provide visual feedback to the user
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500); // Revert back after 1.5 seconds

            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Could not copy text to clipboard.');
            });
        }
    });
});