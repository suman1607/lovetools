document.addEventListener('DOMContentLoaded', () => {
    // --- Get All DOM Elements ---
    const colorInput = document.getElementById('color-input');
    const colorPreview = document.getElementById('color-preview');
    const hexPreviewText = document.getElementById('hex-preview-text');
    
    const hexOutput = document.getElementById('hex-output');
    const rgbOutput = document.getElementById('rgb-output');
    const hslOutput = document.getElementById('hsl-output');

    const copyHexBtn = document.getElementById('copy-hex-btn');
    const copyRgbBtn = document.getElementById('copy-rgb-btn');
    const copyHslBtn = document.getElementById('copy-hsl-btn');

    // --- Core Color Update Function ---
    const updateColor = (hex) => {
        // 1. Update the main preview background and text
        colorPreview.style.backgroundColor = hex;
        hexPreviewText.textContent = hex.toUpperCase();

        // 2. Convert HEX to RGB
        const rgb = hexToRgb(hex);
        rgbOutput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        
        // 3. Convert RGB to HSL
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        hslOutput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        
        // 4. Update the HEX output field
        hexOutput.value = hex.toUpperCase();

        // 5. Update preview text color for readability
        // Calculate brightness: if it's "light", use black text, otherwise white.
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        hexPreviewText.style.color = (brightness > 128) ? '#000000' : '#FFFFFF';
    };
    
    // --- Event Listeners ---
    colorInput.addEventListener('input', (e) => {
        updateColor(e.target.value);
    });

    const copyToClipboard = (element, button) => {
        navigator.clipboard.writeText(element.value).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => { button.textContent = originalText; }, 1500);
        });
    };

    copyHexBtn.addEventListener('click', () => copyToClipboard(hexOutput, copyHexBtn));
    copyRgbBtn.addEventListener('click', () => copyToClipboard(rgbOutput, copyRgbBtn));
    copyHslBtn.addEventListener('click', () => copyToClipboard(hslOutput, copyHslBtn));

    // --- Helper Functions ---
    const hexToRgb = (hex) => {
        let r = 0, g = 0, b = 0;
        // 3 digits
        if (hex.length == 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
        // 6 digits
        } else if (hex.length == 7) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
        }
        return { r: +r, g: +g, b: +b };
    };

    const rgbToHsl = (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { 
            h: Math.round(h * 360), 
            s: Math.round(s * 100), 
            l: Math.round(l * 100) 
        };
    };
    
    // --- Initial Load ---
    updateColor(colorInput.value);
});