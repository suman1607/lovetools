window.onload = function() {
    console.log("PDF-to-JPG: Page and all scripts fully loaded. Initializing tool...");

    const uploadWrapper = document.getElementById('upload-wrapper');
    const uploadLabel = document.getElementById('upload-label');
    const pdfUpload = document.getElementById('pdf-upload');
    const settingsArea = document.querySelector('.settings-area');
    const pageInfo = document.getElementById('page-info');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('quality-value');
    const convertBtn = document.getElementById('convert-to-jpg-btn');
    const downloadContainer = document.getElementById('download-container');
    const downloadBtn = document.getElementById('download-btn');
    let uploadedFile = null;

    if (window.pdfjsLib && window.JSZip) {
        // Set up the required worker from the lib folder
        pdfjsLib.GlobalWorkerOptions.workerSrc = `lib/pdf.worker.min.js`;

        // Enable the UI for the user
        uploadWrapper.classList.remove('disabled');
        uploadLabel.querySelector('span').textContent = 'Click to browse or drag & drop a PDF';
        uploadLabel.querySelector('small').textContent = 'Select one PDF file to convert';
        console.log("PDF-to-JPG Tool Initialized: Ready for use.");
    } else {
        // This error will now only show if the files in the `lib` folder are corrupted or missing
        uploadWrapper.classList.remove('disabled');
        uploadLabel.querySelector('span').textContent = 'Error: Library files not found!';
        uploadLabel.querySelector('small').textContent = 'Please make sure the files in the `lib` folder are correct.';
        console.error("Critical Error: PDF.js or JSZip library not found.");
        return; // Stop the script
    }

    pdfUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file || file.type !== 'application/pdf') return;
        
        uploadedFile = file;
        uploadLabel.querySelector('span').textContent = 'Loading PDF info...';
        try {
            const fileBytes = await file.arrayBuffer();
            const pdfjsDoc = await pdfjsLib.getDocument({ data: fileBytes }).promise;
            pageInfo.textContent = `File: ${file.name} (${pdfjsDoc.numPages} pages)`;
            uploadLabel.querySelector('span').textContent = 'File Ready!';
            settingsArea.hidden = false;
            downloadContainer.hidden = true;
        } catch (error) {
            alert('Could not read PDF info. The file may be corrupted.');
            console.error(error);
        }
    });

    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
    });

    convertBtn.addEventListener('click', async () => {
        if (!uploadedFile) {
            alert('Please upload a PDF first.');
            return;
        }
        convertBtn.disabled = true;
        convertBtn.textContent = 'Processing...';
        try {
            const zip = new JSZip();
            const quality = parseInt(qualitySlider.value, 10) / 100;
            const fileBytes = await uploadedFile.arrayBuffer();
            const pdfjsDoc = await pdfjsLib.getDocument({ data: fileBytes }).promise;
            for (let i = 1; i <= pdfjsDoc.numPages; i++) {
                convertBtn.textContent = `Converting page ${i} of ${pdfjsDoc.numPages}...`;
                const page = await pdfjsDoc.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport: viewport }).promise;
                const jpgDataUrl = canvas.toDataURL('image/jpeg', quality);
                const base64Data = jpgDataUrl.split(',')[1];
                zip.file(`page-${i}.jpg`, base64Data, { base64: true });
            }
            convertBtn.textContent = 'Zipping files...';
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            downloadBtn.href = url;
            downloadBtn.download = `${uploadedFile.name.replace(/\.pdf$/i, '')}.zip`;
            downloadContainer.hidden = false;
        } catch (error) {
            alert('An error occurred during conversion. The PDF may be corrupted or in an unsupported format.');
        } finally {
            convertBtn.disabled = false;
            convertBtn.textContent = 'Convert to JPG';
        }
    });
};