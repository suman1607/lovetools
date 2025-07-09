document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary DOM elements
    const imageUpload = document.getElementById('image-upload');
    const uploadLabel = document.getElementById('upload-label');
    const settingsArea = document.querySelector('.settings-area');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('quality-value');
    const compressBtn = document.getElementById('compress-btn');
    const resultsArea = document.querySelector('.results-area');
    const originalPreview = document.getElementById('original-preview');
    const compressedPreview = document.getElementById('compressed-preview');
    const originalSize = document.getElementById('original-size');
    const compressedSize = document.getElementById('compressed-size');
    const downloadBtn = document.getElementById('download-btn');

    let originalFile = null;

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
            originalSize.textContent = `Size: ${formatBytes(file.size)}`;
            uploadLabel.querySelector('span').textContent = file.name;
        };
        reader.readAsDataURL(file);

        settingsArea.hidden = false;
        resultsArea.hidden = true;
    });

    // Update quality value display
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = e.target.value;
    });

    // Handle compression
    compressBtn.addEventListener('click', () => {
        if (!originalFile) {
            alert('Please select an image first.');
            return;
        }

        const quality = parseInt(qualitySlider.value, 10) / 100;
        const img = new Image();
        img.src = URL.createObjectURL(originalFile);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const mimeType = originalFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
            const compressedDataUrl = canvas.toDataURL(mimeType, quality);
            
            compressedPreview.src = compressedDataUrl;
            downloadBtn.href = compressedDataUrl;
            downloadBtn.download = `compressed-${originalFile.name}`;

            const compressedBlob = dataURLtoBlob(compressedDataUrl);
            compressedSize.textContent = `Size: ${formatBytes(compressedBlob.size)} | Saved: ${calculateReduction(originalFile.size, compressedBlob.size)}%`;

            resultsArea.hidden = false;
        };
    });

    // --- Helper Functions ---
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    function calculateReduction(original, compressed) {
        if (original <= compressed) return 0;
        const reduction = ((original - compressed) / original) * 100;
        return reduction.toFixed(1);
    }

    function dataURLtoBlob(dataurl) {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) { u8arr[n] = bstr.charCodeAt(n); }
        return new Blob([u8arr], { type: mime });
    }
});