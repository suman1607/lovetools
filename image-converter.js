document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary DOM elements
    const imageUpload = document.getElementById('image-upload');
    const uploadLabel = document.getElementById('upload-label');
    const settingsArea = document.querySelector('.settings-area');
    const formatSelect = document.getElementById('format-select');
    const qualityContainer = document.getElementById('quality-container');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('quality-value');
    const convertBtn = document.getElementById('convert-btn');
    const resultDisplay = document.getElementById('result-display');
    const resultPreview = document.getElementById('result-preview');
    const downloadBtn = document.getElementById('download-btn');

    let originalImage = null;
    let originalFileName = '';

    // Handle file selection
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            return;
        }

        originalFileName = file.name.split('.').slice(0, -1).join('.'); // Get name without extension

        const reader = new FileReader();
        reader.onload = (event) => {
            uploadLabel.querySelector('span').textContent = file.name;
            
            // Create an image object to work with
            originalImage = new Image();
            originalImage.onload = () => {
                // Show settings, hide old results
                settingsArea.hidden = false;
                resultDisplay.hidden = true;
            };
            originalImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Show/hide quality slider based on format selection
    formatSelect.addEventListener('change', () => {
        if (formatSelect.value === 'jpeg') {
            qualityContainer.hidden = false;
        } else {
            qualityContainer.hidden = true;
        }
    });

    // Update quality value display
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value;
    });

    // Handle the conversion button click
    convertBtn.addEventListener('click', () => {
        if (!originalImage) {
            alert('Please upload an image first.');
            return;
        }

        const format = formatSelect.value;
        const mimeType = `image/${format}`;
        const quality = parseInt(qualitySlider.value, 10) / 100;

        // Create canvas and draw the image
        const canvas = document.createElement('canvas');
        canvas.width = originalImage.naturalWidth;
        canvas.height = originalImage.naturalHeight;
        const ctx = canvas.getContext('2d');

        // If converting from a transparent format (like PNG) to a format that doesn't
        // support transparency (like JPG), fill the background with white first.
        if (format === 'jpeg') {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(originalImage, 0, 0);

        // Get the converted image data URL
        let convertedDataUrl;
        if (format === 'jpeg') {
            convertedDataUrl = canvas.toDataURL(mimeType, quality);
        } else {
            convertedDataUrl = canvas.toDataURL(mimeType);
        }

        // Update the result preview and download link
        resultPreview.src = convertedDataUrl;
        resultPreview.style.maxWidth = '300px'; // Limit preview size
        resultPreview.style.maxHeight = '200px';
        resultPreview.style.marginTop = '1rem';
        
        downloadBtn.href = convertedDataUrl;
        downloadBtn.download = `${originalFileName}.${format}`;

        // Show the result display
        resultDisplay.hidden = false;
    });
});