document.addEventListener('DOMContentLoaded', () => {
    // --- Get All DOM Elements ---
    const imageUpload = document.getElementById('image-upload');
    const uploadLabel = document.getElementById('upload-label');
    const settingsArea = document.querySelector('.settings-area');
    const previewContainer = document.getElementById('meme-preview-container');
    const canvas = document.getElementById('meme-canvas');
    const ctx = canvas.getContext('2d');
    
    // Inputs
    const topTextInput = document.getElementById('top-text-input');
    const bottomTextInput = document.getElementById('bottom-text-input');
    const fontSizeSlider = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    const fontColorPicker = document.getElementById('font-color');
    const downloadBtn = document.getElementById('download-btn-meme');

    // --- State Variables ---
    let image = null;

    // --- Main Drawing Function ---
    const drawMeme = () => {
        if (!image) return;

        // Set canvas dimensions to the image's dimensions
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        // 1. Draw the base image
        ctx.drawImage(image, 0, 0);

        // 2. Set up text style
        const fontSize = fontSizeSlider.value;
        ctx.font = `bold ${fontSize}px Impact, sans-serif`;
        ctx.fillStyle = fontColorPicker.value;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = fontSize / 20; // Stroke width relative to font size
        ctx.textAlign = 'center';

        // 3. Draw Top Text
        const topText = topTextInput.value.toUpperCase();
        const topX = canvas.width / 2;
        const topY = fontSize * 1.2; // Position with a little margin
        ctx.textBaseline = 'top';
        ctx.strokeText(topText, topX, 10); // Draw outline
        ctx.fillText(topText, topX, 10);   // Draw fill

        // 4. Draw Bottom Text
        const bottomText = bottomTextInput.value.toUpperCase();
        const bottomX = canvas.width / 2;
        const bottomY = canvas.height - 10; // Position with a little margin
        ctx.textBaseline = 'bottom';
        ctx.strokeText(bottomText, bottomX, bottomY); // Draw outline
        ctx.fillText(bottomText, bottomX, bottomY);   // Draw fill
    };

    // --- Event Listeners ---

    // Image Upload
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            image = new Image();
            image.onload = () => {
                uploadLabel.querySelector('span').textContent = 'Image Loaded!';
                previewContainer.hidden = false;
                settingsArea.hidden = false;
                drawMeme(); // Initial draw
            };
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Update listeners for all inputs
    topTextInput.addEventListener('input', drawMeme);
    bottomTextInput.addEventListener('input', drawMeme);
    fontColorPicker.addEventListener('input', drawMeme);
    fontSizeSlider.addEventListener('input', (e) => {
        fontSizeValue.textContent = e.target.value;
        drawMeme();
    });

    // Download Button
    downloadBtn.addEventListener('click', () => {
        if (!image) {
            alert('Please upload an image first.');
            return;
        }
        // Use JPEG for smaller file size, common for memes
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Create a temporary link to trigger the download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'mymeme.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});