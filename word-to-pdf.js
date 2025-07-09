document.addEventListener('DOMContentLoaded', () => {
    // --- Get All DOM Elements ---
    const wordUpload = document.getElementById('word-upload');
    const uploadLabel = document.getElementById('upload-label');
    const settingsArea = document.querySelector('.settings-area');
    const fileInfo = document.getElementById('file-info');
    const convertBtn = document.getElementById('convert-word-btn');

    let uploadedFile = null;

    // --- Handle File Upload ---
    wordUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if the file type is likely a Word document
        const allowedTypes = [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.doc',
            '.docx'
        ];
        // A simple check by name ending is a good fallback
        const isWordFile = allowedTypes.includes(file.type) || file.name.endsWith('.doc') || file.name.endsWith('.docx');

        if (!isWordFile) {
            alert('Please upload a valid Word document (.doc or .docx).');
            return;
        }

        uploadedFile = file;
        
        // Show the settings area with file info
        uploadLabel.querySelector('span').textContent = 'File Ready to Convert';
        fileInfo.textContent = `File: ${file.name}`;
        settingsArea.hidden = false;
    });

    // --- Handle Convert Button Click ---
    convertBtn.addEventListener('click', () => {
        if (!uploadedFile) {
            alert('Please upload a file first.');
            return;
        }

        // This is the "correct code" for a feature that requires a server
        // on a front-end only website. We clearly inform the user.
        alert(
            "Feature Not Available in this Demo\n\n" +
            "Converting Word documents to PDF requires powerful server-side processing. " +
            "This front-end only version of LoveTools includes the UI as a placeholder for future development."
        );
    });
});