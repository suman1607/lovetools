document.addEventListener('DOMContentLoaded', () => {
    // --- Get DOM Elements ---
    const textInput = document.getElementById('qr-text-input');
    const generateBtn = document.getElementById('generate-qr-btn');
    const qrContainer = document.getElementById('qr-code-container');
    const qrOutput = document.getElementById('qr-code-output');
    const downloadContainer = document.getElementById('download-link-container');
    const downloadLink = document.getElementById('download-link');

    let qrCode = null; // To hold the QRCode.js instance

    // --- The Main Generation Function ---
    const generateQRCode = () => {
        const text = textInput.value.trim();

        if (text === '') {
            alert('Please enter some text or a URL.');
            return;
        }

        // Clear any previous QR code
        qrOutput.innerHTML = '';
        
        // If this is the first time, create a new QRCode instance
        if (qrCode === null) {
            qrCode = new QRCode(qrOutput, {
                text: text,
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H // High correction level
            });
        } else {
            // If it already exists, just update the text and regenerate
            qrCode.makeCode(text);
        }

        // Show the container
        qrContainer.hidden = false;

        // The library generates an <img> inside the qrOutput div. We need to
        // wait a moment for it to be created, then we can get its data for the download link.
        setTimeout(() => {
            const qrImage = qrOutput.querySelector('img');
            if (qrImage) {
                downloadLink.href = qrImage.src;
                downloadContainer.hidden = false;
            }
        }, 100); // 100ms delay is usually enough
    };


    // --- Event Listeners ---
    generateBtn.addEventListener('click', generateQRCode);
    
    // Optional: Allow pressing Enter in the input field to generate
    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission if it's in a form
            generateQRCode();
        }
    });
});