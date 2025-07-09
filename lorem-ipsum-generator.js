document.addEventListener('DOMContentLoaded', () => {
    // --- Get All DOM Elements ---
    const paragraphCountInput = document.getElementById('paragraph-count');
    const generateBtn = document.getElementById('generate-lorem-btn');
    const outputArea = document.getElementById('lorem-output-area');

    // --- The source of our text ---
    const loremWords = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'praesent',
        'interdum', 'dictum', 'mi', 'non', 'egestas', 'nulla', 'in', 'justo', 'a', 'finibus',
        'metus', 'mauris', 'vel', 'risus', 'quis', 'viverra', 'orci', 'luctus', 'et', 'ultrices',
        'posuere', 'cubilia', 'curae', 'phasellus', 'iaculis', 'urna', 'id', 'erat', 'aliquam',
        'auctor', 'sed', 'consequat', 'tincidunt', 'nunc', 'vitae', 'arcu', 'semper', 'feugiat',
        'morbi', 'lacinia', 'sapien', 'ac', 'mollis', 'aliquet', 'ligula', 'tellus', 'bibendum',
        'leo', 'eu', 'ultricies', 'purus', 'massa', 'at', 'neque', 'duis', 'fringilla', 'dui',
        'at', 'maximus', 'efficitur', 'vivamus', 'nec', 'odio', 'ut', 'quam', 'dignissim', 'hendrerit'
    ];

    // --- Helper function to generate a random number in a range ---
    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // --- Helper function to generate a single sentence ---
    const generateSentence = () => {
        const sentenceLength = getRandomInt(8, 20); // Sentences will have 8 to 20 words
        let sentence = [];
        for (let i = 0; i < sentenceLength; i++) {
            const randomIndex = getRandomInt(0, loremWords.length - 1);
            sentence.push(loremWords[randomIndex]);
        }
        // Capitalize the first letter and add a period
        let formattedSentence = sentence.join(' ');
        return formattedSentence.charAt(0).toUpperCase() + formattedSentence.slice(1) + '.';
    };

    // --- Helper function to generate a single paragraph ---
    const generateParagraph = () => {
        const paragraphLength = getRandomInt(4, 8); // Paragraphs will have 4 to 8 sentences
        let paragraph = [];
        for (let i = 0; i < paragraphLength; i++) {
            paragraph.push(generateSentence());
        }
        return paragraph.join(' ');
    };

    // --- The Main Click Handler ---
    generateBtn.addEventListener('click', () => {
        const numParagraphs = parseInt(paragraphCountInput.value, 10);

        if (isNaN(numParagraphs) || numParagraphs < 1) {
            outputArea.value = 'Please enter a valid number of paragraphs.';
            return;
        }
        
        let resultText = [];
        for (let i = 0; i < numParagraphs; i++) {
            resultText.push(generateParagraph());
        }

        // Join paragraphs with double newlines
        outputArea.value = resultText.join('\n\n');
    });

    // Automatically select text when the user clicks the output area
    outputArea.addEventListener('click', () => {
        outputArea.select();
    });
});