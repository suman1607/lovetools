document.addEventListener('DOMContentLoaded', () => {
    // --- Get All DOM Elements ---
    const pdfUpload = document.getElementById('pdf-upload');
    const uploadLabel = document.getElementById('upload-label');
    const settingsArea = document.querySelector('.settings-area');
    const pageInfo = document.getElementById('page-info');
    const splitModeRadios = document.querySelectorAll('input[name="split-mode"]');
    const extractOptions = document.getElementById('extract-options');
    const pageRangesInput = document.getElementById('page-ranges');
    const splitBtn = document.getElementById('split-btn');
    const downloadContainer = document.getElementById('download-container');
    const downloadBtn = document.getElementById('download-btn');

    let loadedPdf = null; // Store the loaded pdf-lib document object

    // --- Handle File Upload ---
    pdfUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file || file.type !== 'application/pdf') return;

        uploadLabel.querySelector('span').textContent = 'Loading PDF...';
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            const { PDFDocument } = PDFLib;
            loadedPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
            
            pageInfo.textContent = `Total Pages: ${loadedPdf.getPageCount()}`;
            uploadLabel.querySelector('span').textContent = file.name;
            settingsArea.hidden = false;
            downloadContainer.hidden = true;

        } catch (error) {
            alert('Could not load PDF. The file may be corrupted or password-protected.');
            console.error(error);
            uploadLabel.querySelector('span').textContent = 'Click to browse or drag & drop a PDF';
        }
    });

    // --- UI Logic for Split Mode ---
    splitModeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            extractOptions.hidden = e.target.value !== 'extract';
        });
    });

    // --- Main Splitting Logic ---
    splitBtn.addEventListener('click', async () => {
        if (!loadedPdf) {
            alert('Please upload a PDF first.');
            return;
        }

        const mode = document.querySelector('input[name="split-mode"]:checked').value;
        splitBtn.disabled = true;
        splitBtn.textContent = 'Processing...';

        try {
            if (mode === 'extract') {
                await handleExtractPages();
            } else {
                await handleSplitAllPages();
            }
        } catch (error) {
            alert('An error occurred during splitting. Please check your page range input.');
            console.error(error);
        } finally {
            splitBtn.disabled = false;
            splitBtn.textContent = 'Split PDF';
        }
    });

    // --- Handler for "Extract Pages" Mode ---
    const handleExtractPages = async () => {
        const ranges = pageRangesInput.value;
        if (!ranges) throw new Error('Page range is empty.');

        const pagesToExtract = parsePageRanges(ranges, loadedPdf.getPageCount());
        if (pagesToExtract.length === 0) throw new Error('No valid pages selected.');

        const { PDFDocument } = PDFLib;
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(loadedPdf, pagesToExtract);
        copiedPages.forEach(page => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        downloadBtn.href = url;
        downloadBtn.download = 'split.pdf';
        downloadBtn.textContent = 'Download Extracted PDF';
        downloadContainer.hidden = false;
    };

    // --- Handler for "Split All Pages" Mode ---
    const handleSplitAllPages = async () => {
        const zip = new JSZip();
        const { PDFDocument } = PDFLib;
        const pageCount = loadedPdf.getPageCount();

        for (let i = 0; i < pageCount; i++) {
            const newPdf = await PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(loadedPdf, [i]);
            newPdf.addPage(copiedPage);
            const pdfBytes = await newPdf.save();
            zip.file(`page-${i + 1}.pdf`, pdfBytes);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);

        downloadBtn.href = url;
        downloadBtn.download = 'split-pages.zip';
        downloadBtn.textContent = 'Download ZIP File';
        downloadContainer.hidden = false;
    };
    
    // --- Helper function to parse page ranges (e.g., "1, 3, 5-7") ---
    function parsePageRanges(input, maxPage) {
        const pages = new Set();
        const parts = input.split(',');

        for (const part of parts) {
            const trimmedPart = part.trim();
            if (trimmedPart.includes('-')) {
                const [start, end] = trimmedPart.split('-').map(num => parseInt(num, 10));
                if (!isNaN(start) && !isNaN(end) && start <= end) {
                    for (let i = start; i <= end; i++) {
                        if (i > 0 && i <= maxPage) pages.add(i - 1); // 0-indexed
                    }
                }
            } else {
                const page = parseInt(trimmedPart, 10);
                if (!isNaN(page) && page > 0 && page <= maxPage) {
                    pages.add(page - 1); // 0-indexed
                }
            }
        }
        return Array.from(pages).sort((a, b) => a - b); // Return sorted, unique indices
    }
});