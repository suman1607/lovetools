document.addEventListener('DOMContentLoaded', () => {
    // --- Get All DOM Elements ---
    const pdfUpload = document.getElementById('pdf-upload');
    const uploadLabel = document.getElementById('upload-label');
    const settingsArea = document.querySelector('.settings-area');
    const fileList = document.getElementById('file-list');
    const mergeBtn = document.getElementById('merge-btn');
    const downloadContainer = document.getElementById('download-container');
    const downloadBtn = document.getElementById('download-btn');

    let uploadedFiles = []; // Store the File objects

    // --- Handle File Upload ---
    pdfUpload.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    const handleFiles = (files) => {
        if (files.length === 0) return;
        
        uploadedFiles = Array.from(files);
        renderFileList();
        
        settingsArea.hidden = false;
        downloadContainer.hidden = true;
    };

    const renderFileList = () => {
        fileList.innerHTML = ''; // Clear previous list
        uploadedFiles.forEach((file, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'file-item';
            listItem.setAttribute('draggable', 'true');
            listItem.dataset.index = index;

            listItem.innerHTML = `
                <span class="file-name">${file.name}</span>
                <span class="file-size">${(file.size / 1024).toFixed(1)} KB</span>
            `;

            fileList.appendChild(listItem);
        });
        addDragAndDropListeners();
    };

    // --- Drag and Drop Logic ---
    const addDragAndDropListeners = () => {
        const items = fileList.querySelectorAll('.file-item');
        let dragStartIndex;

        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                dragStartIndex = +e.currentTarget.dataset.index;
                e.currentTarget.classList.add('dragging');
            });
            item.addEventListener('dragend', (e) => {
                e.currentTarget.classList.remove('dragging');
            });
        });

        fileList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingItem = document.querySelector('.dragging');
            const afterElement = getDragAfterElement(fileList, e.clientY);

            if (afterElement == null) {
                fileList.appendChild(draggingItem);
            } else {
                fileList.insertBefore(draggingItem, afterElement);
            }
        });

        fileList.addEventListener('drop', () => {
            const reorderedItems = Array.from(fileList.querySelectorAll('.file-item'));
            const newUploadedFiles = reorderedItems.map(item => uploadedFiles[+item.dataset.index]);
            uploadedFiles = newUploadedFiles;
            renderFileList(); // Re-render to update indexes
        });
    };

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.file-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // --- PDF Merging Logic ---
    mergeBtn.addEventListener('click', async () => {
        if (uploadedFiles.length < 2) {
            alert('Please select at least two PDF files to merge.');
            return;
        }

        mergeBtn.disabled = true;
        mergeBtn.textContent = 'Merging...';

        try {
            const { PDFDocument } = PDFLib;
            const mergedPdf = await PDFDocument.create();

            for (const file of uploadedFiles) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach(page => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            downloadBtn.href = url;
            downloadContainer.hidden = false;

        } catch (error) {
            console.error('Error merging PDFs:', error);
            alert('An error occurred while merging the PDFs. They might be corrupted or password-protected.');
        } finally {
            mergeBtn.disabled = false;
            mergeBtn.textContent = 'Merge PDFs';
        }
    });
});