document.addEventListener('DOMContentLoaded', () => {
    // Get wrapper elements
    const loadingMessage = document.getElementById('loading-message');
    const toolContent = document.getElementById('tool-content');
    
    // --- Robust Library Loading Check ---
    // This function waits for the <script> tag to create the global `dateFns` object.
    const checkLibrary = () => {
        // It checks for `window.dateFns` which is the BROWSER way. NO `require` is used.
        if (typeof dateFns !== 'undefined') {
            console.log("date-fns library loaded successfully.");
            clearInterval(libraryInterval);
            initializeTool(); // Now we can start the tool.
        } else {
            // This is the "Waiting..." message. It is part of the fix, NOT an error.
            console.log("Waiting for date-fns library..."); 
        }
    };
    const libraryInterval = setInterval(checkLibrary, 100);

    const initializeTool = () => {
        // --- Get All Tool-Specific DOM Elements ---
        const timestampInput = document.getElementById('timestamp-input');
        const dateOutput = document.getElementById('date-output');
        const copyDateBtn = document.getElementById('copy-date-btn');
        const dateInput = document.getElementById('date-input');
        const timestampOutput = document.getElementById('timestamp-output');
        const copyTimestampBtn = document.getElementById('copy-timestamp-btn');

        // --- Conversion Logic: Timestamp -> Date ---
        const convertTimestampToDate = () => {
            const timestampStr = timestampInput.value.trim();
            if (!timestampStr) {
                dateOutput.value = '';
                return;
            }
            let timestamp = Number(timestampStr);
            if (timestampStr.length < 13) {
                timestamp *= 1000; // Convert seconds to milliseconds
            }
            if (isNaN(timestamp)) {
                dateOutput.value = 'Invalid timestamp';
                return;
            }
            try {
                // Here, we use the global `dateFns` object directly.
                const formattedDate = dateFns.format(new Date(timestamp), "EEE, dd MMM yyyy HH:mm:ss 'GMT'xx (zzzz)");
                dateOutput.value = formattedDate;
            } catch (error) {
                dateOutput.value = 'Invalid date';
            }
        };

        // --- Conversion Logic: Date -> Timestamp ---
        const convertDateToTimestamp = () => {
            const dateStr = dateInput.value;
            if (!dateStr) {
                timestampOutput.value = '';
                return;
            }
            try {
                const timestampInSeconds = dateFns.getUnixTime(new Date(dateStr));
                timestampOutput.value = timestampInSeconds;
            } catch (error) {
                timestampOutput.value = 'Invalid date';
            }
        };

        // --- Event Listeners ---
        timestampInput.addEventListener('input', convertTimestampToDate);
        dateInput.addEventListener('input', convertDateToTimestamp);
        
        // --- Copy Button Logic ---
        const copyToClipboard = (element, button) => {
            if (element.value && !element.value.includes('Invalid')) {
                navigator.clipboard.writeText(element.value).then(() => {
                    const originalText = button.textContent;
                    button.textContent = 'Copied!';
                    setTimeout(() => { button.textContent = originalText; }, 1500);
                });
            }
        };

        copyDateBtn.addEventListener('click', () => copyToClipboard(dateOutput, copyDateBtn));
        copyTimestampBtn.addEventListener('click', () => copyToClipboard(timestampOutput, copyTimestampBtn));
        
        // --- Set Initial Values and Show the Tool ---
        const now = new Date();
        dateInput.value = dateFns.format(now, "yyyy-MM-dd'T'HH:mm");
        convertDateToTimestamp();

        // Make the tool visible now that it's ready
        loadingMessage.hidden = true;
        toolContent.hidden = false;
    };

    // Failsafe in case the library is blocked by your network/firewall
    setTimeout(() => {
        if (typeof dateFns === 'undefined') {
            clearInterval(libraryInterval);
            loadingMessage.innerHTML = '<p style="color: red;">Error: Could not load required libraries. Please check your internet connection and refresh the page.</p>';
        }
    }, 10000); // Timeout after 10 seconds
});