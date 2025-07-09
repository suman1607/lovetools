// ★★★ সম্পূর্ণ নতুন এবং সঠিক কোড ★★★

// আমরা এখন window.onload ব্যবহার করছি।
// এর মানে হলো, এই কোডটি পেজের সবকিছু লোড হওয়ার পরেই কেবল চলবে।
window.onload = function() {
    console.log("Page and all scripts fully loaded. Initializing tool...");

    // --- Get All DOM Elements ---
    const uploadWrapper = document.getElementById('upload-wrapper');
    const uploadLabel = document.getElementById('upload-label');
    const pdfUpload = document.getElementById('pdf-upload');
    const settingsArea = document.querySelector('.settings-area');
    const pageInfo = document.getElementById('page-info');
    const compressionLevelSelect = document.getElementById('compression-level');
    const compressBtn = document.getElementById('compress-pdf-btn');
    const downloadContainer = document.getElementById('download-container');
    const resultInfo = document.getElementById('result-info');
    const downloadBtn = document.getElementById('download-btn');

    let originalFile = null;

    // যেহেতু window.onload ব্যবহার করা হয়েছে, তাই লাইব্রেরিগুলো অবশ্যই লোড হয়ে গেছে।
    // এখন আমরা নিরাপদে টুলটি চালু করতে পারি।
    if (window.pdfjsLib && window.PDFLib) {
        // pdf.js-এর জন্য worker সেট করুন
        pdfjsLib.GlobalWorkerOptions.workerSrc = `lib/pdf.worker.min.js`;

        // UI চালু করুন
        uploadWrapper.classList.remove('disabled');
        uploadLabel.querySelector('span').textContent = 'Click to browse or drag & drop a PDF';
        uploadLabel.querySelector('small').textContent = 'Select a PDF file to compress';
        console.log("Tool Initialized: Ready for use.");
    } else {
        // যদি কোনো কারণে lib ফোল্ডারে ফাইল না থাকে, তাহলে এই error দেখাবে
        uploadLabel.querySelector('span').textContent = 'Error: Library files not found!';
        uploadLabel.querySelector('small').textContent = 'Please check if `pdf.min.js` and `pdf-lib.min.js` are in the `lib` folder.';
        console.error("Critical Error: PDF libraries not found in window object.");
        return; // আর এগোনো যাবে না
    }


    // --- Handle File Upload ---
    pdfUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || file.type !== 'application/pdf') return;
        originalFile = file;
        
        uploadLabel.querySelector('span').textContent = file.name;
        pageInfo.textContent = `Original Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
        
        settingsArea.hidden = false;
        downloadContainer.hidden = true;
    });

    // --- Main Compression Logic ---
    compressBtn.addEventListener('click', async () => {
        if (!originalFile) {
            alert('Please upload a PDF first.');
            return;
        }
        compressBtn.disabled = true;
        compressBtn.textContent = 'Processing...';

        try {
            const { PDFDocument } = PDFLib;
            const newPdfDoc = await PDFDocument.create();
            const quality = parseFloat(compressionLevelSelect.value);
            const fileBytes = await originalFile.arrayBuffer();
            const pdfjsDoc = await pdfjsLib.getDocument({ data: fileBytes }).promise;
            
            for (let i = 1; i <= pdfjsDoc.numPages; i++) {
                compressBtn.textContent = `Processing page ${i} of ${pdfjsDoc.numPages}...`;
                
                const page = await pdfjsDoc.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;

                const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
                const jpegImage = await newPdfDoc.embedJpg(jpegDataUrl);
                
                const newPage = newPdfDoc.addPage([jpegImage.width, jpegImage.height]);
                newPage.drawImage(jpegImage, { x: 0, y: 0, width: newPage.width, height: newPage.height });
            }

            const compressedBytes = await newPdfDoc.save();
            const blob = new Blob([compressedBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const originalSize = originalFile.size;
            const newSize = blob.size;
            const reduction = originalSize > newSize ? ((originalSize - newSize) / originalSize * 100).toFixed(1) : 0;
            
            resultInfo.textContent = `New Size: ${(newSize / 1024 / 1024).toFixed(2)} MB | Saved: ${reduction}%`;
            downloadBtn.href = url;
            downloadBtn.download = `compressed-${originalFile.name}`;
            downloadContainer.hidden = false;

        } catch (error) {
            console.error('Error compressing PDF:', error);
            alert('An error occurred during compression. The PDF might be corrupted or password-protected.');
        } finally {
            compressBtn.disabled = false;
            compressBtn.textContent = 'Compress PDF';
        }
    });
};