document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary DOM elements
    const imageUpload = document.getElementById('image-upload');
    const uploadLabel = document.getElementById('upload-label');
    const settingsArea = document.querySelector('.settings-area');
    const resizeWidthInput = document.getElementById('resize-width');
    const resizeHeightInput = document.getElementById('resize-height');
    const aspectLock = document.getElementById('aspect-lock');
    const resizeBtn = document.getElementById('resize-btn');
    const resultsArea = document.querySelector('.results-area');
    const originalPreview = document.getElementById('original-preview');
    const resizedPreview = document.getElementById('resized-preview');
    const originalDimensions = document.getElementById('original-dimensions');
    const resizedDimensions = document.getElementById('resized-dimensions');
    const downloadBtn = document.getElementById('download-btn');

    let originalImage = null;
    let originalFile = null;
    let aspectRatio = 1;

    // Handle file selection
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            return;
        }

        originalFile = file;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            originalPreview.src = event.target.result;
            uploadLabel.querySelector('span').textContent = file.name;

            // Create an image object to get its natural dimensions
            originalImage = new Image();
            originalImage.onload = () => {
                // Store aspect ratio
                aspectRatio = originalImage.naturalWidth / originalImage.naturalHeight;

                // Set initial values in input fields
                resizeWidthInput.value = originalImage.naturalWidth;
                resizeHeightInput.value = originalImage.naturalHeight;

                // Display original dimensions
                originalDimensions.textContent = `Dimensions: ${originalImage.naturalWidth} x ${originalImage.naturalHeight}`;
                
                // Show the settings area
                settingsArea.hidden = false;
                resultsArea.hidden = true;
            };
            originalImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Event listener for width input to maintain aspect ratio
    resizeWidthInput.addEventListener('input', () => {
        if (aspectLock.checked) {
            const newWidth = parseInt(resizeWidthInput.value, 10);
            if (!isNaN(newWidth) && newWidth > 0) {
                resizeHeightInput.value = Math.round(newWidth / aspectRatio);
            }
        }
    });

    // Event listener for height input to maintain aspect ratio
    resizeHeightInput.addEventListener('input', () => {
        if (aspectLock.checked) {
            const newHeight = parseInt(resizeHeightInput.value, 10);
            if (!isNaN(newHeight) && newHeight > 0) {
                resizeWidthInput.value = Math.round(newHeight * aspectRatio);
            }
        }
    });

    // Handle resize button click
    resizeBtn.addEventListener('click', () => {
        if (!originalImage) {
            alert('Please upload an image first.');
            return;
        }

        const newWidth = parseInt(resizeWidthInput.value, 10);
        const newHeight = parseInt(resizeHeightInput.value, 10);

        if (isNaN(newWidth) || isNaN(newHeight) || newWidth <= 0 || newHeight <= 0) {
            alert('Please enter valid dimensions.');
            return;
        }

        // Create canvas and draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);

        // Get data URL from canvas
        const resizedDataUrl = canvas.toDataURL(originalFile.type);

        // Update the preview and download link
        resizedPreview.src = resizedDataUrl;
        downloadBtn.href = resizedDataUrl;
        downloadBtn.download = `resized-${originalFile.name}`;

        // Update dimension info
        resizedDimensions.textContent = `Dimensions: ${newWidth} x ${newHeight}`;

        // Show the results
        resultsArea.hidden = false;
    });
});