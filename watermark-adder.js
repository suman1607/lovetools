document.addEventListener('DOMContentLoaded', () => {
    // --- Get All DOM Elements ---
    const mainImageUpload = document.getElementById('main-image-upload');
    const uploadLabel = document.getElementById('upload-label');
    const settingsArea = document.querySelector('.settings-area');
    const resultDisplay = document.getElementById('result-display');
    const resultPreview = document.getElementById('result-preview');
    const downloadBtn = document.getElementById('download-btn');
    const generateBtn = document.getElementById('generate-btn');

    // Watermark type switch
    const watermarkTypeRadios = document.querySelectorAll('input[name="watermark-type"]');
    const textOptions = document.getElementById('text-options');
    const imageOptions = document.getElementById('image-options');

    // Text options
    const watermarkTextInput = document.getElementById('watermark-text');
    const fontSizeSlider = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    const fontColorPicker = document.getElementById('font-color');
    
    // Image options
    const watermarkImageUpload = document.getElementById('watermark-image-upload');
    const imageScaleSlider = document.getElementById('image-scale');
    const imageScaleValue = document.getElementById('image-scale-value');

    // Common options
    const opacitySlider = document.getElementById('opacity');
    const opacityValue = document.getElementById('opacity-value');
    const positionSelect = document.getElementById('position-select');

    // --- State Variables ---
    let mainImage = null;
    let watermarkImage = null;
    let originalFileName = '';
    let originalFileType = 'image/png'; // Default

    // --- Event Listeners ---
    mainImageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        
        originalFileName = file.name;
        originalFileType = file.type;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            mainImage = new Image();
            mainImage.onload = () => {
                uploadLabel.querySelector('span').textContent = file.name;
                settingsArea.hidden = false;
                resultDisplay.hidden = true;
            };
            mainImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    watermarkImageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            watermarkImage = new Image();
            watermarkImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    watermarkTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            textOptions.hidden = e.target.value !== 'text';
            imageOptions.hidden = e.target.value !== 'image';
        });
    });

    fontSizeSlider.addEventListener('input', (e) => fontSizeValue.textContent = e.target.value);
    imageScaleSlider.addEventListener('input', (e) => imageScaleValue.textContent = `${e.target.value}%`);
    opacitySlider.addEventListener('input', (e) => opacityValue.textContent = `${e.target.value}%`);

    generateBtn.addEventListener('click', () => {
        if (!mainImage) {
            alert('Please upload a main image first.');
            return;
        }
        const isTextWatermark = document.querySelector('input[name="watermark-type"]:checked').value === 'text';

        if (isTextWatermark && !watermarkTextInput.value) {
            alert('Please enter some watermark text.');
            return;
        }
        if (!isTextWatermark && !watermarkImage) {
            alert('Please upload a watermark image.');
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = mainImage.naturalWidth;
        canvas.height = mainImage.naturalHeight;
        ctx.drawImage(mainImage, 0, 0);

        ctx.globalAlpha = parseFloat(opacitySlider.value) / 100;
        const position = positionSelect.value;
        const margin = 20;

        let wmWidth, wmHeight, x, y;

        if (isTextWatermark) {
            const text = watermarkTextInput.value;
            const fontSize = parseInt(fontSizeSlider.value, 10);
            ctx.font = `bold ${fontSize}px Arial`;
            
            const textMetrics = ctx.measureText(text);
            wmWidth = textMetrics.width;
            wmHeight = fontSize; // Approximate height

            ({ x, y } = getCoordinates(position, canvas, wmWidth, wmHeight, margin));
            
            ctx.fillStyle = fontColorPicker.value;
            ctx.textBaseline = 'top'; // Always draw from top-left for consistency
            ctx.fillText(text, x, y);
        } else {
            const scale = parseFloat(imageScaleSlider.value) / 100;
            wmWidth = watermarkImage.naturalWidth * scale;
            wmHeight = watermarkImage.naturalHeight * scale;

            ({ x, y } = getCoordinates(position, canvas, wmWidth, wmHeight, margin));
            
            ctx.drawImage(watermarkImage, x, y, wmWidth, wmHeight);
        }

        const resultUrl = canvas.toDataURL(originalFileType);
        resultPreview.src = resultUrl;
        downloadBtn.href = resultUrl;
        downloadBtn.download = `watermarked-${originalFileName}`;
        resultDisplay.hidden = false;
    });

    // --- ★★★ CORRECTED HELPER FUNCTION ★★★ ---
    // This function now ONLY calculates the top-left (x, y) coordinates
    // for an object of a given width and height. It works for both text and images.
    function getCoordinates(position, canvas, width, height, margin) {
        let x, y;
        switch (position) {
            case 'top-left':
                x = margin;
                y = margin;
                break;
            case 'top-right':
                x = canvas.width - width - margin;
                y = margin;
                break;
            case 'bottom-left':
                x = margin;
                y = canvas.height - height - margin;
                break;
            case 'bottom-right':
                x = canvas.width - width - margin;
                y = canvas.height - height - margin;
                break;
            case 'center':
            default:
                x = (canvas.width - width) / 2;
                y = (canvas.height - height) / 2;
        }
        return { x, y };
    }
});