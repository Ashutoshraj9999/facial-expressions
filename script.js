document.addEventListener('DOMContentLoaded', function() {
    // Set the title of the page to "No Fap"
    document.title = "facial expressions";

    const startDate = new Date('2024-06-11');
    const endDate = new Date('2024-08-30');
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const table = document.getElementById('calendar');
    const progressChecked = document.getElementById('progress-checked');
    const progressUnchecked = document.getElementById('progress-unchecked');

    let currentDay = startDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    let currentRow;

    // Load checked checkboxes and percentage values from local storage
    let checkedCheckboxes = JSON.parse(localStorage.getItem('checkedCheckboxes')) || {};
    let checkedPercentage = parseFloat(localStorage.getItem('checkedPercentage')) || 0;
    let uncheckedPercentage = parseFloat(localStorage.getItem('uncheckedPercentage')) || 100;

    // Update checkboxes and progress bars based on stored data
    updateCheckboxes();
    updateProgressBar();

    let dayCount = 0;

    for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        // Skip the dates you want to exclude (June 11, June 12, June 13, June 14, and June 15)
        if ((currentDate.getDate() === 11 && currentDate.getMonth() === 5) || 
            (currentDate.getDate() === 12 && currentDate.getMonth() === 5) || 
            (currentDate.getDate() === 13 && currentDate.getMonth() === 5) || 
            (currentDate.getDate() === 14 && currentDate.getMonth() === 5) || 
            (currentDate.getDate() === 15 && currentDate.getMonth() === 5)) {
            continue;
        }

        const dayOfWeek = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

        if (dayOfWeek === 1 || dayCount === 0) { // Start a new row on Monday or for the first day
            currentRow = table.insertRow();
            currentDay = 1; // Reset the current day to Monday
        }

        const checkboxCell = currentRow.insertCell();
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox-${dayCount}`;
        checkbox.dataset.date = currentDate.toDateString(); // Store the date as a data attribute
        checkbox.addEventListener('change', updateProgress);
        checkboxCell.appendChild(checkbox);

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = `${currentDate.getDate()} ${getMonthName(currentDate.getMonth())}`; // Format date as "dd MON"
        checkboxCell.appendChild(label);

        // Set the initial checked status based on local storage data
        if (checkedCheckboxes.hasOwnProperty(checkbox.id) && checkedCheckboxes[checkbox.id]) {
            checkbox.checked = true;
        }

        currentDay = (currentDay + 1) % 7; // Move to the next day of the week
        dayCount++;
    }

    function getMonthName(monthIndex) {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];
        return monthNames[monthIndex];
    }

    function updateProgress() {
        // Update the checked checkboxes data
        checkedCheckboxes[this.id] = this.checked;
        localStorage.setItem('checkedCheckboxes', JSON.stringify(checkedCheckboxes));

        // Calculate percentages
        const checkedCount = Object.values(checkedCheckboxes).filter(checked => checked).length;
        checkedPercentage = (checkedCount / dayCount) * 100;
        uncheckedPercentage = 100 - checkedPercentage;

        updateProgressBar();
        // Update percentage values in local storage
        localStorage.setItem('checkedPercentage', checkedPercentage);
        localStorage.setItem('uncheckedPercentage', uncheckedPercentage);
    }

    function updateProgressBar() {
        progressChecked.style.width = `${checkedPercentage}%`;
        progressUnchecked.style.width = `${uncheckedPercentage}%`;

        document.getElementById('progress-text-checked').textContent = `${checkedPercentage.toFixed(2)}%`;
        document.getElementById('progress-text-unchecked').textContent = `${uncheckedPercentage.toFixed(2)}%`;
    }

    function updateCheckboxes() {
        // Update checkboxes based on stored data
        for (const checkboxId in checkedCheckboxes) {
            if (checkedCheckboxes.hasOwnProperty(checkboxId)) {
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    checkbox.checked = checkedCheckboxes[checkboxId];
                }
            }
        }
    }
});
