document.addEventListener('DOMContentLoaded', () => {
    // --- Conversion Data Structure ---
    // For each category, we define a base unit and the conversion factor TO that base unit.
    const conversions = {
        length: {
            base: 'meter',
            units: {
                meter: 1,
                kilometer: 1000,
                centimeter: 0.01,
                millimeter: 0.001,
                mile: 1609.34,
                yard: 0.9144,
                foot: 0.3048,
                inch: 0.0254,
            }
        },
        weight: {
            base: 'gram',
            units: {
                gram: 1,
                kilogram: 1000,
                milligram: 0.001,
                pound: 453.592,
                ounce: 28.3495,
            }
        },
        temperature: {
            // Temperature is a special case and is handled separately
            base: 'celsius',
            units: {
                celsius: 'Celsius',
                fahrenheit: 'Fahrenheit',
                kelvin: 'Kelvin',
            }
        },
        data: {
            base: 'byte',
            units: {
                byte: 1,
                kilobyte: 1024,
                megabyte: 1024 ** 2,
                gigabyte: 1024 ** 3,
                terabyte: 1024 ** 4,
            }
        }
    };

    // --- Get DOM Elements ---
    const categorySelect = document.getElementById('category-select');
    const inputFrom = document.getElementById('input-from');
    const selectFrom = document.getElementById('select-from');
    const inputTo = document.getElementById('input-to');
    const selectTo = document.getElementById('select-to');
    const swapBtn = document.getElementById('swap-btn');

    // --- Main Functions ---

    // Populate category dropdown on load
    function populateCategories() {
        for (const category in conversions) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySelect.appendChild(option);
        }
    }

    // Update unit dropdowns when a category is selected
    function updateUnitSelectors() {
        const category = categorySelect.value;
        const { units } = conversions[category];
        
        selectFrom.innerHTML = '';
        selectTo.innerHTML = '';

        for (const unit in units) {
            const optionFrom = document.createElement('option');
            optionFrom.value = unit;
            optionFrom.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
            
            const optionTo = optionFrom.cloneNode(true);

            selectFrom.appendChild(optionFrom);
            selectTo.appendChild(optionTo);
        }
        // Set a default different unit for the 'to' selector
        selectTo.value = Object.keys(units)[1] || Object.keys(units)[0];
        convert(); // Perform initial conversion
    }

    // The core conversion logic
    function convert() {
        const fromValue = parseFloat(inputFrom.value);
        const toValue = parseFloat(inputTo.value);
        
        if(isNaN(fromValue) && isNaN(toValue)) return; // Do nothing if both are empty

        const category = categorySelect.value;
        const fromUnit = selectFrom.value;
        const toUnit = selectTo.value;
        
        let result;

        if (category === 'temperature') {
            // Special handling for temperature
            let tempInCelsius;
            if (fromUnit === 'celsius') tempInCelsius = fromValue;
            if (fromUnit === 'fahrenheit') tempInCelsius = (fromValue - 32) * 5/9;
            if (fromUnit === 'kelvin') tempInCelsius = fromValue - 273.15;
            
            if (toUnit === 'celsius') result = tempInCelsius;
            if (toUnit === 'fahrenheit') result = (tempInCelsius * 9/5) + 32;
            if (toUnit === 'kelvin') result = tempInCelsius + 273.15;
            
        } else {
            // Standard conversion via base unit
            const categoryData = conversions[category];
            const valueInBaseUnit = fromValue * categoryData.units[fromUnit];
            result = valueInBaseUnit / categoryData.units[toUnit];
        }

        inputTo.value = result.toFixed(4).replace(/\.?0+$/, ''); // Format to 4 decimal places and remove trailing zeros
    }
    
    // Reverse conversion
    function convertReverse() {
        // Temporarily swap units, calculate, then swap back to not change the UI
        [selectFrom.value, selectTo.value] = [selectTo.value, selectFrom.value];
        convert();
        [selectFrom.value, selectTo.value] = [selectTo.value, selectFrom.value];
    }


    // --- Event Listeners ---
    categorySelect.addEventListener('change', updateUnitSelectors);
    inputFrom.addEventListener('input', convert);
    selectFrom.addEventListener('change', convert);
    selectTo.addEventListener('change', convert);
    
    // Reverse conversion when typing in the 'to' field
    inputTo.addEventListener('input', () => {
        // To avoid an infinite loop, we perform the reverse calculation manually
        const toValue = parseFloat(inputTo.value);
        if(isNaN(toValue)) return;

        const category = categorySelect.value;
        const fromUnit = selectFrom.value;
        const toUnit = selectTo.value;

        let result;
        if (category === 'temperature') {
             let tempInCelsius;
            if (toUnit === 'celsius') tempInCelsius = toValue;
            if (toUnit === 'fahrenheit') tempInCelsius = (toValue - 32) * 5/9;
            if (toUnit === 'kelvin') tempInCelsius = toValue - 273.15;
            
            if (fromUnit === 'celsius') result = tempInCelsius;
            if (fromUnit === 'fahrenheit') result = (tempInCelsius * 9/5) + 32;
            if (fromUnit === 'kelvin') result = tempInCelsius + 273.15;
        } else {
            const categoryData = conversions[category];
            const valueInBaseUnit = toValue * categoryData.units[toUnit];
            result = valueInBaseUnit / categoryData.units[fromUnit];
        }
        inputFrom.value = result.toFixed(4).replace(/\.?0+$/, '');
    });

    swapBtn.addEventListener('click', () => {
        // Swap the selected units
        [selectFrom.value, selectTo.value] = [selectTo.value, selectFrom.value];
        // Rerun the conversion
        convert();
    });

    // --- Initial Setup ---
    populateCategories();
    updateUnitSelectors();

});